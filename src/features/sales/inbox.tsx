import { useState, useEffect } from 'react';
import { Search, CheckCheck, Check, MoreVertical, Paperclip, FileText, Send, LockKeyhole, ArrowLeft, PanelRight, Inbox as InboxIcon, Smile, X, MessageSquare, MailOpen, CalendarX, SlidersHorizontal, History, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useSales, runAction } from './data';
import { Shell, Avatar, Channel, StageTag } from './shared';
import { LeadForm } from './forms';
import { LeadPanel } from './lead-panel';
import { stages, timeLabel } from './model';

const tabs = [
  { id: 'Todas', label: 'Chats', icon: MessageSquare },
  { id: 'Não lidas', label: 'Não lidas', icon: MailOpen },
  { id: 'Sem próxima ação', label: 'Sem ação', icon: CalendarX },
] as const;
const channels = ['Todos', 'WhatsApp', 'Instagram'] as const;
const templateTexts = [
  'Olá! Sou do FindFlow. Podemos conversar sobre a gestão da sua fábrica?',
  'Podemos agendar um diagnóstico para entender seus processos?',
  'Olá! Gostaria de saber se conseguiu avaliar nossa proposta.',
];

export function InboxPage({ selectedId }: { selectedId?: string }) {
  const { leads, messages, updateLead } = useSales();
  const [selected, setSelected] = useState(selectedId ?? leads[0]?.id ?? '');
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<(typeof tabs)[number]['id']>('Todas');
  const [channel, setChannel] = useState<(typeof channels)[number]>('Todos');
  const [showFilters, setShowFilters] = useState(false);
  const [newLead, setNewLead] = useState(false);
  const [mobileChat, setMobileChat] = useState(false);
  const [details, setDetails] = useState(false);
  const [draft, setDraft] = useState('');
  const [templates, setTemplates] = useState(false);
  const [attachment, setAttachment] = useState('');

  useEffect(() => {
    if (selectedId) {
      setSelected(selectedId);
      setMobileChat(true);
    }
  }, [selectedId]);

  const lead = leads.find((l) => l.id === selected) ?? leads[0];
  const filtered = leads.filter(
    (l) =>
      `${l.company} ${l.decision_maker} ${l.phone}`.toLowerCase().includes(search.toLowerCase()) &&
      (tab === 'Todas' || (tab === 'Não lidas' && l.unread > 0) || (tab === 'Sem próxima ação' && !l.next_at)) &&
      (channel === 'Todos' || l.channel === channel),
  );
  const thread = messages.filter((m) => m.lead_id === lead?.id);

  function select(id: string) {
    setSelected(id);
    setMobileChat(true);
    setDraft('');
    setAttachment('');
    const item = leads.find((l) => l.id === id);
    if (item?.unread) void runAction(() => updateLead(id, { unread: 0 }), 'Conversa marcada como lida');
  }

  return (
    <Shell area="Inbox" onNew={() => setNewLead(true)}>
      <div className={`inbox-grid ${mobileChat ? 'show-chat' : ''}`}>
        <section className="conversation-list">
          <div className="list-title">
            <h1>Conversas</h1>
            <Button variant="ghost" size="icon" title="Novo lead" onClick={() => setNewLead(true)}>
              <MoreVertical size={17} />
            </Button>
          </div>
          <div className="list-tools">
            <div className="search-box">
              <Search />
              <input aria-label="Buscar conversas" placeholder="Pesquisar por nome ou número…" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <Button variant="ghost" size="icon" title="Filtrar por canal" className={showFilters || channel !== 'Todos' ? 'filter-on' : ''} onClick={() => setShowFilters((v) => !v)}>
              <SlidersHorizontal size={16} />
            </Button>
          </div>
          {showFilters && (
            <div className="filter-row">
              {channels.map((c) => (
                <button type="button" key={c} className={channel === c ? 'selected' : ''} onClick={() => setChannel(c)}>
                  {c}
                </button>
              ))}
            </div>
          )}
          <div className="list-tabs" role="tablist">
            {tabs.map((t) => (
              <button type="button" role="tab" aria-selected={tab === t.id} key={t.id} className={tab === t.id ? 'active' : ''} onClick={() => setTab(t.id)}>
                <t.icon size={14} />
                {t.label}
              </button>
            ))}
          </div>
          <div className="list-count">
            <span>Ordenar chamados por:</span>
            <strong>Mais recentes · {filtered.length}</strong>
          </div>
          <div className="conversations">
            {filtered.map((l, i) => {
              const last = messages.filter((m) => m.lead_id === l.id).at(-1);
              return (
                <button type="button" className={`conversation-item ${l.id === lead?.id ? 'selected' : ''}`} key={l.id} onClick={() => select(l.id)}>
                  <div className="channel-avatar">
                    <Avatar name={l.company} alt={i % 3 === 1} />
                    <span className={`channel-badge ${l.channel === 'Instagram' ? 'instagram' : ''}`}>
                      <Channel channel={l.channel} />
                    </span>
                  </div>
                  <div className="conversation-copy">
                    <div className="conversation-company">
                      <strong>{l.company}</strong>
                      <time className={l.unread > 0 ? 'unread-time' : ''}>{last ? timeLabel(last.created_at) : 'Agora'}</time>
                    </div>
                    <div className="conversation-bottom">
                      <p className="conversation-preview">
                        {l.resolved ? '✓ ' : ''}
                        {last?.content ?? 'Nova conversa'}
                      </p>
                      {l.unread > 0 && <span className="unread">{l.unread}</span>}
                    </div>
                    <StageTag stage={l.stage} />
                  </div>
                </button>
              );
            })}
            {filtered.length === 0 && (
              <div className="empty">
                <Search />
                Nenhuma conversa encontrada.
              </div>
            )}
          </div>
        </section>
        {lead ? (
          <>
            <section className="chat-column">
              <header className="chat-header">
                <Button variant="ghost" size="icon" title="Voltar às conversas" className="mobile-only" onClick={() => setMobileChat(false)}>
                  <ArrowLeft />
                </Button>
                <div className="channel-avatar">
                  <Avatar name={lead.company} />
                  <span className={`channel-badge ${lead.channel === 'Instagram' ? 'instagram' : ''}`}>
                    <Channel channel={lead.channel} />
                  </span>
                </div>
                <div className="chat-title">
                  <h2>{lead.company}</h2>
                  <p>{lead.decision_maker || 'Contato'} · {lead.phone || lead.channel}</p>
                </div>
                <span className="chat-stage">{stages[lead.stage]}</span>
                <div className="chat-actions">
                  <Button variant="ghost" size="icon" title="Buscar na conversa" onClick={() => toast.info('Busca na conversa em breve.')}>
                    <Search />
                  </Button>
                  <Button variant="ghost" size="icon" title="Etapa do funil" onClick={() => setDetails((v) => !v)}>
                    <Tag />
                  </Button>
                  <Button variant="ghost" size="icon" title="Histórico" onClick={() => setDetails((v) => !v)}>
                    <History />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    title={lead.resolved ? 'Reabrir conversa' : 'Marcar como resolvida'}
                    onClick={() => void runAction(() => updateLead(lead.id, { resolved: !lead.resolved }), lead.resolved ? 'Conversa reaberta' : 'Conversa resolvida')}
                  >
                    <CheckCheck className={lead.resolved ? 'text-success' : ''} />
                  </Button>
                  <Button variant="ghost" size="icon" title="Detalhes do lead" className="mobile-only details-toggle" onClick={() => setDetails(true)}>
                    <PanelRight />
                  </Button>
                </div>
              </header>
              <div className="chat-history">
                <span className="chat-day">Hoje, {new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })}</span>
                {thread.map((m) => {
                  const out = m.direction === 'outbound';
                  return (
                    <div className={`chat-message ${out ? 'outbound' : ''}`} key={m.id}>
                      <div className="message-bubble">
                        <div className="message-head">
                          <span className="message-sender">{out ? 'Camila · FindFlow' : lead.decision_maker.split(' ')[0] || 'Contato'}</span>
                          <span className="message-time">
                            {timeLabel(m.created_at)}
                            {out && <CheckCheck size={14} className="read-check" />}
                          </span>
                        </div>
                        <p>{m.content}</p>
                      </div>
                    </div>
                  );
                })}
                {thread.length === 0 && (
                  <div className="empty">
                    <InboxIcon />
                    Nenhuma mensagem recebida.
                  </div>
                )}
                <div className="chat-system">
                  <LockKeyhole size={10} />
                  Conversa privada da equipe comercial
                </div>
                {lead.resolved && (
                  <div className="chat-system">
                    <Check size={12} />
                    Conversa resolvida
                  </div>
                )}
              </div>
              <div className="composer-area">
                {templates && (
                  <div className="template-list">
                    {templateTexts.map((t) => (
                      <button
                        type="button"
                        key={t}
                        onClick={() => {
                          setDraft(t);
                          setTemplates(false);
                        }}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                )}
                {attachment && (
                  <div className="attachment-chip">
                    <Paperclip size={12} />
                    {attachment}
                    <button type="button" title="Remover anexo" onClick={() => setAttachment('')}>
                      <X size={12} />
                    </button>
                  </div>
                )}
                <form
                  className="composer"
                  onSubmit={(e) => {
                    e.preventDefault();
                    toast.info('Canal não conectado. Sua mensagem não foi enviada.');
                  }}
                >
                  <div className="tools">
                    <Button variant="ghost" size="icon" type="button" title="Inserir emoji" onClick={() => setDraft((d) => d + ' 😊')}>
                      <Smile />
                    </Button>
                    <Button variant="ghost" size="icon" type="button" title="Modelos de mensagem" className={templates ? 'tool-on' : ''} onClick={() => setTemplates((v) => !v)}>
                      <FileText />
                    </Button>
                    <Button variant="ghost" size="icon" type="button" title="Anexar arquivo" onClick={() => document.getElementById('chat-file')?.click()}>
                      <Paperclip />
                    </Button>
                    <input id="chat-file" className="hidden" type="file" onChange={(e) => setAttachment(e.target.files?.[0]?.name ?? '')} />
                  </div>
                  <textarea
                    aria-label="Resposta"
                    rows={1}
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        e.currentTarget.form?.requestSubmit();
                      }
                    }}
                    placeholder="Digite sua mensagem…"
                  />
                  <button type="submit" className="send-button" title="Enviar" disabled={!draft.trim()}>
                    <Send size={17} />
                  </button>
                </form>
                <p className="integration-note">
                  <LockKeyhole size={10} />
                  Canal não conectado · envio indisponível
                </p>
              </div>
            </section>
            <LeadPanel lead={lead} mobileOpen={details} onClose={() => setDetails(false)} />
          </>
        ) : (
          <div className="empty">
            <InboxIcon />
            Sua Inbox está pronta para novos leads.
          </div>
        )}
      </div>
      {newLead && <LeadForm open onClose={() => setNewLead(false)} />}
    </Shell>
  );
}
