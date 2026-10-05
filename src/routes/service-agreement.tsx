import { createFileRoute } from "@tanstack/react-router";
import { HireApp } from "@/components/service-agreement-form";

export const Route = createFileRoute("/service-agreement")({
  component: HireApp,
  head: () => ({
    meta: [
      { title: "Service agreement draft · Plan Decoder" },
      {
        name: "description",
        content:
          "Draft a service agreement from your own notes and download a PDF. Stays on this device. Not an NDIA form.",
      },
    ],
  }),
});
