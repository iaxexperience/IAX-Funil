-- =====================================================================================
--  IAX Funil · Esquema completo do banco (Supabase / PostgreSQL)
-- -------------------------------------------------------------------------------------
--  Como usar:
--    1. No painel do Supabase, abra  SQL Editor → New query.
--    2. Cole este arquivo inteiro e clique em Run.
--    3. (Opcional) Rode também o arquivo iax-funil-dados-demo.sql para ter leads de exemplo.
--    4. Crie o seu usuário pela tela de login do app e promova-o a administrador
--       com o comando que está no final deste arquivo.
--
--  O script pode ser rodado mais de uma vez: ele cria o que falta e atualiza funções,
--  gatilhos e regras de acesso, sem apagar dados.
--
--  Origem: migrações do projeto (drizzle/migrations/0000 e 0001), consolidadas.
-- =====================================================================================

begin;

-- -------------------------------------------------------------------------------------
-- 1. Papéis de usuário
-- -------------------------------------------------------------------------------------
do $$
begin
  if not exists (select 1 from pg_type where typname = 'app_role' and typnamespace = 'public'::regnamespace) then
    create type public.app_role as enum ('admin', 'sales');
  end if;
end $$;

-- -------------------------------------------------------------------------------------
-- 2. Perfis e papéis (um perfil por usuário do Supabase Auth)
-- -------------------------------------------------------------------------------------
create table if not exists public.profiles (
  id   uuid primary key references auth.users(id) on delete cascade,
  name text not null default 'Comercial'
);

create table if not exists public.user_roles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role    public.app_role not null default 'sales'
);

-- Verifica se um usuário tem um papel (usada nas regras de acesso).
create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

-- Todo usuário novo ganha um perfil e o papel "sales" (comercial).
create or replace function public.new_sales_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, name)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', 'Comercial'))
  on conflict (id) do nothing;
  insert into public.user_roles (user_id, role)
  values (new.id, 'sales')
  on conflict (user_id) do nothing;
  return new;
end $$;

drop trigger if exists sales_user_created on auth.users;
create trigger sales_user_created
  after insert on auth.users
  for each row execute function public.new_sales_user();

-- -------------------------------------------------------------------------------------
-- 3. Leads (empresas/oportunidades do funil)
--    stage: 0 Novo lead · 1 Contato iniciado · 2 Diagnóstico agendado · 3 Qualificado
--           4 Demonstração · 5 Proposta enviada · 6 Negociação · 7 Cliente ganho · 8 Nutrir/perdido
-- -------------------------------------------------------------------------------------
create table if not exists public.leads (
  id             uuid primary key default gen_random_uuid(),
  company        text not null,
  decision_maker text not null default '',
  phone          text not null default '',
  instagram      text not null default '',
  city           text not null default '',
  state          text not null default '',
  source         text not null default 'WhatsApp',
  channel        text not null default 'WhatsApp' check (channel in ('WhatsApp', 'Instagram')),
  stage          integer not null default 0 check (stage between 0 and 8),
  pain           text not null default '',
  current_system text not null default '',
  next_action    text not null default '',
  next_at        timestamptz,
  owner_id       uuid references public.profiles(id),
  segment        text not null default 'Fábrica de produtos de limpeza e saneantes',
  revenue        text not null default '',
  employees      text not null default '',
  buying_trigger text not null default '',
  qualification  jsonb not null default '[false,false,false,false,false]',
  unread         integer not null default 0,
  resolved       boolean not null default false,
  created_at     timestamptz not null default now()
);
create index if not exists leads_owner on public.leads (owner_id);
create index if not exists leads_stage on public.leads (stage);

-- Quem pode ver/editar um lead: o responsável ou um administrador.
create or replace function public.can_access_lead(_lead uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.leads
    where id = _lead and (owner_id = auth.uid() or public.has_role(auth.uid(), 'admin'))
  )
$$;

-- Só administradores trocam o responsável de um lead.
create or replace function public.guard_lead_owner()
returns trigger language plpgsql set search_path = public as $$
begin
  if tg_op = 'UPDATE'
     and new.owner_id is distinct from old.owner_id
     and auth.uid() is not null
     and not public.has_role(auth.uid(), 'admin') then
    raise exception 'Somente administradores podem alterar responsáveis';
  end if;
  return new;
end $$;

drop trigger if exists lead_owner_guard on public.leads;
create trigger lead_owner_guard
  before update on public.leads
  for each row execute function public.guard_lead_owner();

-- -------------------------------------------------------------------------------------
-- 4. Contatos, conversas e mensagens
-- -------------------------------------------------------------------------------------
create table if not exists public.contacts (
  id        uuid primary key default gen_random_uuid(),
  lead_id   uuid not null references public.leads on delete cascade,
  name      text not null,
  phone     text not null default '',
  instagram text not null default ''
);
create index if not exists contacts_lead on public.contacts (lead_id);

create table if not exists public.conversations (
  id                 uuid primary key default gen_random_uuid(),
  lead_id            uuid not null references public.leads on delete cascade,
  channel            text not null,
  integration_status text not null default 'disconnected',
  external_id        text,
  created_at         timestamptz not null default now()
);
create index if not exists conversations_lead on public.conversations (lead_id);

-- Mensagens: o navegador só lê. Gravação fica com o servidor (service_role),
-- que recebe e envia pelo WhatsApp/Instagram.
create table if not exists public.messages (
  id              uuid primary key default gen_random_uuid(),
  lead_id         uuid not null references public.leads on delete cascade,
  conversation_id uuid references public.conversations on delete cascade,
  content         text not null,
  direction       text not null default 'inbound' check (direction in ('inbound', 'outbound')),
  status          text not null default 'simulated' check (status in ('simulated', 'draft', 'received', 'sent', 'failed')),
  created_at      timestamptz not null default now()
);
create index if not exists messages_lead_created on public.messages (lead_id, created_at);

-- -------------------------------------------------------------------------------------
-- 5. Atividades (agenda), notas e histórico de etapas
-- -------------------------------------------------------------------------------------
create table if not exists public.activities (
  id          uuid primary key default gen_random_uuid(),
  lead_id     uuid not null references public.leads on delete cascade,
  type        text not null default 'Follow-up',
  title       text not null,
  due_at      timestamptz not null default now(),
  owner_id    uuid references public.profiles,
  status      text not null default 'pendente' check (status in ('pendente', 'concluída', 'cancelada')),
  observation text not null default '',
  created_at  timestamptz not null default now()
);
create index if not exists activities_lead_due on public.activities (lead_id, due_at);
create index if not exists activities_due on public.activities (due_at);

create table if not exists public.notes (
  id         uuid primary key default gen_random_uuid(),
  lead_id    uuid not null references public.leads on delete cascade,
  content    text not null,
  author_id  uuid,
  created_at timestamptz not null default now()
);
create index if not exists notes_lead on public.notes (lead_id);

create table if not exists public.stage_history (
  id         uuid primary key default gen_random_uuid(),
  lead_id    uuid not null references public.leads on delete cascade,
  from_stage integer,
  to_stage   integer not null,
  author_id  uuid,
  created_at timestamptz not null default now()
);
create index if not exists stage_history_lead on public.stage_history (lead_id, created_at);

-- -------------------------------------------------------------------------------------
-- 6. Automação por gatilhos
-- -------------------------------------------------------------------------------------

-- Ao criar/alterar um lead: registra no histórico (cadastro, mudança de etapa ou de perfil).
create or replace function public.audit_lead()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'INSERT' then
    insert into public.activities (lead_id, type, title, status, owner_id)
    values (new.id, 'Registro', 'Lead cadastrado', 'concluída', new.owner_id);
  elsif new.stage is distinct from old.stage then
    insert into public.stage_history (lead_id, from_stage, to_stage, author_id)
    values (new.id, old.stage, new.stage, auth.uid());
    insert into public.activities (lead_id, type, title, status, owner_id)
    values (new.id, 'Etapa', 'Etapa atualizada', 'concluída', new.owner_id);
  elsif to_jsonb(new) - array['unread', 'resolved', 'next_action', 'next_at']
        is distinct from to_jsonb(old) - array['unread', 'resolved', 'next_action', 'next_at'] then
    insert into public.activities (lead_id, type, title, status, owner_id)
    values (new.id, 'Atualização', 'Perfil do lead atualizado', 'concluída', new.owner_id);
  end if;
  return new;
end $$;

drop trigger if exists lead_audit on public.leads;
create trigger lead_audit
  after insert or update on public.leads
  for each row execute function public.audit_lead();

-- Ao criar um lead: cria o contato principal e a conversa do canal.
create or replace function public.lead_contact()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.contacts (lead_id, name, phone, instagram)
  values (new.id, new.decision_maker, new.phone, new.instagram);
  insert into public.conversations (lead_id, channel)
  values (new.id, new.channel);
  return new;
end $$;

drop trigger if exists create_lead_contact on public.leads;
create trigger create_lead_contact
  after insert on public.leads
  for each row execute function public.lead_contact();

-- Ao agendar/concluir uma atividade: a próxima atividade pendente vira a "próxima ação" do lead.
create or replace function public.sync_next_action()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  next_row public.activities;
begin
  select * into next_row
  from public.activities
  where lead_id = new.lead_id and status = 'pendente'
  order by due_at
  limit 1;

  update public.leads
  set next_action = coalesce(next_row.title, ''),
      next_at     = next_row.due_at
  where id = new.lead_id
    and (next_action is distinct from coalesce(next_row.title, '')
         or next_at is distinct from next_row.due_at);
  return new;
end $$;

drop trigger if exists activity_sync on public.activities;
create trigger activity_sync
  after insert or update of status, due_at, title on public.activities
  for each row
  when (new.type not in ('Registro', 'Atualização', 'Etapa', 'Nota'))
  execute function public.sync_next_action();

-- Ao adicionar uma nota interna: registra no histórico do lead.
create or replace function public.note_history()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.activities (lead_id, type, title, status, observation)
  values (new.lead_id, 'Nota', 'Nota interna adicionada', 'concluída', new.content);
  return new;
end $$;

drop trigger if exists note_audit on public.notes;
create trigger note_audit
  after insert on public.notes
  for each row execute function public.note_history();

-- -------------------------------------------------------------------------------------
-- 7. Permissões e regras de acesso (Row Level Security)
-- -------------------------------------------------------------------------------------
grant select, update on public.profiles to authenticated;
grant select on public.user_roles to authenticated;
grant select, insert, update, delete on public.leads, public.contacts, public.conversations, public.activities to authenticated;
grant select on public.messages, public.stage_history to authenticated;
grant select, insert on public.notes to authenticated;
grant all on public.profiles, public.user_roles, public.leads, public.contacts, public.conversations,
             public.messages, public.activities, public.notes, public.stage_history to service_role;

alter table public.profiles      enable row level security;
alter table public.user_roles    enable row level security;
alter table public.leads         enable row level security;
alter table public.contacts      enable row level security;
alter table public.conversations enable row level security;
alter table public.messages      enable row level security;
alter table public.activities    enable row level security;
alter table public.notes         enable row level security;
alter table public.stage_history enable row level security;

drop policy if exists profiles_read on public.profiles;
create policy profiles_read on public.profiles for select to authenticated
  using (id = auth.uid() or public.has_role(auth.uid(), 'admin'));

drop policy if exists profiles_edit on public.profiles;
create policy profiles_edit on public.profiles for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid());

drop policy if exists roles_read on public.user_roles;
create policy roles_read on public.user_roles for select to authenticated
  using (user_id = auth.uid() or public.has_role(auth.uid(), 'admin'));

drop policy if exists leads_access on public.leads;
create policy leads_access on public.leads for all to authenticated
  using (owner_id = auth.uid() or public.has_role(auth.uid(), 'admin'))
  with check (owner_id = auth.uid() or public.has_role(auth.uid(), 'admin'));

drop policy if exists contacts_access on public.contacts;
create policy contacts_access on public.contacts for all to authenticated
  using (public.can_access_lead(lead_id)) with check (public.can_access_lead(lead_id));

drop policy if exists conversations_access on public.conversations;
create policy conversations_access on public.conversations for all to authenticated
  using (public.can_access_lead(lead_id)) with check (public.can_access_lead(lead_id));

drop policy if exists messages_read on public.messages;
create policy messages_read on public.messages for select to authenticated
  using (public.can_access_lead(lead_id));

drop policy if exists activities_access on public.activities;
create policy activities_access on public.activities for all to authenticated
  using (public.can_access_lead(lead_id)) with check (public.can_access_lead(lead_id));

drop policy if exists notes_read on public.notes;
create policy notes_read on public.notes for select to authenticated
  using (public.can_access_lead(lead_id));

drop policy if exists notes_create on public.notes;
create policy notes_create on public.notes for insert to authenticated
  with check (public.can_access_lead(lead_id) and author_id = auth.uid());

drop policy if exists stage_history_read on public.stage_history;
create policy stage_history_read on public.stage_history for select to authenticated
  using (public.can_access_lead(lead_id));

commit;

-- =====================================================================================
--  Primeiro administrador
--  Depois de criar a sua conta pela tela de login do app (/auth), troque o e-mail abaixo
--  e rode só este comando para virar administrador (vê todos os leads e troca responsáveis):
--
--  update public.user_roles
--  set role = 'admin'
--  where user_id = (select id from auth.users where email = 'seu-email@empresa.com.br');
-- =====================================================================================
