import type { Metadata } from "next";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { CtaSection } from "@/components/shared/cta-section";
import { FinalDividerTwo } from "@/components/shared/final-divider-two";
import { LegalSection } from "@/components/shared/legal-section";
import { TERMS_SUPPLIERS_HTML } from "@/data/legal/terms-suppliers";

export const metadata: Metadata = {
  title: "Syarat & Ketentuan Pemasok | METITO",
  description:
    "Syarat dan ketentuan pengadaan barang dan jasa bagi pemasok dan vendor PT Multi Enviro Tirta Teknologi (METITO).",
};

export default function TermsSuppliersPage() {
  return (
    <>
      <SiteHeader />
      <main className="bg-bg">
        <LegalSection html={TERMS_SUPPLIERS_HTML} />
        <FinalDividerTwo />
        <CtaSection />
        <FinalDividerTwo />
      </main>
      <SiteFooter />
    </>
  );
}
