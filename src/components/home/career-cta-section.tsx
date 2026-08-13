import { LogoMark } from "@/components/icons";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { EXTERNAL } from "@/lib/site";

export function CareerCtaSection() {
  return (
    <section className="padding-global">
      <div className="grid grid-cols-1 border-x border-line lg:grid-cols-[1fr_1fr]">
        <div>
          <div className="flex flex-col items-start justify-start gap-8 px-4 pt-8 pb-12 md:max-w-[30.5rem] md:px-8 md:py-16">
            <Reveal className="flex flex-col items-start justify-start gap-4">
              <div className="flex flex-col gap-3">
                <div className="tagline">Kemitraan</div>
                <h2 className="text-h2 font-medium leading-1-1 tracking-h2 text-navy">
                  Komitmen kami terhadap kemitraan jangka panjang
                </h2>
              </div>
              <p className="text-regular leading-1-5 text-body">
                Kami tidak hanya menjual produk dan jasa, tetapi membangun kemitraan yang mendukung
                efisiensi biaya operasional (OpEx) dan investasi modal (CapEx) perusahaan Anda agar
                tetap kompetitif di pasar.
              </p>
            </Reveal>

            <Reveal delay={140}>
              <ButtonLink href={EXTERNAL.whatsapp} variant="primary" className="max-xs:w-full">
                Hubungi Kami untuk Konsultasi
              </ButtonLink>
            </Reveal>
          </div>
        </div>

        {/* Di bawah 1024px panel ini melompat ke ATAS teks (`max-lg:row-start-1`),
            jadi urutannya sengaja dipicu per elemen, bukan mengikuti urutan baca. */}
        <div className="relative flex aspect-square items-center justify-center overflow-hidden bg-gradient-to-br from-[#012966] via-[#0a4a8c] to-[#096aae] max-lg:col-start-1 max-lg:row-start-1">
          <Reveal className="flex flex-col items-center gap-6 px-8 text-center">
            <div className="rounded-full bg-white/95 p-6 shadow-[0_24px_48px_rgba(1,20,45,0.35)]">
              <LogoMark className="h-24 md:h-32" />
            </div>
            <div className="font-mono text-small font-bold uppercase tracking-[0.2em] text-[#fff]">
              Clean Water, Clean Future.
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
