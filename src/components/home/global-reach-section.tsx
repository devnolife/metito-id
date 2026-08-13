import { Reveal } from "@/components/ui/reveal";
import { revealDelay } from "@/components/ui/reveal-timing";
import { cn } from "@/lib/utils";

type LocationGroupData = {
  label: string;
  items: readonly string[];
  className?: string;
};

type Region = {
  title: string;
  className?: string;
  groups: readonly LocationGroupData[];
};

const REGIONS: readonly Region[] = [
  {
    title: "Kantor Pusat",
    className: "border-b border-line md:border-b-0 md:border-r",
    groups: [
      {
        label: "Sulawesi Selatan",
        items: ["Bontobila, Barombong", "Kab. Gowa"],
      },
      {
        label: "Kontak",
        items: ["0812-1760-3950", "0821-5555-1235", "info@metito.id"],
      },
    ],
  },
  {
    title: "Cakupan Layanan",
    groups: [
      {
        label: "Wilayah",
        items: ["Sulawesi", "Kalimantan", "Jawa", "Sumatera", "Seluruh Indonesia"],
      },
      {
        label: "Sektor",
        items: ["Mining", "Petrochemical", "Oil & Gas", "Palm Oil Refinery", "Power Plants"],
      },
    ],
  },
];

function LocationGroup({ label, items, className, delay }: LocationGroupData & { delay?: number }) {
  return (
    <Reveal
      delay={delay}
      className={cn("flex w-full flex-col items-start justify-start gap-1.5", className)}
    >
      <div className="tagline">{label}</div>
      <div className="flex flex-col items-start justify-start gap-1">
        {items.map((item) => (
          <span key={item} className="text-regular leading-1-5 text-body">
            {item}
          </span>
        ))}
      </div>
    </Reveal>
  );
}

export function GlobalReachSection() {
  return (
    <section className="padding-global">
      <div className="border-x border-line">
        <Reveal className="mx-auto flex max-w-[37rem] flex-col items-center justify-start gap-4 px-4 pt-12 pb-8 text-center md:px-0 md:py-16">
          <h2 className="text-h2 font-medium leading-1-1 tracking-h2 text-navy">
            Berbasis di Sulawesi Selatan,{" "}
            <br className="max-lg:hidden" />
            melayani seluruh Indonesia
          </h2>
          <p className="text-regular leading-1-5 text-body">
            METITO berkantor pusat di Kab. Gowa, Sulawesi Selatan — mendukung kebutuhan industri,
            komersial, dan institusi di berbagai wilayah Indonesia dengan pengiriman tepat waktu.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 border-t border-line md:grid-cols-[1fr_1fr]">
          {REGIONS.map((region) => (
            <div
              key={region.title}
              className={cn("flex flex-col gap-6 px-6 py-8", region.className)}
            >
              <Reveal as="h3" className="text-h3 font-medium leading-1-2 tracking-h3 text-navy">
                {region.title}
              </Reveal>

              <div className="grid grid-cols-1 gap-7 xs:grid-cols-2">
                {region.groups.map((group, index) => (
                  <LocationGroup key={group.label} {...group} delay={revealDelay(index + 1)} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
