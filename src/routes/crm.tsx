import { createFileRoute } from "@tanstack/react-router";
import { CrmPage } from "@/features/sales/crm";
import { meta } from "@/features/sales/model";

export const Route = createFileRoute("/crm")({
  head: () => meta("CRM", "Gestão de leads e qualificação do IAX SAC."),
  component: CrmPage,
});
