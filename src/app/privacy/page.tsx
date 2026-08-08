import type { Metadata } from "next";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { CtaSection } from "@/components/shared/cta-section";
import { FinalDividerTwo } from "@/components/shared/final-divider-two";
import { LegalSection } from "@/components/shared/legal-section";
import { PRIVACY_HTML } from "@/data/legal/privacy";

export const metadata: Metadata = {
  title: "Kebijakan Privasi | METITO",
  description:
    "Kebijakan privasi PT Multi Enviro Tirta Teknologi (METITO): bagaimana kami mengumpulkan, menggunakan, dan melindungi data pribadi Anda sesuai peraturan yang berlaku di Indonesia.",
};

export default function PrivacyPage() {
  return (
    <>
      <SiteHeader />
      <main className="bg-bg">
        <LegalSection html={PRIVACY_HTML} />
        <FinalDividerTwo />
        <CtaSection />
        <FinalDividerTwo />
      </main>
      <SiteFooter />
    </>
  );
}
