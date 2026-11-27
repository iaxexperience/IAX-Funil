import { createFileRoute } from "@tanstack/react-router";
import { KanbanPage } from "@/features/sales/kanban";
import { meta } from "@/features/sales/model";

export const Route = createFileRoute("/funil")({
  head: () => meta("Funil", "Funil de vendas em Kanban da IAX."),
  component: KanbanPage,
});
