"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  GridIcon,
  MailIcon,
  QuoteIcon,
  SettingsIcon,
  UsersIcon,
} from "@/components/portal/icons";
import { cn } from "@/lib/utils";

/* Dashboard internal METITO — digitalisasi CRM_Nomor_Surat_METITO_3.xlsx.

   SALES  (/sales/*)     = tampilan kerja harian (UI baru).
   ADMIN  (/dashboard/*) = halaman kelola/CRUD; di-port ke UI baru bertahap. */
const NAV_SALES = [
  { href: "/sales", label: "Ringkasan", icon: GridIcon, exact: true },
  { href: "/sales/penawaran", label: "Surat Penawaran", icon: QuoteIcon, exact: false },
  { href: "/sales/surat", label: "Nomor Surat", icon: MailIcon, exact: false },
  { href: "/sales/crm", label: "CRM", icon: UsersIcon, exact: false },
] as const;

const NAV_ADMIN = [
  { href: "/dashboard/quotations", label: "Kelola Penawaran", icon: QuoteIcon, exact: false },
  { href: "/dashboard/letters", label: "Kelola Surat", icon: MailIcon, exact: false },
  { href: "/dashboard/crm", label: "Kelola CRM", icon: UsersIcon, exact: false },
  { href: "/dashboard/crm/activities", label: "Log Aktivitas", icon: UsersIcon, exact: false },
  { href: "/dashboard/settings", label: "Pengaturan", icon: SettingsIcon, exact: false },
] as const;

/** Menu kelola untuk SALES: penawarannya sendiri dan pencatatan follow-up. */
const SALES_KELOLA_HREFS: readonly string[] = [
  "/dashboard/quotations",
  "/dashboard/crm/activities",
];

/** Satu-satunya menu peran MAGANG: mengisi Log Aktivitas. */
const NAV_MAGANG = [
  { href: "/dashboard/crm/activities", label: "Log Aktivitas", icon: UsersIcon, exact: false },
] as const;

type NavEntry = {
  href: string;
  label: string;
  icon: (props: React.SVGProps<SVGSVGElement>) => React.ReactElement;
  exact: boolean;
};

function matches(pathname: string, item: NavEntry): boolean {
  return item.exact ? pathname === item.href : pathname.startsWith(item.href);
}

/**
 * Menu yang paling spesifik yang menang. Tanpa ini "Kelola CRM" ikut tersorot
 * saat berada di "Log Aktivitas", karena kedua tautannya berbagi awalan.
 */
function isActive(pathname: string, item: NavEntry, all: readonly NavEntry[]): boolean {
  if (!matches(pathname, item)) return false;
  return !all.some(
    (other) =>
      other.href !== item.href &&
      other.href.length > item.href.length &&
      matches(pathname, other)
  );
}

function NavItem({ item, active }: { item: NavEntry; active: boolean }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group relative flex items-center gap-3 rounded-md px-3 py-2.5 text-regular transition-colors",
        active ? "bg-white/10 text-[#fff]" : "text-[#c3d6ec] hover:bg-white/5 hover:text-[#fff]"
      )}
    >
      {active ? (
        <span className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r bg-orange" />
      ) : null}
      <Icon
        className={cn(
          "h-[18px] w-[18px]",
          active ? "text-orange" : "text-[#8fb4dd] group-hover:text-[#c3d6ec]"
        )}
      />
      {item.label}
    </Link>
  );
}

export function Sidebar({
  className,
  role = "ADMIN",
}: {
  className?: string;
  role?: "ADMIN" | "SALES" | "MAGANG";
}) {
  const pathname = usePathname();
  const isAdmin = role === "ADMIN";
  const isMagang = role === "MAGANG";
  const salesItems = isMagang ? [] : NAV_SALES;
  const kelolaItems = isMagang
    ? NAV_MAGANG
    : isAdmin
      ? NAV_ADMIN
      : NAV_ADMIN.filter((item) => SALES_KELOLA_HREFS.includes(item.href));
  const allItems: readonly NavEntry[] = [...salesItems, ...kelolaItems];
  return (
    <aside
      className={cn(
        "flex h-full w-[264px] shrink-0 flex-col bg-navy text-[#fff]",
        className
      )}
    >
      <div className="flex h-16 items-center border-b border-white/10 px-5">
        <Link href="/" aria-label="beranda METITO" className="flex items-center gap-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/metito-mark.png"
            alt="METITO — Multi Enviro Tirta Teknologi"
            className="h-9 w-auto rounded-full bg-white p-0.5"
          />
          <span className="flex flex-col justify-center gap-0.5 leading-none">
            <span className="text-[1.1rem] font-bold leading-none tracking-tight text-[#fff]">
              M<span className="text-orange">E</span>TITO
            </span>
            <span className="text-[0.52rem] font-medium leading-none tracking-[0.04em] text-[#8fb4dd]">
              Multi Enviro Tirta Teknologi
            </span>
          </span>
        </Link>
      </div>

      <nav className="no-scrollbar flex-1 space-y-1 overflow-y-auto p-4">
        {salesItems.length > 0 ? (
          <>
            <p className="px-3 pb-2 font-mono text-tiny uppercase tracking-wide text-[#8fb4dd]">
              Sales
            </p>
            {salesItems.map((item) => (
              <NavItem key={item.href} item={item} active={isActive(pathname, item, allItems)} />
            ))}
          </>
        ) : null}

        {kelolaItems.length > 0 ? (
          <>
            <p
              className={cn(
                "px-3 pb-2 font-mono text-tiny uppercase tracking-wide text-[#8fb4dd]",
                salesItems.length > 0 && "pt-5"
              )}
            >
              {isAdmin ? "Admin" : isMagang ? "Tugas" : "Kelola"}
            </p>
            {kelolaItems.map((item) => (
              <NavItem key={item.href} item={item} active={isActive(pathname, item, allItems)} />
            ))}
          </>
        ) : null}
      </nav>
    </aside>
  );
}
