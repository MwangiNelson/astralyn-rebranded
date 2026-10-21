"use server";

import nodemailer from "nodemailer";

/* ------------------------------------------------------------
   Sign-ups for the website exposure check, sent to the same inbox
   and through the same Zoho mailbox as the start form (see
   app/start/send.ts for why). Nothing is stored and nothing is
   scanned yet: each sign-up is an email a person follows up.

   A website is optional, but if one is given the visitor must
   confirm they own it or may have it assessed, because that site
   is the one we will check first when the scanner goes live.
------------------------------------------------------------ */

const TO = "nelson@astralyngroup.com";
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const HOST = /^(?=.{1,253}$)([a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/;

export type Notify = { email: string; website: string; authorised: boolean };

/** "https://www.Example.co.ke/about" → "www.example.co.ke". Empty when it is not a hostname. */
function hostname(v: unknown) {
  if (typeof v !== "string") return "";
  const h = v.trim().toLowerCase().replace(/^[a-z]+:\/\//, "").split(/[/?#:]/)[0];
  return HOST.test(h) ? h : "";
}

export async function notifyMe(input: Notify): Promise<{ ok: boolean }> {
  // ponytail: no rate limit or captcha, same as the start form. Add one if spam arrives.
  const email = typeof input?.email === "string" ? input.email.trim().slice(0, 200) : "";
  const rawSite = typeof input?.website === "string" ? input.website.trim() : "";
  const site = hostname(rawSite);

  if (!EMAIL.test(email)) return { ok: false };
  if (rawSite && (!site || input?.authorised !== true)) return { ok: false };

  const { SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_USER || !SMTP_PASS) {
    console.error("[security] SMTP_USER / SMTP_PASS not set; sign-up not sent");
    return { ok: false };
  }

  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.zoho.com",
    port: Number(process.env.SMTP_PORT || 465),
    secure: Number(process.env.SMTP_PORT || 465) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  try {
    await transport.sendMail({
      from: { name: "Astralyn website", address: SMTP_USER },
      to: TO,
      replyTo: email,
      subject: `Security check sign-up: ${site || email}`,
      text: [
        `Email: ${email}`,
        `Website: ${site || "(none given)"}`,
        ...(site ? ["Confirmed they own it or may have it assessed: yes"] : []),
        "",
        "They asked to hear when the website exposure check is live.",
      ].join("\n"),
    });
    return { ok: true };
  } catch (err) {
    console.error("[security] sign-up send failed", err);
    return { ok: false };
  }
}
