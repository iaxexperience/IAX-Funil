import { createFileRoute } from "@tanstack/react-router";
import { AgendaPage } from "@/features/sales/agenda";
import { meta } from "@/features/sales/model";

export const Route = createFileRoute("/agenda")({
  head: () => meta("Agenda", "Agenda comercial da IAX: ligações, reuniões e follow-ups."),
  component: AgendaPage,
});
