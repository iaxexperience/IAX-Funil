import { createFileRoute } from "@tanstack/react-router";
import { LandingPage } from "@/features/site/landing";
import { meta } from "@/features/sales/model";

export const Route = createFileRoute("/")({
  head: () =>
    meta(
      "Automações inteligentes",
      "A IAX cria automações, agentes de IA e sistemas como IAX Guardian, FindFlow e Pulse para levar sua empresa para o futuro.",
    ),
  component: LandingPage,
});
