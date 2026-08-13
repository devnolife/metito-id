"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

/** Webflow tab fade: outgoing pane 100ms, incoming pane 300ms, `ease`. */
const FADE_OUT_MS = 100;

type PlatformCard = {
  image: string;
  title: string;
  body: string;
  alt: string;
};

type PlatformPane = {
  id: string;
  label: string;
  cta: string;
  href: string;
  cards: readonly PlatformCard[];
};

const PANES: readonly PlatformPane[] = [
  {
    id: "produk",
    label: "Produk",
    cta: "Minta Penawaran Produk",
    href: "mailto:info@metito.id",
    cards: [
      {
        image: "/images/home/produk-water-treatment",
        title: "Water Treatment",
        body: "Ion Exchange Resin, Filter Media, Membrane RO/UF/NF, Activated Carbon — didukung bahan kimia WTP/WWTP/STP seperti PAC, tawas, caustic soda, antiscalant RO, hingga membrane cleaner.",
        alt: "Drum dan jerigen bahan kimia pengolahan air tersusun di atas palet dalam gudang METITO.",
      },
      {
        image: "/images/home/produk-equipment-supply",
        title: "Equipment Supply",
        body: "HP Pump, Feed Pump, Dosing Pump, Blower, Multi Media Filter, Carbon Filter, Softener, RO System, Demin Plant, Chlorine Dioxide Generator, instrumentasi, dan sistem pendukung lainnya.",
        alt: "Pompa sentrifugal dan dosing pump dalam peti kayu bersiap dikirim di samping skid sistem reverse osmosis.",
      },
      {
        image: "/images/home/produk-consumables",
        title: "Consumables & Spare Parts",
        body: "Cartridge Filter, Valve, Mechanical Seal, Gasket, Bearing — plus Carbon Graphite: carbon brush, carbon vane, carbon seal, dan carbon connector.",
        alt: "Deretan valve, flange, dan sambungan perpipaan pada instalasi pengolahan air.",
      },
      {
        image: "/images/home/produk-mining",
        title: "Mining & Material Handling",
        body: "Conveyor Belt, Idler Roller, Crusher Parts (jaw, cone, impact, hammer), Vibrating Screen, hingga komponen belt conveyor: pulley, gearbox, motor, dan belt cleaner.",
        alt: "Fasilitas pengolahan air industri berskala besar dengan bak sedimentasi dan jaringan perpipaan.",
      },
    ],
  },
  {
    id: "layanan",
    label: "Layanan",
    cta: "Konsultasi Layanan Engineering",
    href: "https://wa.me/6281217603950",
    cards: [
      {
        image: "/images/home/layanan-design-engineering",
        title: "Design & Engineering WTP / WWTP / STP",
        body: "Desain dan engineering sistem pengolahan air — Reverse Osmosis System, Demineralization Plant, Chlorine Dioxide System, hingga Chemical Dosing System.",
        alt: "Pandangan udara instalasi pengolahan air lengkap dengan clarifier, silo, dan gedung proses.",
      },
      {
        image: "/images/home/layanan-instalasi",
        title: "Instalasi & Commissioning",
        body: "Fabrikasi tangki, piping, dan struktur baja; instalasi serta komisioning sistem; upgrade kapasitas dan efisiensi sistem eksisting.",
        alt: "Teknisi bersafety helmet merakit perpipaan stainless steel dan valve pada skid sistem.",
      },
      {
        image: "/images/home/layanan-maintenance",
        title: "Preventive & Corrective Maintenance",
        body: "Kontrak perawatan rutin, condition monitoring & predictive maintenance, annual maintenance agreement (AMA), hingga shutdown & turnaround support.",
        alt: "Bak clarifier dan jembatan pipa pada instalasi pengolahan air yang beroperasi normal.",
      },
      {
        image: "/images/home/layanan-plant-audit",
        title: "Plant Audit & Troubleshooting",
        body: "Audit kinerja plant, troubleshooting & optimasi proses, alignment, balancing & vibration analysis, serta manpower supply teknisi dan engineer.",
        alt: "Engineer METITO melakukan inspeksi lapangan dengan tablet di area instalasi pengolahan air.",
      },
    ],
  },
];

const imageSrcSet = (base: string) =>
  `${base}-p-500.jpg 500w, ${base}-p-800.jpg 800w, ${base}.jpg 912w`;

export function PlatformSection() {
  const [active, setActive] = useState(0);
  const [displayed, setDisplayed] = useState(0);
  const [phase, setPhase] = useState<"idle" | "out" | "in">("idle");
  const buttonsRef = useRef<Array<HTMLButtonElement | null>>([]);
  const displayedRef = useRef(0);
  const fadeTimer = useRef<number | null>(null);
  const fadeFrames = useRef<number[]>([]);

  const clearFade = useCallback(() => {
    if (fadeTimer.current !== null) window.clearTimeout(fadeTimer.current);
    fadeTimer.current = null;
    fadeFrames.current.forEach((frame) => cancelAnimationFrame(frame));
    fadeFrames.current = [];
  }, []);

  /** Webflow cross-fade: current pane out over 100ms, then the next one in over 300ms. */
  const selectTab = useCallback(
    (index: number) => {
      setActive(index);
      if (index === displayedRef.current) return;
      clearFade();
      setPhase("out");
      fadeTimer.current = window.setTimeout(() => {
        displayedRef.current = index;
        setDisplayed(index);
        setPhase("in");
        fadeFrames.current.push(
          requestAnimationFrame(() => {
            fadeFrames.current.push(requestAnimationFrame(() => setPhase("idle")));
          }),
        );
      }, FADE_OUT_MS);
    },
    [clearFade],
  );

  useEffect(() => clearFade, [clearFade]);

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
      let next = index;
      if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (index + 1) % PANES.length;
      else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (index - 1 + PANES.length) % PANES.length;
      else if (event.key === "Home") next = 0;
      else if (event.key === "End") next = PANES.length - 1;
      else return;
      event.preventDefault();
      selectTab(next);
      buttonsRef.current[next]?.focus();
    },
    [selectTab],
  );

  const paneFade = cn(
    "transition-opacity ease-[cubic-bezier(0.25,0.1,0.25,1)]",
    phase === "out" && "opacity-0 duration-100",
    phase === "in" && "opacity-0 duration-300",
    phase === "idle" && "opacity-100 duration-300",
  );

  return (
    <section className="padding-global">
      <div className="border-x border-line pt-xxlarge pb-xhuge md:pt-xlarge md:pb-xlarge">
        {/* header — hanya bagian ini yang di-reveal. Kartunya sengaja tidak:
            pane yang tidak aktif berada dalam keadaan `hidden`, sehingga
            IntersectionObserver tidak akan pernah memicunya, dan kartu pane
            kedua akan tersangkut tak terlihat saat tab berpindah. Kartunya
            sudah punya cross-fade sendiri (100ms keluar / 300ms masuk). */}
        <Reveal className="flex flex-col items-start justify-start gap-4 px-6 md:mx-auto md:max-w-[30.25rem] md:items-center md:px-0 md:text-center">
          <div className="flex flex-col items-start justify-start gap-3 md:items-center">
            <div className="tagline">Produk &amp; Layanan</div>
            <h2 className="text-h2 font-medium leading-1-1 tracking-h2 text-navy">
              Produk berkualitas untuk sistem pengolahan air &amp; industri
            </h2>
          </div>
          <div className="w-full max-w-[20rem]">
            <p className="text-regular leading-1-5 text-body">
              Kualitas, keandalan, dan ketersediaan tepat waktu — semua dari satu mitra terpercaya.
            </p>
          </div>
        </Reveal>

        {/* body */}
        <div className="mt-8">
          <div className="relative flex flex-col items-center justify-between">
            <div
              role="tablist"
              aria-label="Produk dan layanan"
              className="relative mx-4 flex w-auto overflow-hidden rounded-[0.25rem] border border-line md:mx-medium"
            >
              {PANES.map((pane, index) => (
                <button
                  key={pane.id}
                  ref={(node) => {
                    buttonsRef.current[index] = node;
                  }}
                  type="button"
                  role="tab"
                  id={`platform-tab-${pane.id}`}
                  aria-selected={index === active}
                  aria-controls={`platform-panel-${pane.id}`}
                  tabIndex={index === active ? 0 : -1}
                  onClick={() => selectTab(index)}
                  onKeyDown={(event) => onKeyDown(event, index)}
                  className={cn(
                    "relative block min-w-[9rem] px-8 py-4 text-center text-regular leading-1-5 font-medium",
                    index === active ? "bg-bg-shade text-navy" : "bg-transparent text-body",
                  )}
                >
                  <span className="block">{pane.label}</span>
                  {index < PANES.length - 1 && (
                    <span className="absolute inset-y-0 right-0 block w-px bg-line" />
                  )}
                  {index === active && (
                    <span className="absolute inset-x-0 bottom-0 block h-[0.1875rem] bg-brand" />
                  )}
                </button>
              ))}
            </div>

            <div className="relative mt-8 w-full overflow-hidden">
              {PANES.map((pane, index) => (
                <div
                  key={pane.id}
                  id={`platform-panel-${pane.id}`}
                  role="tabpanel"
                  aria-labelledby={`platform-tab-${pane.id}`}
                  className={cn("relative", index === displayed ? cn("block", paneFade) : "hidden")}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2">
                    {pane.cards.map((card, cardIndex) => (
                      <div
                        key={card.title}
                        className={cn(
                          "flex flex-col gap-6 border-b border-line",
                          cardIndex % 2 === 0 && "md:border-r md:border-line",
                        )}
                      >
                        <div className="aspect-[3/2] overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={`${card.image}.jpg`}
                            srcSet={imageSrcSet(card.image)}
                            sizes="(max-width: 767px) 100vw, 50vw"
                            alt={card.alt}
                            width={912}
                            height={600}
                            loading="lazy"
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex flex-col gap-3 px-4 pb-8 md:px-8 md:pb-10">
                          <h3 className="text-h3 font-medium leading-1-2 tracking-h3 text-navy">
                            {card.title}
                          </h3>
                          <p className="text-regular leading-1-5 text-body">{card.body}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 flex items-start justify-center px-4 md:px-0">
                    <ButtonLink href={pane.href} className="max-xs:w-full">
                      {pane.cta}
                    </ButtonLink>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
