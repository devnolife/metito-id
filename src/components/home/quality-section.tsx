import { Award, Handshake, Lightbulb, Star, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type CoreValue = {
  icon: LucideIcon;
  title: string;
  body: string;
};

const CORE_VALUES: readonly CoreValue[] = [
  {
    icon: Award,
    title: "Quality",
    body: "Produk berkualitas tinggi dengan harga kompetitif dari supplier terpercaya.",
  },
  {
    icon: Star,
    title: "Excellent Service",
    body: "Solusi engineering yang efektif dan efisien di setiap tahap pekerjaan.",
  },
  {
    icon: Handshake,
    title: "Integrity",
    body: "Hubungan jangka panjang yang dibangun di atas kepercayaan.",
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    body: "Teknologi dan pendekatan baru untuk mendukung keberlanjutan operasional pelanggan.",
  },
];

export function QualitySection() {
  return (
    <section className="padding-global">
      <div className="grid grid-cols-1 border-x border-line lg:grid-cols-2">
        <div className="flex items-center justify-start border-b border-line px-4 pb-8 pt-12 md:px-8 md:pb-16 md:pt-16 lg:border-b-0 lg:border-r">
          <div className="flex flex-col items-start justify-start gap-6 md:max-w-[26.5rem]">
            <div className="flex flex-col gap-4">
              <div className="tagline">Visi</div>
              <h2 className="text-h2 font-medium leading-1-1 tracking-h2 text-navy">
                Menjadi mitra terpercaya dalam penyediaan solusi terintegrasi
              </h2>
              <p className="text-regular leading-1-5 text-body">
                Untuk kebutuhan air, industri, dan pertambangan di Indonesia.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <div className="tagline">Misi</div>
              <ul className="flex list-none flex-col gap-2 text-regular leading-1-5 text-body">
                <li>— Menyediakan produk berkualitas tinggi dengan harga kompetitif</li>
                <li>— Memberikan solusi engineering yang efektif dan efisien</li>
                <li>— Membangun hubungan jangka panjang berbasis kepercayaan</li>
                <li>— Mendukung keberlanjutan operasional pelanggan</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1">
          {CORE_VALUES.map((value, index) => (
            <div
              key={value.title}
              className={cn(
                "flex items-center gap-5 border-b border-line px-6 py-6 md:px-8",
                index === CORE_VALUES.length - 1 && "lg:border-b-0",
              )}
            >
              <value.icon
                className="h-8 w-8 shrink-0 text-blue"
                strokeWidth={1.25}
                aria-hidden="true"
              />
              <div className="flex flex-col gap-1">
                <h3 className="text-h5 font-medium leading-1-4 text-navy">{value.title}</h3>
                <p className="text-small leading-1-5 text-body">{value.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
