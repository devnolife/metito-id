export interface StatCard {
  label: string;
  value: string;
}

/**
 * `.principle_main_grid.v1` — four equal `1fr` tracks from 768px up. Below that
 * the tracks collapse to two (>= 480px) then one, so long METITO facts (KBLI,
 * alamat) stay readable on phones instead of overflowing.
 *
 * cards → padding 1rem 1.5rem (1rem 1rem < 768), gap .75rem,
 * 1px top rule everywhere and a 1px right rule from 768px up.
 */
export function StatGrid({ items }: { items: readonly StatCard[] }) {
  return (
    <div className="grid grid-cols-[1fr] xs:grid-cols-[1fr_1fr] md:grid-cols-[1fr_1fr_1fr_1fr]">
      {items.map((item) => (
        <div
          key={item.label}
          className="flex flex-col items-start justify-start gap-3 border-t border-line px-4 py-4 md:border-r md:px-6"
        >
          <h3 className="text-tiny leading-1-5 font-semibold tracking-normal text-gray uppercase">
            {item.label}
          </h3>
          <p className="text-regular leading-1-5 text-body">{item.value}</p>
        </div>
      ))}
    </div>
  );
}
