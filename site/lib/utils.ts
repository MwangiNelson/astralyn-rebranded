export type ClassValue = string | number | false | null | undefined;

/**
 * Minimal classnames joiner. Dependency-free (no clsx / tailwind-merge) so the
 * project doesn't need extra installs. Filters falsy values and joins with a
 * space — sufficient for the shadcn-style components we use.
 */
export function cn(...inputs: ClassValue[]): string {
  return inputs.filter(Boolean).join(" ");
}
