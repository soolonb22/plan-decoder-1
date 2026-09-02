import type { ReactNode, SVGProps } from "react";

const INK = "#3B1A44";
const PURPLE = "#6B2976";
const WHITE = "#FFFFFF";
const SKIN = "#C9845A";
const HAIR = "#2B1B18";
const CORAL = "#E07A4A";
const PINK = "#E7A8C0";
const PINK_DEEP = "#D07A9A";
const TEAL = "#007A86";
const TEAL_SKIN = "#5BA3B5";
const TEAL_HAIR = "#2E6B84";
const MEG = "#F2A0B6";
const GREEN = "#4F7A24";
const GOLD = "#C48414";

export type ArtTopic =
  | "home"
  | "rights"
  | "articles"
  | "assess"
  | "nav"
  | "wallet"
  | "words"
  | "news"
  | "plan"
  | "guide"
  | "glossary";

type ArtProps = SVGProps<SVGSVGElement> & { title?: string };

function Svg({ title, children, className, viewBox = "0 0 200 200", ...rest }: ArtProps & { children: ReactNode; viewBox?: string }) {
  return (
    <svg viewBox={viewBox} role={title ? "img" : "presentation"} aria-hidden={title ? undefined : true} className={className} {...rest}>
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  );
}

export function KnowItArt(props: ArtProps) {
  return (
    <Svg title={props.title ?? "Person looking through a magnifying glass"} {...props}>
      <path d="M52 200 C52 138 70 118 100 118 C130 118 148 138 148 200" fill={CORAL} />
      <ellipse cx="100" cy="100" rx="38" ry="42" fill={SKIN} />
      <path d="M62 88 C68 50 92 36 118 42 C140 47 154 70 152 96 C148 72 128 58 104 60 C82 62 68 74 62 88Z" fill={HAIR} />
      <circle cx="86" cy="102" r="5.5" fill={INK} />
      <path d="M88 118 Q100 128 114 120" fill="none" stroke={INK} strokeWidth="3.2" strokeLinecap="round" />
      <circle cx="128" cy="108" r="28" fill="none" stroke={PURPLE} strokeWidth="10" />
      <circle cx="128" cy="106" r="8" fill={INK} />
      <circle cx="131" cy="103" r="2.4" fill={WHITE} />
      <path d="M148 128 L172 154" stroke={PURPLE} strokeWidth="12" strokeLinecap="round" />
    </Svg>
  );
}

export function ShowItArt(props: ArtProps) {
  return (
    <Svg title={props.title ?? "Scales of justice"} {...props}>
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

export function ActOnItArt(props: ArtProps) {
  return (
    <Svg title={props.title ?? "Person with a megaphone"} {...props}>
      <path d="M58 200 C58 140 74 122 100 122 C126 122 142 140 142 200" fill="#D7E8EE" />
      <circle cx="100" cy="86" r="40" fill={TEAL_SKIN} />
      <path d="M62 78 C66 42 86 28 108 32 C132 36 148 58 146 86 C138 58 118 48 98 52 C80 55 68 66 62 78Z" fill={TEAL_HAIR} />
      <circle cx="88" cy="90" r="5" fill={INK} />
      <circle cx="112" cy="90" r="5" fill={INK} />
      <path d="M90 106 Q100 114 112 106" fill="none" stroke={INK} strokeWidth="3.2" strokeLinecap="round" />
      <path d="M138 78 L178 62 L178 118 L138 102 Z" fill={MEG} />
      <rect x="126" y="84" width="16" height="16" rx="3" fill={MEG} />
    </Svg>
  );
}

export function ClipboardArt(props: ArtProps) {
  return (
    <Svg title={props.title ?? "Practice checklist"} {...props}>
      <rect x="48" y="36" width="104" height="140" rx="14" fill={WHITE} stroke={PURPLE} strokeWidth="6" />
      <rect x="78" y="24" width="44" height="24" rx="8" fill={CORAL} />
      <path d="M68 84 h20 M68 108 h48 M68 132 h48 M68 156 h32" stroke={PURPLE} strokeWidth="6" strokeLinecap="round" />
      <path d="M64 80 l8 8 16-16" fill="none" stroke={GREEN} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function SignpostArt(props: ArtProps) {
  return (
    <Svg title={props.title ?? "Community pathways"} {...props}>
      <ellipse cx="100" cy="176" rx="56" ry="16" fill="#8FBF6A" />
      <rect x="94" y="48" width="12" height="128" rx="4" fill="#8B5A2B" />
      <path d="M106 68 L176 54 L106 108 Z" fill={CORAL} />
      <path d="M94 112 L24 98 L94 152 Z" fill={TEAL} />
    </Svg>
  );
}

export function FolderArt(props: ArtProps) {
  return (
    <Svg title={props.title ?? "Evidence folder"} {...props}>
      <path d="M36 72 H88 L100 86 H164 C172 86 176 90 176 98 V164 C176 172 172 176 164 176 H36 C28 176 24 172 24 164 V80 C24 74 28 72 36 72Z" fill={GOLD} />
      <rect x="24" y="96" width="152" height="80" rx="10" fill="#E8C56B" stroke={INK} strokeWidth="3" />
      <rect x="48" y="52" width="72" height="56" rx="6" fill={WHITE} stroke={PURPLE} strokeWidth="4" />
      <path d="M60 70 h48 M60 84 h36" stroke={PURPLE} strokeWidth="4" strokeLinecap="round" />
    </Svg>
  );
}

export function WordsArt(props: ArtProps) {
  return (
    <Svg title={props.title ?? "Finding the words"} {...props}>
      <path d="M36 48 H120 C132 48 140 56 140 68 V108 C140 120 132 128 120 128 H78 L54 152 V128 H36 C24 128 16 120 16 108 V68 C16 56 24 48 36 48Z" fill="#D7EEF2" stroke={INK} strokeWidth="4" />
      <path d="M84 86 H188 C196 86 204 94 204 104 V140 C204 150 196 158 188 158 H150 L132 178 V158 H84 C76 158 68 150 68 140 V104 C68 94 76 86 84 86Z" fill={WHITE} stroke={INK} strokeWidth="4" />
      <path d="M40 78 h64 M40 96 h48" stroke={PURPLE} strokeWidth="5" strokeLinecap="round" />
      <path d="M96 116 h72" stroke={TEAL} strokeWidth="5" strokeLinecap="round" />
    </Svg>
  );
}

export function NewsArt(props: ArtProps) {
  return (
    <Svg title={props.title ?? "News headlines"} {...props}>
      <rect x="32" y="28" width="136" height="148" rx="10" fill={WHITE} stroke={PURPLE} strokeWidth="6" />
      <rect x="48" y="44" width="104" height="22" rx="4" fill={PURPLE} />
      <path d="M48 86 h104 M48 106 h104 M48 126 h80 M48 146 h92" stroke={TEAL} strokeWidth="6" strokeLinecap="round" />
    </Svg>
  );
}

export function PlanDocArt(props: ArtProps) {
  return (
    <Svg title={props.title ?? "Reading a plan"} {...props}>
      <rect x="44" y="24" width="112" height="152" rx="10" fill={WHITE} stroke={PURPLE} strokeWidth="6" />
      <rect x="60" y="40" width="80" height="16" rx="4" fill={CORAL} />
      <rect x="60" y="68" width="80" height="28" rx="6" fill="#E7F3F4" />
      <rect x="60" y="106" width="80" height="28" rx="6" fill="#EFE6F2" />
      <rect x="60" y="144" width="48" height="16" rx="4" fill={GOLD} />
    </Svg>
  );
}

export function CalendarArt(props: ArtProps) {
  return (
    <Svg title={props.title ?? "Dates and changes"} {...props}>
      <rect x="36" y="44" width="128" height="120" rx="14" fill={WHITE} stroke={PURPLE} strokeWidth="6" />
      <rect x="36" y="44" width="128" height="32" rx="14" fill={PURPLE} />
      <circle cx="68" cy="60" r="6" fill={GOLD} />
      <circle cx="132" cy="60" r="6" fill={GOLD} />
      <rect x="56" y="92" width="22" height="18" rx="4" fill="#EFE6F2" />
      <rect x="88" y="92" width="22" height="18" rx="4" fill={CORAL} />
      <rect x="120" y="92" width="22" height="18" rx="4" fill="#EFE6F2" />
      <rect x="56" y="122" width="22" height="18" rx="4" fill="#EFE6F2" />
      <rect x="88" y="122" width="22" height="18" rx="4" fill="#E7F3F4" />
    </Svg>
  );
}

export function MeetingArt(props: ArtProps) {
  return (
    <Svg title={props.title ?? "A planning conversation"} {...props}>
      <circle cx="74" cy="88" r="28" fill={SKIN} />
      <path d="M50 78 C56 58 74 50 90 58" fill={HAIR} />
      <circle cx="66" cy="88" r="4" fill={INK} />
      <circle cx="82" cy="88" r="4" fill={INK} />
      <circle cx="132" cy="84" r="26" fill="#E7B48A" />
      <path d="M112 74 C118 56 136 50 148 60" fill="#3B2416" />
      <circle cx="124" cy="84" r="3.6" fill={INK} />
      <circle cx="140" cy="84" r="3.6" fill={INK} />
      <path d="M40 200 C44 140 60 122 74 122 C88 122 102 140 108 200" fill={CORAL} />
      <path d="M108 200 C112 144 122 128 132 128 C146 128 160 148 164 200" fill={TEAL} />
    </Svg>
  );
}

export function BookArt(props: ArtProps) {
  return (
    <Svg title={props.title ?? "Glossary book"} {...props}>
      <path d="M36 44 H100 V168 H44 C38 168 36 164 36 158 Z" fill="#EFE6F2" stroke={PURPLE} strokeWidth="5" />
      <path d="M100 44 H164 V158 C164 164 162 168 156 168 H100 Z" fill={WHITE} stroke={PURPLE} strokeWidth="5" />
      <path d="M100 44 V168" stroke={PURPLE} strokeWidth="5" />
      <path d="M116 70 h32 M116 90 h32 M116 110 h24" stroke={TEAL} strokeWidth="5" strokeLinecap="round" />
    </Svg>
  );
}

export function TogetherArt(props: ArtProps) {
  return (
    <Svg title={props.title ?? "You do not have to do this alone"} {...props}>
      <circle cx="78" cy="78" r="30" fill={SKIN} />
      <path d="M52 70 C58 48 78 40 96 50" fill={HAIR} />
      <circle cx="70" cy="78" r="4" fill={INK} />
      <circle cx="86" cy="78" r="4" fill={INK} />
      <circle cx="126" cy="86" r="26" fill={TEAL_SKIN} />
      <path d="M106 78 C112 58 128 52 142 62" fill={TEAL_HAIR} />
      <circle cx="118" cy="86" r="3.6" fill={INK} />
      <circle cx="134" cy="86" r="3.6" fill={INK} />
      <path d="M36 200 C40 138 58 118 78 118 C98 118 112 138 118 200" fill={CORAL} />
      <path d="M108 200 C112 148 118 132 126 132 C140 132 156 152 164 200" fill="#D7E8EE" />
    </Svg>
  );
}

export function LookCloselyArt(props: ArtProps) { return <KnowItArt {...props} />; }
export function KeepARecordArt(props: ArtProps) { return <ShowItArt {...props} />; }
export function SpeakUpArt(props: ArtProps) { return <ActOnItArt {...props} />; }

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
      <path d="M48 360 C48 220 70 188 110 188 C150 188 172 220 172 360" fill={CORAL} />
      <ellipse cx="110" cy="168" rx="46" ry="50" fill={SKIN} />
      <path d="M64 154 C70 100 98 84 128 92 C156 100 172 128 168 164 C160 128 134 114 106 118 C84 121 70 136 64 154Z" fill={HAIR} />
      <circle cx="92" cy="168" r="6" fill={INK} />
      <circle cx="142" cy="176" r="32" fill="none" stroke={PURPLE} strokeWidth="11" />
      <circle cx="142" cy="174" r="9" fill={INK} />
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
      <path d="M118 112 L196 96 L118 168 Z" fill={CORAL} />
      <path d="M102 148 L24 132 L102 204 Z" fill={TEAL_SKIN} />
    </PhoneShell>
  );
}
export function PhoneTalk() {
  return (
    <PhoneShell screen="#F7EEE4">
      <rect x="36" y="46" width="148" height="58" rx="16" fill="#D7EEF2" stroke={INK} strokeWidth="3" />
      <text x="110" y="70" textAnchor="middle" fontSize="11" fontWeight="700" fill={PURPLE} fontFamily="Figtree, sans-serif">Can I talk to you</text>
      <text x="110" y="86" textAnchor="middle" fontSize="11" fontWeight="700" fill={PURPLE} fontFamily="Figtree, sans-serif">about something?</text>
      <rect x="86" y="122" width="98" height="40" rx="14" fill={WHITE} stroke={INK} strokeWidth="3" />
      <text x="135" y="148" textAnchor="middle" fontSize="13" fontWeight="700" fill={PURPLE} fontFamily="Figtree, sans-serif">Sure thing!</text>
      <circle cx="72" cy="230" r="36" fill={SKIN} />
      <path d="M44 218 C50 196 64 188 80 192 C92 195 102 208 100 224" fill={HAIR} />
      <circle cx="148" cy="236" r="34" fill="#E7B48A" />
      <path d="M124 224 C130 204 146 196 162 202 C174 206 182 218 180 232" fill="#3B2416" />
    </PhoneShell>
  );
}
export function PhoneSafe() {
  return (
    <PhoneShell screen="#F3E6F5">
      <path d="M110 64 L168 88 V168 C168 214 142 248 110 268 C78 248 52 214 52 168 V88 Z" fill="#9AD0E0" stroke={PURPLE} strokeWidth="6" />
      <circle cx="110" cy="148" r="28" fill="#E7B48A" stroke={INK} strokeWidth="3" />
      <circle cx="74" cy="200" r="24" fill={SKIN} stroke={INK} strokeWidth="3" />
      <circle cx="146" cy="200" r="24" fill={SKIN} stroke={INK} strokeWidth="3" />
    </PhoneShell>
  );
}
function PhoneClipboard() {
  return (
    <PhoneShell screen="#EFE6F2">
      <rect x="58" y="70" width="104" height="160" rx="12" fill={WHITE} stroke={PURPLE} strokeWidth="6" />
      <rect x="86" y="56" width="48" height="22" rx="8" fill={CORAL} />
      <path d="M78 110 h20 M78 140 h64 M78 170 h64 M78 200 h40" stroke={PURPLE} strokeWidth="6" strokeLinecap="round" />
      <path d="M74 106 l8 8 16-16" fill="none" stroke={GREEN} strokeWidth="6" strokeLinecap="round" />
    </PhoneShell>
  );
}
function PhoneFolder() {
  return (
    <PhoneShell screen="#F7F0DE">
      <path d="M40 140 H96 L108 154 H180 V250 H40 Z" fill={GOLD} />
      <rect x="40" y="154" width="140" height="96" rx="8" fill="#E8C56B" />
      <rect x="64" y="100" width="80" height="70" rx="8" fill={WHITE} stroke={PURPLE} strokeWidth="4" />
    </PhoneShell>
  );
}
function PhoneCalendar() {
  return (
    <PhoneShell screen="#E7F3F4">
      <rect x="40" y="70" width="140" height="180" rx="16" fill={WHITE} stroke={PURPLE} strokeWidth="6" />
      <rect x="40" y="70" width="140" height="40" fill={PURPLE} />
      <text x="110" y="96" textAnchor="middle" fontSize="16" fontWeight="700" fill={WHITE} fontFamily="Figtree, sans-serif">2027</text>
      <rect x="58" y="132" width="28" height="24" rx="4" fill="#EFE6F2" />
      <rect x="96" y="132" width="28" height="24" rx="4" fill={CORAL} />
      <rect x="134" y="132" width="28" height="24" rx="4" fill="#EFE6F2" />
    </PhoneShell>
  );
}
function PhoneNews() {
  return (
    <PhoneShell screen="#F6EFE6">
      <rect x="40" y="60" width="140" height="200" rx="10" fill={WHITE} stroke={PURPLE} strokeWidth="5" />
      <rect x="54" y="76" width="112" height="28" rx="4" fill={PURPLE} />
      <path d="M54 128 h112 M54 152 h112 M54 176 h80 M54 200 h96" stroke={TEAL} strokeWidth="6" strokeLinecap="round" />
    </PhoneShell>
  );
}
function PhonePlan() {
  return (
    <PhoneShell screen="#EFE6F2">
      <rect x="48" y="56" width="124" height="210" rx="10" fill={WHITE} stroke={PURPLE} strokeWidth="5" />
      <rect x="64" y="74" width="92" height="18" rx="4" fill={CORAL} />
      <rect x="64" y="108" width="92" height="36" rx="6" fill="#E7F3F4" />
      <rect x="64" y="156" width="92" height="36" rx="6" fill="#EFE6F2" />
      <rect x="64" y="204" width="56" height="18" rx="4" fill={GOLD} />
    </PhoneShell>
  );
}

type Scene = { Art: (p: ArtProps) => ReactNode; title: string; body: string };

const TOPICS: Record<ArtTopic, { icons: Scene[]; phones: ReactNode[] }> = {
  home: {
    icons: [
      { Art: ClipboardArt, title: "Practise", body: "Rehearse daily-life questions." },
      { Art: FolderArt, title: "Keep notes", body: "Evidence stays on this device." },
      { Art: SignpostArt, title: "Find doors", body: "Health, housing, and local help." },
    ],
    phones: [<PhoneClipboard key="a" />, <PhoneFolder key="b" />, <PhonePath key="c" />, <PhonePlan key="d" />],
  },
  rights: {
    icons: [
      { Art: KnowItArt, title: "Know it", body: "Find out what your rights are." },
      { Art: ShowItArt, title: "Show it", body: "Keep a clear record of what happens." },
      { Art: ActOnItArt, title: "Act on it", body: "Speak up if something is not right." },
    ],
    phones: [<PhoneLook key="a" />, <PhonePath key="b" />, <PhoneTalk key="c" />, <PhoneSafe key="d" />],
  },
  articles: {
    icons: [
      { Art: CalendarArt, title: "Dates", body: "What is changing, and when." },
      { Art: PlanDocArt, title: "Your plan", body: "The parts of a plan in plain words." },
      { Art: MeetingArt, title: "Reassessment", body: "What a review conversation is." },
    ],
    phones: [<PhoneCalendar key="a" />, <PhonePlan key="b" />, <PhoneTalk key="c" />, <PhoneFolder key="d" />],
  },
  assess: {
    icons: [
      { Art: ClipboardArt, title: "Questions", body: "About a typical hard day." },
      { Art: MeetingArt, title: "A conversation", body: "Practice only \u2014 not the NDIA." },
      { Art: TogetherArt, title: "With someone", body: "A carer or nominee can help." },
    ],
    phones: [<PhoneClipboard key="a" />, <PhoneTalk key="b" />],
  },
  nav: {
    icons: [
      { Art: SignpostArt, title: "Pathways", body: "More than one door can help." },
      { Art: MeetingArt, title: "Local people", body: "Health, housing, and community." },
      { Art: FolderArt, title: "What to take", body: "Notes you already keep." },
    ],
    phones: [<PhonePath key="a" />],
  },
  wallet: {
    icons: [
      { Art: FolderArt, title: "Evidence", body: "Slips and notes in one place." },
      { Art: CalendarArt, title: "Diary", body: "What a week actually looked like." },
      { Art: TogetherArt, title: "Carer notes", body: "Unpaid support counts too." },
    ],
    phones: [<PhoneFolder key="a" />, <PhoneCalendar key="b" />],
  },
  words: {
    icons: [
      { Art: WordsArt, title: "Swap words", body: "Harsh labels for what happens." },
      { Art: BookArt, title: "Plain English", body: "Say it the way you live it." },
      { Art: MeetingArt, title: "In the room", body: "Words you can take to a meeting." },
    ],
    phones: [<PhoneTalk key="a" />],
  },
  news: {
    icons: [
      { Art: NewsArt, title: "Headlines", body: "Copied from ndis.gov.au." },
      { Art: CalendarArt, title: "Timing", body: "When a change is due." },
      { Art: BookArt, title: "Our notes", body: "Why a family might care." },
    ],
    phones: [<PhoneNews key="a" />, <PhoneCalendar key="b" />],
  },
  plan: {
    icons: [
      { Art: PlanDocArt, title: "Budgets", body: "Goals, supports, and dates." },
      { Art: FolderArt, title: "Funding", body: "How the money is managed." },
      { Art: CalendarArt, title: "Review date", body: "When the plan is looked at again." },
    ],
    phones: [<PhonePlan key="a" />, <PhoneCalendar key="b" />],
  },
  guide: {
    icons: [
      { Art: MeetingArt, title: "One step", body: "Letters and meeting notes." },
      { Art: WordsArt, title: "Your words", body: "Kept in ordinary language." },
      { Art: FolderArt, title: "Take it with you", body: "A brief you can print." },
    ],
    phones: [<PhoneTalk key="a" />, <PhonePlan key="b" />],
  },
  glossary: {
    icons: [
      { Art: BookArt, title: "NDIS words", body: "Said in ordinary English." },
      { Art: WordsArt, title: "Plain meaning", body: "What people actually do." },
      { Art: PlanDocArt, title: "On your plan", body: "Where the word turns up." },
    ],
    phones: [],
  },
};

export function PageArt({ topic, showPhones = true, showIcons = true }: { topic: ArtTopic; showPhones?: boolean; showIcons?: boolean }) {
  const set = TOPICS[topic];
  return (
    <div className="page-art">
      {showIcons ? (
        <ul className="ill-trio">
          {set.icons.map(({ Art, title, body }) => (
            <li key={title} className="ill-trio-item">
              <Art className="ill-trio-art" />
              <p className="ill-trio-title">{title}</p>
              <p className="ill-trio-body">{body}</p>
            </li>
          ))}
        </ul>
      ) : null}
      {showPhones && set.phones.length ? <div className="ill-phones">{set.phones}</div> : null}
    </div>
  );
}

export function IllustrationTrio() {
  return <PageArt topic="rights" showPhones={false} />;
}

export function PhoneRow() {
  return <PageArt topic="rights" showIcons={false} />;
}

export function FeatureArt({ kind }: { kind: "assess" | "nav" | "rights" | "news" | "glossary" | "words" | "wallet" | "guide" }) {
  const map = {
    assess: ClipboardArt,
    nav: SignpostArt,
    rights: ActOnItArt,
    news: NewsArt,
    glossary: BookArt,
    words: WordsArt,
    wallet: FolderArt,
    guide: MeetingArt,
  } as const;
  const Art = map[kind];
  return <Art className="ill-feature" />;
}
