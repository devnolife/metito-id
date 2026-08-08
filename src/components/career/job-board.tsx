import { ButtonLink } from "@/components/ui/button";
import { EXTERNAL } from "@/lib/site";

/**
 * Pengganti papan lowongan Ashby milik Andercore. METITO tidak memasang daftar
 * lowongan aktif — halaman ini memakai alur lamaran umum: daftar bidang yang
 * dapat dilamar plus CTA kirim CV via email / WhatsApp.
 */
interface ApplicationField {
  title: string;
  scope: string;
}

const APPLICATION_FIELDS: readonly ApplicationField[] = [
  {
    title: "Teknisi Water Treatment",
    scope:
      "Installation & commissioning, preventive/corrective maintenance, dan troubleshooting sistem pengolahan air — RO system, demineralization plant, hingga chlorine dioxide system.",
  },
  {
    title: "Sales Engineer",
    scope:
      "Penawaran produk dan solusi — chemical, equipment, dan spare parts — untuk pelanggan di sektor mining, petrochemical, oil & gas, palm oil refinery, dan power plants.",
  },
  {
    title: "Chemical Engineer",
    scope:
      "Design WTP/WWTP/STP, plant audit, chemical dosing system, serta dukungan engineering untuk efisiensi operasional pelanggan.",
  },
  {
    title: "Admin & Logistik",
    scope:
      "Administrasi, pengadaan, dan koordinasi pengiriman produk ke pelanggan di seluruh Indonesia.",
  },
];

const APPLY_MAILTO = `${EXTERNAL.email}?subject=${encodeURIComponent("Lamaran Kerja - METITO")}`;

export function JobBoard() {
  return (
    <div className="mx-auto w-full max-w-[45rem] px-4 pb-24">
      <p className="tagline">Bidang yang dapat dilamar</p>
      <p className="mt-3 text-regular leading-1-5 text-body">
        Saat ini kami tidak memasang daftar lowongan aktif. Bidang berikut adalah area yang
        relevan dengan kebutuhan tim kami — Anda dapat mengirimkan lamaran umum kapan saja,
        dan kami akan menghubungi Anda bila ada kebutuhan yang sesuai.
      </p>

      <div className="mt-8 border-t border-line">
        {APPLICATION_FIELDS.map((field) => (
          <div key={field.title} className="flex flex-col gap-2 border-b border-line py-6">
            <h3 className="text-xlarge font-medium leading-1-2 text-navy">{field.title}</h3>
            <p className="text-small leading-1-5 text-body">{field.scope}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <ButtonLink href={APPLY_MAILTO} className="max-xs:w-full">
          Kirim CV ke info@metito.id
        </ButtonLink>
        <ButtonLink href={EXTERNAL.whatsapp} variant="secondary" className="max-xs:w-full">
          Lamar via WhatsApp
        </ButtonLink>
      </div>

      <p className="mt-6 text-small leading-1-5 text-body">
        Lampirkan CV beserta surat lamaran singkat Anda, dan cantumkan bidang yang dilamar
        pada subjek email atau pesan WhatsApp.
      </p>
    </div>
  );
}
