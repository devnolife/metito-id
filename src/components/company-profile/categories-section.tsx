import {
  PrincipleSection,
  type PrincipleCard,
} from "@/components/shared/principle-section";

const INTRO =
  "METITO menghadirkan solusi satu atap: kebutuhan bahan kimia, jasa engineering, equipment, hingga suku cadang ditangani dalam satu koordinasi — untuk mendukung keberlanjutan operasional pelanggan.";

const BUSINESS_LINES: readonly PrincipleCard[] = [
  {
    title: "Chemical Supply",
    body: "Penyediaan bahan kimia industri untuk berbagai aplikasi — dari chemical water treatment, boiler dan cooling, hingga kebutuhan WWTP dan STP.",
  },
  {
    title: "Engineering Services",
    body: "Perancangan, instalasi, dan pemeliharaan sistem serta proses industri — dari design WTP/WWTP/STP hingga preventive maintenance.",
  },
  {
    title: "Equipment Supply",
    body: "Penyediaan equipment dan sistem pendukung berstandar industri — dari pompa, blower, dan filter hingga RO system dan demin plant.",
  },
  {
    title: "Spare Parts Supply",
    body: "Penyediaan suku cadang original maupun alternatif untuk meminimalkan downtime operasional pelanggan.",
  },
];

/** `.principle_main_wrapper` #4 — "Lini Bisnis": empat kartu lini bisnis METITO. */
export function CategoriesSection() {
  return (
    <PrincipleSection
      tagline="Lini Bisnis"
      heading="Empat lini bisnis dalam satu kemitraan"
      intro={INTRO}
      cards={BUSINESS_LINES}
    />
  );
}
