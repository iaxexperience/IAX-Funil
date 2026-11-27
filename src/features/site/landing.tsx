import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import {
  MessageCircle,
  Instagram,
  CalendarDays,
  BarChart3,
  Sparkles,
  ShieldCheck,
  Zap,
  ArrowRight,
  ChevronDown,
  Menu,
  X,
  Bot,
  FileText,
  Clock,
  Headphones,
  BookOpen,
  ClipboardList,
} from 'lucide-react';
import { Brand } from '@/features/sales/shared';
import { IaxHero, AboutSection, ProductsSection, ContactSection, IAX_EMAIL, IAX_PHONE } from './products';
import { SolutionsSection, ChatbotSection, CrmSection, LeadsSection, FeatureCardsSection, FunnelSection, AgendaSection, IntegrationsSection, ContactFabs } from './sections';

// Vídeos gratuitos do Mixkit (Mixkit Stock Video Free License: uso comercial liberado, sem atribuição).
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
            <a href="#quem-somos" onClick={() => setMenu(false)}>Quem somos</a>
            <a href="#sistemas" onClick={() => setMenu(false)}>Sistemas</a>
            <a href="#solucoes" onClick={() => setMenu(false)}>Atendimento</a>
            <a href="#crm" onClick={() => setMenu(false)}>CRM</a>
            <a href="#integracoes" onClick={() => setMenu(false)}>Integrações</a>
            <a href="#contato" onClick={() => setMenu(false)}>Contato</a>
            <Link to="/auth" className="lp-link-login">Entrar</Link>
          </nav>
          <div className="lp-nav-cta">
            <Link to="/auth" className="lp-login">Entrar</Link>
            <a href="#contato" className="lp-btn primary small lp-hide-sm">Fale conosco</a>
            <Link to="/inbox" search={{}} className="lp-btn green small">Ver demonstração</Link>
            <button type="button" className="lp-burger" aria-label={menu ? 'Fechar menu' : 'Abrir menu'} onClick={() => setMenu((v) => !v)}>
              {menu ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      <main id="topo">
        <IaxHero />

        <AboutSection />

        <ProductsSection />

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

        <ContactSection />
      </main>

      <footer className="lp-footer">
        <div className="lp-container lp-footer-grid">
          <div>
            <Brand light />
            <p>Automações inteligentes, sistemas e integrações para levar sua empresa para o futuro.</p>
            <p className="ix-foot-contact">
              <a href={`mailto:${IAX_EMAIL}`}>{IAX_EMAIL}</a>
              <br />
              {IAX_PHONE}
            </p>
          </div>
          <div>
            <h4>Sistemas</h4>
            <a href="#iax-guardian">IAX Guardian</a>
            <a href="#findflow">FindFlow</a>
            <a href="#pulse-doacoes">Pulse Doações</a>
            <a href="#pulse-pep-clinic">Pulse PEP Clinic</a>
            <a href="#pulse-eleitoral">Pulse Eleitoral</a>
          </div>
          <div>
            <h4>Plataforma</h4>
            <a href="#solucoes">Atendimento e CRM</a>
            <a href="#integracoes">Integrações</a>
            <Link to="/auth">Entrar</Link>
            <Link to="/inbox" search={{}}>Demonstração</Link>
          </div>
        </div>
        <div className="lp-container lp-copy">© {new Date().getFullYear()} IAX Inteligência Artificial Experience. Todos os direitos reservados.</div>
      </footer>

      <ContactFabs />
    </div>
  );
}
