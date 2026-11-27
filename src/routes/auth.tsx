import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { ArrowLeft, Mail, Lock, Eye, EyeOff, User, Check, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Brand } from "@/features/sales/shared";
import { meta } from "@/features/sales/model";

export const Route = createFileRoute("/auth")({
  head: () => meta("Entrar", "Acesso à central comercial IAX."),
  component: AuthRoute,
});

const VIDEO_OFFICE = "https://assets.mixkit.co/videos/42664/42664-720.mp4";
const VIDEO_OFFICE_POSTER = "https://assets.mixkit.co/videos/42664/42664-thumb-720-0.jpg";

const AUTH_MESSAGES: Record<string, string> = {
  "invalid login credentials": "E-mail ou senha incorretos.",
  "email not confirmed": "Confirme seu e-mail antes de entrar. Abra a mensagem que enviamos.",
  "user already registered": "Esse e-mail já tem conta. Entre ou recupere a senha.",
  "email could not be validated": "Digite um e-mail válido.",
  "unable to validate email address": "Digite um e-mail válido.",
  "password should be at least": "A senha precisa ter pelo menos 8 caracteres.",
  "new password should be different": "A nova senha precisa ser diferente da anterior.",
  "for security purposes": "Aguarde alguns minutos antes de tentar de novo.",
  "rate limit": "Muitas tentativas seguidas. Aguarde um pouco e tente de novo.",
};

function authMessage(err: unknown): string {
  const raw = (err instanceof Error ? err.message : String(err ?? "")).toLowerCase();
  for (const key of Object.keys(AUTH_MESSAGES)) if (raw.includes(key)) return AUTH_MESSAGES[key]!;
  return "Não foi possível concluir. Confira o e-mail e a senha e tente de novo.";
}

type Mode = "entrar" | "criar" | "recuperar" | "nova-senha";

const TITLES: Record<Mode, string> = {
  entrar: "Acesse sua conta",
  criar: "Crie sua conta",
  recuperar: "Recuperar senha",
  "nova-senha": "Defina uma nova senha",
};

/** Consulta se o login com Google está ativado no backend, para só mostrar o botão quando funcionar. */
async function googleEnabled(): Promise<boolean> {
  const url = import.meta.env["VITE_SUPABASE_URL"] as string | undefined;
  const key = import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"] as string | undefined;
  if (!url || !key) return false;
  try {
    const res = await fetch(`${url.replace(/\/+$/, "")}/auth/v1/settings`, { headers: { apikey: key } });
    if (!res.ok) return false;
    const settings = (await res.json()) as { external?: { google?: boolean } };
    return settings.external?.google === true;
  } catch {
    return false;
  }
}

function InputIcon({ icon, children, action }: { icon: ReactNode; children: ReactNode; action?: ReactNode }) {
  return (
    <div className="au-input">
      <span className="au-input-icon">{icon}</span>
      {children}
      {action}
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path fill="#4285F4" d="M23.5 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.45a5.52 5.52 0 0 1-2.39 3.62v3h3.87c2.26-2.08 3.57-5.15 3.57-8.81Z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.95-2.92l-3.87-3c-1.08.72-2.45 1.15-4.08 1.15-3.13 0-5.79-2.12-6.74-4.96H1.27v3.1A12 12 0 0 0 12 24Z" />
      <path fill="#FBBC05" d="M5.26 14.27a7.2 7.2 0 0 1 0-4.54v-3.1H1.27a12 12 0 0 0 0 10.74l3.99-3.1Z" />
      <path fill="#EA4335" d="M12 4.77c1.76 0 3.35.61 4.6 1.8l3.43-3.43A11.5 11.5 0 0 0 12 0 12 12 0 0 0 1.27 6.63l3.99 3.1C6.21 6.89 8.87 4.77 12 4.77Z" />
    </svg>
  );
}

function AuthRoute() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("entrar");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [google, setGoogle] = useState(false);

  useEffect(() => {
    let active = true;
    void googleEnabled().then((on) => active && setGoogle(on));
    // Quem chega pelo link de "esqueci minha senha" volta para cá com uma sessão de recuperação.
    if (window.location.hash.includes("type=recovery")) setMode("nova-senha");
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setMode("nova-senha");
    });
    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, []);

  function go(next: Mode) {
    setMode(next);
    setError("");
    setNotice("");
    setPassword("");
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setNotice("");
    try {
      if (mode === "entrar") {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;
        await navigate({ to: "/inbox", search: {} });
      } else if (mode === "criar") {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { name: name.trim() || "Comercial" }, emailRedirectTo: `${window.location.origin}/inbox` },
        });
        if (signUpError) throw signUpError;
        if (data.session) await navigate({ to: "/inbox", search: {} });
        else setNotice(`Enviamos um link de confirmação para ${email}. Abra o e-mail e clique no link para entrar.`);
      } else if (mode === "recuperar") {
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/auth` });
        if (resetError) throw resetError;
        setNotice(`Se ${email} tiver conta, você vai receber um link para criar uma nova senha.`);
      } else {
        const { error: updateError } = await supabase.auth.updateUser({ password });
        if (updateError) throw updateError;
        await navigate({ to: "/inbox", search: {} });
      }
    } catch (err) {
      setError(authMessage(err));
    } finally {
      setBusy(false);
    }
  }

  async function signInWithGoogle() {
    setError("");
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/inbox` },
    });
    if (oauthError) setError(authMessage(oauthError));
  }

  const needsPassword = mode !== "recuperar";
  const needsEmail = mode !== "nova-senha";
  const submitLabel = mode === "entrar" ? "Entrar" : mode === "criar" ? "Criar conta" : mode === "recuperar" ? "Enviar link de recuperação" : "Salvar nova senha";

  return (
    <div className="au-page">
      <Link to="/" className="au-back">
        <ArrowLeft size={15} />
        Voltar para o site
      </Link>

      <main className="au-card">
        <section className="au-form-side">
          <Link to="/" className="au-brand" aria-label="IAX: ir para o site">
            <Brand />
          </Link>
          <h1>{TITLES[mode]}</h1>
          {mode === "criar" && <p className="au-sub">A conta entra com perfil comercial. O administrador ajusta as permissões depois.</p>}
          {mode === "recuperar" && <p className="au-sub">Digite o e-mail da sua conta e enviaremos um link para você criar uma nova senha.</p>}

          {error && (
            <p className="au-alert error" role="alert">
              {error}
            </p>
          )}
          {notice && (
            <p className="au-alert" role="status">
              {notice}
            </p>
          )}

          <form onSubmit={submit} className="au-form">
            {mode === "criar" && (
              <label className="au-field">
                <span>Nome</span>
                <InputIcon icon={<User size={18} />}>
                  <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Como você aparece no time" autoComplete="name" />
                </InputIcon>
              </label>
            )}
            {needsEmail && (
              <label className="au-field">
                <span>E-mail</span>
                <InputIcon icon={<Mail size={18} />}>
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@empresa.com" autoComplete="email" />
                </InputIcon>
              </label>
            )}
            {needsPassword && (
              <label className="au-field">
                <span>{mode === "nova-senha" ? "Nova senha" : "Senha"}</span>
                <InputIcon
                  icon={<Lock size={18} />}
                  action={
                    <button
                      type="button"
                      className="au-eye"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                      title={showPassword ? "Ocultar senha" : "Mostrar senha"}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  }
                >
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={mode === "entrar" ? "Sua senha" : "Mínimo de 8 caracteres"}
                    autoComplete={mode === "entrar" ? "current-password" : "new-password"}
                  />
                </InputIcon>
              </label>
            )}
            <button type="submit" className="au-submit" disabled={busy}>
              {busy && <Loader2 size={18} className="au-spin" />}
              {busy ? "Aguarde…" : submitLabel}
            </button>
          </form>

          {mode === "entrar" && (
            <button type="button" className="au-link" onClick={() => go("recuperar")}>
              Esqueceu sua senha?
            </button>
          )}
          {(mode === "recuperar" || mode === "nova-senha") && (
            <button type="button" className="au-link" onClick={() => go("entrar")}>
              Voltar para o login
            </button>
          )}

          {google && (mode === "entrar" || mode === "criar") && (
            <>
              <div className="au-divider">
                <span>ou</span>
              </div>
              <button type="button" className="au-google" onClick={() => void signInWithGoogle()}>
                <GoogleIcon />
                Continuar com Google
              </button>
            </>
          )}

          {mode === "entrar" && (
            <p className="au-switch">
              Não tem conta?{" "}
              <button type="button" onClick={() => go("criar")}>
                Criar conta
              </button>
            </p>
          )}
          {mode === "criar" && (
            <p className="au-switch">
              Já tem conta?{" "}
              <button type="button" onClick={() => go("entrar")}>
                Entrar
              </button>
            </p>
          )}
          <Link to="/inbox" search={{}} className="au-demo">
            Ver a demonstração sem entrar
          </Link>
        </section>

        <aside className="au-visual" aria-hidden="true">
          <video src={VIDEO_OFFICE} poster={VIDEO_OFFICE_POSTER} autoPlay muted loop playsInline preload="metadata" />
          <div className="au-visual-copy">
            <span className="au-kicker">Atendimento e vendas com IA</span>
            <h2>Que bom ter você aqui!</h2>
            <p>Do primeiro “olá” ao contrato assinado: WhatsApp, Instagram, funil de vendas e agenda num lugar só.</p>
            <ul>
              <li>
                <Check size={14} />
                Conversas de WhatsApp e Instagram
              </li>
              <li>
                <Check size={14} />
                Funil de vendas, agenda e follow-ups
              </li>
              <li>
                <Check size={14} />
                Assistente Leo com inteligência artificial
              </li>
            </ul>
          </div>
        </aside>
      </main>

      <footer className="au-footer">
        IAX © {new Date().getFullYear()} · Produzido por IAX Inteligência Artificial Experience LTDA. Todos os direitos reservados.
      </footer>
    </div>
  );
}
