import { useMemo, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import {
  Search,
  Plus,
  Pencil,
  Phone,
  Instagram,
  MapPin,
  Crosshair,
  UserRound,
  Flag,
  CircleCheck,
  CalendarClock,
  Send,
  MessageCircle,
  CalendarPlus,
  Check,
  ArrowRightLeft,
  Inbox as InboxIcon,
  List,
  Columns3,
  Building2,
  StickyNote,
  Sparkles,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useSales, runAction } from './data';
import { Shell, Avatar, Channel, Icp } from './shared';
import { LeadForm, ActivityForm } from './forms';
import { AppointmentAssistant } from './appointment-ai';
import { stages, dateLabel, timeLabel, overdue, icpScore, type Lead } from './model';

type Status = 'Novo' | 'Contatado' | 'Qualificado' | 'Convertido' | 'Perdido';
function leadStatus(l: Lead): Status {
  if (l.stage === 0) return 'Novo';
  if (l.stage === 1) return 'Contatado';
  if (l.stage === 7) return 'Convertido';
  if (l.stage === 8) return 'Perdido';
  return 'Qualificado';
}
const statusTone: Record<Status, string> = { Novo: 'blue', Contatado: 'orange', Qualificado: 'teal', Convertido: 'green', Perdido: 'red' };
const statuses: Status[] = ['Novo', 'Contatado', 'Qualificado', 'Convertido', 'Perdido'];

function StatusTag({ lead }: { lead: Lead }) {
  const s = leadStatus(lead);
  return <span className={`crm-tag ${statusTone[s]}`}>{s}</span>;
}

function ago(date: string) {
  const days = Math.floor((Date.now() - new Date(date).getTime()) / 86400000);
  if (days < 1) return 'hoje';
  if (days < 7) return `${days} ${days === 1 ? 'dia' : 'dias'}`;
  if (days < 30) return `${Math.floor(days / 7)} sem.`;
  const months = Math.floor(days / 30);
  return `${months} ${months === 1 ? 'mês' : 'meses'}`;
}

function useStageHistory(leadId: string | undefined, enabled: boolean) {
  return useQuery({
    queryKey: ['stage_history', leadId],
    enabled: enabled && !!leadId,
    queryFn: async () => {
      const { data, error } = await supabase.from('stage_history').select('*').eq('lead_id', leadId!).order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

function LeadDetail({ lead }: { lead: Lead }) {
  const { profiles, notes, activities, addNote, updateLead, updateActivity, admin, demo } = useSales();
  const [tab, setTab] = useState<'notas' | 'atividades' | 'historico'>('notas');
  const [note, setNote] = useState('');
  const [edit, setEdit] = useState(false);
  const [activity, setActivity] = useState(false);
  const [meeting, setMeeting] = useState(false);
  const owner = profiles.find((p) => p.id === lead.owner_id);
  const leadNotes = notes.filter((n) => n.lead_id === lead.id).sort((a, b) => b.created_at.localeCompare(a.created_at));
  const leadActs = activities.filter((a) => a.lead_id === lead.id).sort((a, b) => b.due_at.localeCompare(a.due_at));
  const history = useStageHistory(lead.id, !demo);
  const author = (id: string | null) => profiles.find((p) => p.id === id)?.name ?? 'Equipe';

  return (
    <div className="crm-detail">
      <div className="crm-detail-head">
        <Avatar name={lead.company} square />
        <div className="crm-detail-title">
          <h2>{lead.company || 'Lead sem nome'}</h2>
          <p>
            {lead.decision_maker || 'Contato não informado'} · {lead.segment || 'Segmento não informado'}
          </p>
        </div>
        <StatusTag lead={lead} />
        <div className="crm-detail-actions">
          <Link to="/inbox" search={{ lead: lead.id }} className="crm-btn ghost" title="Abrir conversa">
            <MessageCircle size={14} /> Conversa
          </Link>
          <button type="button" className="crm-btn ghost" onClick={() => setEdit(true)}>
            <Pencil size={13} /> Editar
          </button>
          <button type="button" className="crm-btn ai" onClick={() => setMeeting(true)}>
            <Sparkles size={14} /> Registrar compromisso
          </button>
          <button type="button" className="crm-btn navy" onClick={() => setActivity(true)}>
            <Plus size={14} /> Registrar atividade
          </button>
        </div>
      </div>

      <div className="crm-boxes">
        <div className="crm-box">
          <div className="crm-kv">
            <UserRound size={14} />
            <span>Contato</span>
            <b>{lead.decision_maker || '—'}</b>
          </div>
          <div className="crm-kv">
            <Phone size={14} />
            <span>Telefone</span>
            <b>{lead.phone || '—'}</b>
          </div>
          <div className="crm-kv">
            <Instagram size={14} />
            <span>Instagram</span>
            <b>{lead.instagram || '—'}</b>
          </div>
          <div className="crm-kv">
            <MapPin size={14} />
            <span>Cidade</span>
            <b>{[lead.city, lead.state].filter(Boolean).join(', ') || '—'}</b>
          </div>
          <div className="crm-kv">
            <Crosshair size={14} />
            <span>Origem</span>
            <b>
              {lead.source} · <Channel channel={lead.channel} /> {lead.channel}
            </b>
          </div>
        </div>
        <div className="crm-box">
          <label className="crm-kv">
            <Flag size={14} />
            <span>Etapa</span>
            <select value={lead.stage} onChange={(e) => void runAction(() => updateLead(lead.id, { stage: Number(e.target.value) }), 'Etapa atualizada')}>
              {stages.map((s, i) => (
                <option key={s} value={i}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          <label className="crm-kv">
            <UserRound size={14} />
            <span>Responsável</span>
            {admin ? (
              <select
                value={lead.owner_id ?? ''}
                onChange={(e) => void runAction(() => updateLead(lead.id, { owner_id: e.target.value || null }), 'Responsável atualizado')}
              >
                <option value="">Sem responsável</option>
                {profiles.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            ) : (
              <b>{owner?.name ?? 'Sem responsável'}</b>
            )}
          </label>
          <div className="crm-kv">
            <CircleCheck size={14} />
            <span>Conversa</span>
            <button
              type="button"
              className={`crm-state ${lead.resolved ? 'done' : ''}`}
              onClick={() => void runAction(() => updateLead(lead.id, { resolved: !lead.resolved }), lead.resolved ? 'Conversa reaberta' : 'Conversa resolvida')}
            >
              <i /> {lead.resolved ? 'Resolvida' : 'Aberta'}
            </button>
          </div>
          <div className="crm-kv">
            <CalendarClock size={14} />
            <span>Criado em</span>
            <b>
              {dateLabel(lead.created_at)} às {timeLabel(lead.created_at)}
            </b>
          </div>
          <div className="crm-icp">
            <Icp criteria={lead.qualification} />
          </div>
        </div>
        <div className="crm-side">
          <div className="crm-box">
            <div className="crm-box-title">
              Observações
              <button type="button" onClick={() => setEdit(true)}>
                <Pencil size={11} /> Editar
              </button>
            </div>
            <p>
              <b>Dor:</b> {lead.pain || 'não informada'}
              <br />
              <b>Sistema atual:</b> {lead.current_system || 'não informado'}
              {lead.buying_trigger && (
                <>
                  <br />
                  <b>Gatilho de compra:</b> {lead.buying_trigger}
                </>
              )}
            </p>
          </div>
          <div className={`crm-box ${overdue(lead.next_at) ? 'late' : ''}`}>
            <div className="crm-box-title">Próxima atividade</div>
            <p>
              {lead.next_action ? (
                <>
                  {lead.next_action}
                  {lead.next_at && (
                    <>
                      <br />
                      <b>
                        {dateLabel(lead.next_at)} às {timeLabel(lead.next_at)}
                        {overdue(lead.next_at) ? ' · atrasada' : ''}
                      </b>
                    </>
                  )}
                </>
              ) : (
                'Nenhuma atividade agendada.'
              )}
            </p>
            <button type="button" className="crm-add" onClick={() => setActivity(true)}>
              <CalendarPlus size={13} /> Agendar
            </button>
          </div>
        </div>
      </div>

      <div className="crm-box crm-tabs-box">
        <div className="crm-tabs" role="tablist">
          {(
            [
              ['notas', 'Notas', leadNotes.length],
              ['atividades', 'Atividades', leadActs.length],
              ['historico', 'Histórico', null],
            ] as const
          ).map(([id, label, count]) => (
            <button type="button" role="tab" aria-selected={tab === id} key={id} className={tab === id ? 'on' : ''} onClick={() => setTab(id)}>
              {label}
              {count ? <em>{count}</em> : null}
            </button>
          ))}
        </div>

        {tab === 'notas' && (
          <>
            <form
              className="crm-note-form"
              onSubmit={(e) => {
                e.preventDefault();
                if (note.trim())
                  void runAction(async () => {
                    await addNote(lead.id, note.trim());
                    setNote('');
                  }, 'Nota registrada');
              }}
            >
              <textarea aria-label="Nova nota" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Escreva uma observação sobre este lead…" />
              <button type="submit" className="crm-btn soft" disabled={!note.trim()}>
                <Send size={13} /> Registrar
              </button>
            </form>
            {leadNotes.map((n) => (
              <div className="crm-entry" key={n.id}>
                <Avatar name={author(n.author_id)} small />
                <div>
                  <b>{author(n.author_id)}</b> <small>{dateLabel(n.created_at)} às {timeLabel(n.created_at)}</small>
                  <p>{n.content}</p>
                </div>
              </div>
            ))}
            {leadNotes.length === 0 && <p className="crm-muted">Nenhuma nota ainda.</p>}
          </>
        )}

        {tab === 'atividades' && (
          <>
            {leadActs.map((a) => (
              <div className={`crm-entry act ${a.status === 'concluída' ? 'done' : overdue(a.due_at) ? 'late' : ''}`} key={a.id}>
                <span className="crm-act-type">{a.type}</span>
                <div>
                  <b>{a.title}</b> <small>{dateLabel(a.due_at)} às {timeLabel(a.due_at)}</small>
                  {a.observation && <p>{a.observation}</p>}
                </div>
                {a.status !== 'concluída' ? (
                  <button type="button" className="crm-btn soft" onClick={() => void runAction(() => updateActivity(a.id, 'concluída'), 'Atividade concluída')}>
                    <Check size={13} /> Concluir
                  </button>
                ) : (
                  <span className="crm-done">
                    <Check size={13} /> Concluída
                  </span>
                )}
              </div>
            ))}
            {leadActs.length === 0 && <p className="crm-muted">Nenhuma atividade registrada.</p>}
          </>
        )}

        {tab === 'historico' && (
          <>
            {demo && <p className="crm-muted">Na demonstração, o histórico mostra só as atividades concluídas. Entre na sua conta para ver as mudanças de etapa.</p>}
            {(history.data ?? []).map((h) => (
              <div className="crm-entry" key={h.id}>
                <span className="crm-hist-icon">
                  <ArrowRightLeft size={13} />
                </span>
                <div>
                  <b>{h.from_stage === null ? `Criado em ${stages[h.to_stage]}` : `${stages[h.from_stage]} → ${stages[h.to_stage]}`}</b>{' '}
                  <small>
                    {author(h.author_id)} · {dateLabel(h.created_at)} às {timeLabel(h.created_at)}
                  </small>
                </div>
              </div>
            ))}
            {leadActs
              .filter((a) => a.status === 'concluída')
              .map((a) => (
                <div className="crm-entry" key={`h-${a.id}`}>
                  <span className="crm-hist-icon green">
                    <Check size={13} />
                  </span>
                  <div>
                    <b>{a.title}</b> <small>{dateLabel(a.due_at)}</small>
                  </div>
                </div>
              ))}
            {!demo && !history.isLoading && (history.data ?? []).length === 0 && leadActs.every((a) => a.status !== 'concluída') && (
              <p className="crm-muted">Sem movimentações ainda.</p>
            )}
          </>
        )}
      </div>

      {edit && <LeadForm open lead={lead} onClose={() => setEdit(false)} />}
      {meeting && <AppointmentAssistant lead={lead} open onClose={() => setMeeting(false)} />}
      <ActivityForm open={activity} leadId={lead.id} onClose={() => setActivity(false)} />
    </div>
  );
}

export function CrmPage() {
  const { leads, profiles, user } = useSales();
  const [view, setView] = useState<'inbox' | 'lista'>('inbox');
  const [owner, setOwner] = useState<'meus' | 'sem' | 'todos'>('todos');
  const [state, setState] = useState<'abertos' | 'encerrados' | 'todos'>('abertos');
  const [chip, setChip] = useState<Status | 'Sem responsável' | null>(null);
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [newLead, setNewLead] = useState(false);
  const [mobileDetail, setMobileDetail] = useState(false);
  const me = user?.id ?? 'demo-1';

  const counts = useMemo(() => {
    const c: Record<string, number> = { Total: leads.length, 'Sem responsável': leads.filter((l) => !l.owner_id).length };
    for (const s of statuses) c[s] = leads.filter((l) => leadStatus(l) === s).length;
    return c;
  }, [leads]);

  const list = useMemo(
    () =>
      leads
        .filter(
          (l) =>
            `${l.company} ${l.decision_maker} ${l.phone} ${l.instagram}`.toLowerCase().includes(search.toLowerCase()) &&
            (owner === 'todos' || (owner === 'meus' ? l.owner_id === me : !l.owner_id)) &&
            (state === 'todos' || (state === 'abertos' ? l.stage < 7 : l.stage >= 7)) &&
            (!chip || (chip === 'Sem responsável' ? !l.owner_id : leadStatus(l) === chip)),
        )
        .sort((a, b) => b.created_at.localeCompare(a.created_at)),
    [leads, search, owner, state, chip, me],
  );
  const selected = list.find((l) => l.id === selectedId) ?? list[0];
  const ownerName = (l: Lead) => profiles.find((p) => p.id === l.owner_id)?.name ?? 'Sem responsável';

  function pick(id: string) {
    setSelectedId(id);
    setMobileDetail(true);
    setView('inbox');
  }

  return (
    <Shell area="CRM" onNew={() => setNewLead(true)}>
      <div className="crm-page">
        <div className="crm-head">
          <div>
            <h1>Leads</h1>
            <p>Gerencie sua fila de leads e qualificação</p>
          </div>
          <button type="button" className="crm-btn navy big" onClick={() => setNewLead(true)}>
            <Plus size={15} /> Novo lead
          </button>
        </div>
        <div className="crm-chips">
          <button type="button" className={`crm-chip gray ${chip === null ? 'on' : ''}`} onClick={() => setChip(null)}>
            Total: {counts['Total']}
          </button>
          {statuses.map((s) => (
            <button type="button" key={s} className={`crm-chip ${statusTone[s]} ${chip === s ? 'on' : ''}`} onClick={() => setChip(chip === s ? null : s)}>
              {s}: {counts[s]}
            </button>
          ))}
          <button type="button" className={`crm-chip orange ${chip === 'Sem responsável' ? 'on' : ''}`} onClick={() => setChip(chip === 'Sem responsável' ? null : 'Sem responsável')}>
            Sem responsável: {counts['Sem responsável']}
          </button>
        </div>
        <div className="crm-views" role="tablist">
          <button type="button" role="tab" aria-selected={view === 'inbox'} className={view === 'inbox' ? 'on' : ''} onClick={() => setView('inbox')}>
            <InboxIcon size={14} /> Inbox
          </button>
          <Link to="/funil" className="crm-view-link">
            <Columns3 size={14} /> Kanban
          </Link>
          <button type="button" role="tab" aria-selected={view === 'lista'} className={view === 'lista' ? 'on' : ''} onClick={() => setView('lista')}>
            <List size={14} /> Lista
          </button>
        </div>

        {view === 'inbox' ? (
          <div className={`crm-grid ${mobileDetail ? 'show-detail' : ''}`}>
            <aside className="crm-list">
              <div className="crm-search">
                <Search size={15} />
                <input aria-label="Buscar lead" placeholder="Buscar lead…" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <div className="crm-seg">
                {(
                  [
                    ['meus', 'Meus'],
                    ['sem', 'Sem dono'],
                    ['todos', 'Todos'],
                  ] as const
                ).map(([id, label]) => (
                  <button type="button" key={id} className={owner === id ? 'on' : ''} onClick={() => setOwner(id)}>
                    {label}
                  </button>
                ))}
              </div>
              <div className="crm-pills">
                {(
                  [
                    ['abertos', 'Abertos'],
                    ['encerrados', 'Encerrados'],
                    ['todos', 'Todos'],
                  ] as const
                ).map(([id, label]) => (
                  <button type="button" key={id} className={state === id ? 'on' : ''} onClick={() => setState(id)}>
                    {label}
                  </button>
                ))}
              </div>
              <div className="crm-rows">
                {list.map((l) => (
                  <button type="button" key={l.id} className={`crm-row ${l.id === selected?.id ? 'on' : ''}`} onClick={() => pick(l.id)}>
                    <Avatar name={l.company} />
                    <span className="crm-row-main">
                      <b>{l.company || 'Lead sem nome'}</b>
                      <span>
                        <StatusTag lead={l} />
                        <span className="crm-tag plain">{l.source}</span>
                      </span>
                    </span>
                    <small>{ago(l.created_at)}</small>
                  </button>
                ))}
                {list.length === 0 && (
                  <p className="crm-muted center">
                    <Building2 size={22} />
                    Nenhum lead com esses filtros.
                  </p>
                )}
              </div>
            </aside>
            <section className="crm-detail-wrap">
              <button type="button" className="crm-back" onClick={() => setMobileDetail(false)}>
                ← Voltar para a lista
              </button>
              {selected ? (
                <LeadDetail key={selected.id} lead={selected} />
              ) : (
                <p className="crm-muted center">
                  <StickyNote size={22} />
                  Selecione um lead para ver os detalhes.
                </p>
              )}
            </section>
          </div>
        ) : (
          <div className="crm-table-wrap">
            <div className="crm-table-tools">
              <div className="crm-search">
                <Search size={15} />
                <input aria-label="Buscar lead" placeholder="Buscar lead…" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <span className="crm-muted">{list.length} leads</span>
            </div>
            <table className="crm-table">
              <thead>
                <tr>
                  <th>Empresa</th>
                  <th>Contato</th>
                  <th>Status</th>
                  <th>Etapa</th>
                  <th>Origem</th>
                  <th>Responsável</th>
                  <th>Próxima ação</th>
                  <th>ICP</th>
                </tr>
              </thead>
              <tbody>
                {list.map((l) => (
                  <tr key={l.id} onClick={() => pick(l.id)} tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && pick(l.id)}>
                    <td>
                      <span className="crm-cell-co">
                        <Avatar name={l.company} small />
                        {l.company || 'Lead sem nome'}
                      </span>
                    </td>
                    <td>{l.decision_maker || '—'}</td>
                    <td>
                      <StatusTag lead={l} />
                    </td>
                    <td>{stages[l.stage]}</td>
                    <td>
                      <span className="crm-cell-co">
                        <Channel channel={l.channel} /> {l.source}
                      </span>
                    </td>
                    <td>{ownerName(l)}</td>
                    <td className={overdue(l.next_at) ? 'late' : ''}>{l.next_at ? `${dateLabel(l.next_at)} · ${timeLabel(l.next_at)}` : '—'}</td>
                    <td>
                      <b>{icpScore(l.qualification)}</b>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {list.length === 0 && <p className="crm-muted center">Nenhum lead com esses filtros.</p>}
          </div>
        )}
      </div>
      {newLead && <LeadForm open onClose={() => setNewLead(false)} />}
    </Shell>
  );
}
