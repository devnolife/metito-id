import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * ---------------------------------------------------------------------------
 * Shared shell for every legal page: `/imprint` (second block), `/privacy`,
 * `/terms`, `/terms-suppliers`.
 * ---------------------------------------------------------------------------
 *
 * Reproduces the Webflow chain measured on the live site at 1440x900:
 *
 *   <section .imprint_main_wrapper / .imprint_second_wrapper>
 *       padding-inline: 5%                              -> .padding-global
 *     <div .privacy_main_component / .imprint_second_component>
 *       padding: 0 32px; border-width: 0 1px 1px 1px; border-color #382e30
 *                                                       -> border-x border-b border-line px-medium
 *       <div .imprint_second_header>
 *         max-width: 584px; padding: 64px 0; flex column; gap: 16px
 *                                                       -> max-w-[36.5rem] py-xlarge gap-xsmall
 *         <div .imprint_second_rich-text.w-richtext>     -> RICH_TEXT
 *
 * (mobile <768: padding-inline 24px, py 40px, gap 12px — all handled by the
 *  responsive spacing tokens, no extra variants needed.)
 *
 * ---------------------------------------------------------------------------
 * API
 * ---------------------------------------------------------------------------
 *
 *   // /privacy, /terms, /terms-suppliers — the <h1> lives INSIDE the rich text
 *   // (Webflow renders it with font-weight 400 and letter-spacing: normal),
 *   // so pass the whole block as `html` and do NOT pass `heading`:
 *   <LegalSection html={PRIVACY_HTML} />
 *
 *   // /imprint second block — a standalone `.heading-style-h1` sibling
 *   // (font-weight 500, tracking -0.07rem) plus free-form children:
 *   <LegalSection heading={"Nutzungs\u00ADhinweise"}>
 *     <div className="max-w-[36rem]">…</div>
 *   </LegalSection>
 *
 * Props
 *   heading?   Rendered as `<h1>` styled like Webflow's `.heading-style-h1`.
 *              Soft hyphens (U+00AD) and other entities pass through unchanged.
 *   html?      Sanitised Webflow `.w-richtext` markup (the `*.html` files under
 *              docs/research/raw/richtext/). Gets the full extracted typography.
 *   children?  Rendered after `html`, inside the same 584px column.
 *   className? Extra classes for the 584px column.
 *   id?        Optional id on the `<section>`.
 *
 * Also exported: `RICH_TEXT` — the typography-only class string, if you ever
 * need the rich-text treatment without the section shell.
 */

/**
 * Typography for Webflow's `.imprint_second_rich-text.w-richtext`, extracted
 * from docs/research/raw/richtext/privacy.meta.json + terms-suppliers.meta.json
 * (desktop computed values; the responsive font tokens track Webflow's own
 * breakpoint ladder, so mobile follows automatically).
 *
 *   h1   56/61.6 (1.1)  w400  navy   ls normal   mt 0   mb 16
 *   h2   40/48   (1.2)  w400  navy   ls normal   mt 32  mb 24
 *   h3   24/28.8 (1.2)  w400  navy   ls normal   mt 24  mb 8
 *   h4   18/23.4 (1.3)  w500  navy   ls normal   mt 0   mb 8   (1.4 below 768px)
 *   p    16/24          w400  text-body                 mt 0   mb 16
 *   ul   mt/mb 16  ml 8  pl 20  list-style disc
 *   ol   mt/mb 16        pl 24  list-style decimal
 *   li   mt/mb 4         pl 8
 *   strong w700 · em italic · a underline (Webflow base `a`)
 *
 * Verified against the live /privacy and /terms-suppliers at 1440 and 390:
 * every value above matches exactly at both viewports.
 *
 * `table` / `blockquote` / `figure` do not occur in any of the four legal
 * documents; they get Webflow's own base treatment so nothing looks broken if
 * the CMS ever adds one.
 */
export const RICH_TEXT = cn(
  "text-regular leading-1-5 text-body",
  // headings — Webflow overrides the global weight/tracking inside rich text
  "[&_h1]:text-h1 [&_h1]:leading-1-1 [&_h1]:font-normal [&_h1]:tracking-normal [&_h1]:text-navy [&_h1]:mt-0 [&_h1]:mb-4",
  "[&_h2]:text-h2 [&_h2]:leading-1-2 [&_h2]:font-normal [&_h2]:tracking-normal [&_h2]:text-navy [&_h2]:mt-8 [&_h2]:mb-6",
  "[&_h3]:text-h3 [&_h3]:leading-1-2 [&_h3]:font-normal [&_h3]:tracking-normal [&_h3]:text-navy [&_h3]:mt-6 [&_h3]:mb-2",
  "[&_h4]:text-[1.125rem] [&_h4]:leading-1-4 [&_h4]:font-medium [&_h4]:tracking-normal [&_h4]:text-navy [&_h4]:mt-0 [&_h4]:mb-2 md:[&_h4]:leading-1-3",
  "[&_h5]:text-h5 [&_h5]:leading-1-4 [&_h5]:font-medium [&_h5]:text-navy [&_h5]:mt-5 [&_h5]:mb-4",
  "[&_h6]:text-h6 [&_h6]:leading-1-4 [&_h6]:font-medium [&_h6]:text-navy [&_h6]:mt-5 [&_h6]:mb-4",
  // body copy
  "[&_p]:mt-0 [&_p]:mb-4",
  "[&_strong]:font-bold [&_em]:italic",
  "[&_a]:underline",
  // lists
  "[&_ul]:my-4 [&_ul]:ml-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:overflow-hidden",
  "[&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:overflow-hidden",
  "[&_li]:my-1 [&_li]:pl-2",
  // Webflow ships these two resets in the page's inline <style> block, not in
  // the shared stylesheet — without them every list ends 4px too tall and the
  // block drifts ~64px over a 10 000px legal page:
  //   .w-richtext > :not(div):first-child,
  //   .w-richtext > div:first-child > :first-child { margin-top: 0 !important }
  //   .w-richtext > :last-child,
  //   .w-richtext ol li:last-child,
  //   .w-richtext ul li:last-child      { margin-bottom: 0 !important }
  "[&>:not(div):first-child]:!mt-0 [&>div:first-child>:first-child]:!mt-0",
  "[&>:last-child]:!mb-0 [&_ol_li:last-child]:!mb-0 [&_ul_li:last-child]:!mb-0",
  // rare Webflow rich-text nodes (base stylesheet defaults)
  "[&_blockquote]:my-0 [&_blockquote]:border-l-[0.1875rem] [&_blockquote]:border-line [&_blockquote]:px-5 [&_blockquote]:py-3 [&_blockquote]:text-[1.25rem] [&_blockquote]:leading-1-5",
  "[&_figure]:my-12 [&_figure]:max-w-[60%] [&_img]:w-full",
  "[&_table]:w-full [&_table]:border-collapse [&_td]:align-top [&_th]:align-top [&_th]:text-left",
);

export type LegalSectionProps = {
  heading?: string;
  html?: string;
  children?: ReactNode;
  className?: string;
  id?: string;
};

export function LegalSection({ heading, html, children, className, id }: LegalSectionProps) {
  return (
    <section id={id} className="padding-global">
      <div className="border-x border-b border-line px-medium">
        <div className={cn("flex max-w-[36.5rem] flex-col gap-xsmall py-xlarge", className)}>
          {heading ? (
            <h1 className="text-h1 leading-1-1 font-medium tracking-h1 text-navy">{heading}</h1>
          ) : null}
          {html ? (
            <div className={RICH_TEXT} dangerouslySetInnerHTML={{ __html: html }} />
          ) : null}
          {children}
        </div>
      </div>
    </section>
  );
}
