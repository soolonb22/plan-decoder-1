import { createFileRoute } from "@tanstack/react-router";
import { Disclaimer, PageHeader } from "@/components/layout/page";
import { ContactBody, LegalCard, LegalPageNav } from "@/components/legal";
import { LEGAL_DISCLAIMER, LEGAL_EMAIL, LEGAL_UPDATED } from "@/lib/legal";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({
    meta: [
      { title: "Contact | Plan Decoder" },
      {
        name: "description",
        content: `How to contact Plan Decoder. Email ${LEGAL_EMAIL}. Independent Australian NDIS practice tools. Not the NDIA.`,
      },
      { name: "robots", content: "index,follow" },
    ],
  }),
});

function ContactPage() {
  return (
    <div>
      <PageHeader
        title="Contact"
        lede={`A single email for questions, cancel requests, and anything on the site that is wrong. Last reviewed ${LEGAL_UPDATED}.`}
      />
      <Disclaimer>{LEGAL_DISCLAIMER}</Disclaimer>
      <LegalPageNav />
      <div className="mt-5 space-y-3">
        <LegalCard title="Contact">
          <ContactBody />
        </LegalCard>
      </div>
    </div>
  );
}
