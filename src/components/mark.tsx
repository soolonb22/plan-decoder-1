export function OllieMark({ className = "size-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <rect width="32" height="32" rx="9" fill="#6B2976" />
      <path
        d="M11 9.2h6.1c3.1 0 5.2 1.9 5.2 4.7 0 2.9-2.1 4.8-5.2 4.8H13.8V22.8H11V9.2zm2.8 2.3v4.8h3.1c1.6 0 2.6-1 2.6-2.4s-1-2.4-2.6-2.4h-3.1z"
        fill="#FFFFFF"
      />
    </svg>
  );
}
