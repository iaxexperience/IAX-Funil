import { useMemo, useState } from 'react';
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import { Search, CalendarDays, Flame, TriangleAlert, Trophy, Users, Percent, MessageSquareDot } from 'lucide-react';
import { useSales, runAction } from './data';
import { Shell, Avatar, Channel } from './shared';
import { LeadForm } from './forms';
import { LeadPanel } from './lead-panel';
import { stages, icpScore, icpLabel, overdue, dateLabel, timeLabel, type Lead } from './model';

/** Cor de cada etapa do funil, na mesma ordem de `stages`. */
const stageHues = [255, 220, 195, 165, 140, 85, 55, 150, 20];

function LeadCard({ lead, ownerName, onOpen, ghost = false }: { lead: Lead; ownerName: string; onOpen?: () => void; ghost?: boolean }) {
  const score = icpScore(lead.qualification);
  const late = overdue(lead.next_at);
  return (
    <article className={`kb-card ${ghost ? 'ghost' : ''}`} onClick={onOpen}>
      <div className="kb-card-top">
        <span className="kb-channel">
          <Channel channel={lead.channel} />
          {lead.source}
        </span>
        {lead.unread > 0 && (
          <span className="kb-unread" title={`${lead.unread} mensagens não lidas`}>
            <MessageSquareDot size={12} />
            {lead.unread}
          </span>
        )}
      </div>
      <h3>{lead.company || 'Lead sem nome'}</h3>
      <p>{lead.decision_maker || 'Contato não informado'}</p>
      <span className={`kb-icp ${score >= 70 ? 'hot' : score >= 50 ? 'warm' : 'cold'}`}>
        {score >= 70 && <Flame size={11} />}
        {icpLabel(score)} · ICP {score}
      </span>
      <div className="kb-card-foot">
        <span className={`kb-next ${late ? 'late' : ''}`} title={lead.next_action || 'Sem próxima ação'}>
          {late ? <TriangleAlert size={12} /> : <CalendarDays size={12} />}
          {lead.next_at ? `${dateLabel(lead.next_at)} · ${timeLabel(lead.next_at)}` : 'Sem próxima ação'}
        </span>
        <span title={ownerName}>
          <Avatar name={ownerName} small />
        </span>
      </div>
    </article>
  );
}

function DraggableCard({ lead, ownerName, onOpen }: { lead: Lead; ownerName: string; onOpen: () => void }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: lead.id, data: { stage: lead.stage } });
  return (
    <div ref={setNodeRef} {...listeners} {...attributes} className={`kb-drag ${isDragging ? 'dragging' : ''}`} aria-roledescription="cartão arrastável">
      <LeadCard lead={lead} ownerName={ownerName} onOpen={onOpen} />
    </div>
  );
}

function Column({ index, leads, owner, onOpen }: { index: number; leads: Lead[]; owner: (l: Lead) => string; onOpen: (id: string) => void }) {
  const { setNodeRef, isOver } = useDroppable({ id: `stage-${index}` });
  return (
    <section className={`kb-col ${isOver ? 'over' : ''}`} style={{ ['--hue' as string]: String(stageHues[index]) }} aria-label={stages[index]}>
      <header className="kb-col-head">
        <i />
        <h2>{stages[index]}</h2>
        <span>{leads.length}</span>
      </header>
      <div ref={setNodeRef} className="kb-drop">
        {leads.map((l) => (
          <DraggableCard key={l.id} lead={l} ownerName={owner(l)} onOpen={() => onOpen(l.id)} />
        ))}
        {leads.length === 0 && <p className="kb-empty">Arraste um lead para cá</p>}
      </div>
    </section>
  );
}

export function KanbanPage() {
  const { leads, profiles, updateLead, user, demo } = useSales();
  const [search, setSearch] = useState('');
  const [ownerFilter, setOwnerFilter] = useState('todos');
  const [channel, setChannel] = useState('todos');
  const [onlyHot, setOnlyHot] = useState(false);
  const [newLead, setNewLead] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);
  // Mantém o cartão na coluna nova enquanto o banco confirma a mudança.
  const [pending, setPending] = useState<Record<string, number>>({});

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 180, tolerance: 6 } }),
    useSensor(KeyboardSensor),
  );

  const me = user?.id ?? 'demo-1';
  const owner = (l: Lead) => profiles.find((p) => p.id === l.owner_id)?.name ?? 'Sem responsável';
  const view = useMemo(
    () =>
      leads
        .map((l) => (pending[l.id] !== undefined ? { ...l, stage: pending[l.id]! } : l))
        .filter(
          (l) =>
            `${l.company} ${l.decision_maker} ${l.phone}`.toLowerCase().includes(search.toLowerCase()) &&
            (ownerFilter === 'todos' || (ownerFilter === 'meus' ? l.owner_id === me : ownerFilter === 'sem' ? !l.owner_id : l.owner_id === ownerFilter)) &&
            (channel === 'todos' || l.channel === channel) &&
            (!onlyHot || icpScore(l.qualification) >= 70),
        ),
    [leads, pending, search, ownerFilter, channel, onlyHot, me],
  );

  const active = view.filter((l) => l.stage < 7).length;
  const won = view.filter((l) => l.stage === 7).length;
  const lost = view.filter((l) => l.stage === 8).length;
  const stats = [
    { icon: Users, label: 'Leads ativos', value: active, hint: 'em andamento no funil' },
    { icon: Flame, label: 'Prioridade', value: view.filter((l) => l.stage < 7 && icpScore(l.qualification) >= 70).length, hint: 'ICP acima de 70' },
    { icon: TriangleAlert, label: 'Ações atrasadas', value: view.filter((l) => l.stage < 7 && overdue(l.next_at)).length, hint: 'precisam de atenção', warn: true },
    { icon: Trophy, label: 'Clientes ganhos', value: won, hint: 'na etapa Cliente ganho' },
    { icon: Percent, label: 'Conversão', value: `${won + lost > 0 ? Math.round((won / (won + lost)) * 100) : 0}%`, hint: 'ganhos sobre encerrados' },
  ];

  function onDragStart(e: DragStartEvent) {
    setDragId(String(e.active.id));
  }
  function onDragEnd(e: DragEndEvent) {
    setDragId(null);
    const id = String(e.active.id);
    const target = e.over ? Number(String(e.over.id).replace('stage-', '')) : NaN;
    const lead = view.find((l) => l.id === id);
    if (!lead || Number.isNaN(target) || lead.stage === target) return;
    setPending((p) => ({ ...p, [id]: target }));
    void runAction(() => updateLead(id, { stage: target }), `${lead.company} movido para ${stages[target]}`).finally(() =>
      setPending((p) => {
        const next = { ...p };
        delete next[id];
        return next;
      }),
    );
  }

  const dragging = dragId ? view.find((l) => l.id === dragId) : undefined;
  const opened = openId ? leads.find((l) => l.id === openId) : undefined;

  return (
    <Shell area="Funil" onNew={() => setNewLead(true)}>
      <div className="kb-stats">
        {stats.map((s) => (
          <div className={`kb-stat ${s.warn && Number(s.value) > 0 ? 'warn' : ''}`} key={s.label}>
            <span className="kb-stat-icon">
              <s.icon size={17} />
            </span>
            <div>
              <small>{s.label}</small>
              <strong>{s.value}</strong>
              <em>{s.hint}</em>
            </div>
          </div>
        ))}
      </div>
      <div className="kb-filters">
        <div className="kb-search">
          <Search size={15} />
          <input aria-label="Buscar no funil" placeholder="Buscar empresa, contato ou telefone…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select aria-label="Responsável" value={ownerFilter} onChange={(e) => setOwnerFilter(e.target.value)}>
          <option value="todos">Todos os responsáveis</option>
          <option value="meus">Meus leads</option>
          <option value="sem">Sem responsável</option>
          {profiles.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <select aria-label="Canal" value={channel} onChange={(e) => setChannel(e.target.value)}>
          <option value="todos">Todos os canais</option>
          <option value="WhatsApp">WhatsApp</option>
          <option value="Instagram">Instagram</option>
        </select>
        <label className={`kb-toggle ${onlyHot ? 'on' : ''}`}>
          <input type="checkbox" checked={onlyHot} onChange={(e) => setOnlyHot(e.target.checked)} />
          <Flame size={14} /> Só prioridade
        </label>
        <span className="kb-summary">
          {view.length} {view.length === 1 ? 'lead' : 'leads'}
          {demo ? ' · demonstração' : ''}
        </span>
      </div>
      <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd} onDragCancel={() => setDragId(null)}>
        <div className="kb-board">
          {stages.map((_, i) => (
            <Column key={i} index={i} leads={view.filter((l) => l.stage === i)} owner={owner} onOpen={setOpenId} />
          ))}
        </div>
        <DragOverlay dropAnimation={{ duration: 180, easing: 'ease-out' }}>
          {dragging ? <LeadCard lead={dragging} ownerName={owner(dragging)} ghost /> : null}
        </DragOverlay>
      </DndContext>
      {opened && (
        <>
          <div className="drawer-overlay" onClick={() => setOpenId(null)} />
          <LeadPanel lead={opened} drawer onClose={() => setOpenId(null)} />
        </>
      )}
      {newLead && <LeadForm open onClose={() => setNewLead(false)} />}
    </Shell>
  );
}
