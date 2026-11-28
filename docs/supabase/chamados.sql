-- =====================================================================================
--  IAX Funil · API de chamados (tickets) para os sistemas da IAX
--  FindFlow, Pulse Doações, Pulse PEP Clinic, Pulse Eleitoral, IAX Guardian e outros
--  abrem chamados aqui pela API; a equipe da IAX atende pela tela "Chamados" do app.
-- -------------------------------------------------------------------------------------
--  Rode DEPOIS do iax-funil-schema.sql (usa public.has_role e a tabela profiles).
--  Pode ser rodado mais de uma vez.
-- =====================================================================================

begin;

-- -------------------------------------------------------------------------------------
-- 1. Sistemas autorizados a usar a API (uma chave por sistema; só o hash fica salvo)
-- -------------------------------------------------------------------------------------
create table if not exists public.api_clients (
  id           uuid primary key default gen_random_uuid(),
  system       text not null unique check (system ~ '^[a-z0-9][a-z0-9-]{1,39}$'),  -- ex.: findflow, pulse-doacoes
  name         text not null,                                                      -- ex.: FindFlow
  key_hash     text not null unique,                                               -- SHA-256 da chave (hex)
  key_prefix   text not null,                                                      -- primeiros caracteres, para identificar
  active       boolean not null default true,
  created_by   uuid references public.profiles(id),
  created_at   timestamptz not null default now(),
  last_used_at timestamptz
);

-- -------------------------------------------------------------------------------------
-- 2. Chamados
-- -------------------------------------------------------------------------------------
create sequence if not exists public.ticket_number_seq start 1001;

create table if not exists public.tickets (
  id                uuid primary key default gen_random_uuid(),
  number            bigint not null unique default nextval('public.ticket_number_seq'),
  system            text not null references public.api_clients(system) on update cascade,
  external_ref      text,                     -- id do chamado/cliente no sistema de origem (evita duplicar)
  title             text not null check (char_length(title) between 3 and 200),
  description       text not null default '' check (char_length(description) <= 10000),
  category          text not null default 'Suporte',
  priority          text not null default 'média' check (priority in ('baixa', 'média', 'alta', 'urgente')),
  status            text not null default 'aberto' check (status in ('aberto', 'em_andamento', 'aguardando_cliente', 'resolvido', 'fechado')),
  requester_name    text not null default '',
  requester_email   text not null default '',
  requester_phone   text not null default '',
  requester_company text not null default '',
  metadata          jsonb not null default '{}',
  assigned_to       uuid references public.profiles(id),
  first_response_at timestamptz,
  resolved_at       timestamptz,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  unique (system, external_ref)
);
create index if not exists tickets_status_created on public.tickets (status, created_at desc);
create index if not exists tickets_system_created on public.tickets (system, created_at desc);

-- Histórico: abertura, mensagens (públicas ou internas), mudanças de status e de responsável.
create table if not exists public.ticket_events (
  id          uuid primary key default gen_random_uuid(),
  ticket_id   uuid not null references public.tickets on delete cascade,
  kind        text not null check (kind in ('criado', 'mensagem', 'status', 'atribuicao')),
  author_type text not null check (author_type in ('sistema', 'equipe')),
  author_id   uuid references public.profiles(id),
  author_name text not null default '',
  body        text not null default '' check (char_length(body) <= 10000),
  is_public   boolean not null default true,   -- false = nota interna, não aparece para o sistema de origem
  from_status text,
  to_status   text,
  created_at  timestamptz not null default now()
);
create index if not exists ticket_events_ticket_created on public.ticket_events (ticket_id, created_at);

-- -------------------------------------------------------------------------------------
-- 3. Automação
-- -------------------------------------------------------------------------------------
-- Mantém updated_at, registra a mudança de status no histórico e as datas de resolução.
create or replace function public.ticket_touch()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  new.updated_at := now();
  if new.status is distinct from old.status then
    insert into public.ticket_events (ticket_id, kind, author_type, author_id, author_name, from_status, to_status, is_public)
    values (new.id, 'status', case when auth.uid() is null then 'sistema' else 'equipe' end, auth.uid(),
            coalesce((select name from public.profiles where id = auth.uid()), ''), old.status, new.status, true);
    if new.status in ('resolvido', 'fechado') and old.status not in ('resolvido', 'fechado') then
      new.resolved_at := now();
    elsif new.status not in ('resolvido', 'fechado') then
      new.resolved_at := null;
    end if;
  end if;
  return new;
end $$;

drop trigger if exists ticket_touch on public.tickets;
create trigger ticket_touch
  before update on public.tickets
  for each row execute function public.ticket_touch();

-- Primeira resposta pública da equipe marca o tempo de primeira resposta.
create or replace function public.ticket_first_response()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.kind = 'mensagem' and new.author_type = 'equipe' and new.is_public then
    update public.tickets set first_response_at = now()
    where id = new.ticket_id and first_response_at is null;
  end if;
  return new;
end $$;

drop trigger if exists ticket_first_response on public.ticket_events;
create trigger ticket_first_response
  after insert on public.ticket_events
  for each row execute function public.ticket_first_response();

-- -------------------------------------------------------------------------------------
-- 4. Permissões (RLS)
--    Equipe logada: lê e atende chamados. Só administradores gerenciam as chaves.
--    A API dos sistemas grava pelo servidor (service_role), nunca pelo navegador.
-- -------------------------------------------------------------------------------------
alter table public.api_clients   enable row level security;
alter table public.tickets       enable row level security;
alter table public.ticket_events enable row level security;

-- O hash da chave nunca é exposto ao app: só estas colunas podem ser lidas.
revoke all on public.api_clients from authenticated;
grant select (id, system, name, key_prefix, active, created_by, created_at, last_used_at) on public.api_clients to authenticated;
grant insert (system, name, key_hash, key_prefix, created_by) on public.api_clients to authenticated;
grant update (name, key_hash, key_prefix, active) on public.api_clients to authenticated;
grant select, update on public.tickets to authenticated;
grant select, insert on public.ticket_events to authenticated;
grant usage on sequence public.ticket_number_seq to service_role;
grant all on public.api_clients, public.tickets, public.ticket_events to service_role;

drop policy if exists api_clients_admin_read on public.api_clients;
create policy api_clients_admin_read on public.api_clients for select to authenticated
  using (public.has_role(auth.uid(), 'admin'));
drop policy if exists api_clients_admin_insert on public.api_clients;
create policy api_clients_admin_insert on public.api_clients for insert to authenticated
  with check (public.has_role(auth.uid(), 'admin') and created_by = auth.uid());
drop policy if exists api_clients_admin_update on public.api_clients;
create policy api_clients_admin_update on public.api_clients for update to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

drop policy if exists tickets_team_read on public.tickets;
create policy tickets_team_read on public.tickets for select to authenticated using (true);
drop policy if exists tickets_team_update on public.tickets;
create policy tickets_team_update on public.tickets for update to authenticated using (true) with check (true);

drop policy if exists ticket_events_team_read on public.ticket_events;
create policy ticket_events_team_read on public.ticket_events for select to authenticated using (true);
drop policy if exists ticket_events_team_insert on public.ticket_events;
create policy ticket_events_team_insert on public.ticket_events for insert to authenticated
  with check (author_type = 'equipe' and author_id = auth.uid());

commit;
