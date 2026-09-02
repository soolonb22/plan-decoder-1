import type { ReactNode, SVGProps } from "react";

const INK = "#4A1C53";
const PURPLE = "#6B2976";
const TEAL = "#007A86";
const GREEN = "#4F7A24";
const GOLD = "#C48414";
const WHITE = "#FFFFFF";

type ArtProps = SVGProps<SVGSVGElement> & { title?: string };

function Svg({ title, children, className, ...rest }: ArtProps & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 160 160"
      role={title ? "img" : "presentation"}
      aria-hidden={title ? undefined : true}
      className={className}
      {...rest}
    >
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  );
}

function Face({ cx, cy, skin, smile = true }: { cx: number; cy: number; skin: string; smile?: boolean }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r="28" fill={skin} stroke={INK} strokeWidth="3.5" />
      <circle cx={cx - 9} cy={cy - 2} r="3.2" fill={INK} />
      <circle cx={cx + 9} cy={cy - 2} r="3.2" fill={INK} />
      {smile ? (
        <path d={`M${cx - 10} ${cy + 10} Q${cx} ${cy + 18} ${cx + 10} ${cy + 10}`} fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" />
      ) : (
        <path d={`M${cx - 8} ${cy + 12} H${cx + 8}`} fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" />
      )}
    </g>
  );
}

export function LookCloselyArt(props: ArtProps) {
  return (
    <Svg title={props.title ?? "Person looking closely at a plan"} {...props}>
      <rect width="160" height="160" rx="28" fill="#EFE6F2" />
      <ellipse cx="80" cy="148" rx="46" ry="10" fill="#D8C6E0" />
      <path d="M48 148c4-34 10-52 32-52s28 18 32 52" fill={PURPLE} stroke={INK} strokeWidth="3.5" />
      <Face cx={80} cy={62} skin="#E8B48A" />
      <path d="M52 50c6-22 20-28 36-24 10 2 18 10 22 20" fill="#2A1A20" stroke={INK} strokeWidth="3" />
      <circle cx="118" cy="92" r="22" fill="none" stroke={TEAL} strokeWidth="7" />
      <circle cx="118" cy="92" r="14" fill={WHITE} stroke={INK} strokeWidth="2.5" />
      <path d="M134 108 L148 124" stroke={TEAL} strokeWidth="8" strokeLinecap="round" />
      <path d="M134 108 L148 124" stroke={INK} strokeWidth="3.2" strokeLinecap="round" />
    </Svg>
  );
}

export function KeepARecordArt(props: ArtProps) {
  return (
    <Svg title={props.title ?? "Person writing notes"} {...props}>
      <rect width="160" height="160" rx="28" fill="#E7F3F4" />
      <ellipse cx="80" cy="148" rx="46" ry="10" fill="#C5DDE0" />
      <path d="M46 148c6-36 14-54 34-54s28 18 34 54" fill={TEAL} stroke={INK} strokeWidth="3.5" />
      <Face cx={78} cy={60} skin="#C68642" />
      <path d="M54 44c8-18 24-24 40-16 12 6 18 16 20 26" fill="#3B2416" stroke={INK} strokeWidth="3" />
      <rect x="96" y="86" width="42" height="50" rx="6" fill={WHITE} stroke={INK} strokeWidth="3.2" />
      <path d="M104 98h26M104 108h26M104 118h18" stroke={PURPLE} strokeWidth="3" strokeLinecap="round" />
      <rect x="118" y="78" width="8" height="22" rx="2" fill={GOLD} stroke={INK} strokeWidth="2" transform="rotate(18 122 89)" />
    </Svg>
  );
}

export function SpeakUpArt(props: ArtProps) {
  return (
    <Svg title={props.title ?? "Person speaking up"} {...props}>
      <rect width="160" height="160" rx="28" fill="#EAF3E2" />
      <ellipse cx="80" cy="148" rx="46" ry="10" fill="#C9DDB8" />
      <path d="M50 148c4-34 12-52 30-52s26 18 30 52" fill={GREEN} stroke={INK} strokeWidth="3.5" />
      <Face cx={74} cy={62} skin="#F1D4B5" />
      <path d="M52 46c4-18 18-26 34-20 8 3 16 12 18 24" fill="#1F3A4A" stroke={INK} strokeWidth="3" />
      <path d="M108 52c18 4 28 18 28 34 0 16-10 28-26 34" fill={WHITE} stroke={INK} strokeWidth="3.2" />
      <circle cx="118" cy="78" r="3" fill={PURPLE} />
      <circle cx="128" cy="86" r="3" fill={PURPLE} />
      <circle cx="118" cy="94" r="3" fill={PURPLE} />
    </Svg>
  );
}

function Phone({ children, fill = "#EFE6F2" }: { children: ReactNode; fill?: string }) {
  return (
    <svg viewBox="0 0 120 180" className="ill-phone" role="presentation" aria-hidden>
      <rect x="6" y="4" width="108" height="172" rx="18" fill={PURPLE} />
      <rect x="12" y="12" width="96" height="156" rx="12" fill={fill} />
      <rect x="48" y="16" width="24" height="6" rx="3" fill={PURPLE} />
      {children}
    </svg>
  );
}

export function PhoneLook() {
  return (
    <Phone>
      <circle cx="60" cy="78" r="28" fill="#E8B48A" stroke={INK} strokeWidth="3" />
      <path d="M38 70c6-20 18-26 34-20 10 4 18 12 20 22" fill="#2A1A20" />
      <circle cx="50" cy="78" r="3" fill={INK} />
      <circle cx="70" cy="78" r="3" fill={INK} />
      <path d="M50 90 Q60 98 70 90" fill="none" stroke={INK} strokeWidth="2.6" strokeLinecap="round" />
      <circle cx="84" cy="108" r="14" fill="none" stroke={TEAL} strokeWidth="5" />
      <path d="M94 118 L104 130" stroke={TEAL} strokeWidth="5" strokeLinecap="round" />
    </Phone>
  );
}

export function PhonePath() {
  return (
    <Phone fill="#E7F3F4">
      <ellipse cx="60" cy="128" rx="34" ry="14" fill="#8FBF6A" />
      <path d="M28 128 C40 96 50 88 60 88 S80 96 92 128" fill="#6FA24A" />
      <rect x="54" y="46" width="12" height="50" rx="3" fill="#8B5A2B" stroke={INK} strokeWidth="2" />
      <path d="M66 56 L98 48 L66 78 Z" fill={GOLD} stroke={INK} strokeWidth="2.4" />
      <path d="M54 68 L22 60 L54 90 Z" fill={TEAL} stroke={INK} strokeWidth="2.4" />
    </Phone>
  );
}

export function PhoneTalk() {
  return (
    <Phone fill="#F4EEE6">
      <circle cx="42" cy="86" r="22" fill="#C68642" stroke={INK} strokeWidth="3" />
      <path d="M24 76c6-16 16-20 28-14" fill="#3B2416" />
      <circle cx="36" cy="84" r="2.6" fill={INK} />
      <circle cx="48" cy="84" r="2.6" fill={INK} />
      <circle cx="82" cy="78" r="20" fill="#F1D4B5" stroke={INK} strokeWidth="3" />
      <path d="M68 68c6-14 18-16 28-8" fill="#1F3A4A" />
      <circle cx="76" cy="76" r="2.6" fill={INK} />
      <circle cx="88" cy="76" r="2.6" fill={INK} />
      <path d="M48 58c18-18 44-8 44 10" fill={WHITE} stroke={INK} strokeWidth="2.4" />
      <text x="70" y="54" textAnchor="middle" fontSize="9" fontWeight="700" fill={PURPLE}>
        ok
      </text>
    </Phone>
  );
}

export function PhoneSafe() {
  return (
    <Phone fill="#EAF3E2">
      <path d="M60 44 L92 56 V88 C92 112 76 126 60 134 C44 126 28 112 28 88 V56 Z" fill={WHITE} stroke={INK} strokeWidth="3.2" />
      <path d="M60 56 L80 64 V88 C80 104 70 114 60 120 C50 114 40 104 40 88 V64 Z" fill="#D7E8C8" />
      <circle cx="48" cy="92" r="10" fill="#E8B48A" stroke={INK} strokeWidth="2" />
      <circle cx="72" cy="92" r="10" fill="#C68642" stroke={INK} strokeWidth="2" />
      <circle cx="60" cy="78" r="11" fill="#F1D4B5" stroke={INK} strokeWidth="2" />
    </Phone>
  );
}

const STEPS = [
  { Art: LookCloselyArt, title: "Look closely", body: "Read what the words actually mean for your day." },
  { Art: KeepARecordArt, title: "Keep a record", body: "Notes and evidence stay on this device until you choose." },
  { Art: SpeakUpArt, title: "Speak up", body: "Use calm, plain words when something is not right." },
];

export function IllustrationTrio() {
  return (
    <ul className="ill-trio">
      {STEPS.map(({ Art, title, body }) => (
        <li key={title} className="ill-trio-item">
          <Art className="ill-trio-art" />
          <p className="ill-trio-title">{title}</p>
          <p className="ill-trio-body">{body}</p>
        </li>
      ))}
    </ul>
  );
}

export function PhoneRow() {
  return (
    <div className="ill-phones" aria-hidden>
      <PhoneLook />
      <PhonePath />
      <PhoneTalk />
      <PhoneSafe />
    </div>
  );
}

export function FeatureArt({ kind }: { kind: "assess" | "nav" | "rights" | "news" | "glossary" | "words" | "wallet" | "guide" }) {
  const map = {
    assess: LookCloselyArt,
    nav: KeepARecordArt,
    rights: SpeakUpArt,
    news: KeepARecordArt,
    glossary: LookCloselyArt,
    words: SpeakUpArt,
    wallet: KeepARecordArt,
    guide: LookCloselyArt,
  } as const;
  const Art = map[kind];
  return <Art className="ill-feature" />;
}
