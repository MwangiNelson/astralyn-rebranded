/**
 * Astralyn lockup — the angular "A" mark followed by the wordmark.
 * The mark is the SVG asset in /public; the wordmark is set in the display face.
 */
export default function Logo({
  word = true,
  className = "",
  markClass = "h-6 w-auto md:h-7",
  wordClass = "text-[1.05rem] tracking-[0.24em]",
}: {
  word?: boolean;
  className?: string;
  markClass?: string;
  wordClass?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/astralyn_logo.svg"
        alt="Astralyn"
        className={markClass}
      />
      {word && (
        <span className={`display leading-none text-white ${wordClass}`}>
          ASTRALYN
        </span>
      )}
    </span>
  );
}
