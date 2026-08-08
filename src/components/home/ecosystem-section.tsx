import {
  Droplets,
  Factory,
  Fuel,
  Mountain,
  Trees,
  Zap,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

type Industry = {
  icon: LucideIcon;
  title: string;
  body: string;
};

const INDUSTRIES: readonly Industry[] = [
  {
    icon: Mountain,
    title: "Mining",
    body: "Pertambangan batubara, nikel, emas, dan mineral lainnya.",
  },
  {
    icon: Factory,
    title: "Petrochemical",
    body: "Industri petrokimia dan pengolahan kimia.",
  },
  {
    icon: Fuel,
    title: "Oil & Gas",
    body: "Eksplorasi dan produksi minyak & gas bumi.",
  },
  {
    icon: Trees,
    title: "Palm Oil Refinery",
    body: "Pabrik pengolahan kelapa sawit.",
  },
  {
    icon: Droplets,
    title: "Water Treatment",
    body: "Instalasi pengolahan air bersih dan limbah.",
  },
  {
    icon: Zap,
    title: "Power Plants",
    body: "Pembangkit listrik tenaga uap dan gas.",
  },
];

export function EcosystemSection() {
  return (
    <section className="padding-global">
      <div className="border-x border-line">
        <div className="w-full pt-xlarge" />

        <div className="mx-auto flex max-w-[37rem] flex-col items-center justify-start gap-4 text-center max-md:p-4">
          <h2 className="text-h2 font-medium leading-1-1 tracking-h2 text-navy">
            Industri yang{" "}
            <br className="max-lg:hidden" />
            kami layani
          </h2>
          <p className="text-regular leading-1-5 text-body">
            Dari pertambangan hingga pembangkit listrik — METITO mendukung keandalan operasional
            berbagai sektor industri di Indonesia.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 md:mt-12 md:grid-cols-3">
          {INDUSTRIES.map((industry, index) => (
            <div
              key={industry.title}
              className={cn(
                "flex flex-col items-center justify-start gap-4 border-t border-line p-8 text-center",
                index % 3 !== 2 && "md:border-r",
              )}
            >
              <industry.icon className="h-10 w-10 text-blue" strokeWidth={1.25} aria-hidden="true" />
              <div className="flex flex-col gap-2">
                <h3 className="text-h5 font-medium leading-1-4 text-navy">{industry.title}</h3>
                <p className="text-small leading-1-5 text-body">{industry.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
