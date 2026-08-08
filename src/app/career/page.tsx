import type { Metadata } from "next";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { SectionDivider } from "@/components/layout/section-divider";

import { CareerHeroSection } from "@/components/career/hero-section";
import { BackersSection } from "@/components/career/backers-section";
import { LifeSection } from "@/components/career/life-section";
import { OpeningsSection } from "@/components/career/openings-section";
import { TalentPartnersSection } from "@/components/career/talent-partners-section";
import { ApplyCtaSection } from "@/components/career/apply-cta-section";
import { FinalDivider } from "@/components/career/final-divider";

const TITLE = "Karier di METITO – PT Multi Enviro Tirta Teknologi";
const DESCRIPTION =
  "Bergabunglah dengan METITO, penyedia solusi terintegrasi untuk water treatment, industrial supply, engineering, dan mining support services di Indonesia. Kirim CV Anda ke info@metito.id.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    type: "website",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/seo/opengraph.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/seo/opengraph.png"],
  },
};

export default function CareerPage() {
  return (
    <>
      <SiteHeader />
      <main className="bg-bg">
        <CareerHeroSection />
        <SectionDivider />
        <BackersSection />
        <SectionDivider />
        <LifeSection />
        <SectionDivider />
        <OpeningsSection />
        <SectionDivider />
        <TalentPartnersSection />
        <SectionDivider />
        <ApplyCtaSection />
        <FinalDivider />
      </main>
      <SiteFooter />
    </>
  );
}
