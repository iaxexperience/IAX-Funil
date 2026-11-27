import { createFileRoute } from "@tanstack/react-router";
import { LandingPage } from "@/features/site/landing";
import { meta } from "@/features/sales/model";

export const Route = createFileRoute("/")({
  head: () =>
    meta(
      "Atendimento e vendas pelo WhatsApp",
      "Centralize WhatsApp e Instagram, organize o funil de vendas e nunca mais perca um lead.",
    ),
  component: LandingPage,
});
