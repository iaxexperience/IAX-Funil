import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { Link } from '@tanstack/react-router';
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Menu,
  X,
  Play,
  Mail,
  Phone,
  MessageCircle,
  LogIn,
  Boxes,
  Clock,
  Plug,
  SlidersHorizontal,
  Factory,
  HeartPulse,
  Store,
  Vote,
} from 'lucide-react';
import { products, waLink, IAX_EMAIL, IAX_PHONE, type Product } from './products';
import { ContactFabs } from './sections';

/* ------------------------------------------------------------------ Mídias
   Fotos e vídeo do Pexels (licença Pexels: uso comercial liberado, sem atribuição). */
const HERO_VIDEO_HD = 'https://videos.pexels.com/video-files/8631874/8631874-hd_1920_1080_25fps.mp4';
const HERO_VIDEO_SD = 'https://videos.pexels.com/video-files/8631874/8631874-hd_1280_720_25fps.mp4';
const photo = (id: number, w = 1200) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;
const PHOTO_MEETING = photo(36733315);
const PHOTO_EXECUTIVE = photo(5717548);
const PHOTO_CONTACT = photo(806835);
const PHOTO_TEAM = photo(1181370, 800);
const PHOTO_ANALYTICS = photo(7693706, 800);
const PHOTO_SUIT = photo(17582358, 800);
const LEO = '/img/leo-assistente.webp';

function Logo({ className = '', dark = false }: { className?: string; dark?: boolean }) {
  return (
    <img
      className={`sk-logo ${className}`}
      src={dark ? '/img/iax-logo-nova-escuro.png' : '/img/iax-logo-nova.png'}
      alt="IAX · Inteligência Artificial Experience"
      width={dark ? 1112 : 1000}
      height={dark ? 514 : 402}
    />
  );
}

/** Botão com seta, no estilo da página de referência. */
function Cta({ href, children, variant = 'solid', external = false }: { href: string; children: ReactNode; variant?: 'solid' | 'outline'; external?: boolean }) {
  return (
    <a className={`sk-btn ${variant}`} href={href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
      {children}
    </a>
  );
}

/* -------------------------------------------------------------------- Menu */
function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const links = [
    ['#para-quem', 'Para quem'],
    ['#sistemas', 'Sistemas'],
    ['#ia', 'Inteligência artificial'],
    ['#contato', 'Contato'],
  ];
  return (
    <header className={`sk-header ${scrolled ? 'scrolled' : ''}`}>
      <div className="sk-topbar">
        <div className="sk-wrap sk-topbar-inner">
          <a href={`mailto:${IAX_EMAIL}`}>
            <Mail size={13} /> {IAX_EMAIL}
          </a>
          <a href={waLink('Olá! Quero falar com a IAX.')} target="_blank" rel="noopener noreferrer">
            <Phone size={13} /> {IAX_PHONE}
          </a>
          <Link to="/auth" className="sk-topbar-client">
            <LogIn size={13} /> Área do cliente
          </Link>
        </div>
      </div>
      <div className="sk-nav-bar">
        <div className="sk-wrap">
          <nav className="sk-nav" aria-label="Menu principal">
            <a href="#topo" className="sk-nav-logo" aria-label="IAX: início">
              <Logo dark />
            </a>
            <div className={`sk-nav-links ${open ? 'open' : ''}`}>
              {links.map(([href, label]) => (
                <a key={href} href={href} onClick={() => setOpen(false)}>
                  {label}
                </a>
              ))}
              <Link to="/auth" className="sk-nav-login" onClick={() => setOpen(false)}>
                Área do cliente
              </Link>
            </div>
            <Cta href="#contato">
              Fale com especialista <ArrowRight size={15} />
            </Cta>
            <button type="button" className="sk-burger" aria-label={open ? 'Fechar menu' : 'Abrir menu'} aria-expanded={open} onClick={() => setOpen((v) => !v)}>
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}

/* -------------------------------------------------------------------- Topo */
function Hero() {
  const [video, setVideo] = useState('');
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setVideo(window.innerWidth < 900 ? HERO_VIDEO_SD : HERO_VIDEO_HD);
  }, []);
  return (
    <section className="sk-hero" id="topo">
      <video className="sk-hero-video" src={video || undefined} poster={PHOTO_EXECUTIVE} autoPlay muted loop playsInline aria-hidden="true" />
      <div className="sk-wrap sk-hero-inner">
        <span className="sk-eyebrow">IAX · Inteligência Artificial Experience</span>
        <h1>Automações inteligentes que levam sua empresa para o futuro</h1>
        <p>Sistemas próprios e automação com IA para indústrias, hospitais, clínicas, varejo e campanhas que querem sair das planilhas, ganhar controle e atender 24 horas pelo WhatsApp.</p>
        <div className="sk-hero-ctas">
          <Cta href="#sistemas">Quero conhecer</Cta>
          <Cta href={waLink('Olá! Quero falar com um especialista da IAX.')} variant="outline" external>
            Falar com especialista
          </Cta>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------- Mais eficiência (prints em rotação) */
function Efficiency() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = window.setTimeout(() => setI((v) => (v + 1) % products.length), 4500);
    return () => window.clearTimeout(t);
  }, [i, paused]);
  return (
    <section className="sk-dark sk-eff" id="sistemas">
      <div className="sk-wrap sk-eff-grid">
        <div className="sk-eff-copy">
          <h2>Mais eficiência, menos esforço operacional</h2>
          <p>
            A IAX cria sistemas completos para segurança, indústria, saúde, doações e eleições. Cada um automatiza tarefas repetitivas, conecta os canais da
            sua empresa e entrega uma visão integrada do negócio em tempo real.
          </p>
          <Cta href={waLink('Olá! Quero agendar uma demonstração dos sistemas da IAX.')} external>
            Agende uma demonstração
          </Cta>
        </div>
        <div className="sk-eff-visual" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
          <div className="sk-eff-frame">
            {products.map((p, n) => (
              <img key={p.slug} src={p.image} alt={`Tela do ${p.name}`} className={n === i ? 'on' : ''} loading={n === 0 ? 'eager' : 'lazy'} decoding="async" />
            ))}
          </div>
          <div className="sk-eff-tabs" role="tablist" aria-label="Sistemas">
            {products.map((p, n) => (
              <button key={p.slug} type="button" role="tab" aria-selected={n === i} className={n === i ? 'on' : ''} onClick={() => setI(n)}>
                {p.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------ Para quem (perfil de cliente ideal) */
const segments = [
  {
    icon: Factory,
    title: 'Indústria química e saneantes',
    who: 'Fábricas de 10 a 100 funcionários que fabricam e vendem direto, com volume alto de notas.',
    pains: ['Fórmulas, lotes e estoque em planilhas', 'Notas fiscais e a reforma tributária (IBS/CBS)', 'Pedidos e atendimento espalhados no WhatsApp'],
    systems: ['FindFlow', 'IAX Guardian'],
    msg: 'Olá! Tenho uma indústria e quero conhecer o FindFlow.',
  },
  {
    icon: HeartPulse,
    title: 'Hospitais filantrópicos e clínicas',
    who: 'Instituições de saúde que dependem de doações e precisam de prontuário eletrônico seguro.',
    pains: ['Prontuário em papel ou sistema antigo', 'Captação de doações por telefone sem controle', 'Recibos, metas da equipe e dados sensíveis'],
    systems: ['Pulse PEP Clinic', 'Pulse Doações', 'IAX Guardian'],
    msg: 'Olá! Represento uma instituição de saúde e quero conhecer o Pulse PEP Clinic e o Pulse Doações.',
  },
  {
    icon: Store,
    title: 'Varejo e empresas com caixa',
    who: 'Lojas, redes e serviços que usam ERP e PDV e vendem pelo WhatsApp e Instagram.',
    pains: ['Descontos, cancelamentos e quebras de caixa', 'Acessos fora do horário sem alerta', 'Clientes sem resposta fora do expediente'],
    systems: ['IAX Guardian', 'Atendimento e CRM', 'Assistente Leo'],
    msg: 'Olá! Tenho uma empresa com caixa e ERP e quero conhecer o IAX Guardian.',
  },
  {
    icon: Vote,
    title: 'Campanhas e mandatos',
    who: 'Candidatos, partidos e equipes de mandato que decidem com dados de território.',
    pains: ['Base de apoiadores desorganizada', 'Decisões sem mapa do território', 'Comunicação com a base pelo WhatsApp'],
    systems: ['Pulse Eleitoral'],
    msg: 'Olá! Quero conhecer o Pulse Eleitoral para minha campanha ou mandato.',
  },
];

function Segments() {
  return (
    <section className="sk-light sk-seg" id="para-quem">
      <div className="sk-wrap">
        <span className="sk-kicker">Para quem a IAX trabalha</span>
        <h2>Feito para organizações que querem sair das planilhas</h2>
        <p className="sk-lead wide">
          Empresas e instituições de médio porte, principalmente no Nordeste, que ainda dependem de planilhas ou sistemas antigos, atendem pelo WhatsApp e
          precisam de controle e segurança para crescer.
        </p>
        <div className="sk-seg-grid">
          {segments.map((g) => (
            <article className="sk-seg-card" key={g.title}>
              <span className="sk-seg-icon">
                <g.icon size={22} />
              </span>
              <h3>{g.title}</h3>
              <p className="sk-seg-who">{g.who}</p>
              <ul>
                {g.pains.map((pn) => (
                  <li key={pn}>{pn}</li>
                ))}
              </ul>
              <div className="sk-seg-sys">
                {g.systems.map((sy) => (
                  <span key={sy}>{sy}</span>
                ))}
              </div>
              <a className="sk-link" href={waLink(g.msg)} target="_blank" rel="noopener noreferrer">
                Falar sobre meu segmento <ArrowRight size={15} />
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- Números */
const facts = [
  { icon: Boxes, value: '5', label: 'sistemas próprios', text: 'Segurança, ERP industrial, doações, saúde e gestão eleitoral desenvolvidos pela IAX.' },
  { icon: Clock, value: '24/7', label: 'operação contínua', text: 'Automações e agentes de IA trabalhando dia e noite, sem pausas.' },
  { icon: Plug, value: '7', label: 'tecnologias integradas', text: 'WhatsApp, Instagram, CRMs, pagamentos, HL7, MCP e APIs.' },
  { icon: SlidersHorizontal, value: '100%', label: 'sob medida', text: 'Cada solução é ajustada à realidade e aos processos da sua empresa.' },
];

function Numbers() {
  return (
    <section className="sk-light sk-waves">
      <div className="sk-wrap">
        <h2 className="sk-center">A força da IAX em números</h2>
        <div className="sk-num-grid">
          {facts.slice(0, 3).map((f) => (
            <div className="sk-num" key={f.label}>
              <f.icon size={22} />
              <div>
                <strong>{f.value}</strong>
                <small>{f.label}</small>
                <p>{f.text}</p>
              </div>
            </div>
          ))}
          {facts.slice(3).map((f) => (
            <div className="sk-num" key={f.label}>
              <f.icon size={22} />
              <div>
                <strong>{f.value}</strong>
                <small>{f.label}</small>
                <p>{f.text}</p>
              </div>
            </div>
          ))}
          <figure className="sk-num-photo">
            <img src={PHOTO_MEETING} alt="Equipe em reunião de negócios com notebooks" loading="lazy" />
          </figure>
          <div className="sk-num-cta">
            <p>Quer ver esses resultados na sua empresa?</p>
            <Cta href="#contato">Fale com a IAX</Cta>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------- Inteligência artificial (carrossel) */
const aiCards = [
  { title: 'Agentes de IA avançados', text: 'Agendamento automático e captação inteligente de leads com agentes que trabalham sem parar.', img: PHOTO_ANALYTICS },
  { title: 'Assistente virtual Leo', text: 'Tira dúvidas, abre chamados, envia manuais e passa para um atendente humano quando precisa.', img: LEO, top: true },
  { title: 'Automação social', text: 'Fluxos para WhatsApp e Instagram que respondem seus clientes no tempo certo, 24 horas por dia.', img: PHOTO_TEAM },
  { title: 'Integrações API', text: 'Conexões com CRMs, Google Calendar, sistemas de pagamento, HL7, MCP e as plataformas que você já usa.', img: PHOTO_SUIT },
  { title: 'Segurança com IAX Guardian', text: 'Monitoramento contínuo, simulação de ataques e alertas antes que o risco vire incidente.', img: '/img/produtos/iax-guardian.jpg', shot: true },
  { title: 'Atendimento e CRM', text: 'Conversas, leads, funil de vendas e agenda em uma só plataforma, com histórico de cada cliente.', img: '/img/produtos/findflow.jpg', shot: true },
];

/** Grade de cartões: todos aparecem inteiros (3 por linha no computador, 2 no tablet, 1 no celular). */
function CardGrid({ children, label }: { children: ReactNode; label: string }) {
  return (
    <div className="sk-grid" aria-label={label}>
      {children}
    </div>
  );
}

function AiSection() {
  return (
    <section className="sk-dark" id="ia">
      <div className="sk-wrap">
        <h2 className="sk-center">
          Automação com <em>inteligência artificial</em>
        </h2>
        <p className="sk-center sk-sub">
          Automatize atendimentos, conecte sistemas e tenha controle total da operação. Conheça as soluções em IA que levam eficiência e segurança para a sua
          empresa.
        </p>
        <CardGrid label="Soluções em inteligência artificial">
          {aiCards.map((c) => (
            <article className="sk-ai-card" key={c.title}>
              <h3>{c.title}</h3>
              <p>{c.text}</p>
              <div className={`sk-ai-img ${'top' in c && c.top ? 'top' : ''} ${'shot' in c && c.shot ? 'shot' : ''}`}>
                <img src={c.img} alt="" loading="lazy" />
              </div>
            </article>
          ))}
        </CardGrid>
        <div className="sk-center sk-mt">
          <Cta href="#videos">Veja os sistemas em ação</Cta>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- Por que a IAX */
const reasons = [
  ['Eficiência desde o primeiro uso', 'Reduza tarefas manuais e acelere processos já nas primeiras semanas.'],
  ['Mais controle, menos risco', 'Regras, alertas e histórico completo para decidir com segurança.'],
  ['Atendimento 24 horas', 'O Leo e as automações respondem seus clientes a qualquer hora.'],
  ['Integra com o que você já usa', 'WhatsApp, Instagram, CRMs, pagamentos e as APIs da sua operação.'],
  ['Segurança de ponta a ponta', 'Dados protegidos e monitorados pelo IAX Guardian.'],
  ['Soluções sob medida', 'Cada sistema é ajustado aos processos e à realidade do seu negócio.'],
];

function WhyIax() {
  return (
    <section className="sk-light" id="por-que">
      <div className="sk-wrap sk-why-grid">
        <div>
          <h2>Por que a IAX é a escolha certa para sua empresa?</h2>
          <div className="sk-why-list">
            {reasons.map(([t, d]) => (
              <div className="sk-why" key={t}>
                <span className="sk-check">
                  <Check size={16} strokeWidth={3} />
                </span>
                <h3>{t}</h3>
                <p>{d}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="sk-why-side">
          <figure>
            <img src={PHOTO_EXECUTIVE} alt="Executiva trabalhando no notebook em escritório moderno" loading="lazy" />
          </figure>
          <div className="sk-btn-pair">
            <Cta href={waLink('Olá! Quero contratar uma solução da IAX.')} external>
              Contratar a IAX
            </Cta>
            <a className="sk-btn-arrow" href="#contato" aria-label="Ir para o contato">
              <ArrowUpRight size={18} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------ Sistemas em ação (vídeos) */
function VideoCard({ p }: { p: Product }) {
  const [playing, setPlaying] = useState(false);
  return (
    <article className="sk-video" id={`video-${p.slug}`}>
      <div className="sk-video-media">
        {playing && p.video ? (
          <video src={p.video} poster={p.poster || p.image} controls autoPlay playsInline />
        ) : (
          <>
            <img src={p.poster || p.image} alt={`Tela do ${p.name}`} loading="lazy" />
            {p.video ? (
              <button type="button" className="sk-play" onClick={() => setPlaying(true)} aria-label={`Assistir ao vídeo do ${p.name}`}>
                <Play size={18} fill="currentColor" />
              </button>
            ) : (
              <span className="sk-play soon" title="Vídeo em breve">
                <Play size={18} fill="currentColor" />
              </span>
            )}
          </>
        )}
      </div>
      <div className="sk-video-copy">
        <strong>{p.name}</strong>
        <span>{p.tag}</span>
        <p>“{p.headline}”</p>
        <small>{p.video ? 'Assista à demonstração' : 'Vídeo de demonstração em breve'}</small>
      </div>
    </article>
  );
}

function Videos() {
  return (
    <section className="sk-dark" id="videos">
      <div className="sk-wrap">
        <div className="sk-row-head">
          <h2>
            Veja os sistemas da IAX <em>em ação</em>
          </h2>
        </div>
        <CardGrid label="Vídeos dos sistemas">
          {products.map((p) => (
            <VideoCard p={p} key={p.slug} />
          ))}
        </CardGrid>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- Contato */
function Contact() {
  const [sent, setSent] = useState(false);
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const v = (k: string) => String(f.get(k) ?? '').trim();
    const msg = [
      'Olá! Vim pelo site da IAX.',
      `Nome: ${v('nome')}`,
      `Empresa: ${v('empresa')}`,
      v('segmento') && `Segmento: ${v('segmento')}`,
      `E-mail: ${v('email')}`,
      `Telefone: ${v('telefone')}`,
      v('interesse') && `Interesse: ${v('interesse')}`,
      v('mensagem') && `Mensagem: ${v('mensagem')}`,
    ]
      .filter(Boolean)
      .join('\n');
    window.open(waLink(msg), '_blank', 'noopener,noreferrer');
    setSent(true);
  }
  return (
    <section className="sk-light" id="contato">
      <div className="sk-wrap">
        <h2 className="sk-contact-title">Preencha seus dados e descubra como a IAX pode transformar a sua empresa.</h2>
        <div className="sk-contact-card">
          <form className="sk-form" onSubmit={submit}>
            <label>
              Nome*
              <input name="nome" required placeholder="Digite seu nome" autoComplete="name" />
            </label>
            <label>
              E-mail corporativo*
              <input name="email" type="email" required placeholder="voce@empresa.com.br" autoComplete="email" />
            </label>
            <div className="sk-form-row">
              <label>
                Telefone*
                <input name="telefone" type="tel" required placeholder="(00) 00000-0000" autoComplete="tel" />
              </label>
              <label>
                Empresa*
                <input name="empresa" required placeholder="Nome da empresa" autoComplete="organization" />
              </label>
            </div>
            <label>
              Segmento
              <select name="segmento" defaultValue="">
                <option value="">Selecione o seu segmento</option>
                {segments.map((g) => (
                  <option key={g.title}>{g.title}</option>
                ))}
                <option>Outro segmento</option>
              </select>
            </label>
            <label>
              Sistema de interesse
              <select name="interesse" defaultValue="">
                <option value="">Ainda não sei, quero orientação</option>
                {products.map((p) => (
                  <option key={p.slug}>{p.name}</option>
                ))}
                <option>Automação e agentes de IA</option>
                <option>Atendimento e CRM</option>
              </select>
            </label>
            <label>
              Mensagem
              <textarea name="mensagem" rows={3} placeholder="Conte rapidamente o seu desafio" />
            </label>
            <button type="submit" className="sk-btn solid full">
              Enviar pelo WhatsApp
            </button>
            {sent && <p className="sk-form-ok">Abrimos o WhatsApp com seus dados. É só enviar a mensagem para falar com a IAX.</p>}
            <p className="sk-form-note">Seus dados são usados apenas para a IAX entrar em contato com você.</p>
          </form>
          <figure className="sk-contact-photo">
            <img src={PHOTO_CONTACT} alt="Profissional usando notebook em escritório iluminado" loading="lazy" />
          </figure>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- Rodapé */
function Footer() {
  return (
    <footer className="sk-footer">
      <div className="sk-wrap sk-foot-grid">
        <div>
          <Logo className="sk-foot-logo" />
        </div>
        <div>
          <h4>Sistemas</h4>
          {products.map((p) => (
            <a key={p.slug} href={`#video-${p.slug}`}>
              {p.name}
            </a>
          ))}
        </div>
        <div>
          <h4>Soluções</h4>
          <a href="#ia">Agentes de IA</a>
          <a href="#ia">Automação social</a>
          <a href="#ia">Integrações API</a>
          <Link to="/inbox" search={{}}>
            Atendimento e CRM
          </Link>
        </div>
        <div>
          <h4>Contato</h4>
          <a href={`mailto:${IAX_EMAIL}`}>{IAX_EMAIL}</a>
          <a href={waLink('Olá! Quero falar com a IAX.')} target="_blank" rel="noopener noreferrer">
            {IAX_PHONE}
          </a>
          <Link to="/auth">Área do cliente</Link>
        </div>
      </div>
      <div className="sk-wrap sk-copy">
        © {new Date().getFullYear()} IAX Inteligência Artificial Experience. Todos os direitos reservados.
        <a href={waLink('Olá! Quero falar com a IAX.')} target="_blank" rel="noopener noreferrer">
          <MessageCircle size={14} /> Fale com a gente no WhatsApp
        </a>
      </div>
    </footer>
  );
}

export function LandingPage() {
  return (
    <div className="sk">
      <Nav />
      <main>
        <Hero />
        <Efficiency />
        <Segments />
        <Numbers />
        <AiSection />
        <WhyIax />
        <Videos />
        <Contact />
      </main>
      <Footer />
      <ContactFabs />
    </div>
  );
}
