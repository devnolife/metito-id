"use client";

import { useEffect, useRef } from "react";
import { Clock3, HeartHandshake, ShieldCheck, type LucideIcon } from "lucide-react";

/**
 * `.challenge_main_wrapper` — "Mengapa METITO?" + the scroll-driven vision paragraph.
 *
 * Block A: 3 value-prop cards (Kualitas / Ketepatan Waktu / Kepuasan Pelanggan).
 * Block B: GSAP SplitText line masks scrubbed by ScrollTrigger (mirrors textReveal.js).
 */

interface ValueCard {
  id: string;
  title: string;
  body: string;
  icon: LucideIcon;
  accent: string;
}

const VALUE_CARDS: readonly ValueCard[] = [
  {
    id: "kualitas",
    title: "Kualitas Produk Terjamin",
    body: "Menyediakan produk berkualitas tinggi dari jaringan produsen, distributor, dan pemasok terpercaya sesuai standar industri.",
    icon: ShieldCheck,
    accent: "text-blue",
  },
  {
    id: "tepat-waktu",
    title: "Pengiriman Tepat Waktu",
    body: "Komitmen terhadap ketepatan waktu dalam setiap pengiriman untuk menjaga produktivitas dan meminimalkan downtime operasional Anda.",
    icon: Clock3,
    accent: "text-green",
  },
  {
    id: "kepuasan",
    title: "Kepuasan Pelanggan",
    body: "Layanan purna jual dan dukungan teknis yang profesional — dari konsultasi, instalasi, hingga pemeliharaan sistem.",
    icon: HeartHandshake,
    accent: "text-brand",
  },
];

const VISION_PARAGRAPH_1 =
  "METITO hadir sebagai mitra terpercaya dalam menjaga keandalan sistem pengolahan air Anda.";

const VISION_PARAGRAPH_2 =
  "Bukan sekadar menjual produk — kami membangun kemitraan yang mendukung efisiensi OpEx dan CapEx perusahaan Anda.";

/** Minimal structural view of a GSAP SplitText instance. */
interface LineSplit {
  lines: Element[];
  revert: () => void;
}

export function ChallengeSection() {
  const visionRef = useRef<HTMLParagraphElement>(null);

  /* ------------- GSAP SplitText line masks, scrubbed by scroll ------------- */
  useEffect(() => {
    const el = visionRef.current;
    if (!el) return;

    let disposed = false;
    let cleanup = () => {};

    void (async () => {
      const [{ gsap }, { ScrollTrigger }, { SplitText }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
        import("gsap/SplitText"),
      ]);
      if (disposed) return;

      gsap.registerPlugin(ScrollTrigger, SplitText);

      // Split against the final webfont metrics so the line breaks match the target.
      try {
        await document.fonts?.ready;
      } catch {
        /* fonts API unavailable — split with whatever is rendered */
      }
      if (disposed) return;

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      let split: LineSplit | null = null;
      let tween: gsap.core.Tween | null = null;

      const build = () => {
        split = new SplitText(el, {
          type: "lines",
          linesClass: "text-reveal-line",
        });

        const masks = split.lines.map((line) => {
          const mask = document.createElement("div");
          mask.className = "text-reveal-mask";
          line.appendChild(mask);
          return mask;
        });
        if (masks.length === 0) return;

        if (prefersReducedMotion) {
          gsap.set(masks, { x: "100%" });
          return;
        }

        tween = gsap.fromTo(
          masks,
          { x: "0%" },
          {
            x: "100%",
            ease: "none",
            stagger: 0.15,
            scrollTrigger: {
              trigger: el,
              start: "top 90%",
              end: "bottom center",
              scrub: true,
            },
          }
        );
      };

      const teardown = () => {
        tween?.scrollTrigger?.kill();
        tween?.kill();
        tween = null;
        split?.revert();
        split = null;
      };

      build();

      let timer: number | undefined;
      let lastWidth = window.innerWidth;
      const onResize = () => {
        if (window.innerWidth === lastWidth) return; // ignore mobile URL-bar resizes
        lastWidth = window.innerWidth;
        window.clearTimeout(timer);
        timer = window.setTimeout(() => {
          teardown();
          build();
          ScrollTrigger.refresh();
        }, 200);
      };
      window.addEventListener("resize", onResize);

      cleanup = () => {
        window.removeEventListener("resize", onResize);
        window.clearTimeout(timer);
        teardown();
      };
    })();

    return () => {
      disposed = true;
      cleanup();
    };
  }, []);

  return (
    <section className="padding-global">
      <div className="border-x border-line">
        {/* ---- header ---- */}
        <div className="flex flex-col items-center justify-start pt-xlarge pb-large text-center max-md:px-4">
          <h2 className="text-h2 leading-1-1 font-medium tracking-h2 text-navy">
            Mengapa METITO?
          </h2>
        </div>

        {/* ---- 3-up card grid + dashed connectors ---- */}
        <div className="grid grid-cols-1 md:grid-cols-3">
          {VALUE_CARDS.map((card) => (
            <div
              key={card.id}
              className="flex flex-col items-center justify-start gap-medium border-b border-line px-medium pb-large text-center"
            >
              <div className="flex w-full items-end justify-center pb-2 pt-4">
                <card.icon className={`h-16 w-16 ${card.accent}`} strokeWidth={1.25} />
              </div>
              <div className="flex flex-col items-center justify-start gap-xsmall">
                <h3 className="text-h3 leading-1-2 font-medium tracking-h3 text-navy">
                  {card.title}
                </h3>
                <div className="text-regular leading-1-5 text-body">{card.body}</div>
              </div>
            </div>
          ))}

          {/* horizontal dashed rail linking the three connectors */}
          <div
            aria-hidden="true"
            className="col-span-1 mx-[50%] border-b border-dashed border-line md:col-span-3 md:mx-[16.6667%]"
          />

          {/* vertical dashed rail dropping into the logo mark */}
          <div
            aria-hidden="true"
            className="col-span-1 flex flex-col items-center justify-between md:col-span-3"
          >
            <div className="min-h-[9rem] border-r border-dashed border-line" />
          </div>
        </div>

        {/* ---- scroll-driven vision paragraph ---- */}
        <div className="mx-auto flex w-[calc(100%-2rem)] max-w-none flex-col items-center justify-start gap-10 md:w-auto md:max-w-[770px]">
          <div className="w-20 min-w-20">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/metito-mark.png"
              alt=""
              loading="lazy"
              className="h-full w-full object-contain"
            />
          </div>
          <div className="relative w-full">
            <p
              ref={visionRef}
              className="text-[1.5rem] leading-1-1 font-medium tracking-h2 text-center md:text-[2.5rem]"
            >
              {VISION_PARAGRAPH_1}
              <br />
              <br />
              {VISION_PARAGRAPH_2}
            </p>
          </div>
        </div>

        <div aria-hidden="true" className="w-full pt-xlarge" />
      </div>
    </section>
  );
}
