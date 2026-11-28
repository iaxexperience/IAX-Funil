import { useState, type FormEvent } from 'react';
import { Sparkles, Loader2, CalendarPlus, Copy, ArrowRight, TriangleAlert, Check, RefreshCw, LogIn } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useSales, runAction } from './data';
import { Field } from './shared';
import { activityTypes, localInput, stages, type Lead } from './model';
import { meetingKinds, recommendNextStep, type MeetingInput, type Recommendation } from './next-step-ai';

type Meeting = MeetingInput['meeting'];
const temperatures = [
  { id: 'quente', label: 'Quente', hint: 'quer avançar' },
  { id: 'morno', label: 'Morno', hint: 'interessado, com dúvidas' },
  { id: 'frio', label: 'Frio', hint: 'sem urgência' },
] as const;

/** Data sugerida pela IA: hoje + N dias, no horário sugerido (fim de semana vai para segunda). */
function suggestedDate(days: number, hour: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  if (d.getDay() === 6) d.setDate(d.getDate() + 2);
  if (d.getDay() === 0) d.setDate(d.getDate() + 1);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
}

function meetingText(m: Meeting) {
  return [
    m.participants && `Participantes: ${m.participants}`,
    `Temperatura: ${m.temperature}`,
    `O que aconteceu: ${m.summary}`,
    m.objections && `Objeções/dúvidas: ${m.objections}`,
    m.agreements && `Combinado: ${m.agreements}`,
  ]
    .filter(Boolean)
    .join('\n');
}

export function AppointmentAssistant({ lead, open, onClose }: { lead: Lead; open: boolean; onClose: () => void }) {
  const { addActivity, updateLead, user, demo } = useSales();
  const [step, setStep] = useState<'form' | 'result'>('form');
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [rec, setRec] = useState<Recommendation | null>(null);
  const [draft, setDraft] = useState({ title: '', type: 'Follow-up', due: '', message: '' });
  const [done, setDone] = useState({ scheduled: false, staged: false });

  function reset() {
    setStep('form');
    setMeeting(null);
    setRec(null);
    setError('');
    setDone({ scheduled: false, staged: false });
  }
  function close() {
    if (busy) return;
    reset();
    onClose();
  }

  async function ask(m: Meeting) {
    setError('');
    setRec(null);
    if (demo) {
      setError('Entre na sua conta para receber a recomendação da IA. Na demonstração, o compromisso é registrado só neste navegador.');
      return;
    }
    setBusy(true);
    try {
      const res = await recommendNextStep({ data: { leadId: lead.id, meeting: m } });
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setRec(res.recommendation);
      setDraft({
        title: res.recommendation.title,
        type: res.recommendation.type,
        due: localInput(suggestedDate(res.recommendation.due_in_days, res.recommendation.due_hour)),
        message: res.recommendation.whatsapp_message,
      });
    } catch {
      setError('Não foi possível falar com a IA agora. Confira sua conexão e tente de novo.');
    } finally {
      setBusy(false);
    }
  }

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const read = (k: string) => String(f.get(k) ?? '').trim();
    const m: Meeting = {
      when: read('when'),
      kind: read('kind') as Meeting['kind'],
      participants: read('participants'),
      summary: read('summary'),
      objections: read('objections'),
      agreements: read('agreements'),
      temperature: (read('temperature') || 'morno') as Meeting['temperature'],
    };
    if (m.summary.length < 15) {
      setError('Descreva o que aconteceu no compromisso (pelo menos uma frase).');
      return;
    }
    setBusy(true);
    try {
      // 1) O compromisso entra no histórico do lead como atividade concluída.
      await addActivity({
        lead_id: lead.id,
        type: m.kind,
        title: `${m.kind} realizada`,
        due_at: new Date(m.when).toISOString(),
        owner_id: user?.id ?? lead.owner_id,
        status: 'concluída',
        observation: meetingText(m),
      });
      toast.success('Compromisso registrado no histórico do lead');
    } catch {
      setBusy(false);
      setError('Não foi possível salvar o compromisso. Confira sua conexão e tente de novo.');
      return;
    }
    setBusy(false);
    setMeeting(m);
    setStep('result');
    // 2) Pede a recomendação do próximo passo.
    await ask(m);
  }

  async function schedule() {
    if (!draft.title.trim() || !draft.due) return;
    await runAction(async () => {
      await addActivity({
        lead_id: lead.id,
        type: draft.type,
        title: draft.title.trim(),
        due_at: new Date(draft.due).toISOString(),
        owner_id: user?.id ?? lead.owner_id,
        status: 'pendente',
        observation: rec ? `Sugerido pela IA após ${meeting?.kind.toLowerCase() ?? 'compromisso'}: ${rec.rationale}` : '',
      });
      setDone((d) => ({ ...d, scheduled: true }));
    }, 'Próximo passo agendado');
  }

  async function applyStage() {
    if (!rec) return;
    await runAction(async () => {
      await updateLead(lead.id, { stage: rec.suggested_stage });
      setDone((d) => ({ ...d, staged: true }));
    }, `Lead movido para ${stages[rec.suggested_stage]}`);
  }

  function copyMessage() {
    void navigator.clipboard
      .writeText(draft.message)
      .then(() => toast.success('Mensagem copiada'))
      .catch(() => toast.error('Não foi possível copiar.'));
  }

  const stageChanges = rec ? rec.suggested_stage !== lead.stage : false;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && close()}>
      <DialogContent className="max-w-2xl modal-scroll ai-dialog">
        <DialogHeader>
          <DialogTitle className="ai-title">
            <Sparkles size={18} /> {step === 'form' ? 'Registrar compromisso' : 'Próximo passo recomendado'}
          </DialogTitle>
          <DialogDescription>
            {step === 'form'
              ? `${lead.company}: conte como foi e a IA sugere o próximo passo para este lead.`
              : `${lead.company} · com base no compromisso, no histórico e na etapa atual (${stages[lead.stage]}).`}
          </DialogDescription>
        </DialogHeader>

        {step === 'form' ? (
          <form onSubmit={submit} className="ai-form">
            <div className="form-grid">
              <Field label="Data e horário *">
                <input name="when" type="datetime-local" required defaultValue={localInput(new Date().toISOString())} />
              </Field>
              <Field label="Tipo de compromisso *">
                <select name="kind" defaultValue="Reunião">
                  {meetingKinds.map((k) => (
                    <option key={k}>{k}</option>
                  ))}
                </select>
              </Field>
              <Field label="Participantes" className="full">
                <input name="participants" maxLength={300} placeholder="Ex.: Marcos (sócio) e Ana (financeiro)" />
              </Field>
              <Field label="O que aconteceu *" className="full">
                <textarea name="summary" required minLength={15} maxLength={4000} rows={4} placeholder="Principais pontos da conversa, o que o cliente mostrou interesse, decisões tomadas…" />
              </Field>
              <Field label="Objeções ou dúvidas">
                <textarea name="objections" maxLength={2000} rows={3} placeholder="Preço, prazo de implantação, concorrente…" />
              </Field>
              <Field label="O que ficou combinado">
                <textarea name="agreements" maxLength={2000} rows={3} placeholder="Ex.: enviar proposta até sexta; nova reunião com o sócio" />
              </Field>
            </div>
            <fieldset className="ai-temp">
              <legend>Temperatura do lead</legend>
              {temperatures.map((t) => (
                <label key={t.id}>
                  <input type="radio" name="temperature" value={t.id} defaultChecked={t.id === 'morno'} />
                  <span>
                    <b>{t.label}</b>
                    <small>{t.hint}</small>
                  </span>
                </label>
              ))}
            </fieldset>
            {error && <p className="ai-error">{error}</p>}
            <div className="dialog-foot">
              <Button variant="outline" type="button" disabled={busy} onClick={close}>
                Cancelar
              </Button>
              <Button type="submit" disabled={busy}>
                {busy ? <Loader2 size={15} className="au-spin" /> : <Sparkles size={15} />}
                Salvar e recomendar próximo passo
              </Button>
            </div>
          </form>
        ) : (
          <div className="ai-result">
            {busy && (
              <div className="ai-loading">
                <Loader2 size={22} className="au-spin" />
                <p>Analisando o compromisso e o histórico do lead…</p>
              </div>
            )}

            {!busy && error && (
              <div className="ai-error box">
                <TriangleAlert size={18} />
                <div>
                  <p>{error}</p>
                  <div className="ai-error-actions">
                    {demo ? (
                      <Button asChild size="sm">
                        <Link to="/auth">
                          <LogIn size={14} /> Entrar na minha conta
                        </Link>
                      </Button>
                    ) : (
                      meeting && (
                        <Button size="sm" variant="outline" onClick={() => void ask(meeting)}>
                          <RefreshCw size={14} /> Tentar de novo
                        </Button>
                      )
                    )}
                  </div>
                </div>
              </div>
            )}

            {!busy && rec && (
              <>
                <section className="ai-card main">
                  <div className="ai-card-head">
                    <span className="ai-badge">Próximo passo</span>
                    <span className={`ai-conf ${rec.confidence === 'alta' ? 'high' : rec.confidence === 'baixa' ? 'low' : ''}`}>Confiança {rec.confidence}</span>
                  </div>
                  <Field label="O que fazer">
                    <input value={draft.title} maxLength={200} onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))} />
                  </Field>
                  <div className="form-grid">
                    <Field label="Tipo">
                      <select value={draft.type} onChange={(e) => setDraft((d) => ({ ...d, type: e.target.value }))}>
                        {activityTypes.map((t) => (
                          <option key={t}>{t}</option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Quando">
                      <input type="datetime-local" value={draft.due} onChange={(e) => setDraft((d) => ({ ...d, due: e.target.value }))} />
                    </Field>
                  </div>
                  <p className="ai-why">
                    <b>Por quê:</b> {rec.rationale}
                  </p>
                  <Button onClick={() => void schedule()} disabled={done.scheduled || !draft.title.trim() || !draft.due}>
                    {done.scheduled ? <Check size={15} /> : <CalendarPlus size={15} />}
                    {done.scheduled ? 'Agendado na agenda' : 'Agendar este próximo passo'}
                  </Button>
                </section>

                <section className="ai-card">
                  <div className="ai-card-head">
                    <span className="ai-badge soft">Etapa do funil</span>
                  </div>
                  {stageChanges ? (
                    <>
                      <p className="ai-stage">
                        {stages[lead.stage]} <ArrowRight size={15} /> <b>{stages[rec.suggested_stage]}</b>
                      </p>
                      {rec.stage_reason && <p className="ai-muted">{rec.stage_reason}</p>}
                      <Button variant="outline" size="sm" onClick={() => void applyStage()} disabled={done.staged}>
                        {done.staged ? <Check size={14} /> : <ArrowRight size={14} />}
                        {done.staged ? 'Etapa atualizada' : `Mover para ${stages[rec.suggested_stage]}`}
                      </Button>
                    </>
                  ) : (
                    <p className="ai-muted">
                      Manter em <b>{stages[lead.stage]}</b>. {rec.stage_reason}
                    </p>
                  )}
                </section>

                <section className="ai-card">
                  <div className="ai-card-head">
                    <span className="ai-badge soft">Mensagem para o WhatsApp</span>
                    <Button variant="ghost" size="sm" onClick={copyMessage}>
                      <Copy size={14} /> Copiar
                    </Button>
                  </div>
                  <textarea className="ai-msg" rows={4} value={draft.message} onChange={(e) => setDraft((d) => ({ ...d, message: e.target.value }))} />
                </section>

                {rec.risks.length > 0 && (
                  <section className="ai-card risks">
                    <div className="ai-card-head">
                      <span className="ai-badge warn">Pontos de atenção</span>
                    </div>
                    <ul>
                      {rec.risks.map((r) => (
                        <li key={r}>{r}</li>
                      ))}
                    </ul>
                  </section>
                )}

                <p className="ai-note">Sugestão gerada por IA. Revise antes de agendar ou enviar a mensagem.</p>
              </>
            )}

            <div className="dialog-foot">
              {!busy && rec && meeting && (
                <Button variant="ghost" onClick={() => void ask(meeting)}>
                  <RefreshCw size={14} /> Gerar outra sugestão
                </Button>
              )}
              <Button variant="outline" onClick={close} disabled={busy}>
                Fechar
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
