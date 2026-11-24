import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Shell } from "@/features/sales/shared";
import { LeadForm } from "@/features/sales/forms";
import { meta } from "@/features/sales/model";

export const Route = createFileRoute("/funil")({
  head: () => meta("Funil", "Pipeline comercial do FindFlow Sales."),
  component: FunilRoute,
});

function FunilRoute() {
  const [newLead, setNewLead] = useState(false);
  return (
    <Shell area="Funil" onNew={() => setNewLead(true)}>
      <div className="empty">O quadro do Funil será concluído quando houver créditos disponíveis.</div>
      {newLead && <LeadForm open onClose={() => setNewLead(false)} />}
    </Shell>
  );
}