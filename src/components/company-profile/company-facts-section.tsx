import { PrincipleSection } from "@/components/shared/principle-section";

import { StatGrid, type StatCard } from "./stat-grid";

const INTRO =
  "PT Multi Enviro Tirta Teknologi adalah perusahaan penanaman modal dalam negeri (PMDN) yang berkedudukan di Kabupaten Gowa, Sulawesi Selatan, dan terdaftar resmi melalui sistem OSS.";

const ROW_1: readonly StatCard[] = [
  { label: "Nama Perusahaan", value: "PT Multi Enviro Tirta Teknologi" },
  { label: "Brand", value: "METITO" },
  { label: "Status", value: "PMDN (Penanaman Modal Dalam Negeri)" },
  { label: "Skala Usaha", value: "Usaha Kecil" },
];

const ROW_2: readonly StatCard[] = [
  { label: "NIB", value: "2310250113814 (OSS)" },
  { label: "Tanggal Terbit", value: "23 Oktober 2025" },
  {
    label: "KBLI 46591",
    value:
      "Perdagangan Besar Mesin Kantor dan Industri Pengolahan, Suku Cadang dan Perlengkapannya",
  },
  { label: "KBLI 35129", value: "Aktivitas Penunjang Tenaga Listrik Lainnya" },
];

const ROW_3: readonly StatCard[] = [
  {
    label: "Alamat",
    value:
      "Bonto Bila, Desa/Kel. Lembang Parang, Kec. Barombong, Kab. Gowa, Sulawesi Selatan 90225",
  },
  { label: "Telepon / WhatsApp", value: "0812-1760-3950 · 0821-5555-1235 · 0853-9954-4912" },
  { label: "Email", value: "info@metito.id" },
  { label: "Website", value: "www.metito.id" },
];

/** `.principle_main_wrapper` #1 — "Fakta Perusahaan" + tiga baris kartu data resmi. */
export function CompanyFactsSection() {
  return (
    <PrincipleSection
      tagline="Fakta Perusahaan"
      heading="Terdaftar resmi, siap mendukung operasional Anda"
      intro={INTRO}
    >
      <StatGrid items={ROW_1} />
      <StatGrid items={ROW_2} />
      <StatGrid items={ROW_3} />
    </PrincipleSection>
  );
}
