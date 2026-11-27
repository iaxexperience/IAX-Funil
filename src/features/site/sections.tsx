import { useState, type ReactNode } from 'react';
import {
  ArrowRight,
  Check,
  Home,
  Target,
  TrendingUp,
  CalendarDays,
  BookOpen,
  Settings,
  Search,
  Bell,
  Plus,
  Pencil,
  MoreHorizontal,
  Mail,
  Phone,
  Crosshair,
  User,
  Flag,
  CircleCheck,
  CalendarClock,
  Send,
  Eye,
  Trash2,
  DollarSign,
  CalendarCheck,
  TriangleAlert,
  Gauge,
  LayoutGrid,
  ListChecks,
  PhoneCall,
  Camera,
  Mic,
  Image,
  Smile,
  MessageCircle,
  Instagram,
  Filter,
  SquareCheck,
  Sparkles,
  Headphones,
  Bot,
} from 'lucide-react';

export const VIDEO_OFFICE_POSTER = 'https://assets.mixkit.co/videos/42664/42664-thumb-720-0.jpg';

/* Números de WhatsApp (somente dígitos, com DDI e DDD). Hoje os dois usam o comercial do iax.info.
   Se um deles ficar vazio, o botão leva para a seção de contato. */
const WHATSAPP_COMERCIAL = '5583996583281';
const WHATSAPP_SUPORTE = '5583996583281';

const tones = ['t0', 't1', 't2', 't3', 't4', 't5'];
function toneOf(name: string) {
  let h = 0;
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return tones[h % tones.length] ?? 't0';
}
function Face({ name, size = 'md' }: { name: string; size?: 'sm' | 'md' | 'lg' }) {
  const ini = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join('');
  return <span className={`lp-face ${size} ${toneOf(name)}`}>{ini}</span>;
}

function Heading({ eyebrow, title, text, center = false }: { eyebrow?: string; title: ReactNode; text?: ReactNode; center?: boolean }) {
  return (
    <div className={`lp-sh ${center ? 'center' : ''}`}>
      {eyebrow && <span className="lp-kicker">{eyebrow}</span>}
      <h2>{title}</h2>
      {text && <p>{text}</p>}
    </div>
  );
}

/** Janela do app com a barra azul-marinho, usada nos mockups. */
function AppWindow({ active, children, className = '' }: { active: string; children: ReactNode; className?: string }) {
  const nav = [
    { icon: Home, label: 'Home' },
    { icon: Target, label: 'Vendas' },
    { icon: TrendingUp, label: 'Performance' },
    { icon: CalendarDays, label: 'Operação' },
    { icon: BookOpen, label: 'Recursos' },
    { icon: Settings, label: 'Administração' },
  ];
  return (
    <div className={`lp-win ${className}`}>
      <div className="lp-win-bar">
        <span className="lp-win-logo">
          <span className="brand-logo" />
        </span>
        <span className="lp-win-org">Sua empresa ▾</span>
        <nav>
          {nav.map((n) => (
            <span key={n.label} className={n.label === active ? 'on' : ''}>
              <n.icon size={13} />
              {n.label}
            </span>
          ))}
        </nav>
        <span className="lp-win-tools">
          <Search size={13} />
          <Bell size={13} />
          <Face name="Camila Andrade" size="sm" />
        </span>
      </div>
      <div className="lp-win-body">{children}</div>
    </div>
  );
}

/* ----------------------------------------------------------------- Chatbot */
const botReplies: Record<string, ReactNode> = {
  '2ª via de boleto': (
    <>
      Aqui está! <br />
      Acessar <a href="#contato">2ª via do boleto aqui.</a>
    </>
  ),
  'Consultar chamados': (
    <>
      Você tem <b>1 chamado aberto</b>: “Integração com o WhatsApp”. Status: em andamento.
    </>
  ),
  'Falar com atendente': <>Certo! Estou transferindo você para a Camila, do time de suporte. Ela já vai te responder. 😊</>,
};

export function ChatbotSection() {
  const [choice, setChoice] = useState('2ª via de boleto');
  return (
    <section className="lp-section lp-dots lp-chatbot" id="chatbot">
      <div className="lp-container lp-split">
        <div className="lp-bot-stage" aria-label="Exemplo de conversa com o chatbot">
          <span className="lp-leo-face lp-bot-leo" aria-hidden="true" />
          <div className="lp-bot">
            <div className="lp-bot-head">
              <span className="lp-bot-logo">
                <span className="brand-logo" />
              </span>
              <div>
                <strong>IAX</strong>
                <small>
                  <i /> Online
                </small>
              </div>
            </div>
            <div className="lp-bot-body">
              <p className="lp-bot-msg">
                Olá. Como vai?
                <br />
                Como posso te ajudar hoje?
              </p>
              <div className="lp-bot-options">
                {Object.keys(botReplies).map((o) => (
                  <button type="button" key={o} className={choice === o ? 'on' : ''} onClick={() => setChoice(o)}>
                    {o}
                  </button>
                ))}
              </div>
              <p className="lp-bot-mine">{choice}</p>
              <p className="lp-bot-msg" key={choice}>
                {botReplies[choice]}
              </p>
            </div>
            <div className="lp-bot-input">
              <Camera size={16} />
              <span>Mensagem…</span>
              <Mic size={15} />
              <Image size={15} />
              <Smile size={15} />
            </div>
          </div>
          <span className="lp-face xl t3 lp-bot-agent" aria-hidden="true">
            CA
          </span>
        </div>
        <div>
          <span className="lp-chip-dot">Disponibilidade total</span>
          <h2 className="lp-big">
            Chatbot IAX: <span className="lp-grad">24h por dia</span>, 7 dias por semana
          </h2>
          <p className="lp-lead">
            O chatbot automatiza o atendimento com respostas instantâneas e personalizadas e direciona cada solicitação ao setor responsável, a
            qualquer hora do dia.
          </p>
          <div className="lp-hero-ctas">
            <a href="#contato" className="lp-btn primary">
              Começar agora <ArrowRight size={18} />
            </a>
            <a href="#leo" className="lp-btn white-soft">
              Saiba mais
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------------- CRM */
const deals = [
  {
    col: 'Novo lead',
    total: 'R$ 11.750,00',
    items: [
      ['Linha de saneantes', 'Brisa Produtos', 'R$ 5.400,00', '20%', 'Rafael Almeida'],
      ['Controle de lotes', 'Alvo Detergentes', 'R$ 3.200,00', '15%', 'Beatriz Nogueira'],
      ['Gestão de estoque', 'SuaveLar', 'R$ 3.150,00', '10%', 'Thiago Martins'],
    ],
  },
  {
    col: 'Diagnóstico',
    total: 'R$ 27.600,00',
    items: [
      ['Expansão da fábrica', 'CloroMax', 'R$ 9.800,00', '40%', 'Carla Vieira'],
      ['Emissão de notas', 'Nordeste Saneantes', 'R$ 12.700,00', '35%', 'Gustavo Melo'],
      ['Treinamento da equipe', 'EcoClean', 'R$ 5.100,00', '25%', 'Fernanda Lima'],
    ],
  },
  {
    col: 'Proposta enviada',
    total: 'R$ 18.300,00',
    items: [
      ['Implantação completa', 'LimpMais Química', 'R$ 12.000,00', '60%', 'Juliana Prado'],
      ['Integração de setores', 'Potiguar Distrib.', 'R$ 6.300,00', '55%', 'Rodrigo Alves'],
    ],
  },
];

export function CrmSection() {
  return (
    <section className="lp-section lp-crm" id="crm">
      <div className="lp-container lp-crm-grid">
        <div className="lp-crm-copy">
          <span className="lp-chip-dot green">Implantação em minutos</span>
          <h2 className="lp-big">
            O CRM para organizar suas vendas e <span className="lp-grad">fechar mais negócios</span>
          </h2>
          <p className="lp-lead">Gerencie leads, oportunidades, tarefas e propostas em uma plataforma simples, intuitiva e pronta para usar.</p>
          <div className="lp-hero-ctas">
            <a href="#contato" className="lp-btn primary caps">
              Comece agora <ArrowRight size={18} />
            </a>
            <a href="#contato" className="lp-btn white-soft">
              Falar com consultor
            </a>
          </div>
          <ul className="lp-checks">
            <li>
              <Check size={15} /> Sem instalação
            </li>
            <li>
              <Check size={15} /> Use no mesmo dia
            </li>
            <li>
              <Check size={15} /> Computador e celular
            </li>
          </ul>
        </div>
        <div className="lp-crm-visual" aria-hidden="true">
          <AppWindow active="Vendas" className="lp-crm-win">
            <div className="lp-win-title">
              <div>
                <h4>Negócios</h4>
                <small>Gerencie seus negócios no pipeline</small>
              </div>
              <span className="lp-select">Comercial ▾</span>
            </div>
            <div className="lp-deals">
              {deals.map((c, ci) => (
                <div className={`lp-deal-col c${ci}`} key={c.col}>
                  <header>
                    <b>{c.col}</b>
                    <em>{c.items.length}</em>
                    <small>{c.total}</small>
                  </header>
                  {c.items.map(([t, co, v, p, o]) => (
                    <article key={t}>
                      <div className="lp-deal-top">
                        <strong>{t}</strong>
                        <span>
                          <Eye size={11} />
                          <Pencil size={11} />
                          <Trash2 size={11} />
                        </span>
                      </div>
                      <small>{co}</small>
                      <div className="lp-deal-val">
                        <b>{v}</b>
                        <em>{p}</em>
                      </div>
                      <small className="lp-deal-owner">
                        <User size={10} /> {o}
                      </small>
                    </article>
                  ))}
                </div>
              ))}
            </div>
          </AppWindow>
          <div className="lp-crm-chart">
            <b>Distribuição por etapa</b>
            <div className="lp-chart-bars">
              {[
                [78, 'b'],
                [58, 'b'],
                [92, 'b'],
                [44, 'y'],
                [36, 'y'],
                [66, 'g'],
                [52, 'g'],
              ].map(([h, c], i) => (
                <i key={i} className={c as string} style={{ height: `${h}%` }} />
              ))}
            </div>
          </div>
          <div className="lp-phone-mock">
            <div className="lp-phone-notch" />
            <div className="lp-phone-head">
              <span className="brand-logo" />
              <Bell size={13} />
            </div>
            <div className="lp-phone-screen">
              <span className="lp-select full">Visão geral de vendas ▾</span>
              {[
                ['Pipeline aberto', 'R$ 30.945,00', '62 negócios', DollarSign, 'blue'],
                ['Negócios ganhos', 'R$ 18.300,00', '7 negócios', TrendingUp, 'green'],
                ['Atividades hoje', '5', 'pendentes', CalendarCheck, 'orange'],
                ['Atrasadas', '1', 'atividade', TriangleAlert, 'red'],
                ['Taxa de conversão', '27%', 'últimos 30 dias', Gauge, 'blue'],
              ].map(([l, v, s, Icon, c]) => {
                const I = Icon as typeof DollarSign;
                return (
                  <div className="lp-kpi" key={l as string}>
                    <div>
                      <small>{l as string}</small>
                      <b>{v as string}</b>
                      <small>{s as string}</small>
                    </div>
                    <I size={16} className={c as string} />
                  </div>
                );
              })}
            </div>
            <div className="lp-phone-tabs">
              {[LayoutGrid, Target, User, CalendarDays, MoreHorizontal].map((I, i) => (
                <I key={i} size={14} className={i === 0 ? 'on' : ''} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------- Leads */
const leadList = [
  { name: 'Marina Lopes', status: 'Qualificado', origin: 'Instagram', when: '2 meses', email: 'marina.lopes@email.com.br', phone: '(83) 98765-4321', note: 'Interessada em automatizar o atendimento da fábrica. Pediu proposta para 3 usuários.' },
  { name: 'Eduardo Nunes', status: 'Contatado', origin: 'Google', when: '3 semanas', email: 'eduardo@cloromax.com.br', phone: '(81) 99812-3344', note: 'Retornar com valores do plano anual.' },
  { name: 'Clara Mota', status: 'Novo', origin: 'Indicação', when: '1 mês', email: 'clara@ecoclean.com.br', phone: '(84) 99654-1020', note: 'Indicação do contador. Primeiro contato pendente.' },
  { name: 'Rafael Siqueira', status: 'Qualificado', origin: 'Feira de negócios', when: '2 meses', email: 'rafael@limpmais.com.br', phone: '(83) 99120-8877', note: 'Decisor. Quer demonstração para o time comercial.' },
  { name: 'Juliana Gomes', status: 'Convertido', origin: 'Site', when: '3 meses', email: 'juliana@brisa.com.br', phone: '(83) 98111-2233', note: 'Cliente ativa desde março.' },
];
const statusTone: Record<string, string> = { Qualificado: 'teal', Contatado: 'orange', Novo: 'blue', Convertido: 'green', Desqualificado: 'red' };

export function LeadsSection() {
  const [sel, setSel] = useState(0);
  const [tab, setTab] = useState('Notas');
  const lead = leadList[sel] ?? leadList[0]!;
  return (
    <section className="lp-section lp-dots" id="leads">
      <div className="lp-container">
        <Heading center title="Gerencie leads e negócios com tranquilidade" text="Organize interações e dados de clientes em uma ferramenta simples e tome decisões ágeis quando a oportunidade surgir." />
        <AppWindow active="Vendas" className="lp-leads-win">
          <div className="lp-win-title">
            <div>
              <h4>Leads</h4>
              <small>Gerencie sua fila de leads e qualificação</small>
            </div>
            <span className="lp-navy-btn">
              <Plus size={13} /> Novo lead
            </span>
          </div>
          <div className="lp-status-chips">
            {[
              ['Total: 40', 'gray'],
              ['Novo: 4', 'blue'],
              ['Contatado: 8', 'orange'],
              ['Desqualificado: 6', 'red'],
              ['Qualificado: 10', 'green'],
              ['Convertido: 18', 'gray'],
              ['Sem responsável: 4', 'orange'],
            ].map(([t, c]) => (
              <span key={t} className={c}>
                {t}
              </span>
            ))}
          </div>
          <div className="lp-view-tabs">
            <span className="on">Inbox</span>
            <span>Kanban</span>
            <span>Lista</span>
          </div>
          <div className="lp-leads-grid">
            <div className="lp-leads-list">
              <div className="lp-mini-search">
                <Search size={13} /> Buscar lead…
              </div>
              <div className="lp-seg">
                <span>Meus</span>
                <span className="on">Sem dono</span>
                <span>Todos</span>
              </div>
              <div className="lp-pills3">
                <span>Abertos</span>
                <span>Encerrados</span>
                <span>Todos</span>
              </div>
              {leadList.map((l, i) => (
                <button type="button" key={l.name} className={`lp-lead-row ${i === sel ? 'on' : ''}`} onClick={() => setSel(i)}>
                  <Face name={l.name} />
                  <span>
                    <b>{l.name}</b>
                    <span className="lp-tags">
                      <em className={statusTone[l.status]}>{l.status}</em>
                      <em className="plain">{l.origin}</em>
                    </span>
                  </span>
                  <small>{l.when}</small>
                </button>
              ))}
            </div>
            <div className="lp-lead-detail">
              <div className="lp-lead-head">
                <Face name={lead.name} size="lg" />
                <h4>{lead.name}</h4>
                <em className={`lp-tag ${statusTone[lead.status]}`}>{lead.status}</em>
                <span className="lp-lead-actions">
                  <span className="lp-navy-btn">
                    <Plus size={13} /> Registrar atividade
                  </span>
                  <span className="lp-ghost-btn">
                    <Pencil size={12} /> Editar
                  </span>
                  <span className="lp-round-btn">
                    <MoreHorizontal size={14} />
                  </span>
                </span>
              </div>
              <div className="lp-lead-cards">
                <div className="lp-card-box">
                  {[
                    [Mail, 'E-mail', lead.email],
                    [Phone, 'Telefone', lead.phone],
                    [Crosshair, 'Origem', lead.origin],
                    [User, 'Responsável', 'Carla Menezes ▾'],
                  ].map(([I, k, v]) => {
                    const Icon = I as typeof Mail;
                    return (
                      <div className="lp-kv" key={k as string}>
                        <Icon size={13} />
                        <span>{k as string}</span>
                        <b>{v as string}</b>
                      </div>
                    );
                  })}
                </div>
                <div className="lp-card-box">
                  <div className="lp-kv">
                    <Flag size={13} />
                    <span>Estágio</span>
                    <b className="lp-pill-sel">
                      <i className={statusTone[lead.status]} /> {lead.status} ▾
                    </b>
                  </div>
                  <div className="lp-kv">
                    <CircleCheck size={13} />
                    <span>Status</span>
                    <b>
                      <i className="lp-dot green" /> Aberto
                    </b>
                  </div>
                  <div className="lp-kv">
                    <CalendarClock size={13} />
                    <span>Data de criação</span>
                    <b>12/04 às 14:35</b>
                  </div>
                </div>
                <div className="lp-side-cards">
                  <div className="lp-card-box">
                    <div className="lp-box-title">
                      Observações
                      <span>
                        <Pencil size={11} /> Editar
                      </span>
                    </div>
                    <p>{lead.note}</p>
                  </div>
                  <div className="lp-card-box">
                    <div className="lp-box-title">Próxima atividade</div>
                    <p>Reunião de apresentação em 22/05 às 10:00</p>
                    <span className="lp-add">
                      <Plus size={12} /> Agendar
                    </span>
                  </div>
                </div>
              </div>
              <div className="lp-card-box lp-notes">
                <div className="lp-note-tabs">
                  {['Notas', 'Atividades', 'Negócios'].map((t) => (
                    <button type="button" key={t} className={tab === t ? 'on' : ''} onClick={() => setTab(t)}>
                      {t}
                    </button>
                  ))}
                </div>
                <div className="lp-note-input">Escreva uma observação… Use @ para mencionar</div>
                <span className="lp-reg">
                  <Send size={12} /> Registrar
                </span>
                <div className="lp-note">
                  <Face name="Carla Menezes" size="sm" />
                  <div>
                    <b>Carla Menezes</b> <small>15/04 às 09:15</small>
                    <p>
                      {tab === 'Notas'
                        ? 'Lead demonstrou interesse no plano empresarial. Enviar proposta personalizada.'
                        : tab === 'Atividades'
                          ? 'Ligação de qualificação concluída. Próximo passo: demonstração.'
                          : 'Negócio “Implantação IAX” criado na etapa Diagnóstico.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <span className="lp-help-btn">
            <Bot size={15} /> Ajuda
          </span>
        </AppWindow>
      </div>
    </section>
  );
}

/* --------------------------------------------------------- Funcionalidades */
type ThumbKind = 'kanban' | 'cards' | 'list' | 'stats' | 'table' | 'toggles' | 'chart' | 'goals';
function MiniThumb({ kind }: { kind: ThumbKind }) {
  const rows = (n: number) => Array.from({ length: n }, (_, i) => i);
  return (
    <div className={`lp-mini k-${kind}`} aria-hidden="true">
      <div className="lp-mini-bar">
        <span className="brand-logo" />
        <i />
        <i />
        <i />
      </div>
      <div className="lp-mini-body">
        {kind === 'kanban' &&
          rows(5).map((c) => (
            <div className="col" key={c}>
              {rows(3 - (c % 2)).map((r) => (
                <span key={r} />
              ))}
            </div>
          ))}
        {kind === 'cards' &&
          rows(3).map((c) => (
            <div className="col" key={c}>
              {rows(4).map((r) => (
                <span key={r}>
                  <i className={`f t${(c + r) % 6}`} />
                </span>
              ))}
            </div>
          ))}
        {kind === 'list' &&
          rows(6).map((r) => (
            <div className="row" key={r}>
              <i className={`f t${r % 6}`} />
              <span />
              <em className={['teal', 'orange', 'blue', 'green'][r % 4]} />
            </div>
          ))}
        {kind === 'stats' && (
          <>
            <div className="tiles">
              {rows(5).map((t) => (
                <span key={t} className={t === 1 ? 'red' : ''} />
              ))}
            </div>
            {rows(5).map((r) => (
              <div className="row" key={r}>
                <span />
                <span className="short" />
                <em className="red" />
              </div>
            ))}
          </>
        )}
        {kind === 'table' &&
          rows(8).map((r) => (
            <div className="row" key={r}>
              <span className="short" />
              <span />
              <em className={r % 3 === 0 ? 'green' : r % 3 === 1 ? 'orange' : 'red'} />
            </div>
          ))}
        {kind === 'toggles' && (
          <>
            {rows(6).map((r) => (
              <div className="row" key={r}>
                <span />
                <b className={r % 3 === 2 ? 'off' : ''} />
              </div>
            ))}
            <div className="modal">
              <span />
              <span />
              <b />
            </div>
          </>
        )}
        {kind === 'chart' && (
          <div className="m-chart">
            <div className="m-bars">
              {[90, 55, 30, 20, 10].map((h, i) => (
                <i key={i} style={{ height: `${h}%` }} className={['b', 'g', 'y', 'o', 'p'][i]} />
              ))}
            </div>
            <div className="m-hbars">
              {[80, 64, 50, 36, 22].map((w, i) => (
                <i key={i} style={{ width: `${w}%` }} />
              ))}
            </div>
          </div>
        )}
        {kind === 'goals' && (
          <>
            <div className="tiles">
              {rows(4).map((t) => (
                <span key={t} />
              ))}
            </div>
            {rows(3).map((r) => (
              <div className="goal" key={r}>
                <span />
                <i style={{ width: `${[72, 45, 88][r]}%` }} />
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

const featureCards: { kind: ThumbKind; title: string; text: string; href: string }[] = [
  { kind: 'kanban', title: 'CRM de Vendas', text: 'Centralize leads, contatos, empresas, oportunidades e atividades. Acompanhe cada venda do primeiro contato ao fechamento, sem planilhas.', href: '#crm' },
  { kind: 'cards', title: 'Funil de Vendas', text: 'Visualize oportunidades em Kanban, personalize etapas e identifique gargalos no seu funil de vendas.', href: '#funil' },
  { kind: 'list', title: 'Gestão de Leads', text: 'Cadastre, qualifique e distribua leads em um único lugar. Sua equipe sabe quem precisa de atenção e quem está pronto para avançar.', href: '#leads' },
  { kind: 'stats', title: 'Atividades e Agenda', text: 'Organize tarefas, ligações, reuniões e follow-ups em uma agenda comercial conectada às suas negociações.', href: '#agenda' },
  { kind: 'table', title: 'Propostas Comerciais', text: 'Monte propostas a partir das oportunidades, acompanhe o status e saiba quais estão perto de fechar.', href: '#contato' },
  { kind: 'toggles', title: 'Automações', text: 'Crie regras para distribuir leads, mover oportunidades e lembrar sua equipe dos próximos passos.', href: '#contato' },
  { kind: 'chart', title: 'Relatórios de Vendas', text: 'Conversão por etapa, origem dos leads e desempenho de cada vendedor, sempre atualizados.', href: '#contato' },
  { kind: 'goals', title: 'Metas e Previsão', text: 'Defina metas por equipe e por vendedor e acompanhe a previsão de receita do mês.', href: '#contato' },
];

export function FeatureCardsSection() {
  return (
    <section className="lp-section" id="recursos">
      <div className="lp-container">
        <Heading center eyebrow="Funcionalidades" title="Tudo o que sua equipe comercial precisa" text="Do primeiro “olá” ao contrato assinado, cada etapa da venda organizada e visível para todo o time." />
        <div className="lp-feat8">
          {featureCards.map((f) => (
            <a className="lp-feat8-card" href={f.href} key={f.title}>
              <MiniThumb kind={f.kind} />
              <div>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
                <span className="lp-more">
                  Saiba mais <ArrowRight size={14} />
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------- Funil */
export function FunnelSection() {
  const stacks = [
    { t: 'Em contato', v: 'R$ 752,00', people: ['Eduardo Lima', 'Ana Paula'] },
    { t: 'Em negociação', v: 'R$ 459,00', people: ['Carla Ribeiro', 'Pedro Ferreira'] },
    { t: 'Finalizados', v: 'R$ 1.796,00', people: ['Eduardo Lima Castro', 'Melissa Cunha Martins'] },
  ];
  return (
    <section className="lp-section lp-dots lp-funnel" id="funil">
      <div className="lp-container lp-split">
        <div>
          <h2 className="lp-big">
            <span className="lp-grad">Funil de Vendas IAX:</span> controle total e em tempo real
          </h2>
          <p className="lp-lead">
            Visualize cada etapa, acompanhe oportunidades conforme elas acontecem e entenda exatamente onde estão as chances reais de gerar receita.
            Tudo integrado ao atendimento para você vender mais com muito menos esforço.
          </p>
          <a href="/inbox" className="lp-btn primary">
            Veja na prática <ArrowRight size={18} />
          </a>
        </div>
        <div className="lp-funnel-card" aria-hidden="true">
          <img src={VIDEO_OFFICE_POSTER} alt="" loading="lazy" />
          <span className="lp-glass g1">
            <MessageCircle size={22} />
          </span>
          <span className="lp-glass g2">
            <Filter size={22} />
          </span>
          <span className="lp-glass g3">
            <Instagram size={22} />
          </span>
          <div className="lp-stack">
            {stacks.map((s, i) => (
              <div className={`lp-stack-card s${i}`} key={s.t}>
                <header>
                  <b>{s.t}</b>
                  <em>{s.v}</em>
                  <Pencil size={10} />
                </header>
                {i === 2 && <small className="lp-new">+ Nova oportunidade</small>}
                {s.people.map((p) => (
                  <div className="lp-stack-row" key={p}>
                    <span className="lp-won">GANHO</span>
                    <Face name={p} size="sm" />
                    <span>
                      <b>{p}</b>
                      <small>Upsell · WhatsApp</small>
                    </span>
                    {i === 2 && <em className="lp-val">R$ 89,90</em>}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ Agenda */
const tasks: [string, string, string, string][] = [
  ['Follow-up da proposta', 'Negócio · Brisa Produtos', 'João Dias', '20/03'],
  ['Apresentar proposta comercial', 'Proposta · CloroMax', 'Camila Marques', '21/03'],
  ['Enviar materiais de implantação', 'Implantação · LimpMais', 'Lucas Mendes', '22/03'],
  ['Reunião de alinhamento interno', 'Negócio · Nordeste Saneantes', 'Rafael Pereira', '22/03'],
  ['Contrato para assinatura', 'Negócio · EcoClean', 'Camila Marques', '22/03'],
  ['Retornar ao cliente', 'Novo lead · Alvo Detergentes', 'Fernanda Silva', '22/03'],
  ['Acompanhar status da proposta', 'Proposta · SuaveLar', 'João Dias', '23/03'],
];

export function AgendaSection() {
  return (
    <section className="lp-section lp-agenda" id="agenda">
      <div className="lp-container lp-agenda-grid">
        <div>
          <span className="lp-kicker">Atividades e agenda</span>
          <h2 className="lp-big">
            Mantenha cada <span className="lp-grad">próximo passo</span> no radar
          </h2>
          <p className="lp-lead">
            Organize tarefas, ligações, reuniões e follow-ups em uma agenda comercial conectada às suas negociações. Mais clareza sobre o que precisa ser
            feito, quando e para qual oportunidade.
          </p>
          <a href="/agenda" className="lp-btn primary caps">
            Comece agora <ArrowRight size={18} />
          </a>
        </div>
        <div className="lp-agenda-visual" aria-hidden="true">
          <AppWindow active="Operação" className="lp-agenda-win">
            <div className="lp-tiles">
              {[
                [LayoutGrid, 'Todas', '9', '100% do total', 'on'],
                [TriangleAlert, 'Atrasadas', '4', '44% do total', 'red'],
                [SquareCheck, 'Tarefas', '8', '89% do total', ''],
                [PhoneCall, 'Ligações', '1', '11% do total', ''],
                [Mail, 'E-mails', '0', '0% do total', ''],
              ].map(([I, l, n, p, c]) => {
                const Icon = I as typeof Mail;
                return (
                  <div className={`lp-tile ${c as string}`} key={l as string}>
                    <Icon size={15} />
                    <small>{l as string}</small>
                    <b>{n as string}</b>
                    <small>{p as string}</small>
                  </div>
                );
              })}
            </div>
            <div className="lp-table">
              <div className="lp-tr head">
                <span />
                <span>Tipo</span>
                <span>Título</span>
                <span>Negócio</span>
                <span>Responsável</span>
                <span>Data</span>
              </div>
              {tasks.map(([t, n, o, d]) => (
                <div className="lp-tr" key={t}>
                  <span className="lp-cb" />
                  <span>
                    <em className="lp-type">
                      <ListChecks size={10} /> Tarefa
                    </em>
                  </span>
                  <span className="t">{t}</span>
                  <span className="lnk">{n}</span>
                  <span className="who">
                    <Face name={o} size="sm" />
                    {o}
                  </span>
                  <span>
                    <em className="lp-date">{d}</em>
                  </span>
                </div>
              ))}
            </div>
          </AppWindow>
          <div className="lp-pop p1">
            <span>
              <SquareCheck size={16} />
            </span>
            <div>
              <b>9 pendentes</b>
              <small>Atividades abertas</small>
            </div>
          </div>
          <div className="lp-pop p2">
            <span className="warn">
              <TriangleAlert size={16} />
            </span>
            <div>
              <b>4 atrasadas</b>
              <small>Precisam de atenção</small>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- Integrações */
export function IntegrationsSection() {
  const items = ['WhatsApp', 'E-mail', 'Instagram', 'Zapier', 'API aberta', 'Webhooks', 'Formulários web'];
  return (
    <section className="lp-section lp-integr" id="integracoes">
      <div className="lp-container">
        <Heading center eyebrow="Integrações" title="Conecte a IAX à sua operação" text="Leve organização para os canais que já fazem parte da sua rotina. API aberta para criar fluxos personalizados entre sistemas." />
        <div className="lp-integr-pills">
          {items.map((i) => (
            <span key={i}>{i}</span>
          ))}
        </div>
        <div className="lp-center">
          <a href="#contato" className="lp-btn white-soft">
            Saiba mais sobre integrações
          </a>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------- Botões de contato */
function waHref(num: string, msg: string) {
  return num ? `https://wa.me/${num}?text=${encodeURIComponent(msg)}` : '#contato';
}

export function ContactFabs() {
  return (
    <div className="lp-fabs">
      <a href="#chatbot" className="lp-fab" aria-label="Falar com o Leo, assistente virtual">
        <span className="lp-fab-label">
          <Sparkles size={12} /> Leo · IA
        </span>
        <span className="lp-leo-fab-face lp-fab-leo" />
      </a>
      <a
        href={waHref(WHATSAPP_COMERCIAL, 'Olá! Quero conhecer a IAX.')}
        className="lp-fab"
        aria-label="Falar com o comercial pelo WhatsApp"
        {...(WHATSAPP_COMERCIAL ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        <span className="lp-fab-label">Comercial</span>
        <span className="lp-fab-btn green">
          <MessageCircle size={26} />
        </span>
      </a>
      <a
        href={waHref(WHATSAPP_SUPORTE, 'Olá! Preciso de suporte da IAX.')}
        className="lp-fab"
        aria-label="Falar com o suporte pelo WhatsApp"
        {...(WHATSAPP_SUPORTE ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        <span className="lp-fab-label">Suporte</span>
        <span className="lp-fab-btn blue">
          <Headphones size={24} />
        </span>
      </a>
    </div>
  );
}
