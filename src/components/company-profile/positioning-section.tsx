import { PrincipleSection } from "@/components/shared/principle-section";

import { AcTable } from "./ac-table";

const P1 =
  "METITO melayani pelanggan di sektor pertambangan (batubara, nikel, emas), petrokimia, minyak dan gas, kilang kelapa sawit, pengolahan air, hingga pembangkit listrik.";
const P2 =
  "Setiap sektor memiliki tuntutan operasional yang berbeda — karena itu solusi kami mencakup chemical supply, engineering services, equipment, hingga spare parts dalam satu kemitraan yang terintegrasi.";

const CELLS: readonly [string, string][] = [
  ["Mining — batubara, nikel, emas", "Petrochemical"],
  ["Oil & Gas", "Palm Oil Refinery"],
  ["Water Treatment", "Power Plants"],
];

/** `.principle_main_wrapper` #2 — "Industri yang Dilayani" + the `.ac-table--grid.ac-table--big` embed. */
export function PositioningSection() {
  return (
    <PrincipleSection
      tagline="Industri yang Dilayani"
      heading="Dibangun untuk kebutuhan lintas sektor industri"
      intro={
        <>
          {P1}
          <br />
          <br />
          {P2}
        </>
      }
    >
      <AcTable variant="gridBig">
        <tbody>
          {CELLS.map(([left, right]) => (
            <tr key={left}>
              <td>{left}</td>
              <td>{right}</td>
            </tr>
          ))}
        </tbody>
      </AcTable>
    </PrincipleSection>
  );
}
