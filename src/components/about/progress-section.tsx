import { ProgressHeader } from "@/components/shared/progress-header";

const INTRO =
  "METITO hadir sebagai mitra terpercaya bagi industri, komersial, maupun institusi dalam menjaga keandalan operasional sistem pengolahan air mereka.";

const OUTRO_1 =
  "Bagi kami, setiap pengadaan adalah awal dari hubungan jangka panjang yang dibangun di atas kepercayaan.";
const OUTRO_2 = "Clean Water, Clean Future.";

const ROWS: readonly { label: string; text: string }[] = [
  {
    label: "Kualitas Produk",
    text: "Produk berkualitas tinggi dari supplier terpercaya, dengan harga yang kompetitif",
  },
  {
    label: "Pengiriman",
    text: "Pengiriman tepat waktu untuk menjaga kelangsungan operasional pelanggan",
  },
  {
    label: "Dukungan Teknis",
    text: "Layanan purna jual dan dukungan teknis profesional",
  },
  {
    label: "Engineering",
    text: "Solusi engineering yang efektif dan efisien — dari perancangan hingga instalasi dan commissioning",
  },
  {
    label: "Pemeliharaan",
    text: "Preventive maintenance, plant audit, troubleshooting system, hingga annual maintenance agreement (AMA)",
  },
  {
    label: "Suku Cadang",
    text: "Suku cadang original dan alternatif untuk meminimalkan downtime",
  },
];

const ROW =
  "grid grid-cols-[1fr] gap-2 border-b border-line px-4 py-3 md:grid-cols-[10rem_1fr] md:px-8";

/**
 * `.progress_main_wrapper` — repurposed menjadi "Komitmen Kemitraan" METITO:
 * header kiri, tabel bentuk dukungan, dan penutup slogan.
 *
 * container  padding-top 4rem, padding-bottom 3rem (4rem >= 768)
 * table      margin-top 3rem (2rem top and bottom < 768)
 * rows       10rem / 1fr grid, .75rem 2rem padding, 1px bottom rule
 */
export function ProgressSection() {
  return (
    <section className="padding-global">
      <div className="border-x border-line pt-16 pb-12 md:pb-16">
        <ProgressHeader
          tagline="Komitmen Kemitraan"
          heading="Kemitraan jangka panjang yang mendukung efisiensi OpEx dan CapEx pelanggan"
          intro={INTRO}
        />

        <div className="my-8 md:mt-12 md:mb-8">
          <div className={ROW}>
            <div>
              <div className="tagline">Bentuk Dukungan</div>
            </div>
          </div>

          {ROWS.map((row) => (
            <div key={row.label} className={ROW}>
              <div>
                <div className="font-medium text-navy">{row.label}</div>
              </div>
              <div>
                <div className="text-body">{row.text}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="max-w-[37rem] px-4 md:px-8">
          <p className="text-regular leading-1-5 text-body">
            {OUTRO_1}
            <br />
            <br />
            <span className="font-mono text-tiny uppercase text-tag">{OUTRO_2}</span>
          </p>
        </div>
      </div>
    </section>
  );
}
