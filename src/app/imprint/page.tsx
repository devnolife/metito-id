import type { Metadata } from "next";

import { SectionDivider } from "@/components/layout/section-divider";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

import { ImprintDetailsSection } from "@/components/legal/imprint-details-section";
import { ImprintUsageSection } from "@/components/legal/imprint-usage-section";
import { CtaSection } from "@/components/shared/cta-section";
import { FinalDividerTwo } from "@/components/shared/final-divider-two";

export const metadata: Metadata = {
  title: "Informasi Perusahaan | METITO",
  description:
    "Informasi resmi PT Multi Enviro Tirta Teknologi (METITO): identitas badan usaha, NIB, KBLI, alamat kantor, dan kontak.",
};

export default function ImprintPage() {
  return (
    <>
      <SiteHeader />
      <main className="bg-bg">
        <ImprintDetailsSection />
        <SectionDivider />
        <ImprintUsageSection />
        <FinalDividerTwo />
        <CtaSection />
        <FinalDividerTwo />
      </main>
      <SiteFooter />
    </>
  );
}
