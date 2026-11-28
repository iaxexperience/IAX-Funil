import { createFileRoute } from "@tanstack/react-router";
import { AgendaPage } from "@/features/sales/agenda";
import type { AgendaSearch } from "@/features/sales/agenda-model";
import { meta } from "@/features/sales/model";

const searchKeys = ["date", "view", "status", "owner", "type", "q"] as const;

export const Route = createFileRoute("/agenda")({
  // Data, visão e filtros da agenda ficam na URL, para links compartilhados abrirem a mesma visão.
  validateSearch: (search: Record<string, unknown>): AgendaSearch => {
    const out: AgendaSearch = {};
    for (const key of searchKeys) {
      const value = search[key];
      if (typeof value === "string" && value) out[key] = value.slice(0, 120);
    }
    return out;
  },
  head: () => meta("Agenda", "Agenda comercial da IAX: ligações, reuniões e follow-ups."),
  component: AgendaPage,
});
