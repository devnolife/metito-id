import { LogoMark } from "@/components/icons";
import { ButtonLink } from "@/components/ui/button";
import { COMPANY, EXTERNAL } from "@/lib/site";

const APPLY_MAILTO = `${EXTERNAL.email}?subject=${encodeURIComponent("Lamaran Kerja - METITO")}`;

/**
 * `.cta_main_wrapper` on `/career` — the closing "kirim lamaran" panel.
 * The dark `container.svg` artwork is replaced by the soft water-blue radial
 * glow used by the shared CTA, with the METITO kingfisher mark up top.
 */
export function ApplyCtaSection() {
  return (
    <section className="padding-global">
      <div className="border-x border-t border-line bg-[radial-gradient(60%_50%_at_50%_0%,rgba(9,106,174,0.12),transparent_70%)] pt-28 pb-15 max-md:px-4">
        <div className="mx-auto flex w-full max-w-[35rem] flex-col items-center justify-start gap-medium">
          <div className="flex flex-col items-center justify-start gap-4 text-center">
            <LogoMark className="mb-2 h-16" />
            <h2 className="text-h2 font-medium leading-1-1 tracking-h2 text-navy">
              Kirim Lamaran Anda
            </h2>
            <div className="text-regular leading-1-5 text-body">
              Kirimkan CV dan surat lamaran singkat Anda melalui email atau WhatsApp, dan
              cantumkan bidang yang ingin dilamar pada subjek pesan. Tim {COMPANY.brand} akan
              menghubungi Anda bila ada kebutuhan yang sesuai.
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 max-xs:w-full">
            <ButtonLink href={APPLY_MAILTO} className="max-xs:w-full">
              Kirim CV via Email
            </ButtonLink>
            <ButtonLink href={EXTERNAL.whatsapp} variant="secondary" className="max-xs:w-full">
              Hubungi via WhatsApp
            </ButtonLink>
          </div>

          <a href={EXTERNAL.email} className="text-regular leading-1-5 text-brand">
            {COMPANY.email}
          </a>
        </div>
      </div>
    </section>
  );
}
