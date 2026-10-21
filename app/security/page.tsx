import type { Metadata } from "next";
import SecurityPage from "@/components/security/SecurityPage";

export const metadata: Metadata = {
  title: "Website Security Check",
  description:
    "A free, passive check of your public website's security: TLS certificate, security headers, DNS records and email authentication. Coming soon from Astralyn Group, Nairobi.",
  alternates: { canonical: "/security" },
};

export default function Page() {
  return <SecurityPage />;
}
