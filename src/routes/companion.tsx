import { createFileRoute } from "@tanstack/react-router";
import { Guide3D } from "@/components/guide-3d/panel";
import { Disclaimer, PageHeader } from "@/components/layout/page";

export const Route = createFileRoute("/companion")({
  ssr: false,
  component: CompanionPage,
  head: () => ({
    meta: [
      { title: "3D guide · Plan Decoder" },
      {
        name: "description",
        content:
          "An accessible 3D path guide for Plan Decoder. Captions always on. Voice is optional. A simple map is available if 3D is turned off.",
      },
    ],
  }),
});

function CompanionPage() {
  return (
    <div>
      <PageHeader
        title="A 3D guide you can turn off"
        lede="Five stops. Captions always on. Voice only if you ask. Drag to look around, or use the buttons."
      />
      <Disclaimer>
        This guide is practice help only. It is not the NDIA. It will not tell you what to tick or promise funding.
      </Disclaimer>
      <div className="mt-5">
        <Guide3D />
      </div>
      <ul className="mt-5 list-disc space-y-1 pl-5 text-sm text-muted">
        <li>Skip 3D with the link at the top of the map, or turn 3D off.</li>
        <li>Arrow keys move between stops. Escape stops voice.</li>
        <li>Easy read shortens the captions.</li>
        <li>If motion bothers you, your device’s reduce-motion setting also stills the scene.</li>
      </ul>
    </div>
  );
}
