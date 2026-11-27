import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import {
  MessageCircle,
  Instagram,
  Columns3,
  CalendarDays,
  Users,
  BarChart3,
  Sparkles,
  ShieldCheck,
  Zap,
  CheckCheck,
  ArrowRight,
  Play,
  Bell,
  RefreshCw,
  ChevronDown,
  Menu,
  X,
  Bot,
  FileText,
  Clock,
  Check,
  Headphones,
  BookOpen,
  ClipboardList,
} from 'lucide-react';
import { Brand } from '@/features/sales/shared';
import { SolutionsSection, ChatbotSection, CrmSection, LeadsSection, FeatureCardsSection, FunnelSection, AgendaSection, IntegrationsSection, ContactFabs } from './sections';

// Vídeos gratuitos do Mixkit (Mixkit Stock Video Free License: uso comercial liberado, sem atribuição).
const VIDEO_OFFICE = 'https://assets.mixkit.co/videos/42664/42664-720.mp4';
const VIDEO_OFFICE_POSTER = 'https://assets.mixkit.co/videos/42664/42664-thumb-720-0.jpg';
const VIDEO_PHONE = 'https://assets.mixkit.co/videos/43270/43270-720.mp4';
const VIDEO_PHONE_POSTER = 'https://assets.mixkit.co/videos/43270/43270-thumb-720-0.jpg';

const leoPills = [
  { icon: Headphones, label: 'Suporte 24h' },
  { icon: Zap, label: 'Respostas inteligentes' },
  { icon: BookOpen, label: 'Manuais na hora' },
  { icon: ClipboardList, label: 'Meus chamados' },
];

const faqs = [
  { q: 'Preciso instalar alguma coisa?', a: 'Não. A plataforma funciona no navegador, no computador e no celular.' },
  { q: 'Posso usar o meu número de WhatsApp atual?', a: 'Sim. Você conecta o número da empresa e mantém o contato com os clientes que já tem.' },
  { q: 'Quantos vendedores podem usar?', a: 'Quantos a sua equipe precisar. Cada um tem login próprio e vê os leads pelos quais é responsável.' },
  { q: 'Meus dados ficam seguros?', a: 'Sim. Os dados ficam em banco de dados privado, com acesso controlado por usuário e permissão.' },
];

const stats = [
  { value: '2', label: 'canais na mesma tela: WhatsApp e Instagram' },
  { value: '9', label: 'etapas de funil prontas para usar' },
  { value: '100%', label: 'online, no computador e no celular' },
  { value: '1', label: 'histórico único por cliente para todo o time' },
];

function ProductMockup() {
  const chats = [
    { name: 'Brisa Produtos', msg: 'Vocês controlam lotes também?', time: '11:48', unread: 2, ig: false },
    { name: 'Nordeste Saneantes', msg: 'Pode me enviar a proposta?', time: '10:24', unread: 1, ig: true },
    { name: 'CloroMax Indústria', msg: 'Obrigado pelo retorno!', time: '09:15', unread: 0, ig: false },
    { name: 'EcoClean Industrial', msg: 'Vamos agendar a demonstração', time: 'Ontem', unread: 0, ig: false },
  ];
  return (
    <div className="lp-mock" aria-hidden="true">
      <div className="lp-mock-top">
        <span className="lp-mock-logo" />
        <span className="lp-mock-pill" />
        <span className="lp-mock-pill short" />
        <span className="lp-mock-pill" />
        <span className="lp-mock-avatar" />
      </div>
      <div className="lp-mock-body">
        <div className="lp-mock-list">
          <div className="lp-mock-search">Pesquisar por nome ou número…</div>
          {chats.map((c, i) => (
            <div className={`lp-mock-item ${i === 0 ? 'active' : ''}`} key={c.name}>
              <span className={`lp-mock-face f${i}`}>
                <span className={`lp-mock-badge ${c.ig ? 'ig' : ''}`} />
              </span>
              <div>
                <strong>{c.name}</strong>
                <small>{c.msg}</small>
              </div>
              <div className="lp-mock-meta">
                <time>{c.time}</time>
                {c.unread > 0 && <b>{c.unread}</b>}
              </div>
            </div>
          ))}
        </div>
        <div className="lp-mock-chat">
          <div className="lp-mock-chat-head">
            <span className="lp-mock-face f0" />
            <strong>Brisa Produtos</strong>
            <span className="lp-mock-tag">DEMONSTRAÇÃO</span>
          </div>
          <div className="lp-mock-msgs">
            <div className="lp-bubble in">
              <b>Marcos</b>Olá! Queremos organizar a produção e o estoque.
            </div>
            <div className="lp-bubble out">
              <b>Camila · Vendas</b>Perfeito! Posso te mostrar como funciona amanhã às 10h?
              <CheckCheck size={13} />
            </div>
            <div className="lp-bubble in ai">
              <span className="lp-ai-chip">
                <Sparkles size={11} />
                Resumo por IA
              </span>
              Lead quer controle de lotes e fórmulas. Decisor: sócio. Alta prioridade.
            </div>
          </div>
          <div className="lp-mock-composer">
            <span>Digite sua mensagem…</span>
            <i />
          </div>
        </div>
      </div>
      <div className="lp-float lp-float-1">
        <span className="lp-float-icon green">
          <Bell size={15} />
        </span>
        <div>
          <strong>Nova mensagem recebida</strong>
          <small>WhatsApp · agora</small>
        </div>
      </div>
      <div className="lp-float lp-float-2">
        <span className="lp-float-icon blue">
          <RefreshCw size={15} />
        </span>
        <div>
          <strong>Lead movido para Proposta</strong>
          <small>Funil atualizado</small>
        </div>
      </div>
    </div>
  );
}

export function LandingPage() {
  const [menu, setMenu] = useState(false);
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="lp">
      <header className="lp-nav">
        <div className="lp-container lp-nav-inner">
          <a href="#topo" aria-label="Início">
            <Brand />
          </a>
          <nav className={`lp-links ${menu ? 'open' : ''}`} aria-label="Seções">
            <a href="#solucoes" onClick={() => setMenu(false)}>Soluções</a>
            <a href="#chatbot" onClick={() => setMenu(false)}>Chatbot</a>
            <a href="#crm" onClick={() => setMenu(false)}>CRM</a>
            <a href="#funil" onClick={() => setMenu(false)}>Funil</a>
            <a href="#ia" onClick={() => setMenu(false)}>IA</a>
            <a href="#integracoes" onClick={() => setMenu(false)}>Integrações</a>
            <Link to="/auth" className="lp-link-login">Entrar</Link>
          </nav>
          <div className="lp-nav-cta">
            <Link to="/auth" className="lp-login">Entrar</Link>
            <a href="#contato" className="lp-btn primary small lp-hide-sm">Fale com o consultor</a>
            <Link to="/auth" className="lp-btn green small">Começar</Link>
            <button type="button" className="lp-burger" aria-label={menu ? 'Fechar menu' : 'Abrir menu'} onClick={() => setMenu((v) => !v)}>
              {menu ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      <main id="topo">
        <section className="lp-hero">
          <video className="lp-hero-video" src={VIDEO_OFFICE} poster={VIDEO_OFFICE_POSTER} autoPlay muted loop playsInline preload="metadata" aria-hidden="true" />
          <div className="lp-container lp-hero-grid">
            <div className="lp-hero-copy">
              <span className="lp-eyebrow">
                <Sparkles size={14} />
                Atendimento e vendas com IA
              </span>
              <h1>
                Centralize o atendimento e <span>venda mais</span> pelo WhatsApp
              </h1>
              <p>
                WhatsApp, Instagram, funil de vendas e agenda em uma única plataforma. Sua equipe responde mais rápido, acompanha cada oportunidade e
                nunca mais esquece um lead.
              </p>
              <div className="lp-hero-ctas">
                <Link to="/auth" className="lp-btn primary">
                  Começar agora
                  <ArrowRight size={18} />
                </Link>
                <Link to="/inbox" search={{}} className="lp-btn ghost-light">
                  <Play size={16} />
                  Ver demonstração
                </Link>
              </div>
              <ul className="lp-hero-checks">
                <li>
                  <Check size={15} />
                  Sem instalação
                </li>
                <li>
                  <Check size={15} />
                  Computador e celular
                </li>
                <li>
                  <Check size={15} />
                  Suporte em português
                </li>
              </ul>
            </div>
            <ProductMockup />
          </div>
        </section>

        <section className="lp-channels">
          <div className="lp-container">
            <p>Todos os seus canais de conversa em um só lugar</p>
            <div className="lp-channel-row">
              <span>
                <MessageCircle size={20} className="wa" />
                WhatsApp
              </span>
              <span>
                <Instagram size={20} className="ig" />
                Instagram
              </span>
              <span>
                <Bot size={20} />
                Chatbot
              </span>
              <span>
                <CalendarDays size={20} />
                Agenda
              </span>
              <span>
                <BarChart3 size={20} />
                Relatórios
              </span>
            </div>
          </div>
        </section>

        <SolutionsSection />

        <section className="lp-section lp-leo" id="leo">
          <div className="lp-container lp-leo-grid">
            <figure className="lp-leo-art">
              <img src="/img/leo-assistente.webp" alt="Leo, o assistente virtual, conversando com um cliente na janela de chat" width={1212} height={1297} loading="lazy" decoding="async" />
              <figcaption className="lp-leo-badge">
                <span className="lp-leo-face" aria-hidden="true" />
                <div>
                  <strong>Leo está online</strong>
                  <small>Responde em segundos</small>
                </div>
              </figcaption>
            </figure>
            <div className="lp-leo-copy">
              <span className="lp-eyebrow">
                <Bot size={14} />
                Assistente virtual
              </span>
              <h2>
                Conheça o <span className="lp-grad">Leo</span>, o assistente que atende seus clientes 24 horas
              </h2>
              <p>
                O Leo tira dúvidas, abre chamados, envia manuais e, quando precisa, passa a conversa para um atendente humano. Seu cliente nunca fica sem
                resposta, nem de madrugada.
              </p>
              <ul className="lp-leo-pills">
                {leoPills.map((p) => (
                  <li key={p.label}>
                    <span>
                      <p.icon size={18} />
                    </span>
                    {p.label}
                  </li>
                ))}
              </ul>
              <a href="#contato" className="lp-btn primary">
                Quero o Leo na minha empresa
                <ArrowRight size={18} />
              </a>
            </div>
          </div>
        </section>

        <ChatbotSection />

        <CrmSection />

        <LeadsSection />

        <FeatureCardsSection />

        <FunnelSection />

        <AgendaSection />


        <section className="lp-section lp-ai" id="ia">
          <div className="lp-container lp-split">
            <div>
              <span className="lp-eyebrow light">
                <Sparkles size={14} />
                Copiloto de IA
              </span>
              <h2>Uma inteligência artificial que trabalha junto com o seu time</h2>
              <p>Menos tempo digitando, mais tempo vendendo. A IA lê a conversa e entrega o que importa.</p>
              <ul className="lp-list">
                <li>
                  <Zap size={18} />
                  Sugestões de resposta no tom da sua empresa
                </li>
                <li>
                  <FileText size={18} />
                  Resumo automático de conversas longas
                </li>
                <li>
                  <ShieldCheck size={18} />
                  Qualificação do lead com pontuação de prioridade
                </li>
                <li>
                  <Clock size={18} />
                  Lembretes de follow-up no momento certo
                </li>
              </ul>
            </div>
            <div className="lp-ai-visual" aria-hidden="true">
              <div className="lp-phone">
                <video src={VIDEO_PHONE} poster={VIDEO_PHONE_POSTER} autoPlay muted loop playsInline preload="none" />
              </div>
              <div className="lp-bubble in lp-ai-question">
                <b>Cliente</b>Qual o prazo de implantação? Temos 3 unidades.
              </div>
              <div className="lp-ai-suggest">
                <span className="lp-ai-chip">
                  <Sparkles size={11} />
                  Sugestão da IA
                </span>
                <p>A implantação leva cerca de 15 dias para 3 unidades. Posso agendar uma conversa para detalhar o cronograma?</p>
                <div className="lp-ai-actions">
                  <span>Usar resposta</span>
                  <span className="muted">Editar</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <IntegrationsSection />


        <section className="lp-stats">
          <div className="lp-container lp-stats-grid">
            {stats.map((s) => (
              <div key={s.label}>
                <strong>{s.value}</strong>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="lp-section" id="faq">
          <div className="lp-container lp-faq-wrap">
            <div className="lp-heading">
              <span className="lp-eyebrow">Dúvidas</span>
              <h2>Perguntas frequentes</h2>
            </div>
            <div className="lp-faq">
              {faqs.map((f, i) => (
                <div className={`lp-faq-item ${open === i ? 'open' : ''}`} key={f.q}>
                  <button type="button" aria-expanded={open === i} onClick={() => setOpen(open === i ? null : i)}>
                    {f.q}
                    <ChevronDown size={18} />
                  </button>
                  {open === i && <p>{f.a}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="lp-cta" id="contato">
          <div className="lp-container lp-cta-box">
            <div>
              <h2>Pronto para não perder mais nenhum lead?</h2>
              <p>Comece agora e veja sua equipe vender mais em poucos dias.</p>
            </div>
            <Link to="/auth" className="lp-btn white">
              Começar agora
              <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      </main>

      <footer className="lp-footer">
        <div className="lp-container lp-footer-grid">
          <div>
            <Brand light />
            <p>Atendimento, funil de vendas e agenda em uma única plataforma.</p>
          </div>
          <div>
            <h4>Produto</h4>
            <a href="#recursos">Recursos</a>
            <a href="#ia">Inteligência artificial</a>
            <a href="#funil">Funil de vendas</a>
          </div>
          <div>
            <h4>Acesso</h4>
            <Link to="/auth">Entrar</Link>
            <Link to="/inbox" search={{}}>Demonstração</Link>
          </div>
        </div>
        <div className="lp-container lp-copy">© {new Date().getFullYear()} IAX SAC. Todos os direitos reservados.</div>
      </footer>

      <ContactFabs />
    </div>
  );
}
