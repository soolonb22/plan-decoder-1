import { Link, createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page";

export const Route = createFileRoute("/prep-pack/success")({
  component: SuccessPage,
  head: () => ({
    meta: [
      { title: "Prep Pack payment received · Plan Decoder" },
      { name: "description", content: "Check your email for the unlock code, then open the Prep Pack on this device." },
      { name: "robots", content: "noindex" },
    ],
  }),
});

function SuccessPage() {
  return (
    <div>
      <PageHeader
        title="You are in"
        lede="If the payment went through, check the email used at checkout for your unlock code. Then enter it here. Your answers still stay on this device."
        art="guide"
      />
      <div className="flex flex-wrap gap-2">
        <Button asChild>
          <Link to="/unlock">Enter the code</Link>
        </Button>
        <Button variant="secondary" asChild>
          <Link to="/assessment" search={{ tab: "about" }}>
            See the practice assessment
          </Link>
        </Button>
      </div>
    </div>
  );
}
