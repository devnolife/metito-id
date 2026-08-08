/** PT Multi Enviro Tirta Teknologi (METITO) — site-wide config. */

export const COMPANY = {
  name: "PT Multi Enviro Tirta Teknologi",
  brand: "METITO",
  tagline: "Integrated Solutions for Water, Industry and Mining",
  slogan: "Clean Water, Clean Future.",
  address: "Bontobila, Barombong, Kab. Gowa, Sulawesi Selatan",
  phones: ["0812-1760-3950", "0821-5555-1235", "0853-9954-4912"],
  email: "info@metito.id",
  website: "www.metito.id",
} as const;

export const EXTERNAL = {
  whatsapp: "https://wa.me/6281217603950",
  whatsapp2: "https://wa.me/6282155551235",
  email: "mailto:info@metito.id",
  phone: "tel:+6281217603950",
  website: "https://www.metito.id",
} as const;

export interface NavLink {
  label: string;
  href: string;
  external?: boolean;
}

export const NAV_LINKS: NavLink[] = [
  { label: "Tentang Kami", href: "/about-us" },
  { label: "Profil Perusahaan", href: "/company-profile" },
  { label: "FAQ", href: "/faqs" },
  { label: "Login", href: "/login" },
];

export interface FooterColumn {
  heading: string;
  links: NavLink[];
}

export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    heading: "Perusahaan",
    links: [
      { label: "Tentang Kami", href: "/about-us" },
      { label: "Profil Perusahaan", href: "/company-profile" },
      { label: "FAQ", href: "/faqs" },
      { label: "Karier", href: "/career" },
    ],
  },
  {
    heading: "Lini Bisnis",
    links: [
      { label: "Chemical Supply", href: "/#lini-bisnis" },
      { label: "Engineering Services", href: "/#lini-bisnis" },
      { label: "Equipment Supply", href: "/#lini-bisnis" },
      { label: "Spare Parts Supply", href: "/#lini-bisnis" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Kebijakan Privasi", href: "/privacy" },
      { label: "Informasi Perusahaan", href: "/imprint" },
      { label: "S&K Pelanggan", href: "/terms" },
      { label: "S&K Pemasok", href: "/terms-suppliers" },
    ],
  },
];
