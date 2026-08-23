export function OllieMark({ className = "size-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <rect width="32" height="32" rx="9" fill="#6E2C92" />
      <circle cx="16" cy="16" r="7.5" fill="none" stroke="#FFFFFF" strokeWidth="2.4" />
      <circle cx="23" cy="9" r="3" fill="#8BC541" />
    </svg>
  );
}
