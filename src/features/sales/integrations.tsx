import { useState, type ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MessageCircle, Instagram, RefreshCw, Check, Copy, ExternalLink, CircleDashed, ShieldCheck, Mail, Globe, KeyRound, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useSales } from './data';
import { Shell } from './shared';
import { LeadForm } from './forms';
import { CHANNEL_SECRETS, getChannelStatus } from './channel-status';

type ChannelId = keyof typeof CHANNEL_SECRETS;

const channels: {
  id: ChannelId;
  name: string;
  product: string;
  icon: ReactNode;
  description: string;
  steps: { title: string; text: string }[];
  docs: string;
}[] = [
  {
    id: 'whatsapp',
    name: 'WhatsApp Business',
    product: 'API oficial da Meta (WhatsApp Cloud API)',
    icon: <MessageCircle size={26} />,
    description: 'Receba e responda as mensagens do WhatsApp da empresa direto na tela de Conversas, com todo o histórico ligado ao lead.',
    steps: [
      { title: 'Crie um app na Meta', text: 'Em Meta for Developers, crie um app do tipo “Empresa” e adicione o produto WhatsApp.' },
      { title: 'Cadastre o número da empresa', text: 'Em WhatsApp → Configuração da API, adicione e verifique o número que vai atender os clientes.' },
      { title: 'Gere um token permanente', text: 'No Gerenciador de Negócios, crie um usuário do sistema com permissão whatsapp_business_messaging e gere o token.' },
      { title: 'Salve os segredos no Lovable', text: 'Em Cloud → Secrets, cadastre os três segredos abaixo. Depois clique em “Verificar conexão”.' },
    ],
    docs: 'https://developers.facebook.com/docs/whatsapp/cloud-api/get-started',
  },
  {
    id: 'instagram',
    name: 'Instagram Direct',
    product: 'API de mensagens do Instagram (Meta)',
    icon: <Instagram size={26} />,
    description: 'Centralize as mensagens do Direct do Instagram profissional da empresa junto com o WhatsApp.',
    steps: [
      { title: 'Use uma conta profissional', text: 'A conta do Instagram precisa ser Comercial ou Criador de conteúdo e estar ligada a uma Página do Facebook.' },
      { title: 'Adicione o Instagram ao app da Meta', text: 'No mesmo app da Meta, adicione o produto Instagram e conecte a conta da empresa.' },
      { title: 'Gere o token de acesso', text: 'Gere um token com as permissões instagram_basic e instagram_manage_messages.' },
      { title: 'Salve os segredos no Lovable', text: 'Em Cloud → Secrets, cadastre os dois segredos abaixo. Depois clique em “Verificar conexão”.' },
    ],
    docs: 'https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/messaging-api',
  },
];

function copy(text: string) {
  void navigator.clipboard
    .writeText(text)
    .then(() => toast.success(`${text} copiado`))
    .catch(() => toast.error('Não foi possível copiar.'));
}

export function IntegrationsPage() {
  const { leads, messages } = useSales();
  const [newLead, setNewLead] = useState(false);
  const status = useQuery({ queryKey: ['channel-status'], queryFn: () => getChannelStatus(), staleTime: 30_000 });

  return (
    <Shell area="Integrações" onNew={() => setNewLead(true)}>
      <div className="ig-page">
        <div className="ig-grid">
          {channels.map((c) => {
            const secrets = status.data?.[c.id] ?? {};
            const done = CHANNEL_SECRETS[c.id].filter((n) => secrets[n]).length;
            const total = CHANNEL_SECRETS[c.id].length;
            const state = status.isLoading ? 'loading' : done === total ? 'on' : done > 0 ? 'partial' : 'off';
            const channelLeads = leads.filter((l) => l.channel === (c.id === 'whatsapp' ? 'WhatsApp' : 'Instagram'));
            const ids = new Set(channelLeads.map((l) => l.id));
            const msgCount = messages.filter((m) => ids.has(m.lead_id)).length;
            return (
              <article className={`ig-card ${c.id}`} key={c.id}>
                <header className="ig-card-head">
                  <span className="ig-logo">{c.icon}</span>
                  <div>
                    <h2>{c.name}</h2>
                    <small>{c.product}</small>
                  </div>
                  <span className={`ig-status ${state}`}>
                    {state === 'loading' ? (
                      <>
                        <Loader2 size={13} className="au-spin" /> Verificando…
                      </>
                    ) : state === 'on' ? (
                      <>
                        <Check size={13} /> Credenciais salvas
                      </>
                    ) : state === 'partial' ? (
                      <>
                        <CircleDashed size={13} /> Configuração incompleta
                      </>
                    ) : (
                      <>
                        <CircleDashed size={13} /> Não conectado
                      </>
                    )}
                  </span>
                </header>
                <p className="ig-desc">{c.description}</p>
                <div className="ig-metrics">
                  <div>
                    <strong>{channelLeads.length}</strong>
                    <small>leads deste canal</small>
                  </div>
                  <div>
                    <strong>{msgCount}</strong>
                    <small>mensagens no histórico</small>
                  </div>
                  <div>
                    <strong>
                      {done}/{total}
                    </strong>
                    <small>segredos configurados</small>
                  </div>
                </div>
                <ol className="ig-steps">
                  {c.steps.map((s, i) => (
                    <li key={s.title} className={i === c.steps.length - 1 && state === 'on' ? 'done' : ''}>
                      <span>{i === c.steps.length - 1 && state === 'on' ? <Check size={13} /> : i + 1}</span>
                      <div>
                        <b>{s.title}</b>
                        <p>{s.text}</p>
                      </div>
                    </li>
                  ))}
                </ol>
                <div className="ig-secrets">
                  <div className="ig-secrets-title">
                    <KeyRound size={14} /> Segredos no Lovable (Cloud → Secrets)
                  </div>
                  {CHANNEL_SECRETS[c.id].map((n) => (
                    <div className="ig-secret" key={n}>
                      <code>{n}</code>
                      <span className={secrets[n] ? 'ok' : ''}>{secrets[n] ? 'salvo' : 'pendente'}</span>
                      <button type="button" title={`Copiar ${n}`} onClick={() => copy(n)}>
                        <Copy size={13} />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="ig-actions">
                  <button type="button" className="crm-btn navy" onClick={() => void status.refetch()} disabled={status.isFetching}>
                    <RefreshCw size={14} className={status.isFetching ? 'au-spin' : ''} /> Verificar conexão
                  </button>
                  <a className="crm-btn ghost" href={c.docs} target="_blank" rel="noopener noreferrer">
                    <ExternalLink size={13} /> Guia da Meta
                  </a>
                </div>
                {state === 'on' && (
                  <p className="ig-note">
                    Credenciais prontas. O recebimento e o envio automático das mensagens são ativados na próxima etapa, junto com o webhook da Meta.
                  </p>
                )}
                {status.isError && <p className="ig-note warn">Não foi possível verificar agora. Tente de novo em instantes.</p>}
              </article>
            );
          })}
        </div>

        <div className="ig-safe">
          <ShieldCheck size={18} />
          <p>
            <b>Suas chaves ficam protegidas.</b> Os tokens da Meta são guardados só no servidor, como segredos do Lovable. Esta tela nunca mostra os valores,
            apenas se cada um já foi cadastrado.
          </p>
        </div>

        <h3 className="ig-soon-title">Próximos canais</h3>
        <div className="ig-soon">
          {[
            { icon: <Mail size={20} />, name: 'E-mail', text: 'Responda e-mails dos clientes na mesma caixa de entrada.' },
            { icon: <Globe size={20} />, name: 'Chat do site', text: 'Um botão de conversa no seu site, atendido pelo Alex e pela equipe.' },
          ].map((s) => (
            <div className="ig-soon-card" key={s.name}>
              <span>{s.icon}</span>
              <div>
                <b>{s.name}</b>
                <p>{s.text}</p>
              </div>
              <em>Em breve</em>
            </div>
          ))}
        </div>
      </div>
      {newLead && <LeadForm open onClose={() => setNewLead(false)} />}
    </Shell>
  );
}
