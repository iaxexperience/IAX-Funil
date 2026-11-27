import { useMemo, useState } from 'react';
import {
  Search,
  LayoutGrid,
  TriangleAlert,
  CalendarClock,
  CalendarRange,
  CircleCheck,
  List,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Phone,
  MessageCircle,
  Stethoscope,
  Presentation,
  FileText,
  RefreshCw,
  ClipboardList,
  Check,
  RotateCcw,
  Plus,
  type LucideIcon,
} from 'lucide-react';
import { useSales, runAction } from './data';
import { Shell, Avatar } from './shared';
import { ActivityForm } from './forms';
import { LeadPanel } from './lead-panel';
import { activityTypes, timeLabel, type Activity } from './model';

const typeIcon: Record<string, LucideIcon> = {
  Ligação: Phone,
  WhatsApp: MessageCircle,
  Diagnóstico: Stethoscope,
  Demonstração: Presentation,
  Proposta: FileText,
  'Follow-up': RefreshCw,
  'Tarefa interna': ClipboardList,
};
const typeHue: Record<string, number> = { Ligação: 255, WhatsApp: 150, Diagnóstico: 195, Demonstração: 290, Proposta: 60, 'Follow-up': 25, 'Tarefa interna': 260 };

const DAY = 86400000;
const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const startOfWeek = (d: Date) => {
  const s = startOfDay(d);
  const dow = (s.getDay() + 6) % 7; // segunda = 0
  return new Date(s.getTime() - dow * DAY);
};
const isDone = (a: Activity) => a.status === 'concluída';
const dayKey = (d: Date) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
const weekday = (d: Date) => d.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '');
const longDay = (d: Date) => d.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });

type Filter = 'todas' | 'atrasadas' | 'hoje' | 'semana' | 'concluidas';

export function AgendaPage() {
  const { activities, leads, profiles, updateActivity, user } = useSales();
  const [view, setView] = useState<'lista' | 'semana'>('lista');
  const [filter, setFilter] = useState<Filter>('todas');
  const [type, setType] = useState('todos');
  const [owner, setOwner] = useState('todos');
  const [search, setSearch] = useState('');
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date()));
  const [newActivity, setNewActivity] = useState(false);
  const [openLead, setOpenLead] = useState<string | null>(null);

  const now = Date.now();
  const today = startOfDay(new Date()).getTime();
  const me = user?.id ?? 'demo-1';
  const leadName = (id: string) => leads.find((l) => l.id === id)?.company ?? 'Lead removido';
  const ownerName = (id: string | null) => profiles.find((p) => p.id === id)?.name ?? 'Sem responsável';

  const base = useMemo(
    () =>
      activities.filter(
        (a) =>
          (type === 'todos' || a.type === type) &&
          (owner === 'todos' || (owner === 'meus' ? a.owner_id === me : a.owner_id === owner)) &&
          `${a.title} ${leadName(a.lead_id)} ${a.observation}`.toLowerCase().includes(search.toLowerCase()),
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activities, type, owner, search, me, leads],
  );

  const late = (a: Activity) => !isDone(a) && new Date(a.due_at).getTime() < now;
  const counts = {
    todas: base.filter((a) => !isDone(a)).length,
    atrasadas: base.filter(late).length,
    hoje: base.filter((a) => !isDone(a) && new Date(a.due_at).getTime() >= today && new Date(a.due_at).getTime() < today + DAY).length,
    semana: base.filter((a) => !isDone(a) && new Date(a.due_at).getTime() >= today && new Date(a.due_at).getTime() < today + 7 * DAY).length,
    concluidas: base.filter(isDone).length,
  };
  const tiles: { id: Filter; label: string; icon: LucideIcon; tone?: string }[] = [
    { id: 'todas', label: 'Pendentes', icon: LayoutGrid },
    { id: 'atrasadas', label: 'Atrasadas', icon: TriangleAlert, tone: 'red' },
    { id: 'hoje', label: 'Hoje', icon: CalendarClock },
    { id: 'semana', label: 'Próximos 7 dias', icon: CalendarRange },
    { id: 'concluidas', label: 'Concluídas', icon: CircleCheck, tone: 'green' },
  ];

  const listItems = base
    .filter((a) => {
      const t = new Date(a.due_at).getTime();
      if (filter === 'concluidas') return isDone(a);
      if (isDone(a)) return false;
      if (filter === 'atrasadas') return late(a);
      if (filter === 'hoje') return t >= today && t < today + DAY;
      if (filter === 'semana') return t >= today && t < today + 7 * DAY;
      return true;
    })
    .sort((a, b) => (filter === 'concluidas' ? b.due_at.localeCompare(a.due_at) : a.due_at.localeCompare(b.due_at)));

  // Agrupa a lista: atrasadas primeiro, depois por dia.
  const groups: { key: string; title: string; tone?: string; items: Activity[] }[] = [];
  for (const a of listItems) {
    const d = startOfDay(new Date(a.due_at));
    const key = late(a) ? 'late' : dayKey(d);
    const title = late(a) ? 'Atrasadas' : d.getTime() === today ? 'Hoje' : d.getTime() === today + DAY ? 'Amanhã' : longDay(d);
    let g = groups.find((x) => x.key === key);
    if (!g) groups.push((g = { key, title, ...(late(a) ? { tone: 'red' } : {}), items: [] }));
    g.items.push(a);
  }

  const toggle = (a: Activity) =>
    void runAction(() => updateActivity(a.id, isDone(a) ? 'pendente' : 'concluída'), isDone(a) ? 'Atividade reaberta' : 'Atividade concluída');

  const weekDays = Array.from({ length: 7 }, (_, n) => new Date(weekStart.getTime() + n * DAY));
  const weekEnd = weekStart.getTime() + 7 * DAY;
  const weekLabel = `${weekDays[0]!.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })} – ${weekDays[6]!.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' })}`;
  const opened = openLead ? leads.find((l) => l.id === openLead) : undefined;

  return (
    <Shell area="Agenda" onNew={() => setNewActivity(true)}>
      <div className="ag-page">
        <div className="ag-tiles">
          {tiles.map((t) => (
            <button
              type="button"
              key={t.id}
              className={`ag-tile ${t.tone ?? ''} ${filter === t.id ? 'on' : ''}`}
              onClick={() => {
                setFilter(t.id);
                setView('lista');
              }}
            >
              <t.icon size={17} />
              <small>{t.label}</small>
              <strong>{counts[t.id]}</strong>
            </button>
          ))}
        </div>

        <div className="ag-toolbar">
          <div className="ag-views" role="tablist">
            <button type="button" role="tab" aria-selected={view === 'lista'} className={view === 'lista' ? 'on' : ''} onClick={() => setView('lista')}>
              <List size={15} /> Lista
            </button>
            <button type="button" role="tab" aria-selected={view === 'semana'} className={view === 'semana' ? 'on' : ''} onClick={() => setView('semana')}>
              <CalendarDays size={15} /> Semana
            </button>
          </div>
          <div className="ag-search">
            <Search size={15} />
            <input aria-label="Buscar atividades" placeholder="Buscar atividade ou lead…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select aria-label="Tipo de atividade" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="todos">Todos os tipos</option>
            {activityTypes.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
          <select aria-label="Responsável" value={owner} onChange={(e) => setOwner(e.target.value)}>
            <option value="todos">Todos os responsáveis</option>
            <option value="meus">Minhas atividades</option>
            {profiles.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <button type="button" className="crm-btn navy ag-new" onClick={() => setNewActivity(true)}>
            <Plus size={14} /> Nova atividade
          </button>
        </div>

        {view === 'lista' ? (
          <div className="ag-list">
            {groups.map((g) => (
              <section key={g.key} className={`ag-group ${g.tone ?? ''}`}>
                <h3>
                  {g.title} <span>{g.items.length}</span>
                </h3>
                {g.items.map((a) => {
                  const Icon = typeIcon[a.type] ?? ClipboardList;
                  return (
                    <div className={`ag-row ${isDone(a) ? 'done' : ''} ${late(a) ? 'late' : ''}`} key={a.id} style={{ ['--h' as string]: String(typeHue[a.type] ?? 260) }}>
                      <button type="button" className="ag-check" onClick={() => toggle(a)} aria-label={isDone(a) ? 'Reabrir atividade' : 'Concluir atividade'} title={isDone(a) ? 'Reabrir' : 'Concluir'}>
                        {isDone(a) && <Check size={13} strokeWidth={3} />}
                      </button>
                      <div className="ag-time">
                        <b>{timeLabel(a.due_at)}</b>
                        <small>{new Date(a.due_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}</small>
                      </div>
                      <span className="ag-type">
                        <Icon size={14} /> {a.type}
                      </span>
                      <div className="ag-main">
                        <b>{a.title}</b>
                        {a.observation && <p>{a.observation}</p>}
                      </div>
                      <button type="button" className="ag-lead" onClick={() => setOpenLead(a.lead_id)}>
                        {leadName(a.lead_id)}
                      </button>
                      <span className="ag-owner" title={ownerName(a.owner_id)}>
                        <Avatar name={ownerName(a.owner_id)} small />
                        <span>{ownerName(a.owner_id)}</span>
                      </span>
                      <button type="button" className="ag-action" onClick={() => toggle(a)}>
                        {isDone(a) ? (
                          <>
                            <RotateCcw size={13} /> Reabrir
                          </>
                        ) : (
                          <>
                            <Check size={13} /> Concluir
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </section>
            ))}
            {groups.length === 0 && (
              <div className="ag-empty">
                <CalendarDays size={30} />
                <b>Nada por aqui.</b>
                <p>{filter === 'concluidas' ? 'Nenhuma atividade concluída com esses filtros.' : 'Nenhuma atividade pendente com esses filtros.'}</p>
                <button type="button" className="crm-btn navy" onClick={() => setNewActivity(true)}>
                  <Plus size={14} /> Agendar atividade
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="ag-week">
            <div className="ag-week-nav">
              <button type="button" onClick={() => setWeekStart(new Date(weekStart.getTime() - 7 * DAY))} aria-label="Semana anterior">
                <ChevronLeft size={17} />
              </button>
              <button type="button" className="ag-today" onClick={() => setWeekStart(startOfWeek(new Date()))}>
                Hoje
              </button>
              <button type="button" onClick={() => setWeekStart(new Date(weekStart.getTime() + 7 * DAY))} aria-label="Próxima semana">
                <ChevronRight size={17} />
              </button>
              <h3>{weekLabel}</h3>
            </div>
            <div className="ag-week-grid">
              {weekDays.map((d) => {
                const items = base
                  .filter((a) => {
                    const t = new Date(a.due_at).getTime();
                    return t >= d.getTime() && t < d.getTime() + DAY && t < weekEnd;
                  })
                  .sort((a, b) => a.due_at.localeCompare(b.due_at));
                const isToday = d.getTime() === today;
                return (
                  <div className={`ag-day ${isToday ? 'today' : ''}`} key={d.toISOString()}>
                    <header>
                      <small>{weekday(d)}</small>
                      <strong>{d.getDate()}</strong>
                    </header>
                    {items.map((a) => {
                      const Icon = typeIcon[a.type] ?? ClipboardList;
                      return (
                        <button
                          type="button"
                          key={a.id}
                          className={`ag-chip ${isDone(a) ? 'done' : ''} ${late(a) ? 'late' : ''}`}
                          style={{ ['--h' as string]: String(typeHue[a.type] ?? 260) }}
                          onClick={() => setOpenLead(a.lead_id)}
                          title={`${a.type} · ${a.title} · ${leadName(a.lead_id)}`}
                        >
                          <span>
                            <Icon size={12} /> {timeLabel(a.due_at)}
                          </span>
                          <b>{a.title}</b>
                          <small>{leadName(a.lead_id)}</small>
                        </button>
                      );
                    })}
                    {items.length === 0 && <p className="ag-free">Livre</p>}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {opened && (
        <>
          <div className="drawer-overlay" onClick={() => setOpenLead(null)} />
          <LeadPanel lead={opened} drawer onClose={() => setOpenLead(null)} />
        </>
      )}
      <ActivityForm open={newActivity} onClose={() => setNewActivity(false)} />
    </Shell>
  );
}
