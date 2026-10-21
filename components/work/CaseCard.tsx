import type { Client } from "@/lib/clients";

/** One piece of work: the client's mark in brushed metal, what it is, and a way to see it.
 *  Systems behind a client's sign-in have no public address, so they are offered on request. */
export default function CaseCard({ client, summary }: { client: Client; summary?: string }) {
  const Tag = client.href ? "a" : "div";
  const link = client.href
    ? { href: client.href, target: "_blank", rel: "noopener noreferrer", "aria-label": `${client.name}, opens in a new tab` }
    : {};
  return (
    <Tag {...link} className="client-tile chrome-edge group h-full">
      <div className="relative z-[4] flex items-start justify-between gap-4">
        <span className="font-mono text-[0.58rem] tracking-[0.2em] text-steel-2 uppercase">
          {client.sector}
        </span>
        <span className="font-mono text-[0.55rem] tracking-[0.2em] text-steel uppercase">
          {client.inHouse ? "Our product" : "Client"}
        </span>
      </div>

      <div className="relative z-[4] flex min-h-[4.5rem] items-center py-6">
        {client.logo ? (
          <img
            src={client.logo}
            alt={`${client.name} logo`}
            loading="lazy"
            decoding="async"
            className="client-tile__logo"
          />
        ) : (
          <span className="client-tile__wordmark">{client.name}</span>
        )}
      </div>

      <div className="relative z-[4]">
        <div className="chrome-rule mb-4" />
        <div className="flex items-baseline justify-between gap-4">
          <p className="display-title text-lg text-white transition-colors duration-700 group-hover:text-chrome">
            {client.name}
          </p>
          <span className="font-mono text-[0.58rem] tracking-[0.2em] text-steel uppercase tabular-nums">
            {client.year ?? client.status}
          </span>
        </div>
        {summary && <p className="mt-3 text-sm leading-relaxed text-silver">{summary}</p>}
        <p className="mt-4 font-mono text-[0.6rem] tracking-[0.22em] text-silver uppercase transition-colors duration-500 group-hover:text-white">
          {client.href ? "See it live ↗" : "Shown on request"}
        </p>
      </div>
    </Tag>
  );
}
