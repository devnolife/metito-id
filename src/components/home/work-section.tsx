"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { ButtonLink } from "@/components/ui/button";
import { EXTERNAL } from "@/lib/site";
import { cn } from "@/lib/utils";

/** Exact duration of the auto-cycle loader bar on the live site (GSAP `duration: 6`). */
const CYCLE_MS = 6000;

/** Webflow tab fade: outgoing pane 100ms, incoming pane 300ms, `ease`. */
const FADE_OUT_MS = 100;

type WorkTab = {
  label: string;
  tag: string;
  title: string;
  body: string;
  image: string;
};

const TABS: readonly WorkTab[] = [
  {
    label: "Konsultasi",
    tag: "01",
    title: "Sampaikan kebutuhan teknis",
    body: "Spesifikasi, volume, dan jadwal kebutuhan Anda kami terima melalui telepon, email, atau WhatsApp. Tim teknis kami membantu mengidentifikasi solusi yang paling efektif dan efisien.",
    image: "/images/delivery-en-01",
  },
  {
    label: "Penawaran",
    tag: "02",
    title: "Terima penawaran & solusi",
    body: "Harga, spesifikasi produk, dan waktu pengiriman dirangkum dalam satu penawaran yang jelas. Konsultasi teknis dan penawaran harga tanpa biaya.",
    image: "/images/delivery-en-02",
  },
  {
    label: "Pengiriman & Support",
    tag: "03",
    title: "Pengiriman, instalasi & purna jual",
    body: "Pengiriman tepat waktu ke lokasi Anda, didukung instalasi, komisioning, serta layanan purna jual dan dukungan teknis profesional yang berkelanjutan.",
    image: "/images/delivery-en-03",
  },
];

const imageSrcSet = (base: string) =>
  `${base}-p-500.jpg 500w, ${base}-p-800.jpg 800w, ${base}.jpg 912w`;

/**
 * `.work_main_tab_content` — used twice per tab:
 *  - `variant="accordion"` inside the tab itself (visible < 992px only)
 *  - `variant="pane"` in the shared `.w-tab-content` below the tab bar (visible >= 768px only)
 *
 * `grid-cols-[1fr_1fr]` (not `grid-cols-2`) is deliberate: Webflow authors plain `1fr 1fr`, i.e.
 * `minmax(auto, 1fr)`. In the 229.73px-wide accordion column the copy track wins its min-content
 * (169.72px) and the image track keeps the 60.02px remainder. Tailwind's `grid-cols-2` emits
 * `minmax(0, 1fr)` and would split it 114.87/114.87.
 */
function PaneBody({ tab, variant }: { tab: WorkTab; variant: "accordion" | "pane" }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr]">
      <div className="flex flex-col items-start justify-end gap-3 p-4 md:border-r md:border-line md:p-medium lg:pr-[7.5rem]">
        <h3 className="text-h3 font-medium leading-1-2 tracking-h3 text-navy">{tab.title}</h3>
        <p
          className={cn(
            "text-regular leading-1-5 text-body",
            // 768-991: the accordion sits inside the `.w--current` tab link, whose `color` is the
            // brand red; the `max-767` rule that resets it back to the body colour no longer applies.
            variant === "accordion" && "md:text-brand",
          )}
        >
          {tab.body}
        </p>
      </div>
      <div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`${tab.image}.jpg`}
          srcSet={imageSrcSet(tab.image)}
          sizes="(max-width: 912px) 100vw, 912px"
          alt=""
          width={912}
          height={750}
          loading="eager"
          className="max-h-[31.25rem] w-full object-cover"
        />
      </div>
    </div>
  );
}

export function WorkSection() {
  const [active, setActive] = useState(0);
  const [displayed, setDisplayed] = useState(0);
  const [phase, setPhase] = useState<"idle" | "out" | "in">("idle");

  const tabsRef = useRef<HTMLDivElement | null>(null);
  const barsRef = useRef<Array<HTMLSpanElement | null>>([]);
  const buttonsRef = useRef<Array<HTMLButtonElement | null>>([]);
  const activeRef = useRef(0);
  const displayedRef = useRef(0);
  const fadeTimer = useRef<number | null>(null);
  const fadeFrames = useRef<number[]>([]);
  const playRef = useRef<(index: number) => void>(() => {});

  const clearFade = useCallback(() => {
    if (fadeTimer.current !== null) window.clearTimeout(fadeTimer.current);
    fadeTimer.current = null;
    fadeFrames.current.forEach((frame) => cancelAnimationFrame(frame));
    fadeFrames.current = [];
  }, []);

  /** Webflow cross-fade: current pane out over 100ms, then the next one in over 300ms. */
  const switchPane = useCallback(
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

  /* ------------------------------------------------------------------ *
   * Time-driven auto-cycle, armed by scroll (GSAP ScrollTrigger
   * `start: "top 80%"` == IntersectionObserver rootMargin bottom -20%).
   * ------------------------------------------------------------------ */
  useEffect(() => {
    const tabs = tabsRef.current;
    if (!tabs) return;

    let raf: number | null = null;
    let running = false;
    let current = activeRef.current;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const setBar = (index: number, width: string) => {
      const bar = barsRef.current[index];
      if (bar) bar.style.width = width;
    };
    const resetBars = () => TABS.forEach((_, i) => setBar(i, "0%"));
    const kill = () => {
      if (raf !== null) cancelAnimationFrame(raf);
      raf = null;
      running = false;
    };

    const play = (index: number) => {
      kill();
      current = index;
      activeRef.current = index;
      switchPane(index);
      resetBars();

      // Reduced motion: stay clickable, no auto-advance, bar jumps to 100%.
      if (motionQuery.matches) {
        setBar(index, "100%");
        return;
      }

      running = true;
      const started = performance.now();
      const tick = (now: number) => {
        const progress = Math.min((now - started) / CYCLE_MS, 1);
        setBar(current, `${progress * 100}%`);
        if (progress < 1) {
          raf = requestAnimationFrame(tick);
          return;
        }
        raf = null;
        play((current + 1) % TABS.length);
      };
      raf = requestAnimationFrame(tick);
    };

    playRef.current = play;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            if (!running) play(activeRef.current);
          } else if (entry.boundingClientRect.top > 0) {
            // Scrolled back ABOVE the trigger point → kill + reset (onLeaveBack).
            kill();
            resetBars();
          }
        }
      },
      { rootMargin: "0px 0px -20% 0px", threshold: 0 },
    );
    observer.observe(tabs);

    const onMotionChange = () => {
      kill();
      resetBars();
      if (motionQuery.matches) setBar(activeRef.current, "100%");
    };
    motionQuery.addEventListener("change", onMotionChange);

    return () => {
      observer.disconnect();
      motionQuery.removeEventListener("change", onMotionChange);
      kill();
    };
  }, [switchPane]);

  const onKeyDown = useCallback((event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next = index;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (index + 1) % TABS.length;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (index - 1 + TABS.length) % TABS.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = TABS.length - 1;
    else return;
    event.preventDefault();
    playRef.current(next);
    buttonsRef.current[next]?.focus();
  }, []);

  const paneFade = cn(
    "transition-opacity ease-[cubic-bezier(0.25,0.1,0.25,1)]",
    phase === "out" && "opacity-0 duration-100",
    phase === "in" && "opacity-0 duration-300",
    phase === "idle" && "opacity-100 duration-300",
  );

  return (
    <section className="padding-global">
      <div className="border-x border-line">
        {/* heading */}
        <div className="flex flex-col items-start justify-between gap-6 px-4 pt-12 pb-8 md:gap-8 md:px-medium md:pt-xlarge md:pb-large lg:flex-row lg:items-end">
          <div className="flex max-w-[28.5rem] flex-col items-start justify-start gap-4">
            <div className="flex flex-col items-start justify-start gap-3">
              <div className="tagline">Cara Kami Bekerja</div>
              <h2 className="text-h2 font-medium leading-1-1 tracking-h2 text-navy">
                Satu alur terpadu dari kebutuhan hingga pengiriman
              </h2>
            </div>
            <p className="text-regular leading-1-5 text-body">
              METITO menangani seluruh proses dalam satu alur terpadu — dari konsultasi teknis,
              penawaran harga, pengadaan, hingga pengiriman, instalasi, dan layanan purna jual di
              lokasi Anda.
            </p>
          </div>
          <div className="max-xs:w-full">
            <ButtonLink href={EXTERNAL.whatsapp} className="max-xs:w-full">
              Konsultasi Sekarang
            </ButtonLink>
          </div>
        </div>

        {/* tabs */}
        <div className="relative">
          <div
            ref={tabsRef}
            role="tablist"
            aria-label="Cara kami bekerja"
            className="relative flex flex-col border-y border-line md:grid md:grid-cols-3"
          >
            {TABS.map((tab, index) => (
              <div key={tab.tag} role="presentation" className="relative w-full bg-bg">
                <button
                  ref={(node) => {
                    buttonsRef.current[index] = node;
                  }}
                  type="button"
                  role="tab"
                  id={`work-tab-${index}`}
                  aria-selected={index === active}
                  aria-controls={`work-panel-${index}`}
                  tabIndex={index === active ? 0 : -1}
                  onClick={() => playRef.current(index)}
                  onKeyDown={(event) => onKeyDown(event, index)}
                  className={cn(
                    "relative flex w-full items-center justify-between bg-bg px-medium pt-4 pb-[1.01172rem] text-left",
                    "border-b border-line md:border-b-0",
                    index < TABS.length - 1 && "md:border-r md:border-line",
                  )}
                >
                  <span className="text-regular leading-1-5 text-navy">{tab.label}</span>
                  <span className="font-mono text-tiny leading-1-5 uppercase text-tag">{tab.tag}</span>
                  <span className="absolute inset-x-0 bottom-0 block h-[3px]">
                    <span
                      ref={(node) => {
                        barsRef.current[index] = node;
                      }}
                      data-loader-bar={tab.tag}
                      className="block h-[3px] bg-brand"
                      style={{ width: "0%" }}
                    />
                  </span>
                </button>

                {/* `.work_main_accordian_content` — rendered inside the active tab below 992px.
                    < 768px it is the whole layout; 768-991px it stacks above the shared pane. */}
                {index === displayed && (
                  <div className="overflow-hidden lg:hidden">
                    <PaneBody tab={tab} variant="accordion" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* >= 768px: single shared pane below the tab bar */}
          <div className="relative overflow-hidden max-md:hidden">
            {TABS.map((tab, index) => (
              <div
                key={tab.tag}
                id={`work-panel-${index}`}
                role="tabpanel"
                aria-labelledby={`work-tab-${index}`}
                className={cn("relative", index === displayed ? cn("block", paneFade) : "hidden")}
              >
                <PaneBody tab={tab} variant="pane" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
