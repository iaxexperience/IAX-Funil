import { createFileRoute } from "@tanstack/react-router";
import { IntegrationsPage } from "@/features/sales/integrations";
import { meta } from "@/features/sales/model";

export const Route = createFileRoute("/integracoes")({
  head: () => meta("Integrações", "Conecte WhatsApp e Instagram à IAX."),
  component: IntegrationsPage,
});
