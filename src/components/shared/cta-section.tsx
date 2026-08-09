import { LogoMark } from "@/components/icons";
import { ButtonLink } from "@/components/ui/button";
import { COMPANY, EXTERNAL } from "@/lib/site";

const PHONE_ROWS: readonly { label: string; value: string; href: string }[] = [
  { label: "Telepon / WhatsApp", value: "0812-1760-3950", href: "https://wa.me/6281217603950" },
  { label: "Telepon / WhatsApp", value: "0821-5555-1235", href: "https://wa.me/6282155551235" },
  { label: "Telepon", value: "0853-9954-4912", href: "tel:+6285399544912" },
  { label: "Email", value: "info@metito.id", href: "mailto:info@metito.id" },
];

const CARD = "flex justify-between gap-2 px-medium py-3";

export function CtaSection() {
  return (
    <section className="padding-global">
      {/* soft navy/water glow anchored top-centre */}
      <div className="border-x border-line bg-[radial-gradient(60%_50%_at_50%_0%,rgba(9,106,174,0.12),transparent_70%)] px-4 pt-28 pb-15 md:px-0">
        <div className="mx-auto flex flex-col items-center justify-start gap-medium">
          <div className="flex max-w-[26.5rem] flex-col items-center justify-start gap-4 text-center">
            <LogoMark className="mb-xxsmall h-16" />
            <h2 className="text-h2 font-medium leading-1-1 tracking-h2 text-navy">
              {COMPANY.slogan}
            </h2>
            <p className="text-regular leading-1-5 text-body">
              Hubungi kami untuk konsultasi teknis &amp; penawaran harga — solusi terintegrasi untuk
              kebutuhan air, industri, dan pertambangan Anda.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 max-xs:w-full">
            <ButtonLink href={EXTERNAL.whatsapp} variant="primary" className="max-xs:w-full">
              Hubungi via WhatsApp
            </ButtonLink>
            <ButtonLink href={EXTERNAL.email} variant="secondary" className="max-xs:w-full">
              Email: info@metito.id
            </ButtonLink>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 border-x border-line lg:grid-cols-[1fr_1fr_1fr_1fr_1fr]">
        <div className={`${CARD} lg:col-span-4`}>
          <div className="tagline">Kontak</div>
        </div>

        <div className={`${CARD} max-lg:row-start-6 max-lg:border-t max-lg:border-line`}>
          <div className="tagline">Jam Operasional</div>
        </div>

        {PHONE_ROWS.map((row) => (
          <div key={row.value} className={`${CARD} border-t border-r border-line`}>
            <div className="text-body">{row.label}</div>
            <a href={row.href} className="text-navy hover:text-brand">
              {row.value}
            </a>
          </div>
        ))}

        <div className={`${CARD} border-t border-line`}>
          <div className="text-body">Sen.–Jum.</div>
          <div className="text-navy">08.00 – 17.00 WITA</div>
        </div>
      </div>
    </section>
  );
}
