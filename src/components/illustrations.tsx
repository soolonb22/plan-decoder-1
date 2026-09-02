import type { ReactNode, SVGProps } from "react";

const INK = "#3B1A44";
const PURPLE = "#6B2976";
const WHITE = "#FFFFFF";
const SKIN = "#C9845A";
const HAIR = "#2B1B18";
const CORAL = "#E07A4A";
const PINK = "#E7A8C0";
const PINK_DEEP = "#D07A9A";
const TEAL_SKIN = "#5BA3B5";
const TEAL_HAIR = "#2E6B84";
const MEG = "#F2A0B6";

type ArtProps = SVGProps<SVGSVGElement> & { title?: string };

function Svg({
  title,
  children,
  className,
  viewBox = "0 0 200 200",
  ...rest
}: ArtProps & { children: ReactNode; viewBox?: string }) {
  return (
    <svg
      viewBox={viewBox}
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

export function LookCloselyArt(props: ArtProps) {
  return (
    <Svg title={props.title ?? "Person looking through a magnifying glass"} viewBox="0 0 200 200" {...props}>
      <ellipse cx="100" cy="178" rx="58" ry="16" fill={CORAL} />
      <path d="M52 200 C52 138 70 118 100 118 C130 118 148 138 148 200" fill={CORAL} />
      <path d="M58 92 C62 48 86 32 112 38 C138 44 150 70 146 98 C140 78 118 68 96 72 C78 75 64 84 58 92Z" fill={HAIR} />
      <ellipse cx="100" cy="100" rx="38" ry="42" fill={SKIN} />
      <path d="M62 88 C68 50 92 36 118 42 C140 47 154 70 152 96 C148 72 128 58 104 60 C82 62 68 74 62 88Z" fill={HAIR} />
      <circle cx="86" cy="102" r="5.5" fill={INK} />
      <path d="M88 118 Q100 128 114 120" fill="none" stroke={INK} strokeWidth="3.2" strokeLinecap="round" />
      <circle cx="128" cy="108" r="28" fill="none" stroke={PURPLE} strokeWidth="10" />
      <circle cx="128" cy="108" r="22" fill="#F4EFE6" opacity="0.35" />
      <circle cx="128" cy="106" r="8" fill={INK} />
      <circle cx="131" cy="103" r="2.4" fill={WHITE} />
      <path d="M148 128 L172 154" stroke={PURPLE} strokeWidth="12" strokeLinecap="round" />
    </Svg>
  );
}

export function KeepARecordArt(props: ArtProps) {
  return (
    <Svg title={props.title ?? "Scales of justice"} viewBox="0 0 200 200" {...props}>
      <path d="M70 168 H130 L122 188 H78 Z" fill={PINK_DEEP} />
      <rect x="94" y="78" width="12" height="90" rx="4" fill={PINK} />
      <rect x="46" y="74" width="108" height="10" rx="5" fill={PINK} />
      <path d="M52 84 V118" stroke={PINK_DEEP} strokeWidth="4" />
      <path d="M148 84 V118" stroke={PINK_DEEP} strokeWidth="4" />
      <path d="M32 118 H72 Q62 138 52 138 Q42 138 32 118Z" fill={PINK} />
      <path d="M128 118 H168 Q158 138 148 138 Q138 138 128 118Z" fill={PINK} />
      <ellipse cx="100" cy="64" rx="36" ry="28" fill={PINK} />
      <circle cx="88" cy="62" r="5" fill={INK} />
      <circle cx="112" cy="62" r="5" fill={INK} />
      <path d="M90 76 Q100 84 110 76" fill="none" stroke={INK} strokeWidth="3.2" strokeLinecap="round" />
    </Svg>
  );
}

export function SpeakUpArt(props: ArtProps) {
  return (
    <Svg title={props.title ?? "Person with a megaphone"} viewBox="0 0 200 200" {...props}>
      <path d="M58 200 C58 140 74 122 100 122 C126 122 142 140 142 200" fill="#D7E8EE" />
      <path d="M78 128 H122 L128 200 H72 Z" fill="#D7E8EE" />
      <circle cx="100" cy="86" r="40" fill={TEAL_SKIN} />
      <path d="M62 78 C66 42 86 28 108 32 C132 36 148 58 146 86 C138 58 118 48 98 52 C80 55 68 66 62 78Z" fill={TEAL_HAIR} />
      <path d="M70 70 C78 44 98 34 120 42 C136 48 146 64 146 80 C140 60 122 52 102 54 C84 56 74 64 70 70Z" fill={TEAL_HAIR} />
      <circle cx="88" cy="90" r="5" fill={INK} />
      <circle cx="112" cy="90" r="5" fill={INK} />
      <path d="M90 106 Q100 114 112 106" fill="none" stroke={INK} strokeWidth="3.2" strokeLinecap="round" />
      <path d="M138 78 L178 62 L178 118 L138 102 Z" fill={MEG} />
      <rect x="126" y="84" width="16" height="16" rx="3" fill={MEG} />
      <path d="M154 70 L168 58" stroke={MEG} strokeWidth="5" strokeLinecap="round" />
      <path d="M158 80 L176 80" stroke={MEG} strokeWidth="5" strokeLinecap="round" />
      <path d="M154 92 L168 104" stroke={MEG} strokeWidth="5" strokeLinecap="round" />
    </Svg>
  );
}

function PhoneShell({ children, screen = "#F6EFE6" }: { children: ReactNode; screen?: string }) {
  return (
    <svg viewBox="0 0 220 360" className="ill-phone" role="presentation" aria-hidden>
      <rect x="8" y="8" width="204" height="344" rx="36" fill={PURPLE} />
      <rect x="20" y="22" width="180" height="316" rx="26" fill={screen} />
      {children}
    </svg>
  );
}

export function PhoneLook() {
  return (
    <PhoneShell screen="#F3E6F5">
      <ellipse cx="110" cy="300" rx="70" ry="22" fill="#E07A4A" />
      <path d="M48 360 C48 220 70 188 110 188 C150 188 172 220 172 360" fill="#E07A4A" />
      <ellipse cx="110" cy="168" rx="46" ry="50" fill={SKIN} />
      <path d="M64 154 C70 100 98 84 128 92 C156 100 172 128 168 164 C160 128 134 114 106 118 C84 121 70 136 64 154Z" fill={HAIR} />
      <circle cx="92" cy="168" r="6" fill={INK} />
      <path d="M94 188 Q110 200 126 190" fill="none" stroke={INK} strokeWidth="3.4" strokeLinecap="round" />
      <circle cx="142" cy="176" r="32" fill="none" stroke={PURPLE} strokeWidth="11" />
      <circle cx="142" cy="174" r="9" fill={INK} />
      <circle cx="145" cy="171" r="2.6" fill={WHITE} />
      <path d="M164 200 L186 226" stroke={PURPLE} strokeWidth="12" strokeLinecap="round" />
    </PhoneShell>
  );
}

export function PhonePath() {
  return (
    <PhoneShell screen="#EAF6E4">
      <ellipse cx="110" cy="292" rx="78" ry="28" fill="#7CB342" />
      <path d="M36 300 C58 230 78 210 110 210 C142 210 162 230 184 300" fill="#67A033" />
      <rect x="102" y="88" width="16" height="130" rx="4" fill="#8B5A2B" />
      <path d="M118 112 L196 96 L118 168 Z" fill="#E07A4A" />
      <path d="M102 148 L24 132 L102 204 Z" fill="#5BA3B5" />
      <path d="M48 150 L36 150 L42 138 Z" fill="#F6EFE6" />
      <path d="M172 114 L184 114 L178 102 Z" fill="#F6EFE6" />
    </PhoneShell>
  );
}

export function PhoneTalk() {
  return (
    <PhoneShell screen="#F7EEE4">
      <rect x="36" y="46" width="148" height="58" rx="16" fill="#D7EEF2" stroke={INK} strokeWidth="3" />
      <path d="M70 104 L82 104 L76 116 Z" fill="#D7EEF2" stroke={INK} strokeWidth="2" />
      <text x="110" y="70" textAnchor="middle" fontSize="11" fontWeight="700" fill={PURPLE} fontFamily="Figtree, sans-serif">
        Can I talk to you
      </text>
      <text x="110" y="86" textAnchor="middle" fontSize="11" fontWeight="700" fill={PURPLE} fontFamily="Figtree, sans-serif">
        about something?
      </text>
      <rect x="86" y="122" width="98" height="40" rx="14" fill={WHITE} stroke={INK} strokeWidth="3" />
      <text x="135" y="148" textAnchor="middle" fontSize="13" fontWeight="700" fill={PURPLE} fontFamily="Figtree, sans-serif">
        Sure thing!
      </text>
      <circle cx="72" cy="230" r="36" fill="#C9845A" />
      <path d="M44 218 C50 196 64 188 80 192 C92 195 102 208 100 224" fill={HAIR} />
      <circle cx="62" cy="228" r="4.2" fill={INK} />
      <circle cx="80" cy="228" r="4.2" fill={INK} />
      <path d="M62 242 Q72 250 82 242" fill="none" stroke={INK} strokeWidth="2.6" strokeLinecap="round" />
      <circle cx="148" cy="236" r="34" fill="#E7B48A" />
      <path d="M124 224 C130 204 146 196 162 202 C174 206 182 218 180 232" fill="#3B2416" />
      <circle cx="138" cy="234" r="4" fill={INK} />
      <circle cx="156" cy="234" r="4" fill={INK} />
      <path d="M138 248 Q148 255 158 248" fill="none" stroke={INK} strokeWidth="2.6" strokeLinecap="round" />
    </PhoneShell>
  );
}

export function PhoneSafe() {
  return (
    <PhoneShell screen="#F3E6F5">
      <path
        d="M110 64 L168 88 V168 C168 214 142 248 110 268 C78 248 52 214 52 168 V88 Z"
        fill="#9AD0E0"
        stroke={PURPLE}
        strokeWidth="6"
      />
      <circle cx="110" cy="148" r="28" fill="#E7B48A" stroke={INK} strokeWidth="3" />
      <path d="M88 140 C94 122 110 116 124 122" fill="#3B2416" />
      <circle cx="102" cy="148" r="3.2" fill={INK} />
      <circle cx="118" cy="148" r="3.2" fill={INK} />
      <circle cx="74" cy="200" r="24" fill={SKIN} stroke={INK} strokeWidth="3" />
      <path d="M56 194 C60 178 74 172 86 178" fill={HAIR} />
      <circle cx="68" cy="200" r="2.8" fill={INK} />
      <circle cx="80" cy="200" r="2.8" fill={INK} />
      <circle cx="146" cy="200" r="24" fill="#C9845A" stroke={INK} strokeWidth="3" />
      <path d="M128 192 C134 176 150 172 162 180" fill="#1F3A4A" />
      <circle cx="140" cy="200" r="2.8" fill={INK} />
      <circle cx="152" cy="200" r="2.8" fill={INK} />
      <path d="M158 206 Q168 206 170 196" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" />
    </PhoneShell>
  );
}

const STEPS = [
  { Art: LookCloselyArt, title: "Know it", body: "Find out what your rights are." },
  { Art: KeepARecordArt, title: "Show it", body: "Keep a clear record of what happens." },
  { Art: SpeakUpArt, title: "Act on it", body: "Speak up if something is not right." },
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

export function FeatureArt({
  kind,
}: {
  kind: "assess" | "nav" | "rights" | "news" | "glossary" | "words" | "wallet" | "guide";
}) {
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
