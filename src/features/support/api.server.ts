/* Lógica da API de chamados (somente servidor). Importe dentro dos handlers das rotas. */
import type { SupabaseClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { supabaseAdmin } from '@/integrations/supabase/client.server';
import { sha256Hex, ticketPriorities, ticketStatuses, type ApiClient, type Ticket, type TicketEvent } from './model';

// As tabelas de chamados ainda não estão nos tipos gerados do Supabase: usa o cliente sem tipos.
const db = () => supabaseAdmin as unknown as SupabaseClient;

const NO_STORE = { 'Cache-Control': 'no-store', 'Content-Type': 'application/json; charset=utf-8' };

export function json(body: unknown, status = 200, extra: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), { status, headers: { ...NO_STORE, ...extra } });
}
export function apiError(status: number, code: string, message: string, details?: unknown) {
  return json({ error: { code, message, ...(details ? { details } : {}) } }, status);
}

/** Autentica o sistema pela chave em "Authorization: Bearer iax_live_…". */
export async function authenticate(request: Request): Promise<{ client: ApiClient } | { response: Response }> {
  const header = request.headers.get('authorization') ?? '';
  const match = /^Bearer\s+(iax_live_[A-Za-z0-9]{40})$/.exec(header.trim());
  if (!match) return { response: apiError(401, 'unauthorized', 'Envie a chave do sistema no cabeçalho Authorization: Bearer iax_live_…') };
  const hash = await sha256Hex(match[1]!);
  const { data, error } = await db().from('api_clients').select('id, system, name, key_prefix, active, created_at, last_used_at').eq('key_hash', hash).maybeSingle();
  if (error) {
    console.error('[api/chamados] auth', error.message);
    return { response: apiError(503, 'unavailable', 'Serviço de chamados indisponível. Tente novamente em instantes.') };
  }
  if (!data || !(data as ApiClient).active) return { response: apiError(401, 'unauthorized', 'Chave de API inválida ou revogada.') };
  void db().from('api_clients').update({ last_used_at: new Date().toISOString() }).eq('id', (data as ApiClient).id);
  return { client: data as ApiClient };
}

export async function readJson(request: Request): Promise<{ body: unknown } | { response: Response }> {
  const type = request.headers.get('content-type') ?? '';
  if (!type.includes('application/json')) return { response: apiError(415, 'unsupported_media_type', 'Envie o corpo em JSON (Content-Type: application/json).') };
  const text = await request.text();
  if (text.length > 64_000) return { response: apiError(413, 'payload_too_large', 'O corpo da requisição passou de 64 KB.') };
  try {
    return { body: JSON.parse(text) };
  } catch {
    return { response: apiError(400, 'invalid_json', 'O corpo não é um JSON válido.') };
  }
}

const trimmed = (max: number) => z.string().trim().max(max);
export const CreateTicket = z.object({
  title: z.string().trim().min(3, 'O título precisa de pelo menos 3 caracteres.').max(200),
  description: trimmed(10_000).default(''),
  category: trimmed(60).default('Suporte'),
  priority: z.enum(ticketPriorities).default('média'),
  external_ref: trimmed(120).min(1).optional(),
  requester: z
    .object({
      name: trimmed(120).default(''),
      email: z.union([z.string().trim().email('E-mail do solicitante inválido.').max(160), z.literal('')]).default(''),
      phone: trimmed(40).default(''),
      company: trimmed(160).default(''),
    })
    .default({ name: '', email: '', phone: '', company: '' }),
  metadata: z.record(z.string(), z.unknown()).default({}),
});
export const CreateMessage = z.object({
  body: z.string().trim().min(1, 'A mensagem não pode ficar vazia.').max(10_000),
  author_name: trimmed(120).default(''),
});
export const ListQuery = z.object({
  status: z.enum(ticketStatuses).optional(),
  external_ref: trimmed(120).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50),
});

export function zodDetails(error: z.ZodError) {
  return error.issues.map((i) => ({ field: i.path.join('.'), message: i.message }));
}

/** Formato público do chamado (o que os sistemas de origem enxergam). */
export function publicTicket(t: Ticket, events?: TicketEvent[]) {
  return {
    id: t.id,
    number: t.number,
    system: t.system,
    external_ref: t.external_ref,
    title: t.title,
    description: t.description,
    category: t.category,
    priority: t.priority,
    status: t.status,
    requester: { name: t.requester_name, email: t.requester_email, phone: t.requester_phone, company: t.requester_company },
    metadata: t.metadata,
    first_response_at: t.first_response_at,
    resolved_at: t.resolved_at,
    created_at: t.created_at,
    updated_at: t.updated_at,
    ...(events
      ? {
          events: events
            .filter((e) => e.is_public)
            .map((e) => ({ id: e.id, kind: e.kind, author_type: e.author_type, author_name: e.author_name, body: e.body, from_status: e.from_status, to_status: e.to_status, created_at: e.created_at })),
        }
      : {}),
  };
}

export async function createTicket(client: ApiClient, input: z.infer<typeof CreateTicket>) {
  if (input.external_ref) {
    const { data: existing } = await db().from('tickets').select('*').eq('system', client.system).eq('external_ref', input.external_ref).maybeSingle();
    if (existing) return { ticket: existing as Ticket, created: false };
  }
  const { data, error } = await db()
    .from('tickets')
    .insert({
      system: client.system,
      external_ref: input.external_ref ?? null,
      title: input.title,
      description: input.description,
      category: input.category || 'Suporte',
      priority: input.priority,
      requester_name: input.requester.name,
      requester_email: input.requester.email,
      requester_phone: input.requester.phone,
      requester_company: input.requester.company,
      metadata: input.metadata,
    })
    .select('*')
    .single();
  if (error) throw new Error(error.message);
  const ticket = data as Ticket;
  await db().from('ticket_events').insert({ ticket_id: ticket.id, kind: 'criado', author_type: 'sistema', author_name: input.requester.name || client.name, body: input.description, is_public: true });
  return { ticket, created: true };
}

export async function listTickets(client: ApiClient, q: z.infer<typeof ListQuery>) {
  let query = db().from('tickets').select('*').eq('system', client.system).order('created_at', { ascending: false }).limit(q.limit);
  if (q.status) query = query.eq('status', q.status);
  if (q.external_ref) query = query.eq('external_ref', q.external_ref);
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []) as Ticket[];
}

/** Busca um chamado do próprio sistema, por id (uuid) ou número. */
export async function findTicket(client: ApiClient, idOrNumber: string) {
  const isNumber = /^\d{1,12}$/.test(idOrNumber);
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrNumber);
  if (!isNumber && !isUuid) return null;
  const { data, error } = await db()
    .from('tickets')
    .select('*')
    .eq('system', client.system)
    .eq(isNumber ? 'number' : 'id', idOrNumber)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return (data as Ticket | null) ?? null;
}

export async function ticketEvents(ticketId: string) {
  const { data, error } = await db().from('ticket_events').select('*').eq('ticket_id', ticketId).order('created_at');
  if (error) throw new Error(error.message);
  return (data ?? []) as TicketEvent[];
}

export async function addSystemMessage(client: ApiClient, ticket: Ticket, input: z.infer<typeof CreateMessage>) {
  const { data, error } = await db()
    .from('ticket_events')
    .insert({ ticket_id: ticket.id, kind: 'mensagem', author_type: 'sistema', author_name: input.author_name || client.name, body: input.body, is_public: true })
    .select('*')
    .single();
  if (error) throw new Error(error.message);
  // Resposta do cliente reabre um chamado que estava aguardando ou resolvido.
  if (ticket.status === 'aguardando_cliente' || ticket.status === 'resolvido') await db().from('tickets').update({ status: 'em_andamento' }).eq('id', ticket.id);
  return data as TicketEvent;
}
