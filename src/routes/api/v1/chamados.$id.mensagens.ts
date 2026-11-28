import { createFileRoute } from "@tanstack/react-router";

// POST /api/v1/chamados/{id ou número}/mensagens → o sistema de origem responde no chamado
export const Route = createFileRoute("/api/v1/chamados/$id/mensagens")({
  server: {
    handlers: {
      POST: async ({ request, params }) => {
        const api = await import("@/features/support/api.server");
        const auth = await api.authenticate(request);
        if ("response" in auth) return auth.response;
        const body = await api.readJson(request);
        if ("response" in body) return body.response;
        const input = api.CreateMessage.safeParse(body.body);
        if (!input.success) return api.apiError(422, "invalid_body", "Mensagem inválida.", api.zodDetails(input.error));
        try {
          const ticket = await api.findTicket(auth.client, params.id);
          if (!ticket) return api.apiError(404, "not_found", "Chamado não encontrado para este sistema.");
          if (ticket.status === "fechado") return api.apiError(409, "ticket_closed", "Este chamado está fechado. Abra um novo chamado.");
          const event = await api.addSystemMessage(auth.client, ticket, input.data);
          return api.json({ data: { id: event.id, kind: event.kind, body: event.body, created_at: event.created_at } }, 201);
        } catch (error) {
          console.error("[api/chamados] message", error);
          return api.apiError(500, "internal_error", "Não foi possível registrar a mensagem.");
        }
      },
    },
  },
});
