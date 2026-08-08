import { ProgressHeader } from "@/components/shared/progress-header";

import { AcTable } from "./ac-table";

const INTRO =
  "Keunggulan METITO dibangun dari hal-hal fundamental: kualitas produk, ketepatan waktu pengiriman, dan layanan yang menjaga kepuasan pelanggan.";

const ADVANTAGES: readonly [string, string][] = [
  [
    "Kualitas Produk Terjamin",
    "Produk berkualitas tinggi yang bersumber dari supplier terpercaya.",
  ],
  [
    "Pengiriman Tepat Waktu",
    "Komitmen pengiriman tepat waktu untuk menjaga kelangsungan operasional dan meminimalkan downtime.",
  ],
  [
    "Kepuasan Pelanggan",
    "Layanan purna jual dan dukungan teknis profesional di sepanjang masa pakai sistem Anda.",
  ],
];

const COMMIT_TITLE = "Kemitraan jangka panjang, bukan sekadar transaksi";
const COMMIT_BODY =
  "Kami berkomitmen membangun kemitraan jangka panjang yang mendukung efisiensi OpEx dan CapEx pelanggan — hubungan yang dibangun di atas kepercayaan dan keberlanjutan operasional.";
const COMMIT_SLOGAN = "Clean Water, Clean Future.";

const VALUE_CELLS: readonly [string, string][] = [
  ["Quality", "Excellent Service"],
  ["Integrity", "Innovation"],
];

/**
 * `.principle_main_wrapper` #5 — "Keunggulan Kami". Header kiri, tabel keunggulan,
 * blok komitmen, lalu tabel nilai perusahaan (menggantikan daftar pelanggan dan
 * testimoni Andercore).
 */
export function ReferencesSection() {
  return (
    <section className="padding-global">
      <div className="border-x border-line pt-16 pb-0.5">
        <ProgressHeader
          tagline="Keunggulan Kami"
          heading="Komitmen kami kepada setiap pelanggan"
          intro={INTRO}
          introInside
        />

        <AcTable variant="rowlabel" wrapperClassName="mt-5">
          <tbody>
            {ADVANTAGES.map(([label, value]) => (
              <tr key={label}>
                <th scope="row">{label}</th>
                <td>{value}</td>
              </tr>
            ))}
          </tbody>
        </AcTable>

        <div className="flex max-w-[37rem] flex-col gap-3 px-4 pt-10 pb-2 md:px-8">
          <h3 className="text-h3 font-medium leading-1-2 tracking-h3 text-navy">
            {COMMIT_TITLE}
          </h3>
          <p className="text-regular leading-1-5 text-body">{COMMIT_BODY}</p>
          <p className="font-mono text-tiny uppercase text-tag">{COMMIT_SLOGAN}</p>
        </div>

        <AcTable variant="gridBig" wrapperClassName="mt-5">
          <thead>
            <tr>
              <th scope="col" colSpan={2}>
                Nilai Perusahaan
              </th>
            </tr>
          </thead>
          <tbody>
            {VALUE_CELLS.map(([left, right]) => (
              <tr key={left}>
                <td>{left}</td>
                <td>{right}</td>
              </tr>
            ))}
          </tbody>
        </AcTable>
      </div>
    </section>
  );
}
