const P1 =
  "METITO — PT Multi Enviro Tirta Teknologi — adalah perusahaan penyedia solusi terintegrasi untuk sektor Water Treatment, Industrial Supply, Engineering, Equipment, Spare Parts, dan Mining Support Services.";
const P2 =
  "Berbekal pengalaman dan kompetensi teknis di bidang water treatment, wastewater treatment, dan sistem industri lainnya, kami melayani pelanggan industri, komersial, maupun institusi di Indonesia dari Kabupaten Gowa, Sulawesi Selatan.";
const P3 =
  "Perusahaan berstatus penanaman modal dalam negeri (PMDN) dengan NIB 2310250113814, bergerak pada bidang usaha KBLI 46591 dan KBLI 35129.";

/**
 * The first `<section>` of /company-profile.
 *
 * Unlike /about-us this hero nests two bordered frames, so the vertical rails are
 * doubled 1px apart. The dark Andercore photo (`bg-main.jpg`) is replaced by a
 * navy→blue gradient panel from the METITO palette.
 */
export function ProfileHeroSection() {
  return (
    <section className="padding-global bg-bg">
      <div className="border-x border-line">
        <div className="border-x border-line bg-gradient-to-br from-[#012966] to-[#096aae] px-4 py-section-md md:px-8">
          <div className="flex max-w-[35rem] flex-col items-start justify-start gap-4">
            <div className="flex flex-col gap-3">
              <div className="tagline text-[#9ed4f5]">{"Profil\u00a0Perusahaan"}</div>
              <h1 className="text-h1 font-medium leading-1-1 tracking-h1 text-[#fff]">
                PT Multi Enviro Tirta Teknologi
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
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
