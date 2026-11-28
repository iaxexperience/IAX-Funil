import { createFileRoute } from "@tanstack/react-router";

// GET /api/v1/chamados/{id ou número} → chamado do sistema autenticado com o histórico público
export const Route = createFileRoute("/api/v1/chamados/$id")({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        const api = await import("@/features/support/api.server");
        const auth = await api.authenticate(request);
        if ("response" in auth) return auth.response;
        try {
          const ticket = await api.findTicket(auth.client, params.id);
          if (!ticket) return api.apiError(404, "not_found", "Chamado não encontrado para este sistema.");
          const events = await api.ticketEvents(ticket.id);
          return api.json({ data: api.publicTicket(ticket, events) });
        } catch (error) {
          console.error("[api/chamados] get", error);
          return api.apiError(500, "internal_error", "Não foi possível consultar o chamado.");
        }
      },
    },
  },
});
