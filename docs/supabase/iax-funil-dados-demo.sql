-- =====================================================================================
--  IAX Funil · Dados de demonstração (OPCIONAL)
-- -------------------------------------------------------------------------------------
--  Rode DEPOIS do iax-funil-schema.sql, só se quiser leads de exemplo no banco.
--  Os gatilhos criam sozinhos o contato, a conversa e o registro "Lead cadastrado".
--  Os leads ficam sem responsável: só administradores os veem até você atribuí-los.
--  Pode rodar mais de uma vez: leads já existentes são ignorados.
-- =====================================================================================

begin;

insert into public.leads
  (id, company, decision_maker, phone, instagram, city, state, source, channel, stage,
   pain, current_system, next_action, next_at, qualification, unread, revenue, employees, buying_trigger)
values
  ('00000000-0000-4000-8000-000000000001', 'Brisa Produtos de Limpeza', 'Marcos Oliveira', '(83) 99912-4580', '@brisalimpeza', 'João Pessoa', 'PB', 'Anúncio', 'WhatsApp', 4, 'Controle de produção e estoque', 'Planilhas', 'Demonstração da IAX', now() + interval '3 hours', '[true,true,true,true,true]', 2, 'R$ 250 mil / mês', '28', 'Expansão da fábrica'),
  ('00000000-0000-4000-8000-000000000002', 'Nordeste Saneantes', 'Ana Paula Santos', '(83) 98832-1070', '@nordestesaneantes', 'Campina Grande', 'PB', 'Instagram', 'Instagram', 2, 'Rastreabilidade de lotes', 'Sistema próprio', 'Diagnóstico comercial', now() + interval '1 day', '[true,true,true,true,false]', 1, 'R$ 180 mil / mês', '21', 'Adequação de processos'),
  ('00000000-0000-4000-8000-000000000003', 'CloroMax Indústria', 'Ricardo Almeida', '(81) 99741-2090', '@cloromax', 'Recife', 'PE', 'Indicação', 'WhatsApp', 5, 'Emissão de notas e custos', 'ERP legado', 'Enviar proposta revisada', now() - interval '1 day', '[true,true,true,true,true]', 0, 'R$ 420 mil / mês', '42', 'Troca de sistema'),
  ('00000000-0000-4000-8000-000000000004', 'Potiguar Distribuidora', 'Fernanda Costa', '(84) 99934-6780', '@potiguarlimpeza', 'Natal', 'RN', 'Prospecção', 'WhatsApp', 1, 'Gestão de pedidos', 'Planilhas', 'Ligação de qualificação', now() + interval '2 hours', '[false,true,true,false,false]', 0, 'R$ 90 mil / mês', '12', ''),
  ('00000000-0000-4000-8000-000000000005', 'SuaveLar Amaciantes', 'Juliana Mendes', '(85) 99123-9010', '@suavelar', 'Fortaleza', 'CE', 'Instagram', 'Instagram', 0, 'Estoque sem integração', 'Planilhas', 'Primeiro contato', now() + interval '4 hours', '[true,true,true,false,true]', 1, 'R$ 130 mil / mês', '18', 'Nova linha de produtos'),
  ('00000000-0000-4000-8000-000000000006', 'EcoClean Industrial', 'Pedro Ferreira', '(81) 98873-5620', '@ecocleanindustrial', 'Caruaru', 'PE', 'Contador', 'WhatsApp', 6, 'Custo de formulações', 'ERP legado', 'Follow-up da proposta', now() + interval '1 day', '[true,true,true,true,true]', 0, 'R$ 310 mil / mês', '34', 'Crescimento de vendas'),
  ('00000000-0000-4000-8000-000000000007', 'LimpMais Química', 'Carla Ribeiro', '(83) 99125-4560', '@limpmaisquimica', 'Bayeux', 'PB', 'Evento', 'WhatsApp', 7, 'Integração de setores', 'ERP legado', 'Reunião de boas-vindas', now() + interval '2 days', '[true,true,true,true,true]', 0, 'R$ 200 mil / mês', '25', 'Contrato fechado'),
  ('00000000-0000-4000-8000-000000000008', 'Alvo Detergentes', 'Roberto Lima', '(82) 99621-7800', '@alvodetergentes', 'Maceió', 'AL', 'WhatsApp', 'WhatsApp', 3, 'Controle de vendas e notas', 'Sistema próprio', 'Agendar demonstração', now() + interval '5 hours', '[true,true,true,true,false]', 0, 'R$ 160 mil / mês', '20', 'Mais volume de vendas'),
  ('00000000-0000-4000-8000-000000000009', 'Cristal Saneantes', 'Beatriz Souza', '(79) 99167-9000', '@cristalsaneantes', 'Aracaju', 'SE', 'Prospecção', 'Instagram', 8, 'Processos manuais', 'Planilhas', '', null, '[true,false,true,false,false]', 0, 'R$ 60 mil / mês', '8', '')
on conflict (id) do nothing;

-- Conversa de exemplo (uma ida e volta para cada lead, e uma conversa mais longa com a Brisa).
insert into public.messages (lead_id, conversation_id, content, direction, created_at)
select l.id, c.id,
       'Olá, ' || split_part(l.decision_maker, ' ', 1) || '! Sou a Camila, da IAX. Como vocês organizam a gestão da fábrica hoje?',
       'outbound', now() - interval '2 hours'
from public.leads l
join public.conversations c on c.lead_id = l.id
where l.id::text like '00000000-0000-4000-8000-%'
  and not exists (select 1 from public.messages m where m.lead_id = l.id);

insert into public.messages (lead_id, conversation_id, content, created_at)
select l.id, c.id,
       'Olá! Hoje usamos ' || lower(l.current_system) || '. Nosso maior desafio é ' || lower(l.pain) || '.',
       now() - interval '1 hour'
from public.leads l
join public.conversations c on c.lead_id = l.id
where l.id::text like '00000000-0000-4000-8000-%'
  and (select count(*) from public.messages m where m.lead_id = l.id) = 1;

insert into public.messages (lead_id, conversation_id, content, direction, created_at)
select l.id, c.id, x.content, x.direction, now() - x.ago
from public.leads l
join public.conversations c on c.lead_id = l.id
cross join (values
  ('Entendi, Marcos! A IAX conecta produção, estoque e vendas em um só lugar. Podemos conversar sobre a realidade da Brisa?', 'outbound', interval '35 minutes'),
  ('Podemos sim! Vocês conseguem controlar as fórmulas e os lotes também?', 'inbound', interval '12 minutes')
) as x(content, direction, ago)
where l.id = '00000000-0000-4000-8000-000000000001'
  and (select count(*) from public.messages m where m.lead_id = l.id) = 2;

-- Próximas atividades da agenda (o gatilho atualiza a "próxima ação" de cada lead).
insert into public.activities (lead_id, type, title, due_at, owner_id)
select id,
       case when stage = 4 then 'Demonstração' when stage = 2 then 'Diagnóstico' else 'Follow-up' end,
       next_action, next_at, owner_id
from public.leads l
where l.id::text like '00000000-0000-4000-8000-%'
  and next_at is not null
  and not exists (select 1 from public.activities a where a.lead_id = l.id and a.status = 'pendente');

commit;
