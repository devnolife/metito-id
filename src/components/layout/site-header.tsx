"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { ButtonLink } from "@/components/ui/button";
import { EXTERNAL, NAV_LINKS } from "@/lib/site";
import { cn } from "@/lib/utils";

function NavItem({ label, href, external }: { label: string; href: string; external?: boolean }) {
  const className =
    "relative block px-4 py-2 text-regular font-normal leading-1-5 text-navy transition-colors duration-200 hover:text-brand max-lg:w-full max-lg:border-b max-lg:border-line max-lg:px-4 max-lg:py-3";
  if (external) {
    return (
      <a className={className} href={href}>
        {label}
      </a>
    );
  }
  return (
    <Link className={className} href={href}>
      {label}
    </Link>
  );
}

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header
      role="banner"
      className="sticky inset-x-0 top-0 z-[100000000] flex w-full items-center bg-bg px-[5%]"
    >
      <div className="relative z-[999] flex h-full min-h-[4.5rem] w-full items-center justify-between border-x border-b border-line px-medium">
        <Link href="/" aria-label="beranda" className="relative flex items-center gap-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/metito-mark.png"
            alt="METITO — Multi Enviro Tirta Teknologi"
            className="h-10 w-auto"
          />
          <span className="flex flex-col justify-center gap-0.5 leading-none">
            <span className="text-[1.25rem] font-bold leading-none tracking-tight text-navy">
              M<span className="text-brand">E</span>TITO
            </span>
            <span className="text-[0.5625rem] font-medium leading-none tracking-[0.02em] text-body">
              Multi Enviro Tirta Teknologi
            </span>
          </span>
        </Link>

        {/* ---------- desktop menu / mobile drop panel ---------- */}
        <nav
          role="navigation"
          className={cn(
            "flex items-center",
            "max-lg:absolute max-lg:left-0 max-lg:right-0 max-lg:top-[calc(100%+1px)] max-lg:z-[900] max-lg:-mx-medium max-lg:block max-lg:overflow-auto max-lg:border-x max-lg:border-b max-lg:border-line max-lg:bg-bg max-lg:transition-transform max-lg:duration-[400ms]",
            menuOpen ? "max-lg:translate-y-0" : "max-lg:pointer-events-none max-lg:hidden"
          )}
        >
          {NAV_LINKS.map((link) => (
            <NavItem key={link.label} {...link} />
          ))}

          <div className="ml-4 flex items-center gap-4 max-lg:ml-0 max-lg:w-full max-lg:flex-col-reverse max-lg:items-stretch max-lg:p-4">
            <ButtonLink variant="secondary" size="small" href={EXTERNAL.email}>
              Email Kami
            </ButtonLink>
            <ButtonLink variant="primary" size="small" href={EXTERNAL.whatsapp}>
              Hubungi Kami
            </ButtonLink>
          </div>
        </nav>

        {/* ---------- mobile-only trailing cluster ---------- */}
        <div className="hidden items-center max-lg:flex">
          <button
            type="button"
            aria-label="menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="relative cursor-pointer p-0"
          >
            <span className="-mr-2 flex h-12 w-12 flex-col items-center justify-center">
              <span
                className={cn(
                  "h-0.5 w-6 bg-navy transition-transform duration-[400ms]",
                  menuOpen && "translate-y-2 rotate-45"
                )}
              />
              <span
                className={cn(
                  "my-1.5 h-0.5 w-6 bg-navy transition-opacity duration-[400ms]",
                  menuOpen && "opacity-0"
                )}
              />
              <span
                className={cn(
                  "h-0.5 w-6 bg-navy transition-transform duration-[400ms]",
                  menuOpen && "-translate-y-2 -rotate-45"
                )}
              />
            </span>
          </button>
        </div>
      </div>

      {/* ---------- backdrop ---------- */}
      <div
        onClick={() => setMenuOpen(false)}
        className={cn(
          "fixed inset-0 z-[200] bg-[rgba(1,20,45,0.4)] backdrop-blur-[3px] transition-opacity duration-[400ms] lg:hidden",
          menuOpen ? "opacity-100" : "pointer-events-none hidden opacity-0"
        )}
        aria-hidden="true"
      />
    </header>
  );
}
