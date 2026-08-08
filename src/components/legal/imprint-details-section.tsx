import { Fragment, type ReactNode } from "react";

/**
 * `/imprint` — "Informasi Perusahaan"
 *
 * Layout (unchanged from the measured original):
 *
 *   section .imprint_main_wrapper   padding-inline 5%
 *     div  .imprint_main_component  border-left/right 1px border-line
 *       div .imprint_main_header    padding 80px 32px 32px; flex column; gap 8px
 *         h1  .heading-style-h1     56/61.6 · 500 · tracking-h1 · text-navy
 *         div                       16/24 · text-body
 *       div .imprint_main_card      padding 12px 32px; flex column; items-start
 *                                   border-top 1px border-line (first card: none)
 *
 * Labels use the `.tagline` utility (uppercase mono eyebrow). E-mail, phone
 * and website values render as anchors; `globals.css` gives `a` inherited
 * colour and no underline, so they look like plain text.
 *
 * Content: official registration data of PT Multi Enviro Tirta Teknologi
 * (METITO). Do not add data that is not officially published.
 */

type ImprintRow = {
  label: string;
  value: ReactNode;
};

const ROWS: readonly ImprintRow[] = [
  {
    label: "Nama Badan Usaha",
    value: "PT Multi Enviro Tirta Teknologi (METITO)",
  },
  {
    label: "Alamat Kantor",
    value: (
      <>
        Bonto Bila, Desa/Kelurahan Lembang Parang
        <br />
        Kec. Barombong, Kab. Gowa
        <br />
        Provinsi Sulawesi Selatan, Kode Pos 90225
        <br />
        Indonesia
      </>
    ),
  },
  {
    label: "Email",
    value: <a href="mailto:info@metito.id">info@metito.id</a>,
  },
  {
    label: "Telepon / WhatsApp",
    value: (
      <>
        <a href="tel:+6281217603950">0812-1760-3950</a> (Telepon/WhatsApp)
        <br />
        <a href="tel:+6282155551235">0821-5555-1235</a> (Telepon/WhatsApp)
        <br />
        <a href="tel:+6285399544912">0853-9954-4912</a> (Telepon)
      </>
    ),
  },
  {
    label: "Website",
    value: <a href="https://www.metito.id">www.metito.id</a>,
  },
  {
    label: "NIB (Nomor Induk Berusaha)",
    value: "2310250113814 — diterbitkan melalui sistem OSS pada 23 Oktober 2025",
  },
  {
    label: "Status Penanaman Modal",
    value: "PMDN (Penanaman Modal Dalam Negeri) — Skala Usaha Kecil",
  },
  {
    label: "KBLI",
    value: (
      <>
        46591 — Perdagangan Besar Mesin Kantor dan Industri Pengolahan, Suku Cadang dan
        Perlengkapannya
        <br />
        35129 — Aktivitas Penunjang Tenaga Listrik Lainnya
      </>
    ),
  },
  {
    label: "Bidang Usaha",
    value:
      "Chemical Supply, Engineering Services, Equipment Supply, dan Spare Parts Supply untuk water treatment, industri, dan pertambangan",
  },
];

const CARD = "flex flex-col items-start justify-start px-medium py-3";

export function ImprintDetailsSection() {
  return (
    <section className="padding-global">
      <div className="border-x border-line">
        <div className="px-medium flex flex-col gap-xxsmall pt-20 pb-8">
          <h1 className="text-h1 leading-1-1 font-medium tracking-h1 text-navy">
            Informasi Perusahaan
          </h1>
          <div>PT Multi Enviro Tirta Teknologi (METITO)</div>
        </div>

        {ROWS.map((row, index) => (
          <Fragment key={row.label}>
            {/* `.imprint_main_card.is-no-border` — only the very first label row. */}
            <div className={index === 0 ? CARD : `${CARD} border-t border-line`}>
              <div className="tagline">{row.label}</div>
            </div>
            <div className={`${CARD} border-t border-line`}>
              <div>{row.value}</div>
            </div>
          </Fragment>
        ))}
      </div>
    </section>
  );
}
