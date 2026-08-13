import type { Metadata } from "next";

import { SectionDivider } from "@/components/layout/section-divider";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

import { CategoriesSection } from "@/components/company-profile/categories-section";
import { CompanyFactsSection } from "@/components/company-profile/company-facts-section";
import { ProfileCtaSection } from "@/components/company-profile/cta-section";
import { DividerNote } from "@/components/company-profile/divider-note";
import { HeritageSection } from "@/components/company-profile/heritage-section";
import { ProfileHeroSection } from "@/components/company-profile/hero-section";
import { PositioningSection } from "@/components/company-profile/positioning-section";
import { PrecisionSection } from "@/components/company-profile/precision-section";
import { ReferencesSection } from "@/components/company-profile/references-section";

export const metadata: Metadata = {
  title: "Profil Perusahaan | METITO — PT Multi Enviro Tirta Teknologi",
  description:
    "Profil PT Multi Enviro Tirta Teknologi (METITO): perusahaan PMDN dengan NIB 2310250113814 di Kab. Gowa, Sulawesi Selatan — solusi terintegrasi untuk air, industri, dan pertambangan.",
};

export default function CompanyProfilePage() {
  return (
    <>
      <SiteHeader />
      <main className="bg-bg">
        <ProfileHeroSection />
        <SectionDivider />
        <CompanyFactsSection />
        <SectionDivider />
        <HeritageSection />
        <SectionDivider />
        <PositioningSection />
        <SectionDivider />
        <PrecisionSection />
        <SectionDivider />
        <CategoriesSection />
        <DividerNote />
        <ReferencesSection />
        <SectionDivider />
        <ProfileCtaSection />
      </main>
      <SiteFooter />
    </>
  );
}
