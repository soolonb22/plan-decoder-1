export const HOME_FAQS = [
  {
    q: "What is Plan Decoder?",
    a: "Plan Decoder is an independent Australian website at plandecoder.com. It helps families, carers, nominees, and coordinators practise NDIS-style questions, keep evidence notes on their own device, and learn rights in plain English.",
  },
  {
    q: "Is Plan Decoder part of the NDIS or the NDIA?",
    a: "No. Plan Decoder is not the NDIA, not the NDIS, and not a government service. It cannot apply for you, cannot decide eligibility, and cannot promise funding.",
  },
  {
    q: "Do I need an account to look around?",
    a: "No. The practice assessment, Know your rights course, NDIS news, and glossary open without signing in. An account is only for saving a workspace on the app.",
  },
  {
    q: "Where is my information stored?",
    a: "Practice answers and notes stay on this device unless you later choose an encrypted copy. You can delete them. Do not put content in the app that you would not want on this device.",
  },
] as const;

export function faqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: HOME_FAQS.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}
