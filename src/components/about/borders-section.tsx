const VISION =
  "Menjadi mitra terpercaya dalam penyediaan solusi terintegrasi untuk kebutuhan air, industri, dan pertambangan di Indonesia.";

const MISSIONS: readonly string[] = [
  "Menyediakan produk berkualitas tinggi dengan harga kompetitif.",
  "Memberikan solusi engineering yang efektif dan efisien.",
  "Membangun hubungan jangka panjang berbasis kepercayaan.",
  "Mendukung keberlanjutan operasional pelanggan.",
];

/**
 * `.border_main_wrapper` — repurposed menjadi blok "Visi & Misi" METITO.
 * Peta dot-matrix putih (map.svg, aset tema gelap) dan tombol karier Andercore
 * dihapus; diganti dua panel teks berbingkai.
 *
 * container  padding-block 3rem (4rem >= 768)
 * header     max-width 37rem, centred (left-aligned < 768), padding-inline 1rem
 * panels     2 kolom >= 768 · 1 kolom < 768
 */
export function BordersSection() {
  return (
    <section className="padding-global">
      <div className="border-x border-line py-12 md:py-16">
        <div className="mx-auto flex max-w-[37rem] flex-col items-start justify-start gap-4 px-4 md:items-center md:text-center">
          <div className="flex flex-col items-start justify-start gap-3 md:items-center">
            <div className="tagline">Visi &amp; Misi</div>
            <h2 className="text-h2 font-medium leading-1-1 tracking-h2 text-navy">
              Arah yang jelas untuk industri Indonesia
            </h2>
          </div>
          <p className="text-regular leading-1-5 text-body">
            Visi dan misi METITO menjadi pegangan kami dalam setiap kemitraan — dari pengadaan
            produk hingga layanan engineering di lapangan.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 px-4 md:mt-12 md:grid-cols-[1fr_1fr] md:gap-6 md:px-8">
          <div className="flex flex-col gap-4 border border-line bg-bg-shade p-6 md:p-8">
            <div className="tagline">Visi</div>
            <p className="text-h3 font-medium leading-1-3 tracking-h3 text-navy">{VISION}</p>
          </div>

          <div className="flex flex-col gap-4 border border-line p-6 md:p-8">
            <div className="tagline">Misi</div>
            <ol className="flex flex-col gap-3">
              {MISSIONS.map((mission, index) => (
                <li key={mission} className="flex items-start gap-3">
                  <span className="pt-1 font-mono text-tiny leading-1-5 text-blue">
                    0{index + 1}
                  </span>
                  <span className="text-regular leading-1-5 text-body">{mission}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
