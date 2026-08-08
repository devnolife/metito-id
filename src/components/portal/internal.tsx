import type { ReactNode } from "react";

import { Card } from "@/components/portal/card";
import { cn } from "@/lib/utils";

/**
 * Kartu statistik sederhana untuk modul internal — seperti StatCard portal
 * tetapi tanpa sparkline/delta karena angkanya berasal dari database nyata,
 * bukan deret demo.
 */
export function StatTile({
  label,
  value,
  hint,
  accent,
  className,
}: {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  accent?: "brand" | "blue" | "green" | "red" | "neutral";
  className?: string;
}) {
  const accentColor: Record<NonNullable<typeof accent>, string> = {
    brand: "text-brand",
    blue: "text-blue",
    green: "text-green",
    red: "text-destructive",
    neutral: "text-navy",
  };

  return (
    <Card className={cn("p-5", className)}>
      <p className="font-mono text-tiny uppercase tracking-wide text-tag">{label}</p>
      <p className={cn("mt-3 text-[1.75rem] font-semibold leading-none", accentColor[accent ?? "neutral"])}>
        {value}
      </p>
      {hint ? <p className="mt-3 text-tiny text-tag">{hint}</p> : null}
    </Card>
  );
}

/** Panel pemberitahuan saat server database tidak terjangkau. */
export function DbOffline({ module }: { module: string }) {
  return (
    <Card className="p-8 text-center">
      <p className="font-mono text-tiny uppercase tracking-wide text-destructive">
        Database tidak terjangkau
      </p>
      <p className="mx-auto mt-2 max-w-[32rem] text-regular text-body">
        Data {module} tersimpan di PostgreSQL dan server database sedang tidak
        dapat dihubungi. Periksa koneksi <code className="font-mono text-small">DATABASE_URL</code>{" "}
        pada berkas <code className="font-mono text-small">.env</code>, lalu muat ulang halaman ini.
      </p>
    </Card>
  );
}

/** Baris kosong untuk tabel tanpa data. */
export function EmptyRow({ colSpan, children }: { colSpan: number; children: ReactNode }) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-5 py-10 text-center text-small text-muted-foreground">
        {children}
      </td>
    </tr>
  );
}
