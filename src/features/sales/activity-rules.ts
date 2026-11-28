import type { Activity } from './model';

/** Regras de atividade compartilhadas pela Agenda, pelo CRM e pelos testes (sem dependência de navegador). */
export const isPendingActivity = (activity: Pick<Activity, 'status'>) => activity.status === 'pendente';
