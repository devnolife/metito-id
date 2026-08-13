import type { Metadata } from "next";

import { SectionDivider } from "@/components/layout/section-divider";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

import { AboutHeroSection } from "@/components/about/hero-section";
import { BordersSection } from "@/components/about/borders-section";
import { ProgressSection } from "@/components/about/progress-section";
import {
  BACKED_HEADING,
  BACKED_TAGLINE,
  BackedSection,
  INDUSTRY_ITEMS,
} from "@/components/shared/backed-section";
import { CtaSection } from "@/components/shared/cta-section";
import {
  PrincipleSection,
  type PrincipleCard,
} from "@/components/shared/principle-section";
import {
  UPDATES_HEADING,
  UPDATES_INTRO,
  pressArticles,
} from "@/components/shared/press-articles";
import { UpdatesSection } from "@/components/shared/updates-section";

export const metadata: Metadata = {
  title: "Tentang Kami | METITO — PT Multi Enviro Tirta Teknologi",
  description:
    "METITO adalah penyedia solusi terintegrasi untuk Water Treatment, Industrial Supply, Engineering, Equipment, Spare Parts, dan Mining Support Services — mitra terpercaya industri di Indonesia.",
};

const CORE_VALUES: readonly PrincipleCard[] = [
  {
    title: "Quality",
    body: "Produk berkualitas tinggi yang bersumber dari supplier terpercaya — kualitas produk terjamin di setiap pengadaan.",
  },
  {
    title: "Excellent Service",
    body: "Layanan purna jual dan dukungan teknis profesional untuk menjaga kepuasan dan keandalan operasional pelanggan.",
  },
  {
    title: "Integrity",
    body: "Hubungan jangka panjang dibangun di atas kepercayaan — komitmen yang kami pegang di setiap kemitraan.",
  },
  {
    title: "Innovation",
    body: "Solusi engineering yang efektif dan efisien untuk kebutuhan air, industri, dan pertambangan.",
  },
];

const BACKED_INTRO =
  "Dari tambang batubara, nikel, dan emas hingga pembangkit listrik — METITO melayani kebutuhan water treatment dan suplai industri lintas sektor, membantu pelanggan menjaga keandalan operasional sistem pengolahan air mereka.";

export default function AboutUsPage() {
  return (
    <>
      <SiteHeader />
      <main className="bg-bg">
        <AboutHeroSection />
        <SectionDivider />
        <PrincipleSection
          tagline="Nilai Perusahaan"
          heading="Nilai yang menjadi inti kami:"
          cards={CORE_VALUES}
        />
        <SectionDivider />
        <BordersSection />
        <SectionDivider />
        <ProgressSection />
        <SectionDivider />
        <BackedSection
          tagline={BACKED_TAGLINE}
          heading={BACKED_HEADING}
          intro={BACKED_INTRO}
          itemsLabel="Sektor"
          items={INDUSTRY_ITEMS}
        />
        <SectionDivider />
        <UpdatesSection
          heading={UPDATES_HEADING}
          intro={UPDATES_INTRO}
          articles={pressArticles()}
        />
        <SectionDivider />
        <CtaSection />
      </main>
      <SiteFooter />
    </>
  );
}
