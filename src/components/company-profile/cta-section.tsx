import { CtaSection } from "@/components/shared/cta-section";

/**
 * /company-profile CTA — wraps the shared METITO contact CTA. The Webflow `-2`
 * class quirks from the Andercore original (1rem headline fallback, hard-coded
 * 2rem gap) are intentionally dropped so the slogan renders at full size on the
 * light theme.
 */
export function ProfileCtaSection() {
  return <CtaSection />;
}
