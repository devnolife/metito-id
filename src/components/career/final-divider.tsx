/**
 * The divider between the "Kirim Lamaran" CTA and the footer. The Andercore
 * original used dark grid artwork (`final divider 2.svg`); on the light METITO
 * theme it renders the shared `divider-pattern` hatch at the same geometry.
 */
export function FinalDivider() {
  return (
    <div className="padding-global" aria-hidden="true">
      <div className="border border-line">
        <div className="divider-pattern h-16 w-full opacity-60 md:h-[7.5rem]" />
      </div>
    </div>
  );
}
