import type { Metadata } from "next";
import Link from "next/link";

import { Badge } from "@/components/portal/badge";
import { Card, CardHeader } from "@/components/portal/card";
import { DonutChart } from "@/components/portal/charts";
import { KelolaLink } from "@/components/portal/kelola-link";
import { DbOffline, StatTile } from "@/components/portal/internal";
import { PageHeading } from "@/components/portal/ui";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { db } from "@/lib/db";
import { formatCompactIDR, formatTanggal, safeQuery } from "@/lib/portal/internal";
import { getSession } from "@/lib/portal/session.server";
import { formatRupiah } from "@/lib/quotation-math";
import { withRevision } from "@/lib/quotation-number";
import { displayStatus, isShareable, STATUS_LABEL, type DisplayStatus } from "@/lib/quotation-status";

export const metadata: Metadata = { title: "Surat Penawaran | METITO" };

const STATUS_TONE: Record<DisplayStatus, "neutral" | "blue" | "green" | "red" | "amber"> = {
  DRAFT: "neutral",
  SENT: "blue",
  WON: "green",
  LOST: "red",
  EXPIRED: "amber",
};

const STATUS_COLOR: Record<DisplayStatus, string> = {
  DRAFT: "#5a6b81",
  SENT: "#096aae",
  WON: "#1e7226",
  LOST: "#d92d20",
  EXPIRED: "#fb8501",
};

export default async function PenawaranPage() {
  const session = await getSession();
  const isAdmin = session?.role === "ADMIN";
  const quotations = await safeQuery(() =>
    db.quotation.findMany({
      orderBy: { updatedAt: "desc" },
      include: { _count: { select: { items: true } } },
    })
  );

  if (!quotations) {
    return (
      <div>
        <PageHeading
          title="Surat Penawaran"
          description="Dokumen penawaran harga (SPH) yang disusun lewat konsol admin."
        />
        <DbOffline module="surat penawaran" />
      </div>
    );
  }

  const withStatus = quotations.map((q) => ({
    ...q,
    display: displayStatus(q.status, q.validUntil),
  }));

  const byStatus = (s: DisplayStatus) => withStatus.filter((q) => q.display === s);
  const outstanding = byStatus("SENT").reduce((sum, q) => sum + Number(q.total), 0);
  const wonValue = byStatus("WON").reduce((sum, q) => sum + Number(q.total), 0);
  const closed = byStatus("WON").length + byStatus("LOST").length;
  const winRate = closed > 0 ? Math.round((byStatus("WON").length / closed) * 100) : null;

  const donutSegments = (Object.keys(STATUS_LABEL) as DisplayStatus[])
    .map((s) => ({ label: STATUS_LABEL[s], value: byStatus(s).length, color: STATUS_COLOR[s] }))
    .filter((s) => s.value > 0);

  const recent = withStatus.slice(0, 50);

  return (
    <div className="space-y-6">
      <PageHeading
        title="Surat Penawaran"
        description={`${quotations.length} dokumen · penomoran otomatis NNN/SPH-Metito/BULAN/TAHUN`}
        action={
          <KelolaLink
            href="/dashboard/quotations/new"
            isAdmin={isAdmin}
            className="inline-flex items-center justify-center gap-2 rounded-[4px] bg-brand px-4 py-2.5 text-regular font-medium text-[#fff] transition-colors hover:bg-[#d64300]"
          >
            Buat penawaran baru
          </KelolaLink>
        }
      />

      {/* statistik */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatTile
          label="Menunggu jawaban"
          value={byStatus("SENT").length}
          hint={`${formatCompactIDR(outstanding)} nilai terkirim`}
          accent="blue"
        />
        <StatTile
          label="Menang (won)"
          value={byStatus("WON").length}
          hint={`${formatCompactIDR(wonValue)} nilai deal`}
          accent="green"
        />
        <StatTile
          label="Win rate"
          value={winRate === null ? "—" : `${winRate}%`}
          hint={`${closed} penawaran selesai`}
          accent="brand"
        />
        <StatTile
          label="Draft"
          value={byStatus("DRAFT").length}
          hint="Belum diterbitkan, nomor belum terpakai"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* daftar penawaran */}
        <Card className="lg:col-span-2">
          <CardHeader
            title="Dokumen terbaru"
            subtitle="Diurutkan dari perubahan terakhir"
            action={
              <KelolaLink href="/dashboard/quotations" isAdmin={isAdmin}>
                Kelola di konsol admin
              </KelolaLink>
            }
          />
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="px-5">Nomor</TableHead>
                  <TableHead>Pelanggan</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="pr-5 text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recent.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="px-5 py-10 text-center text-muted-foreground">
                      Belum ada surat penawaran. Buat lewat konsol admin.
                    </TableCell>
                  </TableRow>
                ) : (
                  recent.map((q) => (
                    <TableRow key={q.id}>
                      <TableCell className="px-5">
                        <Link
                          href={`/dashboard/quotations/${q.id}`}
                          className="font-medium text-navy hover:text-blue"
                        >
                          {q.numberBase ? withRevision(q.numberBase, q.revision) : "(draft — belum bernomor)"}
                        </Link>
                        <p className="mt-0.5 max-w-[26rem] truncate text-tiny text-muted-foreground">
                          {q.subject}
                        </p>
                      </TableCell>
                      <TableCell className="max-w-[14rem] truncate">{q.customerName}</TableCell>
                      <TableCell className="whitespace-nowrap">{formatTanggal(q.quoteDate)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge tone={STATUS_TONE[q.display]}>{STATUS_LABEL[q.display]}</Badge>
                          {q.publicToken && isShareable(q.status) ? (
                            <Link
                              href={`/q/${q.publicToken}`}
                              target="_blank"
                              className="text-tiny text-blue hover:underline"
                              title={`Dilihat pelanggan ${q.viewCount}×`}
                            >
                              link publik
                            </Link>
                          ) : null}
                        </div>
                      </TableCell>
                      <TableCell className="whitespace-nowrap pr-5 text-right font-medium text-navy">
                        {formatRupiah(q.total)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* distribusi status */}
        <Card>
          <CardHeader title="Distribusi status" subtitle="Seluruh dokumen" />
          <div className="flex flex-col items-center gap-5 p-6">
            {donutSegments.length === 0 ? (
              <p className="py-8 text-small text-muted-foreground">Belum ada data.</p>
            ) : (
              <>
                <DonutChart
                  segments={donutSegments}
                  centerValue={String(quotations.length)}
                  centerLabel="dokumen"
                />
                <ul className="w-full space-y-2">
                  {donutSegments.map((s) => (
                    <li key={s.label} className="flex items-center justify-between text-small">
                      <span className="flex items-center gap-2 text-body">
                        <span className="size-2.5 rounded-full" style={{ background: s.color }} />
                        {s.label}
                      </span>
                      <span className="font-medium text-navy">{s.value}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
