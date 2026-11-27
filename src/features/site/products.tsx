import { useState, type ReactNode } from 'react';
import {
  ArrowRight,
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
  Star,
  Clock,
  Sparkles,
} from 'lucide-react';

/* ------------------------------------------------------------------ Mídias
   Para trocar o fundo do topo pela imagem ou vídeo do iax.info, coloque o arquivo em
   public/media/ e preencha UM dos caminhos abaixo (ex.: '/media/hero.mp4'). */
const HERO_VIDEO = '';
const HERO_IMAGE = '';

export const IAX_EMAIL = 'comercial@iax.info';
export const IAX_PHONE = '+55 83 99658-3281';
const IAX_WHATSAPP = '5583996583281';
export const waLink = (msg: string) => `https://wa.me/${IAX_WHATSAPP}?text=${encodeURIComponent(msg)}`;

/* ---------------------------------------------------------------- Produtos
   Os vídeos de cada sistema entram em `video` (ex.: '/videos/findflow.mp4' em public/videos/)
   e, se quiser, uma imagem de capa em `poster`. Enquanto `video` estiver vazio, aparece "Vídeo em breve". */
type Product = {
  slug: string;
  name: string;
  tag: string;
  icon: ReactNode;
  hue: number;
  text: string;
  points: string[];
  video: string;
  poster: string;
};

const products: Product[] = [
  {
    slug: 'iax-guardian',
    name: 'IAX Guardian',
    tag: 'Segurança',
    icon: <ShieldCheck size={26} />,
    hue: 200,
    text: 'Proteção e monitoramento para os sistemas e os dados da sua empresa, com alertas para agir antes que um problema vire prejuízo.',
    points: ['Monitoramento contínuo', 'Alertas em tempo real', 'Dados protegidos'],
    video: '',
    poster: '',
  },
  {
    slug: 'findflow',
    name: 'FindFlow',
    tag: 'ERP para fábricas químicas',
    icon: <Factory size={26} />,
    hue: 255,
    text: 'Da fórmula à nota fiscal, do balcão ao WhatsApp: produção, estoque, fiscal, vendas e atendimento num lugar só.',
    points: ['Fórmulas, lotes e produção', 'NF-e, NFC-e e IBS/CBS', 'PDV, financeiro e WhatsApp'],
    video: '',
    poster: '',
  },
  {
    slug: 'pulse-doacoes',
    name: 'Pulse Doações',
    tag: 'Gestão de doações',
    icon: <HeartHandshake size={26} />,
    hue: 345,
    text: 'Organize doadores, campanhas e contribuições em um só lugar e acompanhe a arrecadação da sua instituição.',
    points: ['Cadastro de doadores', 'Campanhas de arrecadação', 'Relatórios de contribuições'],
    video: '',
    poster: '',
  },
  {
    slug: 'pulse-pep-clinic',
    name: 'Pulse PEP Clinic',
    tag: 'Prontuário eletrônico',
    icon: <Stethoscope size={26} />,
    hue: 170,
    text: 'Prontuário eletrônico do paciente, agenda e atendimento da clínica integrados em um sistema seguro e fácil de usar.',
    points: ['Prontuário eletrônico (PEP)', 'Agenda da clínica', 'Histórico do paciente'],
    video: '',
    poster: '',
  },
  {
    slug: 'pulse-eleitoral',
    name: 'Pulse Eleitoral',
    tag: 'Gestão de campanhas',
    icon: <Vote size={26} />,
    hue: 290,
    text: 'Organize apoiadores, equipes e a comunicação da campanha com informações sempre atualizadas para decidir rápido.',
    points: ['Base de apoiadores', 'Equipes e lideranças', 'Comunicação pelo WhatsApp'],
    video: '',
    poster: '',
  },
];

/* --------------------------------------------------------------------- Hero */
export function IaxHero() {
  return (
    <section className="ix-hero">
      {HERO_VIDEO ? (
        <video className="ix-hero-media" src={HERO_VIDEO} autoPlay muted loop playsInline preload="metadata" aria-hidden="true" />
      ) : HERO_IMAGE ? (
        <img className="ix-hero-media" src={HERO_IMAGE} alt="" aria-hidden="true" />
      ) : (
        <div className="ix-hero-art" aria-hidden="true">
          <i className="o1" />
          <i className="o2" />
          <i className="o3" />
        </div>
      )}
      <div className="ix-hero-inner">
        <h1>Automações inteligentes, levamos sua empresa para o futuro.</h1>
        <img className="ix-hero-logo" src="/img/iax-logo-3d-dark.png" alt="IAX" width={415} height={212} />
        <p className="ix-hero-tagline">Inteligência Artificial Experience</p>
        <p className="ix-hero-sub">Integre APIs, CRMs e redes sociais com tecnologia de ponta</p>
        <div className="ix-stars" aria-label="Avaliação 5 estrelas">
          {Array.from({ length: 5 }, (_, i) => (
            <Star key={i} size={18} fill="currentColor" />
          ))}
          <span>Avaliação 5 estrelas</span>
        </div>
        <div className="ix-hero-ctas">
          <a href="#sistemas" className="lp-btn primary">
            Conheça nossos sistemas <ArrowRight size={18} />
          </a>
          <a href={waLink('Olá! Quero falar com a IAX sobre automação e sistemas.')} className="lp-btn ghost-light" target="_blank" rel="noopener noreferrer">
            <MessageCircle size={17} /> Fale com a IAX
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
