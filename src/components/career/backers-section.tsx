/**
 * Formerly `.section_backend` — Andercore's investor logo wall (Atomico,
 * Project A, …). Repurposed as a text-only grid of METITO's four core values;
 * the section keeps its export name so `/career` keeps compiling.
 */
import { cn } from "@/lib/utils";

interface CoreValue {
  name: string;
  description: string;
}

const CORE_VALUES: readonly CoreValue[] = [
  {
    name: "Quality",
    description:
      "Produk berkualitas tinggi dengan harga kompetitif — standar yang sama kami terapkan pada setiap pekerjaan engineering dan maintenance.",
  },
  {
    name: "Excellent Service",
    description:
      "Layanan yang responsif dan andal, mulai dari konsultasi teknis hingga dukungan purna jual di lokasi pelanggan.",
  },
  {
    name: "Integrity",
    description:
      "Hubungan jangka panjang dibangun atas dasar kepercayaan — dengan pelanggan, mitra, dan sesama rekan kerja.",
  },
  {
    name: "Innovation",
    description:
      "Solusi engineering yang efektif dan efisien untuk kebutuhan air, industri, dan pertambangan di Indonesia.",
  },
];

export function BackersSection() {
  return (
    <section className="padding-global">
      <div className="border-x border-line">
        <div className="w-full pt-huge" />

        <div className="mx-auto flex w-full max-w-[36rem] flex-col items-center justify-start gap-3 text-center max-md:px-4">
          <div className="tagline">Nilai-Nilai Kami</div>
          <h2 className="text-h2 font-medium leading-1-1 tracking-h2 text-navy">
            Empat nilai yang menjadi dasar cara kami bekerja
          </h2>
        </div>

        <div className="w-full pt-large" />

        <div className="grid grid-cols-[1fr] md:grid-cols-[1fr_1fr] lg:grid-cols-[1fr_1fr_1fr_1fr]">
          {CORE_VALUES.map((value, index) => (
            <div
              key={value.name}
              className={cn(
                "flex w-full flex-col gap-3 border-t border-r border-line px-6 py-10 max-md:border-r-0 lg:min-h-[16rem]",
                index === CORE_VALUES.length - 1 && "border-r-0"
              )}
            >
              <div className="font-mono text-tiny uppercase leading-1-5 text-blue">
                {String(index + 1).padStart(2, "0")}
              </div>
              <h3 className="text-h3 font-medium leading-1-2 tracking-h3 text-navy">
                {value.name}
              </h3>
              <p className="text-regular leading-1-5 text-body">{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
