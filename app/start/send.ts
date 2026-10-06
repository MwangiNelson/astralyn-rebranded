"use server";

import nodemailer from "nodemailer";

/* ------------------------------------------------------------
   The intake lands in Nelson's inbox, sent from that same Zoho
   mailbox so SPF and DKIM for astralyngroup.com line up and it
   does not read as spam. The visitor is the Reply-To, so
   answering the email answers them.

   Needs SMTP_USER and SMTP_PASS in the environment. SMTP_HOST
   defaults to smtp.zoho.com, Zoho's host for free accounts;
   smtppro.zoho.com answers "554 Access Restricted" to those.
   Set SMTP_HOST=smtppro.zoho.com once the mailbox is on a paid plan.
------------------------------------------------------------ */

const TO = "nelson@astralyngroup.com";

export type Signal = {
  kind: string;
  forces: string[];
  scale: string;
  name: string;
  email: string;
  vision: string;
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** One line of text: newlines and runs of space collapse to a single space. */
function line(v: unknown, max: number) {
  return typeof v === "string" ? v.replace(/\s+/g, " ").trim().slice(0, max) : "";
}

export async function sendSignal(input: Signal): Promise<{ ok: boolean }> {
  // ponytail: no rate limit or captcha. Add one if spam starts arriving.
  const name = line(input?.name, 120);
  const email = line(input?.email, 200);
  const kind = line(input?.kind, 60);
  const scale = line(input?.scale, 60);
  const vision =
    typeof input?.vision === "string" ? input.vision.trim().slice(0, 5000) : "";
  const forces = Array.isArray(input?.forces)
    ? input.forces.slice(0, 5).map((f) => line(f, 60)).filter(Boolean)
    : [];

  if (!name || !EMAIL.test(email)) return { ok: false };

  const { SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_USER || !SMTP_PASS) {
    console.error("[start] SMTP_USER / SMTP_PASS not set; intake not sent");
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
      replyTo: { name, address: email },
      subject: `New enquiry from ${name}`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        `Powering: ${kind || "-"}`,
        `Forces: ${forces.join(", ") || "-"}`,
        `Scale: ${scale || "-"}`,
        "",
        vision || "(no vision given)",
      ].join("\n"),
    });
    return { ok: true };
  } catch (err) {
    console.error("[start] intake send failed", err);
    return { ok: false };
  }
}
