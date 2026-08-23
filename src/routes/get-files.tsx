import { createFileRoute } from "@tanstack/react-router";
import { OllieMark } from "@/components/mark";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/get-files")({
  component: GetFiles,
  head: () => ({
    meta: [
      { title: "Download Plan Decoder 1" },
      { name: "robots", content: "noindex,follow" },
    ],
  }),
});

function GetFiles() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-lg flex-col justify-center px-6 py-12">
      <OllieMark className="size-14" />
      <h1 className="mt-5 text-3xl font-semibold">Plan Decoder 1</h1>
      <p className="mt-2 text-muted">
        Download the full app folder (zip). Unzip it, then deploy to plandecoder.com with Wrangler.
      </p>
      <Button className="mt-6 min-h-12" asChild>
        <a href="/Plan-Decoder-1.zip" download="Plan Decoder 1.zip">
          Download Plan Decoder 1.zip
        </a>
      </Button>
      <p className="mt-4 text-sm text-muted">
        Direct file:{" "}
        <a className="text-primary underline-offset-4 hover:underline" href="/Plan-Decoder-1.zip">
          /Plan-Decoder-1.zip
        </a>
      </p>
    </main>
  );
}
