import { createFileRoute } from "@tanstack/react-router";

// API de chamados para os sistemas da IAX (FindFlow, Pulse Doações, Pulse PEP Clinic…).
// GET  /api/v1/chamados          → lista os chamados do sistema autenticado
// POST /api/v1/chamados          → abre um chamado (idempotente por external_ref)
export const Route = createFileRoute("/api/v1/chamados")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const api = await import("@/features/support/api.server");
        const auth = await api.authenticate(request);
        if ("response" in auth) return auth.response;
        const params = Object.fromEntries(new URL(request.url).searchParams);
        const query = api.ListQuery.safeParse(params);
        if (!query.success) return api.apiError(422, "invalid_query", "Parâmetros inválidos.", api.zodDetails(query.error));
        try {
          const tickets = await api.listTickets(auth.client, query.data);
          return api.json({ data: tickets.map((t) => api.publicTicket(t)) });
        } catch (error) {
          console.error("[api/chamados] list", error);
          return api.apiError(500, "internal_error", "Não foi possível listar os chamados.");
        }
      },
      POST: async ({ request }) => {
        const api = await import("@/features/support/api.server");
        const auth = await api.authenticate(request);
        if ("response" in auth) return auth.response;
        const body = await api.readJson(request);
        if ("response" in body) return body.response;
        const input = api.CreateTicket.safeParse(body.body);
        if (!input.success) return api.apiError(422, "invalid_body", "Dados do chamado inválidos.", api.zodDetails(input.error));
        try {
          const { ticket, created } = await api.createTicket(auth.client, input.data);
          return api.json({ data: api.publicTicket(ticket) }, created ? 201 : 200);
        } catch (error) {
          console.error("[api/chamados] create", error);
          return api.apiError(500, "internal_error", "Não foi possível abrir o chamado.");
        }
      },
    },
  },
});
