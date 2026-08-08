import { PrincipleSection } from "@/components/shared/principle-section";

import { AcTable } from "./ac-table";

const INTRO =
  "Dari resin ion exchange hingga suku cadang mining — METITO menyediakan produk berkualitas tinggi dari supplier terpercaya, didukung layanan engineering yang menyeluruh.";

const PRODUCT_ROWS: readonly [string, string][] = [
  ["Water Treatment", "Ion Exchange Resin, Filter Media, Membrane RO/UF/NF, Activated Carbon"],
  [
    "Chemical WTP",
    "PAC, Aluminium Sulfate (Tawas), Soda Ash, Caustic Soda, Sodium Hypochlorite, HCl, H2SO4, Antiscalant RO, Membrane Cleaner",
  ],
  ["Boiler & Cooling", "Oxygen Scavenger, Scale Inhibitor, Boiler Treatment Chemical"],
  [
    "Chemical WWTP",
    "Polymer Anionik/Kationik, Ferric Chloride, Coagulant, Flocculant, Defoamer, pH Adjuster",
  ],
  ["Chemical STP", "Chlorine, Bio Culture, Enzyme Bacteria, Disinfectant"],
  [
    "Industrial Maintenance",
    "Chain Lubricant, Food Grade Lubricant, Penetrating Oil, Rust Remover, Degreaser — termasuk produk setara CRC Industries",
  ],
  [
    "Equipment",
    "HP Pump, Feed Pump, Dosing Pump, Blower, Multi Media Filter, Carbon Filter, Softener, RO System, Demin Plant, Chlorine Dioxide Generator, Instrumentation",
  ],
  ["Consumables & Spare Parts", "Cartridge Filter, Valve, Mechanical Seal, Gasket, Bearing"],
  ["Carbon Graphite", "Carbon Brush, Carbon Vane, Carbon Seal, Carbon Connector"],
  [
    "Mining & Material Handling",
    "Conveyor Belt, Idler Roller, Crusher Parts, Vibrating Screen",
  ],
];

const SERVICE_ROWS: readonly [string, string][] = [
  [
    "Design & Engineering",
    "Design WTP/WWTP/STP, Reverse Osmosis System, Demineralization Plant, Chlorine Dioxide System",
  ],
  ["Instalasi", "Installation & Commissioning, Chemical Dosing System"],
  [
    "Pemeliharaan",
    "Preventive Maintenance, Plant Audit, Troubleshooting System, Annual Maintenance Agreement (AMA)",
  ],
  ["Fabrikasi", "Fabrikasi tangki, piping, dan struktur baja — termasuk modifikasi dan retrofitting"],
  ["Dukungan Operasional", "Shutdown & turnaround support, manpower supply"],
];

/** `.principle_main_wrapper` #3 — "Produk & Layanan" + dua embed `.ac-table--rowlabel`. */
export function PrecisionSection() {
  return (
    <PrincipleSection
      tagline="Produk & Layanan"
      heading="Produk dan layanan unggulan METITO"
      intro={INTRO}
    >
      <AcTable variant="rowlabel">
        <thead>
          <tr>
            <th scope="col" colSpan={2}>
              Produk
            </th>
          </tr>
        </thead>
        <tbody>
          {PRODUCT_ROWS.map(([label, value]) => (
            <tr key={label}>
              <th scope="row">{label}</th>
              <td>{value}</td>
            </tr>
          ))}
        </tbody>
      </AcTable>

      <AcTable variant="rowlabel" wrapperClassName="mt-5">
        <thead>
          <tr>
            <th scope="col" colSpan={2}>
              Layanan Engineering
            </th>
          </tr>
        </thead>
        <tbody>
          {SERVICE_ROWS.map(([label, value]) => (
            <tr key={label}>
              <th scope="row">{label}</th>
              <td>{value}</td>
            </tr>
          ))}
        </tbody>
      </AcTable>
    </PrincipleSection>
  );
}
