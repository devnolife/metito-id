import { Cog, FlaskConical, Package, Wrench, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type BusinessLine = {
  icon: LucideIcon;
  panel: string;
  title: string;
  body: string;
};

const CARDS: readonly BusinessLine[] = [
  {
    icon: FlaskConical,
    panel: "from-[#012966] to-[#096aae]",
    title: "Chemical Supply",
    body: "Penyediaan bahan kimia industri untuk berbagai aplikasi — water & wastewater treatment, boiler & cooling tower, hingga maintenance chemicals.",
  },
  {
    icon: Wrench,
    panel: "from-[#1e7226] to-[#3a9a44]",
    title: "Engineering Services",
    body: "Layanan teknik profesional dan konsultasi yang mencakup perancangan, instalasi, hingga pemeliharaan sistem dan proses industri.",
  },
  {
    icon: Cog,
    panel: "from-[#096aae] to-[#2f96d4]",
    title: "Equipment Supply",
    body: "Kerja sama dengan berbagai produsen dan pemasok terpercaya memastikan ketersediaan equipment serta sistem pendukung berstandar industri.",
  },
  {
    icon: Package,
    panel: "from-[#fe4d00] to-[#fb8501]",
    title: "Spare Parts Supply",
    body: "Suku cadang original dan alternatif berkualitas sesuai standar industri — ketersediaan tepat waktu, menjaga produktivitas, meminimalkan downtime.",
  },
];

export function SolutionSection() {
  return (
    <section id="lini-bisnis" className="padding-global">
      <div className="border-x border-line">
        <div className="w-full pt-huge" />

        <div className="mx-auto flex w-full max-w-[31.25rem] flex-col items-center justify-start gap-3 text-center max-md:px-4">
          <div className="tagline">Lini Bisnis</div>
          <h2 className="text-h2 font-medium leading-1-1 tracking-h2 text-navy">
            Solusi satu atap untuk kebutuhan industri Anda
          </h2>
        </div>

        <div className="mt-8 grid grid-cols-1 md:mt-12 md:grid-cols-2 lg:grid-cols-4">
          {CARDS.map((card, index) => (
            <div
              key={card.title}
              className={cn(
                "flex flex-col gap-6 border-y border-line",
                index < CARDS.length - 1 && "md:border-r",
              )}
            >
              <div
                className={cn(
                  "flex aspect-[1/1.1] items-center justify-center overflow-hidden bg-gradient-to-br md:aspect-square lg:aspect-[3/4]",
                  card.panel,
                )}
              >
                <card.icon
                  className="h-24 w-24 text-white/90"
                  strokeWidth={1}
                  aria-hidden="true"
                />
              </div>

              <div className="flex flex-col gap-3 px-4 pb-10 md:px-small">
                <h3 className="text-h3 font-medium leading-1-2 tracking-h3 text-navy">
                  {card.title}
                </h3>
                <p className="text-regular leading-1-5 text-body">{card.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
