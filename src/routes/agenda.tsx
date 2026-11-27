import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Shell } from "@/features/sales/shared";
import { ActivityForm } from "@/features/sales/forms";
import { meta } from "@/features/sales/model";

export const Route = createFileRoute("/agenda")({
  head: () => meta("Agenda", "Agenda comercial da IAX."),
  component: AgendaRoute,
});

function AgendaRoute() {
  const [newActivity, setNewActivity] = useState(false);
  return (
    <Shell area="Agenda" onNew={() => setNewActivity(true)}>
      <div className="empty">A Agenda comercial será concluída quando houver créditos disponíveis.</div>
      {newActivity && <ActivityForm open onClose={() => setNewActivity(false)} />}
    </Shell>
  );
}