import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { SectionDivider } from "@/components/layout/section-divider";

import { HeroSection } from "@/components/home/hero-section";
import { ChallengeSection } from "@/components/home/challenge-section";
import { SolutionSection } from "@/components/home/solution-section";
import { EcosystemSection } from "@/components/home/ecosystem-section";
import { WorkSection } from "@/components/home/work-section";
import { PlatformSection } from "@/components/home/platform-section";
import { QualitySection } from "@/components/home/quality-section";
import { GlobalReachSection } from "@/components/home/global-reach-section";
import { CareerCtaSection } from "@/components/home/career-cta-section";
import { CtaSection } from "@/components/shared/cta-section";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="bg-bg">
        <HeroSection />
        <SectionDivider />
        <ChallengeSection />
        <SectionDivider />
        <SolutionSection />
        <SectionDivider variant="alt" mobileOnly />
        <EcosystemSection />
        <SectionDivider desktopOnly />
        <WorkSection />
        <SectionDivider />
        <PlatformSection />
        <SectionDivider />
        <QualitySection />
        <SectionDivider />
        <GlobalReachSection />
        <SectionDivider />
        <CareerCtaSection />
        <SectionDivider />
        <CtaSection />
      </main>
      <SiteFooter />
    </>
  );
}
