import type { UpdateArticle } from "./updates-section";

/**
 * Empat lini bisnis METITO, dirender oleh `UpdatesSection` di /about-us
 * (menggantikan koleksi artikel pers Andercore — nama export dipertahankan
 * agar seluruh import tetap berfungsi).
 */
export function pressArticles(): readonly UpdateArticle[] {
  return [
    {
      href: "/company-profile",
      tag: "01",
      title: "Chemical Supply",
      excerpt:
        "Penyediaan bahan kimia industri untuk berbagai aplikasi — dari chemical water treatment, boiler dan cooling, hingga kebutuhan WWTP dan STP.",
    },
    {
      href: "/company-profile",
      tag: "02",
      title: "Engineering Services",
      excerpt:
        "Perancangan, instalasi, dan pemeliharaan sistem serta proses industri — dari design WTP/WWTP/STP hingga preventive maintenance dan plant audit.",
    },
    {
      href: "/company-profile",
      tag: "03",
      title: "Equipment Supply",
      excerpt:
        "Penyediaan equipment dan sistem pendukung berstandar industri — dari pompa, blower, dan filter hingga RO system dan demin plant.",
    },
    {
      href: "/company-profile",
      tag: "04",
      title: "Spare Parts Supply",
      excerpt:
        "Penyediaan suku cadang original maupun alternatif untuk meminimalkan downtime operasional pelanggan.",
    },
  ];
}

export const UPDATES_HEADING = "Lini bisnis METITO";
export const UPDATES_INTRO =
  "Empat lini bisnis terintegrasi untuk kebutuhan air, industri, dan pertambangan.";
