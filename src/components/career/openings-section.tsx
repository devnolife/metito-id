import { JobBoard } from "@/components/career/job-board";

/**
 * `#career-apply` — heading plus the general-application flow. On the Andercore
 * original this hosted an Ashby job-board iframe; METITO does not list active
 * vacancies, so `JobBoard` now renders the open-application fields instead.
 */
export function OpeningsSection() {
  return (
    <section id="career-apply" className="padding-global">
      <div className="border-x border-line">
        <div className="mx-auto flex w-full max-w-[35.5rem] flex-col items-center justify-start gap-3 pt-24 pb-12 text-center max-md:px-4">
          <div className="tagline">Bergabung dengan Kami</div>
          <h2 className="text-h2 font-medium leading-1-1 tracking-h2 text-navy">
            Kami selalu terbuka untuk talenta terbaik
          </h2>
        </div>

        <div>
          <JobBoard />
        </div>
      </div>
    </section>
  );
}
