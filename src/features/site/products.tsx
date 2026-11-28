import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Play,
  ShieldCheck,
  Factory,
  HeartHandshake,
  Stethoscope,
  Vote,
  Share2,
  Plug,
  BrainCircuit,
  Mail,
  Phone,
  MessageCircle,
  Clock,
  Sparkles,
} from 'lucide-react';

/* ------------------------------------------------------------------ Mídias
   Vídeo do topo: o mesmo do iax.info (Pexels 6153734, licença Pexels: uso comercial liberado,
   sem atribuição). Versão HD no computador e uma menor no celular. */
const HERO_VIDEO_HD = 'https://videos.pexels.com/video-files/6153734/6153734-hd_2048_1080_25fps.mp4';
const HERO_VIDEO_SD = 'https://videos.pexels.com/video-files/6153734/6153734-hd_1366_720_25fps.mp4';
const HERO_POSTER = 'https://images.pexels.com/videos/6153734/amputee-anonymouse-artificial-biotechnology-6153734.jpeg?auto=compress&cs=tinysrgb&w=1600';

export const IAX_EMAIL = 'comercial@iax.info';
export const IAX_PHONE = '+55 83 99658-3281';
const IAX_WHATSAPP = '5583996583281';
export const waLink = (msg: string) => `https://wa.me/${IAX_WHATSAPP}?text=${encodeURIComponent(msg)}`;

/* ---------------------------------------------------------------- Produtos
   Os vídeos de cada sistema entram em `video` (ex.: '/videos/findflow.mp4' em public/videos/)
   e, se quiser, uma imagem de capa em `poster`. Enquanto `video` estiver vazio, aparece "Vídeo em breve". */
export type Product = {
  slug: string;
  name: string;
  tag: string;
  icon: ReactNode;
  hue: number;
  headline: string;
  text: string;
  points: string[];
  /** Print da tela do sistema, mostrado enquanto o vídeo não chega. */
  image: string;
  video: string;
  poster: string;
};

export const products: Product[] = [
  {
    slug: 'iax-guardian',
    name: 'IAX Guardian',
    tag: 'Security Operations',
    icon: <ShieldCheck size={26} />,
    hue: 250,
    headline: 'Ataque e defesa, sob a mesma lente.',
    text: 'O IAX Guardian observa cada evento dos seus sistemas, simula o adversário e alerta sua equipe antes que o risco vire incidente.',
    points: ['Monitoramento contínuo 24/7', 'Red × Blue: simulação e detecção', 'Zero escritas no ERP (somente leitura)'],
    image: '/img/produtos/iax-guardian.jpg',
    video: '',
    poster: '',
  },
  {
    slug: 'findflow',
    name: 'FindFlow',
    tag: 'ERP para fábricas químicas',
    icon: <Factory size={26} />,
    hue: 255,
    headline: 'Da fórmula à nota fiscal, do balcão ao WhatsApp.',
    text: 'Produção, estoque, fiscal, vendas e atendimento num lugar só, feito para a rotina de fábricas químicas.',
    points: ['Fórmulas, lotes e produção', 'NF-e, NFC-e e IBS/CBS', 'PDV, financeiro e WhatsApp'],
    image: '/img/produtos/findflow.jpg',
    video: '',
    poster: '',
  },
  {
    slug: 'pulse-doacoes',
    name: 'Pulse Doações',
    tag: 'Doações para hospitais e instituições filantrópicas',
    icon: <HeartHandshake size={26} />,
    hue: 195,
    headline: 'Cada doação no ritmo certo, do telefone ao recibo.',
    text: 'Carteira de doadores, telemarketing, caixa, coleta e relatórios em uma só plataforma, com metas para a equipe e recibos que o doador pode validar.',
    points: ['Carteira de doadores e telemarketing', 'Caixa, coleta e relatórios', 'Metas da equipe e recibos validáveis'],
    image: '/img/produtos/pulse-doacoes.jpg',
    video: '',
    poster: '',
  },
  {
    slug: 'pulse-pep-clinic',
    name: 'Pulse PEP Clinic',
    tag: 'Prontuário eletrônico do paciente',
    icon: <Stethoscope size={26} />,
    hue: 165,
    headline: 'Tecnologia de ponta para sua gestão clínica.',
    text: 'Sistema seguro para gestão clínica e prontuário eletrônico, desenvolvido para médicos, enfermeiros e gestores hospitalares.',
    points: ['Prontuários, evoluções e prescrições', 'Sinais vitais e exames', 'Painel de chamada e relatórios'],
    image: '/img/produtos/pulse-pep-clinic.jpg',
    video: '',
    poster: '',
  },
  {
    slug: 'pulse-eleitoral',
    name: 'Pulse Eleitoral',
    tag: 'Gestão estratégica digital',
    icon: <Vote size={26} />,
    hue: 160,
    headline: 'A inteligência que faltava para a sua vitória nas urnas.',
    text: 'Plataforma de mapeamento territorial e análise preditiva. Transforme dados complexos em decisões vitoriosas.',
    points: ['Mapeamento territorial', 'Análise preditiva', 'Ambiente seguro e criptografado'],
    image: '/img/produtos/pulse-eleitoral.jpg',
    video: '',
    poster: '',
  },
];

/* --------------------------------------------------------------------- Hero */
export function IaxHero() {
  // O vídeo só é escolhido no navegador: versão menor em telas pequenas e nada para quem prefere menos movimento.
  const [video, setVideo] = useState('');
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setVideo(window.innerWidth < 900 ? HERO_VIDEO_SD : HERO_VIDEO_HD);
  }, []);
  return (
    <section className="ix-hero">
      <video
        className="ix-hero-media"
        src={video || undefined}
        poster={HERO_POSTER}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      />
      <div className="ix-hero-inner">
        <h1>Automações inteligentes, levamos sua empresa para o futuro.</h1>
        <img className="ix-hero-logo-full" src="/img/iax-logo-nova-escuro.png" alt="IAX · Inteligência Artificial Experience" width={1000} height={402} fetchPriority="high" />
        <p className="ix-hero-sub">Integre APIs, CRMs e redes sociais com tecnologia de ponta</p>
        <div className="ix-stars" aria-label="Avaliação 5 estrelas">
          <span className="ix-stars-row" aria-hidden="true">
            ★★★★★
          </span>
          <span>Avaliação 5 estrelas</span>
        </div>
        <div className="ix-hero-ctas">
          <a href="#sistemas" className="ix-hero-btn primary">
            Conheça nossos sistemas <ArrowRight size={17} />
          </a>
          <a href={waLink('Olá! Quero falar com a IAX sobre automação e sistemas.')} className="ix-hero-btn" target="_blank" rel="noopener noreferrer">
            <MessageCircle size={16} /> Fale com a IAX
          </a>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- Quem somos */
const services = [
  { icon: Share2, title: 'Automação Social', text: 'Criação de fluxos para Instagram e WhatsApp que atendem e respondem seus clientes 24h por dia.' },
  { icon: Plug, title: 'Integrações API', text: 'Conexões com CRMs, Google Calendar, sistemas de pagamento e as plataformas que sua empresa já usa.' },
  { icon: BrainCircuit, title: 'Agentes de IA Avançados', text: 'Agendamento automático e captação inteligente de leads com agentes que trabalham sem parar.' },
];
const stack = ['WhatsApp', 'Instagram', 'CRMs', 'Pagamentos', 'HL7', 'MCP', 'APIs'];

export function AboutSection() {
  return (
    <section className="lp-section ix-about" id="quem-somos">
      <div className="lp-container ix-about-grid">
        <div>
          <span className="lp-kicker">Quem somos</span>
          <h2 className="lp-big">
            Tecnologia <span className="lp-grad">simples, acessível</span> e realmente útil
          </h2>
          <p className="lp-lead">
            A IAX é especializada em soluções de Inteligência Artificial e automação que ajudam empresas a trabalhar de forma mais rápida, eficiente e
            inteligente. Criamos sistemas que funcionam 24h por dia, eliminando tarefas repetitivas, melhorando o atendimento e aumentando a
            produtividade.
          </p>
          <div className="ix-stack">
            {stack.map((s) => (
              <span key={s}>{s}</span>
            ))}
          </div>
          <p className="ix-about-note">
            <Clock size={16} /> Soluções seguras, escaláveis e totalmente personalizadas.
          </p>
        </div>
        <div className="ix-services">
          {services.map((s) => (
            <article className="ix-service" key={s.title}>
              <span>
                <s.icon size={22} />
              </span>
              <div>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------- Sistemas */
/* ----------------------------------------------- Vitrine em carrossel (estilo Softcom) */
export function SystemsShowcase() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = useRef(false);
  const total = products.length;
  const go = useCallback((i: number) => setIndex(((i % total) + total) % total), [total]);

  useEffect(() => {
    reduced.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);
  useEffect(() => {
    if (paused || reduced.current) return;
    const t = window.setTimeout(() => go(index + 1), 5000);
    return () => window.clearTimeout(t);
  }, [index, paused, go]);

  const current = products[index]!;
  return (
    <section className="sx" aria-labelledby="sx-title">
      <div className="lp-container sx-grid">
        <div className="sx-copy">
          <h2 id="sx-title">Os sistemas da sua empresa estão aqui!</h2>
          <p>
            Segurança, ERP, doações, saúde e eleições: sistemas completos criados pela IAX, com automação e inteligência artificial. Simplifique a gestão da
            sua empresa com a IAX!
          </p>
          <a className="sx-cta" href={waLink('Olá! Quero conversar sobre os sistemas da IAX.')} target="_blank" rel="noopener noreferrer">
            Clique aqui e vamos conversar!
            <ArrowRight size={20} />
          </a>
        </div>

        <div
          className="sx-card"
          role="region"
          aria-roledescription="carrossel"
          aria-label="Sistemas da IAX"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          <div className="sx-viewport">
            <div className="sx-track" style={{ transform: `translateX(-${index * 100}%)` }}>
              {products.map((p, i) => (
                <a
                  key={p.slug}
                  href={`#${p.slug}`}
                  className="sx-slide"
                  style={{ ['--h' as string]: String(p.hue) }}
                  aria-roledescription="slide"
                  aria-label={`${i + 1} de ${total}: ${p.name}`}
                  aria-hidden={i !== index}
                  tabIndex={i === index ? 0 : -1}
                >
                  <img src={p.image} alt={`Tela do ${p.name}`} loading={i === 0 ? 'eager' : 'lazy'} decoding="async" />
                </a>
              ))}
            </div>
            <button type="button" className="sx-arrow prev" onClick={() => go(index - 1)} aria-label="Sistema anterior">
              <ChevronLeft size={22} />
            </button>
            <button type="button" className="sx-arrow next" onClick={() => go(index + 1)} aria-label="Próximo sistema">
              <ChevronRight size={22} />
            </button>
          </div>
          <div className="sx-caption" style={{ ['--h' as string]: String(current.hue) }} aria-live="polite">
            <span className="sx-icon">{current.icon}</span>
            <div>
              <b>{current.name}</b>
              <small>{current.tag}</small>
            </div>
            <a href={`#${current.slug}`} className="sx-more">
              Ver detalhes <ArrowRight size={15} />
            </a>
          </div>
          <div className="sx-dots" role="tablist" aria-label="Escolher sistema">
            {products.map((p, i) => (
              <button
                key={p.slug}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={p.name}
                className={i === index ? 'on' : ''}
                onClick={() => go(i)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ProductVideo({ p }: { p: Product }) {
  const [playing, setPlaying] = useState(false);
  if (p.video) {
    return (
      <div className="ix-video">
        {playing ? (
          <video src={p.video} poster={p.poster || undefined} controls autoPlay playsInline />
        ) : (
          <button type="button" className="ix-video-cover" onClick={() => setPlaying(true)} aria-label={`Assistir ao vídeo do ${p.name}`}>
            {p.poster ? <img src={p.poster} alt="" loading="lazy" /> : <video src={p.video} muted playsInline preload="metadata" />}
            <span className="ix-play">
              <Play size={30} fill="currentColor" />
            </span>
          </button>
        )}
      </div>
    );
  }
  if (p.image) {
    return (
      <div className="ix-video shot">
        <img src={p.image} alt={`Tela do ${p.name}`} loading="lazy" decoding="async" />
        <span className="ix-soon-badge">
          <Play size={13} fill="currentColor" /> Vídeo em breve
        </span>
      </div>
    );
  }
  return (
    <div className="ix-video soon" aria-label={`Vídeo do ${p.name} em breve`}>
      <div className="ix-video-glow" />
      <span className="ix-video-icon">{p.icon}</span>
      <span className="ix-play muted">
        <Play size={26} fill="currentColor" />
      </span>
      <b>{p.name}</b>
      <small>Vídeo de demonstração em breve</small>
    </div>
  );
}

export function ProductsSection() {
  return (
    <section className="lp-section ix-products" id="sistemas">
      <div className="lp-container">
        <div className="lp-sh center">
          <span className="lp-kicker">Nossos sistemas</span>
          <h2 className="lp-big">
            Sistemas que a IAX <span className="lp-grad">construiu</span> para o seu negócio
          </h2>
          <p>Cada sistema nasce de um problema real. Veja como eles funcionam na prática.</p>
        </div>
        <div className="ix-product-nav">
          {products.map((p) => (
            <a key={p.slug} href={`#${p.slug}`} style={{ ['--h' as string]: String(p.hue) }}>
              {p.icon}
              {p.name}
            </a>
          ))}
        </div>
        <div className="ix-product-list">
          {products.map((p, i) => (
            <article className={`ix-product ${i % 2 ? 'flip' : ''}`} id={p.slug} key={p.slug} style={{ ['--h' as string]: String(p.hue) }}>
              <ProductVideo p={p} />
              <div className="ix-product-copy">
                <span className="ix-product-tag">
                  {p.icon}
                  {p.tag}
                </span>
                <h3>{p.name}</h3>
                <p className="ix-product-headline">{p.headline}</p>
                <p>{p.text}</p>
                <ul>
                  {p.points.map((pt) => (
                    <li key={pt}>
                      <Sparkles size={14} />
                      {pt}
                    </li>
                  ))}
                </ul>
                <a href={waLink(`Olá! Quero conhecer o ${p.name}.`)} className="lp-btn primary" target="_blank" rel="noopener noreferrer">
                  Quero conhecer o {p.name} <ArrowRight size={18} />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ Contato */
export function ContactSection() {
  return (
    <section className="lp-cta" id="contato">
      <div className="lp-container lp-cta-box ix-contact">
        <div>
          <h2>Fale conosco para soluções personalizadas</h2>
          <p>Conte o seu desafio e a IAX mostra como automatizar e integrar a sua operação.</p>
          <div className="ix-contact-lines">
            <a href={`mailto:${IAX_EMAIL}`}>
              <Mail size={17} /> {IAX_EMAIL}
            </a>
            <a href={waLink('Olá! Quero falar com a IAX.')} target="_blank" rel="noopener noreferrer">
              <Phone size={17} /> {IAX_PHONE}
            </a>
          </div>
        </div>
        <a href={waLink('Olá! Quero falar com a IAX.')} className="lp-btn white" target="_blank" rel="noopener noreferrer">
          <MessageCircle size={18} /> Chamar no WhatsApp
        </a>
      </div>
    </section>
  );
}
