import Link from "next/link";

/**
 * Tautan menuju area kelola (/dashboard/*). Hanya dirender untuk ADMIN —
 * pengguna SALES tidak berhak membuka area tersebut, jadi menampilkannya
 * hanya akan menghasilkan tautan buntu (proxy memantulkannya balik ke /sales).
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
  if (!isAdmin) return null;
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
