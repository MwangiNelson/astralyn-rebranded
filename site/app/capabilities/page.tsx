import { redirect } from "next/navigation";

/** Capabilities now live within the About experience. */
export default function CapabilitiesPage() {
  redirect("/about");
}
