import type { Database } from '@/integrations/supabase/types';
export type Lead = Database['public']['Tables']['leads']['Row'];
export type Activity = Database['public']['Tables']['activities']['Row'];
export type Message = Database['public']['Tables']['messages']['Row'];
export type Note = Database['public']['Tables']['notes']['Row'];
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type LeadPatch = Database['public']['Tables']['leads']['Update'];
export const stages = ['Novo lead','Contato iniciado','Diagnóstico agendado','Qualificado','Demonstração','Proposta enviada','Negociação','Cliente ganho','Nutrir / perdido'];
export const sources = ['Anúncio','Instagram','WhatsApp','Indicação','Contador','Evento','Prospecção'];
export const activityTypes = ['Ligação','WhatsApp','Diagnóstico','Demonstração','Proposta','Follow-up','Tarefa interna'];
export const qualificationLabels = ['Fabrica e vende diretamente','Volume relevante de vendas e notas','Dor com o sistema atual','Capacidade de investimento','Gatilho de compra ativo'];
export function icpScore(criteria: unknown): number { return Array.isArray(criteria) ? criteria.slice(0,5).filter(v => v === true).length * 20 : 0; }
export function icpLabel(score: number) { return score >= 70 ? 'Prioridade' : score >= 50 ? 'Nutrir' : 'Baixa prioridade'; }
export function overdue(date: string | null, now = new Date()): boolean { return date !== null && new Date(date).getTime() < now.getTime(); }
export const initials = (name: string) => name.split(' ').filter(Boolean).slice(0,2).map(p=>p[0]).join('').toUpperCase();
export const dateLabel = (date: string | null) => date ? new Date(date).toLocaleDateString('pt-BR',{day:'2-digit',month:'short'}) : 'Sem data';
export const timeLabel = (date: string) => new Date(date).toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'});
export const localInput = (date: string | null) => date ? new Date(new Date(date).getTime()-new Date(date).getTimezoneOffset()*60000).toISOString().slice(0,16) : '';
export function meta(title: string, description: string) { return { meta: [{ title: `${title} · FindFlow Sales` },{name:'description',content:description},{property:'og:title',content:`${title} · FindFlow Sales`},{property:'og:description',content:description},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary_large_image'}] }; }
