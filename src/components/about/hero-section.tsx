import Link from "next/link";

const P1 =
  "PT Multi Enviro Tirta Teknologi (METITO) adalah perusahaan penyedia solusi terintegrasi untuk sektor Water Treatment, Industrial Supply, Engineering, Equipment, Spare Parts, dan Mining Support Services.";
const P2 =
  "Berbekal pengalaman dan kompetensi teknis di bidang water treatment, wastewater treatment, dan sistem industri lainnya, METITO hadir sebagai mitra terpercaya bagi industri, komersial, maupun institusi dalam menjaga keandalan operasional sistem pengolahan air mereka.";
const P3 =
  "Kami berkomitmen membangun kemitraan jangka panjang yang mendukung efisiensi OpEx dan CapEx pelanggan. Pelajari lebih lanjut pada ";

/**
 * `.about-hero_main_wrapper` — full-bleed brand panel, copy pinned left.
 * The dark Andercore photo (`bg-main.jpg`) is replaced by a navy→blue
 * gradient panel from the METITO palette.
 *
 * container  gradient panel · padding-inline 2rem (1rem < 768) · padding-block section-md
 * content    max-width 35rem · gap 1rem · header gap .75rem
 */
export function AboutHeroSection() {
  return (
    <section className="padding-global">
      <div className="border-x border-line bg-gradient-to-br from-[#012966] to-[#096aae] px-4 py-section-md md:px-8">
        <div className="flex max-w-[35rem] flex-col items-start justify-start gap-4">
          <div className="flex flex-col gap-3">
            <div className="tagline text-[#9ed4f5]">Tentang Kami</div>
            <h1 className="text-h1 font-medium leading-1-1 tracking-h1 text-[#fff]">
              Solusi terintegrasi untuk air, industri, dan pertambangan
            </h1>
          </div>

          <p className="text-regular leading-1-5 text-cream/90">
            {P1}
            <br />
            <br />
            {P2}
            <br />
            <br />
            {P3}
            <Link
              href="/company-profile"
              className="text-[#fff] underline underline-offset-4 hover:text-cream"
            >
              profil perusahaan METITO
            </Link>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
