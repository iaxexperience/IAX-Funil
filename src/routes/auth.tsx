import { createFileRoute, Link } from "@tanstack/react-router";
import { Brand } from "@/features/sales/shared";
import { meta } from "@/features/sales/model";

export const Route = createFileRoute("/auth")({
  head: () => meta("Entrar", "Acesso à central comercial FindFlow Sales."),
  component: AuthRoute,
});

function AuthRoute() {
  return (
    <div className="auth-page">
      <div className="auth-form">
        <Brand />
        <h1>Entrar</h1>
        <p>A tela de login por e-mail e senha será concluída quando houver créditos disponíveis.</p>
        <Link to="/" search={{ lead: undefined }} className="auth-link">
          Voltar para a demonstração
        </Link>
      </div>
    </div>
  );
}