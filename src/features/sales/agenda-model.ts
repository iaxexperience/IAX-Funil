import { addDays, format, isValid, parseISO, startOfDay, startOfWeek } from 'date-fns';
import type { Activity, Lead } from './model';

export type AgendaSearch = { date?: string; view?: string; status?: string; owner?: string; type?: string; q?: string };
export function agendaDate(value?: string) {
  const parsed = value && /^\d{4}-\d{2}-\d{2}$/.test(value) ? parseISO(value) : new Date();
  return startOfDay(isValid(parsed) ? parsed : new Date());
}
export const dayKey = (date: Date) => format(date, 'yyyy-MM-dd');
export function agendaDays(date: Date, view: string) {
  const start = view === 'day' ? startOfDay(date) : startOfWeek(date, { weekStartsOn: 1 });
  return Array.from({ length: view === 'day' ? 1 : 7 }, (_, index) => addDays(start, index));
}
export function filterActivities(activities: Activity[], leads: Lead[], search: AgendaSearch, now = new Date()) {
  const date = agendaDate(search.date);
  const days = agendaDays(date, search.view ?? 'list');
  const start = days[0] ?? date;
  const end = addDays(days.at(-1) ?? date, 1);
  return activities.filter(activity => {
    const due = new Date(activity.due_at);
    const status = search.status ?? 'pendente';
    if (status === 'overdue') {
      if (activity.status !== 'pendente' || due >= now) return false;
    } else if (due < start || due >= end || (status !== 'all' && activity.status !== status)) return false;
    if (search.owner && activity.owner_id !== search.owner) return false;
    if (search.type && activity.type !== search.type) return false;
    const lead = leads.find(item => item.id === activity.lead_id);
    return `${activity.title} ${lead?.company ?? ''} ${lead?.decision_maker ?? ''}`.toLocaleLowerCase('pt-BR').includes((search.q ?? '').toLocaleLowerCase('pt-BR'));
  }).sort((a, b) => new Date(a.due_at).getTime() - new Date(b.due_at).getTime());
}