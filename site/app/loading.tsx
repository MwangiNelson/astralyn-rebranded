/**
 * Route-level loading state — shown by Next while a segment streams in, so a
 * navigation never leaves the visitor on a blank hang.
 */
export default function Loading() {
  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-midnight">
      <div className="grid-bg grid-bg-fade absolute inset-0 opacity-25" />
      <div className="relative flex flex-col items-center gap-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/astralyn_logo.svg"
          alt=""
          aria-hidden
          className="h-12 w-auto animate-pulse md:h-14"
        />
        <div className="h-px w-40 overflow-hidden bg-white/12">
          <div className="loading-strip h-full w-1/3 bg-white/80" />
        </div>
      </div>
    </div>
  );
}
