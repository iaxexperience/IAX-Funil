import { createFileRoute } from "@tanstack/react-router";
import { InboxPage } from "@/features/sales/inbox";
import { meta } from "@/features/sales/model";

// The home route ships no og:image, so serve-time hosting can inject the
// project's social preview (explicit og:image or latest screenshot).
export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>): { lead?: string } => {
    const lead = typeof search["lead"] === "string" ? search["lead"] : undefined;
    return lead === undefined ? {} : { lead };
  },
  head: () => meta("Inbox", "Central de conversas WhatsApp e Instagram do FindFlow Sales."),
  component: Index,
});

function Index() {
  const { lead } = Route.useSearch();
  return <InboxPage {...(lead ? { selectedId: lead } : {})} />;
}
