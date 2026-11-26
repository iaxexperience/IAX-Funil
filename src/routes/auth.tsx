import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Brand, Field } from "@/features/sales/shared";
import { meta } from "@/features/sales/model";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/auth")({
  head: () => meta("Entrar", "Acesso à central comercial FindFlow Sales."),
  component: AuthRoute,
});

const AUTH_MESSAGES: Record<string, string> = {
  "invalid login credentials": "E-mail ou senha incorretos.",
  "email not confirmed": "Confirme seu e-mail antes de entrar. Abra a mensagem que enviamos.",
  "user already registered": "Esse e-mail já tem conta. Entre ou recupere a senha.",
  "email could not be validated": "Digite um e-mail válido.",
  "unable to validate email address": "Digite um e-mail válido.",
  "password should be at least": "A senha precisa ter pelo menos 8 caracteres.",
  "for security purposes": "Aguarde alguns minutos antes de tentar de novo.",
  "rate limit": "Muitas tentativas seguidas. Aguarde um pouco e tente de novo.",
};

function authMessage(err: unknown): string {
  const raw = (err instanceof Error ? err.message : String(err ?? "")).toLowerCase();
  for (const key of Object.keys(AUTH_MESSAGES)) if (raw.includes(key)) return AUTH_MESSAGES[key]!;
  return "Não foi possível concluir. Confira o e-mail e a senha e tente de novo.";
}

function AuthRoute() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"entrar" | "criar">("entrar");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setNotice("");
    try {
      if (mode === "entrar") {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;
        await navigate({ to: "/", search: {} });
      } else {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { name: name.trim() || "Comercial" } },
        });
        if (signUpError) throw signUpError;
        if (data.session) await navigate({ to: "/", search: {} });
        else setNotice(`Enviamos um link de confirmação para ${email}. Abra o e-mail e clique no link para entrar.`);
      }
    } catch (err) {
      setError(authMessage(err));
    } finally {
      setBusy(false);
    }
  }

  function switchMode() {
    setMode((current) => (current === "entrar" ? "criar" : "entrar"));
    setError("");
    setNotice("");
  }

  return (
    <div className="auth-page">
      <div className="auth-form">
        <Brand />
        <h1>{mode === "entrar" ? "Entrar" : "Criar conta"}</h1>
        <p>
          {mode === "entrar"
            ? "Acesse a central comercial com o e-mail e a senha do seu time."
            : "A conta entra com perfil comercial. O administrador ajusta as permissões depois."}
        </p>
        {error && <p className="auth-error">{error}</p>}
        {notice && <p className="auth-notice">{notice}</p>}
        <form onSubmit={submit}>
          {mode === "criar" && (
            <Field label="Nome">
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Como você aparece no time" autoComplete="name" />
            </Field>
          )}
          <Field label="E-mail">
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="voce@empresa.com" autoComplete="email" />
          </Field>
          <Field label="Senha">
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo de 8 caracteres"
              autoComplete={mode === "entrar" ? "current-password" : "new-password"}
            />
          </Field>
          <Button type="submit" className="w-full" disabled={busy}>
            {busy ? "Aguarde…" : mode === "entrar" ? "Entrar" : "Criar conta"}
          </Button>
        </form>
        <Button variant="ghost" onClick={switchMode}>
          {mode === "entrar" ? "Não tem conta? Criar" : "Já tem conta? Entrar"}
        </Button>
        <Link to="/" search={{}} className="auth-link">
          Voltar para a demonstração
        </Link>
      </div>
    </div>
  );
}
