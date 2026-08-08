"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { FAQ_CATEGORIES } from "@/data/faqs";
import { cn } from "@/lib/utils";

/**
 * `/faqs` — `.faq_main_wrapper`
 *
 * Interaction model measured on the live site (scripts/recon/probe-faq*.mjs):
 *
 *  • 3 Webflow tabs (Produk & Layanan / Pemesanan & Pengiriman / Perusahaan),
 *    `data-duration-in="300"`, `data-duration-out="100"`, `data-easing="ease"` —
 *    same component as the homepage `PlatformSection`.
 *  • Each row is a click-to-toggle accordion driven by Webflow IX2
 *    (`data-w-id` on `.faq_main_question`). All panels start CLOSED
 *    (`.faq_answer` carries an inline `height: 0px` after IX2 boots), any number
 *    can be open at the same time, and clicking an open row closes it again.
 *  • Open/close animates `height` 0 <-> auto over exactly 400 ms with CSS `ease`
 *    (cubic-bezier(.25,.1,.25,1)); the chevron rotates 0 -> 180deg on the same
 *    curve. Verified frame-by-frame: at t=100/200/300 ms the measured progress
 *    was .4085/.8022/.9604 vs .4090/.8029/.9606 for `ease` over 400 ms.
 *
 * Here the height animation uses the `grid-template-rows: 0fr -> 1fr` technique
 * so it keeps working with dynamic content.
 */

/** Webflow tab fade: outgoing pane 100ms, incoming pane 300ms, `ease`. */
const FADE_OUT_MS = 100;

/** CSS `ease` — the exact curve Webflow IX2 uses for the accordion. */
const EASE = "ease-[cubic-bezier(0.25,0.1,0.25,1)]";

const INTRO =
  "METITO (PT Multi Enviro Tirta Teknologi) adalah penyedia solusi terintegrasi untuk water treatment, industrial supply, engineering, equipment, spare parts, dan mining support services. Halaman ini menjawab pertanyaan yang paling sering diajukan seputar produk, layanan, pemesanan, dan perusahaan kami.";

function Chevron({ className }: { className?: string }) {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      <g opacity="0.6">
        <path
          d="M15 7.5L10 12.5L5 7.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

export function FaqSection() {
  const [active, setActive] = useState(0);
  const [displayed, setDisplayed] = useState(0);
  const [phase, setPhase] = useState<"idle" | "out" | "in">("idle");
  const [open, setOpen] = useState<ReadonlySet<string>>(() => new Set<string>());
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
      if (event.key === "ArrowRight" || event.key === "ArrowDown")
        next = (index + 1) % FAQ_CATEGORIES.length;
      else if (event.key === "ArrowLeft" || event.key === "ArrowUp")
        next = (index - 1 + FAQ_CATEGORIES.length) % FAQ_CATEGORIES.length;
      else if (event.key === "Home") next = 0;
      else if (event.key === "End") next = FAQ_CATEGORIES.length - 1;
      else return;
      event.preventDefault();
      selectTab(next);
      buttonsRef.current[next]?.focus();
    },
    [selectTab],
  );

  const toggle = useCallback((key: string) => {
    setOpen((current) => {
      const next = new Set(current);
      if (!next.delete(key)) next.add(key);
      return next;
    });
  }, []);

  const paneFade = cn(
    "transition-opacity ease-[cubic-bezier(0.25,0.1,0.25,1)]",
    phase === "out" && "opacity-0 duration-100",
    phase === "in" && "opacity-0 duration-300",
    phase === "idle" && "opacity-100 duration-300",
  );

  return (
    // The 3-tab menu is 434px wide and deliberately overflows the 390px phone
    // viewport — the live site clips it with `overflow-x: clip` on <html>/<body>.
    // Clipping on the section's padding box is pixel-identical.
    <section className="padding-global overflow-x-clip">
      <div className="border-x border-line pt-xxlarge pb-xhuge md:pt-xlarge md:pb-0">
        {/* .faq_main_header */}
        <div className="mx-medium flex max-w-[30.25rem] flex-col items-start justify-start gap-4 text-left">
          {/* .faq_header_top */}
          <div className="flex flex-col items-start justify-start gap-3">
            <h2 className="text-h2 leading-1-1 font-medium tracking-h2 text-navy">FAQ</h2>
            <p className="w-full text-body">{INTRO}</p>
          </div>
        </div>

        {/* .platform_main_body */}
        <div className="mt-8">
          {/* .faq_main_tab */}
          <div className="relative flex flex-col items-start justify-between">
            <div
              role="tablist"
              aria-label="Kategori FAQ"
              className="relative mx-4 flex w-auto overflow-hidden rounded-[0.25rem] border border-line md:mx-medium"
            >
              {FAQ_CATEGORIES.map((category, index) => (
                <button
                  key={category.id}
                  ref={(node) => {
                    buttonsRef.current[index] = node;
                  }}
                  type="button"
                  role="tab"
                  id={`faq-tab-${category.id}`}
                  aria-selected={index === active}
                  aria-controls={`faq-panel-${category.id}`}
                  tabIndex={index === active ? 0 : -1}
                  onClick={() => selectTab(index)}
                  onKeyDown={(event) => onKeyDown(event, index)}
                  className={cn(
                    "text-regular leading-1-5 relative block min-w-[9rem] px-8 py-4 text-center font-medium",
                    index === active ? "bg-bg-shade text-navy" : "bg-transparent text-body",
                  )}
                >
                  <span className="block">{category.label}</span>
                  {/* Webflow only authored `.platform_tab-link_left-border` on the first tab. */}
                  {index === 0 && (
                    <span className="absolute inset-y-0 right-0 block w-px bg-line" />
                  )}
                  {index === active && (
                    <span className="absolute inset-x-0 bottom-0 block h-[0.1875rem] bg-brand" />
                  )}
                </button>
              ))}
            </div>

            {/* .platform_tab_content */}
            <div className="relative mt-8 w-full overflow-hidden">
              {FAQ_CATEGORIES.map((category, index) => (
                <div
                  key={category.id}
                  id={`faq-panel-${category.id}`}
                  role="tabpanel"
                  aria-labelledby={`faq-tab-${category.id}`}
                  className={cn("relative", index === displayed ? cn("block", paneFade) : "hidden")}
                >
                  {category.items.map((item, itemIndex) => {
                    const key = `${category.id}-${itemIndex}`;
                    const isOpen = open.has(key);
                    return (
                      // .faq_main_accordion
                      <div key={key} className="border-line flex flex-col items-stretch border-t">
                        {/* .faq_main_question — the extra 1px border was black on the
                            dark Andercore theme; kept transparent to preserve the
                            row height on the light METITO theme. */}
                        <button
                          type="button"
                          id={`${key}-button`}
                          aria-expanded={isOpen}
                          aria-controls={`${key}-panel`}
                          onClick={() => toggle(key)}
                          className="flex w-full cursor-pointer items-center justify-between gap-6 border-t border-transparent px-6 py-4 text-left xs:px-4 md:px-8 md:py-6"
                        >
                          <span className="text-regular leading-1-5 text-navy md:text-xlarge">
                            {item.question}
                          </span>
                          {/* .faq_main_icon-wrapper / .faq_main_icon */}
                          <span className="block w-7 self-start text-navy md:w-5">
                            <span className="flex h-7 w-7 flex-col items-center justify-center md:h-5 md:w-5">
                              <Chevron
                                className={cn(
                                  "transition-transform duration-400",
                                  EASE,
                                  isOpen && "rotate-180",
                                )}
                              />
                            </span>
                          </span>
                        </button>

                        {/* .faq_answer */}
                        <div
                          id={`${key}-panel`}
                          role="region"
                          aria-labelledby={`${key}-button`}
                          className={cn(
                            "grid overflow-hidden px-6 transition-[grid-template-rows] duration-400 xs:px-4 md:px-8",
                            EASE,
                            isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                          )}
                        >
                          <div className="min-h-0 overflow-hidden">
                            {/* .faq_main_answer-wrapper */}
                            <div className="mb-5 md:mb-6">
                              <p className="max-w-[36rem] text-body">{item.answer}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
