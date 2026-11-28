/* Tipos e regras da API de chamados (seguro para navegador e servidor). */

export const ticketStatuses = ['aberto', 'em_andamento', 'aguardando_cliente', 'resolvido', 'fechado'] as const;
export const ticketPriorities = ['baixa', 'média', 'alta', 'urgente'] as const;
export type TicketStatus = (typeof ticketStatuses)[number];
export type TicketPriority = (typeof ticketPriorities)[number];

export const statusLabel: Record<TicketStatus, string> = {
  aberto: 'Aberto',
  em_andamento: 'Em andamento',
  aguardando_cliente: 'Aguardando cliente',
  resolvido: 'Resolvido',
  fechado: 'Fechado',
};
export const priorityLabel: Record<TicketPriority, string> = { baixa: 'Baixa', média: 'Média', alta: 'Alta', urgente: 'Urgente' };

/** Sistemas da IAX sugeridos ao criar uma chave (o identificador vai no campo "system" do chamado). */
export const knownSystems = [
  { system: 'findflow', name: 'FindFlow' },
  { system: 'pulse-doacoes', name: 'Pulse Doações' },
  { system: 'pulse-pep-clinic', name: 'Pulse PEP Clinic' },
  { system: 'pulse-eleitoral', name: 'Pulse Eleitoral' },
  { system: 'iax-guardian', name: 'IAX Guardian' },
] as const;

export type Ticket = {
  id: string;
  number: number;
  system: string;
  external_ref: string | null;
  title: string;
  description: string;
  category: string;
  priority: TicketPriority;
  status: TicketStatus;
  requester_name: string;
  requester_email: string;
  requester_phone: string;
  requester_company: string;
  metadata: Record<string, unknown>;
  assigned_to: string | null;
  first_response_at: string | null;
  resolved_at: string | null;
  created_at: string;
  updated_at: string;
};

export type TicketEvent = {
  id: string;
  ticket_id: string;
  kind: 'criado' | 'mensagem' | 'status' | 'atribuicao';
  author_type: 'sistema' | 'equipe';
  author_id: string | null;
  author_name: string;
  body: string;
  is_public: boolean;
  from_status: string | null;
  to_status: string | null;
  created_at: string;
};

export type ApiClient = {
  id: string;
  system: string;
  name: string;
  key_prefix: string;
  active: boolean;
  created_at: string;
  last_used_at: string | null;
};

const KEY_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';

/** Gera uma chave de API forte (prefixo iax_live_ + 40 caracteres aleatórios). */
export function generateApiKey() {
  const bytes = new Uint8Array(40);
  crypto.getRandomValues(bytes);
  let body = '';
  for (const b of bytes) body += KEY_ALPHABET[b % KEY_ALPHABET.length];
  return `iax_live_${body}`;
}

/** SHA-256 em hexadecimal (Web Crypto: funciona no navegador e no servidor). */
export async function sha256Hex(text: string) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

export const keyPrefix = (key: string) => key.slice(0, 13);
