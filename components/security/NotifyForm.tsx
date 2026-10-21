"use client";

import { useState } from "react";
import { notifyMe } from "@/app/security/notify";

const FIELD =
  "w-full appearance-none border border-white/[0.15] bg-transparent px-5 py-4 font-sans text-base text-white placeholder:text-steel outline-none transition-all duration-700 focus:border-white/60 focus:shadow-[0_0_36px_rgba(245,246,247,0.10)]";

export default function NotifyForm() {
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [authorised, setAuthorised] = useState(false);
  const [state, setState] = useState<"idle" | "sending" | "sent" | "failed">("idle");

  const needsConsent = website.trim() !== "";
  const ready = /\S+@\S+\.\S+/.test(email) && (!needsConsent || authorised);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!ready || state === "sending") return;
    setState("sending");
    const { ok } = await notifyMe({ email, website, authorised });
    setState(ok ? "sent" : "failed");
  }

  if (state === "sent") {
    return (
      <p role="status" className="max-w-md text-base leading-relaxed text-chrome">
        Thanks. We&apos;ll email you when the check is ready
        {needsConsent ? ", and run it on your website first" : ""}.
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="max-w-md space-y-4" noValidate>
      <div>
        <label htmlFor="notify-email" className="label mb-3 block">
          Email
        </label>
        <input
          id="notify-email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.co.ke"
          className={FIELD}
        />
      </div>
      <div>
        <label htmlFor="notify-site" className="label mb-3 block">
          Website (optional)
        </label>
        <input
          id="notify-site"
          type="text"
          inputMode="url"
          autoComplete="url"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          placeholder="company.co.ke"
          className={FIELD}
        />
      </div>
      {needsConsent && (
        <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-silver">
          <input
            type="checkbox"
            checked={authorised}
            onChange={(e) => setAuthorised(e.target.checked)}
            className="mt-1 h-4 w-4 shrink-0 accent-white"
          />
          I own this website, or I am allowed to have it checked.
        </label>
      )}
      <button
        type="submit"
        disabled={!ready || state === "sending"}
        className="btn-core btn-solid w-full justify-center disabled:cursor-not-allowed disabled:opacity-40"
      >
        {state === "sending" ? "Sending" : "Tell me when it's ready"}
      </button>
      <p className="text-xs leading-relaxed text-steel-2">
        We use these details only to tell you when the check is live and to
        follow up on your website. Ask us and we&apos;ll delete them.
      </p>
      {state === "failed" && (
        <p role="alert" className="text-sm leading-relaxed text-silver">
          That did not go through. Write to{" "}
          <a href="mailto:nelson@astralyngroup.com" className="text-white underline underline-offset-4">
            nelson@astralyngroup.com
          </a>{" "}
          and it reaches the same inbox.
        </p>
      )}
    </form>
  );
}
