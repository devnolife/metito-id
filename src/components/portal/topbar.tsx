"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { Badge } from "@/components/portal/badge";
import {
  BellIcon,
  ChevronDown,
  GridIcon,
  LogoutIcon,
  MailIcon,
  QuoteIcon,
  SearchIcon,
  SettingsIcon,
  UsersIcon,
} from "@/components/portal/icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const TITLES: { match: (p: string) => boolean; title: string; subtitle: string }[] = [
  { match: (p) => p === "/sales", title: "Ringkasan", subtitle: "Operasional METITO dalam satu pandangan" },
  { match: (p) => p.startsWith("/sales/penawaran"), title: "Surat Penawaran", subtitle: "Dokumen penawaran harga & penomoran SPH" },
  { match: (p) => p.startsWith("/sales/surat"), title: "Nomor Surat", subtitle: "Register penomoran surat keluar" },
  { match: (p) => p.startsWith("/sales/crm"), title: "CRM", subtitle: "Pelanggan, pipeline, dan aktivitas penjualan" },
  { match: (p) => p.startsWith("/dashboard/quotations"), title: "Kelola Penawaran", subtitle: "Susun dan kelola dokumen penawaran" },
  { match: (p) => p.startsWith("/dashboard/letters"), title: "Kelola Surat", subtitle: "Terbitkan dan kelola nomor surat keluar" },
  { match: (p) => p.startsWith("/dashboard/crm"), title: "Kelola CRM", subtitle: "Master pelanggan, pipeline, dan log aktivitas" },
  { match: (p) => p.startsWith("/dashboard/settings"), title: "Pengaturan", subtitle: "Konfigurasi sistem dan identitas" },
];

const MOBILE_NAV = [
  { href: "/sales", label: "Ringkasan", icon: GridIcon, exact: true },
  { href: "/sales/penawaran", label: "Penawaran", icon: QuoteIcon, exact: false },
  { href: "/sales/surat", label: "Nomor Surat", icon: MailIcon, exact: false },
  { href: "/sales/crm", label: "CRM", icon: UsersIcon, exact: false },
  { href: "/dashboard/quotations", label: "Kelola Penawaran", icon: QuoteIcon, exact: false },
  { href: "/dashboard/letters", label: "Kelola Surat", icon: MailIcon, exact: false },
  { href: "/dashboard/crm", label: "Kelola CRM", icon: UsersIcon, exact: false },
  { href: "/dashboard/settings", label: "Pengaturan", icon: SettingsIcon, exact: false },
] as const;

export function Topbar({
  user,
}: {
  user: { name: string; email: string; company: string; initials: string; isAdmin: boolean };
}) {
  const pathname = usePathname();
  const meta = TITLES.find((t) => t.match(pathname)) ?? TITLES[0];
  const [mobileNav, setMobileNav] = useState(false);
  const mobileNavItems = user.isAdmin
    ? MOBILE_NAV
    : MOBILE_NAV.filter(
        (item) =>
          !item.href.startsWith("/dashboard") || item.href.startsWith("/dashboard/quotations")
      );

  /* Logout sungguhan: hapus cookie JWT `auth-token` di server + token lokal,
     lalu kembali ke halaman masuk. */
  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    } catch {
      // Logout bersifat best-effort; sesi lokal tetap dibersihkan.
    } finally {
      if (typeof window !== "undefined") {
        localStorage.removeItem("adminUser");
        localStorage.removeItem("authToken");
      }
      window.location.href = "/login";
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/95 backdrop-blur">
      <div className="flex h-16 items-center gap-4 px-4 md:px-6">
        {/* mobile: logo + burger */}
        <div className="flex items-center gap-3 lg:hidden">
          <button
            type="button"
            aria-label="Menu"
            onClick={() => setMobileNav((v) => !v)}
            className="flex size-9 items-center justify-center rounded-[0.375rem] border border-border text-card-foreground"
          >
            <span className="flex flex-col gap-1">
              <span className="h-0.5 w-4 bg-current" />
              <span className="h-0.5 w-4 bg-current" />
              <span className="h-0.5 w-4 bg-current" />
            </span>
          </button>
          <Link href="/" aria-label="beranda METITO" className="flex items-center gap-2 lg:hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/metito-mark.png"
              alt="METITO"
              className="h-8 w-auto"
            />
            <span className="text-[1rem] font-bold leading-none tracking-tight text-navy">
              M<span className="text-brand">E</span>TITO
            </span>
          </Link>
        </div>

        <div className="hidden min-w-0 lg:block">
          <h1 className="truncate text-large font-medium text-foreground">{meta.title}</h1>
          <p className="truncate text-small text-muted-foreground">{meta.subtitle}</p>
        </div>

        <div className="ml-auto flex items-center gap-2 md:gap-3">
          <div className="relative hidden items-center md:flex">
            <SearchIcon className="pointer-events-none absolute left-3 size-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Cari penawaran, pelanggan…"
              aria-label="Cari"
              className="h-10 w-56 bg-card pl-9 lg:w-72"
            />
          </div>

          <button
            type="button"
            aria-label="Notifications"
            className="relative flex size-10 items-center justify-center rounded-[0.375rem] border border-border text-card-foreground transition-colors hover:text-foreground"
          >
            <BellIcon className="size-[18px]" />
            <span className="absolute top-2.5 right-2.5 size-1.5 rounded-full bg-primary" />
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger className="flex cursor-pointer items-center gap-2 rounded-[0.5rem] border border-border bg-card py-1.5 pr-2 pl-1.5 text-left transition-colors hover:border-navy/20">
              <span className="flex size-8 items-center justify-center rounded-[0.25rem] bg-primary text-tiny font-semibold text-primary-foreground">
                {user.initials}
              </span>
              <span className="hidden leading-tight md:block">
                <span className="block max-w-[120px] truncate text-small font-medium text-foreground">{user.name}</span>
                <span className="block max-w-[120px] truncate text-tiny text-muted-foreground">{user.company}</span>
              </span>
              <ChevronDown className="hidden size-4 text-muted-foreground md:block" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuGroup>
                <DropdownMenuLabel className="flex flex-col items-start gap-2">
                  <span className="flex w-full flex-col">
                    <span className="truncate text-small font-medium text-foreground">{user.name}</span>
                    <span className="truncate text-tiny font-normal text-muted-foreground">{user.email}</span>
                  </span>
                  <Badge tone="brand" dot>
                    Tim Internal · METITO
                  </Badge>
                </DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem render={<Link href="/" />}>Kembali ke metito.id</DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => {
                    void handleLogout();
                  }}
                >
                  <LogoutIcon data-icon="inline-start" />
                  Keluar
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* mobile nav drawer */}
      {mobileNav ? (
        <nav className="border-t border-border bg-bg px-4 py-3 lg:hidden">
          <div className="grid grid-cols-2 gap-2">
            {mobileNavItems.map((item) => {
              const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileNav(false)}
                  className={cn(
                    "flex items-center gap-2 rounded-[0.375rem] border px-3 py-2.5 text-small",
                    active ? "border-primary/40 bg-primary/10 text-foreground" : "border-border text-card-foreground"
                  )}
                >
                  <Icon className="size-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      ) : null}
    </header>
  );
}
