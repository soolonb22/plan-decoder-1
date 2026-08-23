export type StoryBeat = {
  src: string;
  title: string;
  body?: string;
};

export function StoryStrip({
  heading,
  steps,
}: {
  heading?: string;
  steps: StoryBeat[];
}) {
  return (
    <section className="story-strip" aria-label={heading || "How it works"}>
      {heading ? <h2 className="story-strip-heading">{heading}</h2> : null}
      <ol className="story-steps">
        {steps.map((step, i) => (
          <li key={step.title} className="story-step">
            <img src={step.src} alt="" width={72} height={72} />
            <p className="story-step-n">{i + 1}</p>
            <p className="story-step-title">{step.title}</p>
            {step.body ? <p className="story-step-body">{step.body}</p> : null}
          </li>
        ))}
      </ol>
    </section>
  );
}

export const HOW_OLLIE_WORKS: StoryBeat[] = [
  {
    src: "/brand/story-sit.jpg",
    title: "Go slowly",
    body: "Sit somewhere quiet. You can stop whenever you need.",
  },
  {
    src: "/brand/story-tick.jpg",
    title: "One question",
    body: "Tick what is true on a typical hard day. Skip if you need to.",
  },
  {
    src: "/brand/story-device.jpg",
    title: "It stays here",
    body: "Answers live on this device. You can delete them any time.",
  },
  {
    src: "/brand/story-gp.jpg",
    title: "A paper for a GP",
    body: "Optional practice report to take to a doctor. Not an NDIA decision.",
  },
];
