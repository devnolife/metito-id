import type { Metadata } from "next";

import { SectionDivider } from "@/components/layout/section-divider";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

import { FaqSection } from "@/components/faqs/faq-section";
import { CtaSection } from "@/components/shared/cta-section";
import { FinalDividerTwo } from "@/components/shared/final-divider-two";

export const metadata: Metadata = {
  title: "FAQ METITO – Produk, Layanan, Pemesanan & Pengiriman",
  description:
    "Jawaban atas pertanyaan yang paling sering diajukan seputar produk, layanan engineering & maintenance, cara meminta penawaran, area pengiriman, dan legalitas PT Multi Enviro Tirta Teknologi (METITO).",
};

export default function FaqsPage() {
  return (
    <>
      <SiteHeader />
      <main className="bg-bg">
        <FaqSection />
        <SectionDivider />
        <CtaSection />
        <FinalDividerTwo />
      </main>
      <SiteFooter />
    </>
  );
}
