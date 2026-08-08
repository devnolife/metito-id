import Link from "next/link";

import { Badge } from "@/components/portal/badge";
import { Card, CardHeader, Eyebrow } from "@/components/portal/card";
import { BarChart, DonutChart } from "@/components/portal/charts";
import { BoltIcon } from "@/components/portal/icons";
import { DbOffline, StatTile } from "@/components/portal/internal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { CrmDivision } from "@prisma/client";
import { ACTIVITY_TYPE_LABEL, isOpenStage } from "@/lib/crm-labels";
import { db } from "@/lib/db";
import {
  DIVISION_COLOR,
  DIVISION_LABEL,
  formatCompactIDR,
  formatTanggal,
  safeQuery,
} from "@/lib/portal/internal";
import { getSession } from "@/lib/portal/session.server";
import { formatRupiah } from "@/lib/quotation-math";
import { withRevision } from "@/lib/quotation-number";
import { displayStatus, STATUS_LABEL, type DisplayStatus } from "@/lib/quotation-status";

const STATUS_TONE: Record<DisplayStatus, "neutral" | "blue" | "green" | "red" | "amber"> = {
  DRAFT: "neutral",
  SENT: "blue",
  WON: "green",
  LOST: "red",
  EXPIRED: "amber",
};

const BULAN = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

export default async function OverviewPage() {
  const session = await getSession();
  const firstName = session?.name.split(" ")[0] ?? "";

  const data = await safeQuery(async () => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const [quotations, deals, accountsTotal, accountsAktif, lettersYear, lettersMonth, activities] =
      await Promise.all([
        db.quotation.findMany({ orderBy: { updatedAt: "desc" } }),
        db.crmDeal.findMany({ select: { stage: true, division: true, estimatedValue: true } }),
        db.crmAccount.count(),
        db.crmAccount.count({ where: { status: "AKTIF" } }),
        db.letter.count({ where: { year: now.getFullYear() } }),
        db.letter.count({ where: { letterDate: { gte: startOfMonth } } }),
        db.crmActivity.findMany({
          include: { account: { select: { name: true } } },
          orderBy: { occurredAt: "desc" },
          take: 6,
        }),
      ]);
    return { quotations, deals, accountsTotal, accountsAktif, lettersYear, lettersMonth, activities };
  });

  const greeting = (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div>
        <Eyebrow>Ringkasan</Eyebrow>
        <h1 className="mt-1 text-h3 font-medium tracking-h3 text-navy">
          {firstName ? `Selamat datang, ${firstName}` : "Selamat datang"}
        </h1>
        <p className="mt-1 text-regular text-body">
          Operasional penawaran, persuratan, dan penjualan METITO hari ini.
        </p>
      </div>
      <Link
        href="/dashboard/quotations/new"
        className="inline-flex items-center justify-center gap-2 rounded-[4px] bg-brand px-4 py-2.5 text-regular font-medium text-[#fff] transition-colors hover:bg-[#d64300]"
      >
        <BoltIcon className="h-4 w-4" />
        Buat penawaran baru
      </Link>
    </div>
  );

  if (!data) {
    return (
      <div className="space-y-6">
        {greeting}
        <DbOffline module="ringkasan" />
      </div>
    );
  }

  const now = new Date();
  const withStatus = data.quotations.map((q) => ({
    ...q,
    display: displayStatus(q.status, q.validUntil),
  }));
  const sent = withStatus.filter((q) => q.display === "SENT");
  const sentValue = sent.reduce((sum, q) => sum + Number(q.total), 0);

  const openDeals = data.deals.filter((d) => isOpenStage(d.stage));
  const pipelineValue = openDeals.reduce((sum, d) => sum + Number(d.estimatedValue), 0);

  // Penawaran per bulan tahun berjalan (berdasarkan tanggal penawaran).
  const quotationsThisYear = withStatus.filter(
    (q) => new Date(q.quoteDate).getFullYear() === now.getFullYear()
  );
  const perMonth = BULAN.map((label, m) => ({
    label,
    value: quotationsThisYear.filter((q) => new Date(q.quoteDate).getMonth() === m).length,
  })).slice(0, now.getMonth() + 1);

  // Nilai pipeline terbuka per divisi (panel Dashboard pada Excel).
  const perDivision = (Object.keys(DIVISION_LABEL) as CrmDivision[])
    .map((div) => ({
      label: DIVISION_LABEL[div],
      value: openDeals
        .filter((d) => d.division === div)
        .reduce((sum, d) => sum + Number(d.estimatedValue), 0),
      color: DIVISION_COLOR[div],
    }))
    .filter((s) => s.value > 0);

  const recentQuotations = withStatus.slice(0, 5);

  return (
    <div className="space-y-6">
      {greeting}

      {/* KPI */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatTile
          label="Penawaran menunggu jawaban"
          value={sent.length}
          hint={`${formatCompactIDR(sentValue)} nilai terkirim`}
          accent="blue"
        />
        <StatTile
          label="Nilai pipeline terbuka"
          value={formatCompactIDR(pipelineValue)}
          hint={`${openDeals.length} peluang berjalan`}
          accent="brand"
        />
        <StatTile
          label="Pelanggan"
          value={data.accountsTotal}
          hint={`${data.accountsAktif} berstatus aktif`}
          accent="green"
        />
        <StatTile
          label="Surat bulan ini"
          value={data.lettersMonth}
          hint={`${data.lettersYear} surat sepanjang ${now.getFullYear()}`}
        />
      </div>

      {/* charts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader
            title="Penawaran per bulan"
            subtitle={`Jumlah dokumen dibuat · ${now.getFullYear()}`}
            action={
              <Link href="/dashboard/penawaran" className="text-small text-blue hover:underline">
                Lihat semua
              </Link>
            }
          />
          <div className="p-4">
            {quotationsThisYear.length === 0 ? (
              <p className="py-10 text-center text-small text-muted-foreground">
                Belum ada penawaran tahun ini.
              </p>
            ) : (
              <BarChart series={perMonth} height={230} />
            )}
          </div>
        </Card>

        <Card>
          <CardHeader title="Pipeline per divisi" subtitle="Nilai peluang terbuka" />
          <div className="flex flex-col items-center gap-5 p-6">
            {perDivision.length === 0 ? (
              <p className="py-8 text-small text-muted-foreground">Belum ada pipeline terbuka.</p>
            ) : (
              <>
                <DonutChart
                  segments={perDivision}
                  size={160}
                  centerValue={formatCompactIDR(pipelineValue).replace("Rp ", "")}
                  centerLabel="pipeline"
                />
                <ul className="w-full space-y-2">
                  {perDivision.map((s) => (
                    <li key={s.label} className="flex items-center justify-between text-small">
                      <span className="flex items-center gap-2 text-body">
                        <span className="size-2.5 rounded-full" style={{ background: s.color }} />
                        {s.label}
                      </span>
                      <span className="font-medium text-navy">{formatCompactIDR(s.value)}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </Card>
      </div>

      {/* tables */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader
            title="Penawaran terbaru"
            subtitle="Lima dokumen terakhir yang berubah"
            action={
              <Link href="/dashboard/penawaran" className="text-small text-blue hover:underline">
                Semua penawaran
              </Link>
            }
          />
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="px-5">Nomor</TableHead>
                  <TableHead>Pelanggan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="pr-5 text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentQuotations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="px-5 py-10 text-center text-muted-foreground">
                      Belum ada surat penawaran.
                    </TableCell>
                  </TableRow>
                ) : (
                  recentQuotations.map((q) => (
                    <TableRow key={q.id}>
                      <TableCell className="px-5">
                        <Link
                          href={`/dashboard/quotations/${q.id}`}
                          className="font-medium text-navy hover:text-blue"
                        >
                          {q.numberBase ? withRevision(q.numberBase, q.revision) : "(draft)"}
                        </Link>
                        <p className="mt-0.5 max-w-[20rem] truncate text-tiny text-muted-foreground">
                          {q.subject}
                        </p>
                      </TableCell>
                      <TableCell className="max-w-[12rem] truncate">{q.customerName}</TableCell>
                      <TableCell>
                        <Badge tone={STATUS_TONE[q.display]}>{STATUS_LABEL[q.display]}</Badge>
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

        <Card>
          <CardHeader
            title="Aktivitas terakhir"
            subtitle="Log CRM"
            action={
              <Link href="/dashboard/crm" className="text-small text-blue hover:underline">
                Semua log
              </Link>
            }
          />
          <ul className="divide-y divide-border">
            {data.activities.length === 0 ? (
              <li className="px-5 py-8 text-center text-small text-muted-foreground">
                Belum ada aktivitas tercatat.
              </li>
            ) : (
              data.activities.map((act) => (
                <li key={act.id} className="px-5 py-3.5">
                  <div className="flex items-center justify-between gap-3">
                    <Eyebrow>{ACTIVITY_TYPE_LABEL[act.type]}</Eyebrow>
                    <span className="shrink-0 text-tiny text-muted-foreground">
                      {formatTanggal(act.occurredAt)}
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-small text-body">{act.description}</p>
                  <p className="mt-1 truncate text-tiny text-muted-foreground">
                    {act.account?.name ?? act.contactName ?? "—"}
                  </p>
                </li>
              ))
            )}
          </ul>
        </Card>
      </div>
    </div>
  );
}
