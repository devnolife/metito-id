import { ProgressHeader } from "@/components/shared/progress-header";

import { AcTable } from "./ac-table";

const INTRO =
  "PT Multi Enviro Tirta Teknologi (METITO) adalah perusahaan penyedia solusi terintegrasi untuk sektor Water Treatment, Industrial Supply, Engineering, Equipment, Spare Parts, dan Mining Support Services. Berbekal pengalaman dan kompetensi teknis di bidang water treatment, wastewater treatment, dan sistem industri lainnya, METITO hadir sebagai mitra terpercaya bagi industri, komersial, maupun institusi dalam menjaga keandalan operasional sistem pengolahan air mereka.";

const ROWS: readonly { label: string; text: string }[] = [
  {
    label: "Perusahaan",
    text: "PT Multi Enviro Tirta Teknologi — dikenal dengan brand METITO.",
  },
  {
    label: "Bidang Usaha",
    text: "Water Treatment, Industrial Supply, Engineering, Equipment, Spare Parts, dan Mining Support Services.",
  },
  {
    label: "Kompetensi",
    text: "Water treatment, wastewater treatment, dan sistem industri lainnya.",
  },
  {
    label: "Pelanggan",
    text: "Industri, komersial, dan institusi yang mengutamakan keandalan operasional sistem pengolahan air.",
  },
  {
    label: "Komitmen",
    text: "Kemitraan jangka panjang yang mendukung efisiensi OpEx dan CapEx pelanggan.",
  },
  {
    label: "Legalitas",
    text: "NIB 2310250113814 terbit melalui sistem OSS pada 23 Oktober 2025, status penanaman modal dalam negeri (PMDN).",
  },
];

/** `.progress_main_wrapper` — "Tentang METITO" + tabel ringkasan perusahaan. */
export function HeritageSection() {
  return (
    <section className="padding-global">
      <div className="border-x border-line pt-16 pb-0.5">
        <ProgressHeader
          tagline="Tentang METITO"
          heading="Mitra terpercaya untuk keandalan operasional industri"
          intro={INTRO}
          introInside
        />

        <AcTable variant="timeline" wrapperClassName="mt-5">
          <tbody>
            {ROWS.map((row) => (
              <tr key={row.label}>
                <th scope="row">{row.label}</th>
                <td>{row.text}</td>
              </tr>
            ))}
          </tbody>
        </AcTable>
      </div>
    </section>
  );
}
