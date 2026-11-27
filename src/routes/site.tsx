import { createFileRoute, redirect } from "@tanstack/react-router";

// Endereço antigo da landing page: agora ela é a página inicial.
export const Route = createFileRoute("/site")({
  beforeLoad: () => {
    throw redirect({ to: "/", replace: true });
  },
});
