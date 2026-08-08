import type { Metadata } from "next";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { CtaSection } from "@/components/shared/cta-section";
import { FinalDividerTwo } from "@/components/shared/final-divider-two";
import { LegalSection } from "@/components/shared/legal-section";
import { TERMS_HTML } from "@/data/legal/terms";

export const metadata: Metadata = {
  title: "Syarat & Ketentuan Pelanggan | METITO",
  description:
    "Syarat dan ketentuan penjualan produk dan jasa engineering PT Multi Enviro Tirta Teknologi (METITO).",
};

export default function TermsPage() {
  return (
    <>
      <SiteHeader />
      <main className="bg-bg">
        <LegalSection html={TERMS_HTML} />
        <FinalDividerTwo />
        <CtaSection />
        <FinalDividerTwo />
      </main>
      <SiteFooter />
    </>
  );
}
