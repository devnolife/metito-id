const NOTE =
  "Suku cadang original dan alternatif tersedia untuk meminimalkan downtime operasional — dengan komitmen pengiriman tepat waktu dan dukungan teknis purna jual dari tim METITO.";

/**
 * The one `.section_divider-2` on /company-profile that carries a note above the
 * divider artwork. The dark `final-divider-1.svg` grid art is replaced by the
 * light `divider-pattern` hatch (7.5rem tall at desktop, 4rem on phones).
 */
export function DividerNote() {
  return (
    <div className="padding-global">
      <div className="border border-line">
        <p className="px-4 py-6 text-regular leading-1-5 text-body md:px-8">{NOTE}</p>
        <div className="divider-pattern h-16 w-full md:h-[7.5rem]" />
      </div>
    </div>
  );
}
