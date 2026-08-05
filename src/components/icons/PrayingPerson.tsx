/** أيقونة مصلٍّ في السجود/القيام — رسم بسيط ملوّن للهوية الإسلامية. */
export function PrayingPerson({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      {/* سجادة الصلاة */}
      <path d="M8 40h32l-3 4H11z" fill="currentColor" opacity="0.35" />
      <path d="M10 36h28v4H10z" fill="currentColor" opacity="0.2" />
      {/* الجسم في وضع القيام مع رفع اليدين */}
      <circle cx="24" cy="12" r="5" fill="currentColor" />
      <path
        d="M24 18c-5 0-8 3-8 7v11h4V27h8v9h4V25c0-4-3-7-8-7Z"
        fill="currentColor"
      />
      <path d="M17 21l-4 5M31 21l4 5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" fill="none" />
    </svg>
  );
}
