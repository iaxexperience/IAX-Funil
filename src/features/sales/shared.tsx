import { Link } from '@tanstack/react-router';
import { MessagesSquare, Columns3, CalendarDays, ShieldCheck, LogOut, LogIn, Plus, MessageCircle, Instagram, Bell, CircleHelp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSales } from './data';
import { supabase } from '@/integrations/supabase/client';
import { initials, stages, icpScore, icpLabel } from './model';
import type { ReactNode } from 'react';

export function Brand({ light = false }: { light?: boolean }) {
  return (
    <div className={`brand ${light ? 'light' : ''}`}>
      <span className="brand-logo" role="img" aria-label="IAX" />
      <span className="brand-sac">SAC</span>
    </div>
  );
}

export function Avatar({ name, small = false, alt = false, square = false }: { name: string; small?: boolean; alt?: boolean; square?: boolean }) {
  return <div className={`avatar ${small ? 'small' : ''} ${alt ? 'alt' : ''} ${square ? 'square' : ''}`}>{initials(name)}</div>;
}

export function Channel({ channel }: { channel: string }) {
  return channel === 'Instagram' ? <Instagram className="channel-icon instagram" /> : <MessageCircle className="channel-icon" />;
}

export function StageTag({ stage }: { stage: number }) {
  return <span className={`stage-tag ${stage === 7 ? 'success' : ''}`}>{stages[stage]}</span>;
}

export function Icp({ criteria }: { criteria: unknown }) {
  const score = icpScore(criteria);
  return (
    <>
      <div className="icp-line">
        <span className={`icp-label ${score < 70 ? 'low' : ''}`}>
          <ShieldCheck size={12} />
          {icpLabel(score)}
        </span>
        <span className="text-muted-foreground">
          ICP <strong className="text-foreground">{score}</strong> / 100
        </span>
      </div>
      <div className="icp-bar">
        {Array.from({ length: 5 }, (_, i) => (
          <span key={i} className={i < score / 20 ? 'filled' : ''} />
        ))}
      </div>
    </>
  );
}

type Area = 'Inbox' | 'Funil' | 'Agenda';

export function Shell({ area, children, onNew }: { area: Area; children: ReactNode; onNew: () => void }) {
  const { user, demo, leads, profiles, admin } = useSales();
  const profile = profiles.find((p) => p.id === user?.id);
  const name = profile?.name ?? 'Camila Andrade';
  const unread = leads.reduce((sum, l) => sum + l.unread, 0);
  const pending = leads.filter((l) => l.next_at && new Date(l.next_at).getTime() < Date.now()).length;
  const subtitle = area === 'Funil' ? 'Cada oportunidade, no lugar certo.' : 'Seu próximo passo começa aqui.';

  return (
    <div className="app-shell">
      <header className="topbar">
        <Link to="/inbox" search={{}} className="topbar-brand" aria-label="Ir para a Inbox">
          <Brand light />
        </Link>
        <nav className="topbar-nav" aria-label="Menu principal">
          <Link to="/inbox" search={{}} className={`top-link ${area === 'Inbox' ? 'active' : ''}`} title="Conversas">
            <MessagesSquare size={19} />
            <span className="top-text">Conversas</span>
            {unread > 0 && <span className="top-badge">{unread}</span>}
          </Link>
          <Link to="/funil" className={`top-link ${area === 'Funil' ? 'active' : ''}`} title="Funil de vendas">
            <Columns3 size={19} />
            <span className="top-text">Funil</span>
          </Link>
          <Link to="/agenda" className={`top-link ${area === 'Agenda' ? 'active' : ''}`} title="Agenda">
            <CalendarDays size={19} />
            <span className="top-text">Agenda</span>
          </Link>
        </nav>
        <div className="topbar-right">
          {demo && (
            <Link to="/auth" className="demo-pill">
              Demonstração
            </Link>
          )}
          <Button size="sm" className="topbar-new" onClick={onNew}>
            <Plus size={15} />
            <span className="top-text">{area === 'Agenda' ? 'Nova atividade' : 'Novo lead'}</span>
          </Button>
          <button type="button" className="top-icon" title="Ajuda">
            <CircleHelp size={19} />
          </button>
          <Link to="/agenda" className="top-icon" title="Ações atrasadas">
            <Bell size={19} />
            {pending > 0 && <span className="top-badge">{pending}</span>}
          </Link>
          <div className="topbar-profile" title={`${name} · ${demo ? 'Demonstração' : admin ? 'Administrador' : 'Comercial'}`}>
            <Avatar name={name} small />
            <span className="online-dot" />
          </div>
          {demo ? (
            <Link to="/auth" className="top-icon" title="Entrar na sua conta">
              <LogIn size={18} />
            </Link>
          ) : (
            <button type="button" className="top-icon" title="Sair da conta" onClick={() => supabase.auth.signOut()}>
              <LogOut size={18} />
            </button>
          )}
        </div>
      </header>
      <main className="workspace">
        {area !== 'Inbox' && (
          <div className="page-header">
            <div>
              <h1>{area}</h1>
              <p>{subtitle}</p>
            </div>
            <span className="page-date">{new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })}</span>
          </div>
        )}
        {children}
      </main>
    </div>
  );
}

export function Field({ label, children, className = '' }: { label: string; children: ReactNode; className?: string }) {
  return (
    <label className={`field ${className}`}>
      <span>{label}</span>
      {children}
    </label>
  );
}
