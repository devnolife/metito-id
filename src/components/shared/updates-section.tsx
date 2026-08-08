import Link from "next/link";

import { cn } from "@/lib/utils";

export interface UpdateArticle {
  href: string;
  /** Two-digit index badge rendered on the card panel, e.g. "01". */
  tag: string;
  title: string;
  excerpt: string;
}

export interface UpdatesSectionProps {
  heading: string;
  intro: string;
  articles: readonly UpdateArticle[];
}

/**
 * `.updates_main_wrapper` — repurposed for METITO: a framed grid of business-line
 * highlight cards (formerly the Andercore press-article collection). The photo
 * thumbnails are replaced by navy→blue gradient panels carrying a mono index.
 *
 * container  padding-block 4rem (3rem < 768)
 * header     max-width 26rem, centred (full width + 1rem gutter < 768)
 * list       4 tracks >= 992 · 2 tracks 768–991 · 1 track < 768, framed top and bottom
 */
export function UpdatesSection({ heading, intro, articles }: UpdatesSectionProps) {
  return (
    <section className="padding-global">
      <div className="border-x border-line py-12 md:py-16">
        <div className="mx-auto flex flex-col items-center justify-start gap-4 px-4 text-center md:max-w-[26rem] md:px-0">
          <h2 className="text-h2 font-medium leading-1-1 tracking-h2 text-navy">{heading}</h2>
          <p className="text-regular leading-1-5 text-body">{intro}</p>
        </div>

        <div className="mt-8 md:mt-12">
          <div className="grid grid-cols-[1fr] md:grid-cols-[1fr_1fr] md:border-y md:border-line lg:grid-cols-[1fr_1fr_1fr_1fr]">
            {articles.map((article, index) => {
              const isLast = index === articles.length - 1;
              return (
                <div
                  key={article.tag}
                  className={cn(
                    "border-t border-line md:border-t-0",
                    isLast && "border-b md:border-b-0",
                    index >= 2 && "md:border-t lg:border-t-0",
                    index % 2 === 0 && "md:border-r",
                    index % 2 === 1 && !isLast && "lg:border-r"
                  )}
                >
                  <Link href={article.href} className="group block">
                    <div className="flex aspect-[4/2.2] items-end bg-gradient-to-br from-[#012966] to-[#096aae] p-6">
                      <span className="font-mono text-[3rem] leading-none text-[#fff]/25">
                        {article.tag}
                      </span>
                    </div>

                    <div className="flex flex-col gap-5 px-6 pt-6 pb-10">
                      <div className="flex flex-col items-start justify-start gap-3">
                        <h3 className="text-large font-medium leading-1-4 tracking-normal text-navy transition-colors duration-200 group-hover:text-blue md:leading-1-3">
                          {article.title}
                        </h3>
                        <p className="line-clamp-3 text-regular leading-1-5 text-body">
                          {article.excerpt}
                        </p>
                      </div>
                      <div className="tagline">Lini Bisnis {article.tag}</div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
