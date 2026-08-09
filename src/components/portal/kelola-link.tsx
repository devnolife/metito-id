import Link from "next/link";

/** Rute kelola yang boleh dibuka SALES; selebihnya khusus ADMIN. */
const SALES_ALLOWED_PREFIX = "/dashboard/quotations";

/**
 * Tautan menuju area kelola (/dashboard/*). Tim sales hanya berhak atas
 * penawarannya sendiri, sehingga tautan ke data master (CRM, surat,
 * pengaturan) disembunyikan untuk mereka — menampilkannya hanya menghasilkan
 * tautan buntu karena proxy memantulkannya balik ke /sales.
 */
export function KelolaLink({
  href,
  isAdmin,
  children,
  className = "text-small text-blue hover:underline",
}: {
  href: string;
  isAdmin: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  if (!isAdmin && !href.startsWith(SALES_ALLOWED_PREFIX)) return null;
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
