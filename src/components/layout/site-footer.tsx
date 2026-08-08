import Link from "next/link";
import { Globe, Mail, MapPin, Phone } from "lucide-react";

import { COMPANY, FOOTER_COLUMNS } from "@/lib/site";

function FooterLink({ label, href, external }: { label: string; href: string; external?: boolean }) {
  const className =
    "block text-regular leading-1-5 text-navy transition-colors duration-200 hover:text-brand";
  if (external) {
    return (
      <a className={className} href={href} target="_blank" rel="noreferrer">
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

const CONTACT_ROWS = [
  {
    icon: MapPin,
    label: "Alamat",
    value: COMPANY.address,
    href: undefined as string | undefined,
  },
  {
    icon: Phone,
    label: "Telepon",
    value: COMPANY.phones[0],
    href: "tel:+6281217603950",
  },
  {
    icon: Mail,
    label: "Email",
    value: COMPANY.email,
    href: "mailto:info@metito.id",
  },
  {
    icon: Globe,
    label: "Website",
    value: COMPANY.website,
    href: "https://www.metito.id",
  },
];

export function SiteFooter() {
  return (
    <footer className="padding-global">
      <div className="grid grid-cols-1 grid-rows-[auto_auto] border-x border-line lg:grid-cols-[minmax(auto,25rem)_1fr]">
        <div className="flex flex-col items-center justify-center gap-4 border-b border-line px-6 py-10 lg:border-b-0 lg:border-r">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/metito-logo.jpeg"
            alt="METITO — Multi Enviro Tirta Teknologi"
            loading="lazy"
            className="h-auto w-56"
            width={535}
            height={197}
          />
          <p className="text-center text-small leading-1-5 text-body">{COMPANY.tagline}</p>
        </div>

        <div className="grid grid-cols-1 gap-medium p-medium md:grid-cols-3">
          {FOOTER_COLUMNS.map((column) => (
            <div key={column.heading} className="flex flex-col items-start justify-start gap-3">
              <div className="text-tiny uppercase leading-[1.5] text-tag">{column.heading}</div>
              {column.links.map((link) => (
                <FooterLink key={link.label} {...link} />
              ))}
            </div>
          ))}
        </div>

        {/* ---- contact strip, mirroring the letterhead footer ---- */}
        <div className="grid grid-cols-1 border-t border-line md:grid-cols-2 lg:col-span-2 lg:grid-cols-4">
          {CONTACT_ROWS.map((row, index) => (
            <div
              key={row.label}
              className={
                "flex items-start gap-3 px-medium py-4" +
                (index > 0 ? " border-line max-md:border-t md:border-l max-lg:[&:nth-child(3)]:border-l-0 max-lg:[&:nth-child(3)]:border-t" : "")
              }
            >
              <row.icon className="mt-0.5 h-5 w-5 shrink-0 text-navy" aria-hidden="true" />
              <div>
                <div className="text-small font-bold leading-1-4 text-navy">{row.label} :</div>
                {row.href ? (
                  <a
                    href={row.href}
                    className="text-small leading-1-5 text-body transition-colors hover:text-brand"
                  >
                    {row.value}
                  </a>
                ) : (
                  <div className="text-small leading-1-5 text-body">{row.value}</div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-line px-medium pb-xsmall pt-4 lg:col-span-2">
          <div className="text-small leading-[1.5] text-navy">
            © <span>{new Date().getFullYear()}</span> {COMPANY.name} ({COMPANY.brand}).{" "}
            <span className="text-body">{COMPANY.slogan}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
