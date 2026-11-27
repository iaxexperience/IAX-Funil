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
} from 'lucide-react';
import { Brand } from '@/features/sales/shared';

const features = [
  { icon: MessageCircle, title: 'Inbox unificada', text: 'WhatsApp e Instagram em uma só tela. Toda a equipe atende do mesmo lugar, sem perder o histórico.' },
  { icon: Columns3, title: 'Funil de vendas visual', text: 'Arraste cada lead pelas etapas e veja na hora onde estão as oportunidades e os gargalos.' },
  { icon: CalendarDays, title: 'Agenda e follow-ups', text: 'Próxima ação sempre definida. Alertas de atraso para nenhum cliente ficar sem resposta.' },
  { icon: Users, title: 'Equipe e permissões', text: 'Distribua leads por responsável e controle o que cada vendedor pode ver e editar.' },
  { icon: FileText, title: 'Modelos de mensagem', text: 'Respostas prontas para os momentos-chave da venda. Mais agilidade, mesma qualidade.' },
  { icon: BarChart3, title: 'Relatórios em tempo real', text: 'Taxa de conversão por etapa, origem dos leads e desempenho de cada vendedor.' },
];

const steps = [
  { n: '01', title: 'Conecte seus canais', text: 'Ligue o WhatsApp e o Instagram da empresa em poucos minutos.' },
  { n: '02', title: 'Organize o funil', text: 'Cada conversa vira um lead com etapa, responsável e próxima ação.' },
  { n: '03', title: 'Venda mais', text: 'Acompanhe os números e saiba exatamente onde agir para fechar.' },
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
            <a href="#recursos" onClick={() => setMenu(false)}>Recursos</a>
            <a href="#ia" onClick={() => setMenu(false)}>Inteligência artificial</a>
            <a href="#funil" onClick={() => setMenu(false)}>Funil de vendas</a>
            <a href="#faq" onClick={() => setMenu(false)}>Dúvidas</a>
            <Link to="/auth" className="lp-link-login">Entrar</Link>
          </nav>
          <div className="lp-nav-cta">
            <Link to="/auth" className="lp-login">Entrar</Link>
            <Link to="/auth" className="lp-btn primary small">Começar</Link>
            <button type="button" className="lp-burger" aria-label={menu ? 'Fechar menu' : 'Abrir menu'} onClick={() => setMenu((v) => !v)}>
              {menu ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      <main id="topo">
        <section className="lp-hero">
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
                <Link to="/" search={{}} className="lp-btn ghost">
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

        <section className="lp-section" id="recursos">
          <div className="lp-container">
            <div className="lp-heading">
              <span className="lp-eyebrow">Recursos</span>
              <h2>Tudo o que sua equipe comercial precisa</h2>
              <p>Do primeiro “olá” ao contrato assinado, cada etapa da venda organizada e visível para todo o time.</p>
            </div>
            <div className="lp-feature-grid">
              {features.map((f) => (
                <article className="lp-feature" key={f.title}>
                  <span className="lp-feature-icon">
                    <f.icon size={22} />
                  </span>
                  <h3>{f.title}</h3>
                  <p>{f.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

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
            <div className="lp-ai-card" aria-hidden="true">
              <div className="lp-bubble in">
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

        <section className="lp-section" id="funil">
          <div className="lp-container lp-split reverse">
            <div className="lp-kanban" aria-hidden="true">
              {[
                ['Novo lead', ['Potiguar Distribuidora', 'SuaveLar']],
                ['Demonstração', ['Brisa Produtos']],
                ['Proposta', ['CloroMax', 'Alvo Detergentes']],
                ['Ganho', ['LimpMais Química']],
              ].map(([title, cards], i) => (
                <div className="lp-kcol" key={title as string}>
                  <h4>
                    <i className={`d${i}`} />
                    {title as string}
                  </h4>
                  {(cards as string[]).map((c) => (
                    <div className="lp-kcard" key={c}>
                      <strong>{c}</strong>
                      <small>Próxima ação definida</small>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div>
              <span className="lp-eyebrow">Funil de vendas</span>
              <h2>Veja cada oportunidade no lugar certo</h2>
              <p>Arraste os leads entre as etapas, defina a próxima ação e saiba quanto há em negociação em cada fase do funil.</p>
              <div className="lp-steps">
                {steps.map((s) => (
                  <div className="lp-step" key={s.n}>
                    <span>{s.n}</span>
                    <div>
                      <h3>{s.title}</h3>
                      <p>{s.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

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

        <section className="lp-cta">
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
            <Link to="/" search={{}}>Demonstração</Link>
          </div>
        </div>
        <div className="lp-container lp-copy">© {new Date().getFullYear()} IAX SAC. Todos os direitos reservados.</div>
      </footer>
    </div>
  );
}
