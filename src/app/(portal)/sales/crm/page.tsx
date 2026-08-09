import type { Metadata } from "next";

import { Badge } from "@/components/portal/badge";
import { Card, CardHeader, Eyebrow } from "@/components/portal/card";
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
import type { CrmAccountStatus, CrmDealStage, CrmDivision } from "@prisma/client";
import { db } from "@/lib/db";
import {
  ACCOUNT_STATUS_LABEL,
  ACTIVITY_TYPE_LABEL,
  DEAL_STAGE_LABEL,
  isOpenStage,
  weightedValue,
} from "@/lib/crm-labels";
import {
  DIVISION_COLOR,
  DIVISION_LABEL,
  formatCompactIDR,
  formatTanggal,
  safeQuery,
} from "@/lib/portal/internal";
import { getSession } from "@/lib/portal/session.server";
import { formatRupiah } from "@/lib/quotation-math";

export const metadata: Metadata = { title: "CRM | METITO" };

const STAGE_TONE: Record<CrmDealStage, "neutral" | "blue" | "amber" | "green" | "red"> = {
  PROSPEK: "neutral",
  PENAWARAN: "blue",
  NEGOSIASI: "amber",
  DEAL: "green",
  KALAH: "red",
};

const ACCOUNT_TONE: Record<CrmAccountStatus, "blue" | "green" | "neutral"> = {
  PROSPEK: "blue",
  AKTIF: "green",
  TIDAK_AKTIF: "neutral",
};

export default async function CrmPage() {
  const session = await getSession();
  const isAdmin = session?.role === "ADMIN";
  const data = await safeQuery(async () => {
    const [accounts, deals, activities] = await Promise.all([
      db.crmAccount.findMany({ orderBy: { addedAt: "desc" } }),
      db.crmDeal.findMany({
        include: { account: { select: { name: true } } },
        orderBy: { updatedAt: "desc" },
      }),
      db.crmActivity.findMany({
        include: { account: { select: { name: true } } },
        orderBy: { occurredAt: "desc" },
        take: 10,
      }),
    ]);
    return { accounts, deals, activities };
  });

  if (!data) {
    return (
      <div>
        <PageHeading
          title="CRM"
          description="Master pelanggan, pipeline penjualan, dan log aktivitas."
        />
        <DbOffline module="CRM" />
      </div>
    );
  }

  const { accounts, deals, activities } = data;

  // ---- rekap ala sheet "Dashboard" pada Excel ----
  const openDeals = deals.filter((d) => isOpenStage(d.stage));
  const pipelineValue = openDeals.reduce((sum, d) => sum + Number(d.estimatedValue), 0);
  const weighted = openDeals.reduce(
    (sum, d) => sum + weightedValue(Number(d.estimatedValue), d.probability, d.stage),
    0
  );
  const wonCount = deals.filter((d) => d.stage === "DEAL").length;
  const aktif = accounts.filter((a) => a.status === "AKTIF").length;
  const prospek = accounts.filter((a) => a.status === "PROSPEK").length;

  // Nilai pipeline per divisi (panel "NILAI PIPELINE PER DIVISI (Rp)").
  const perDivision = (Object.keys(DIVISION_LABEL) as CrmDivision[])
    .map((div) => ({
      label: DIVISION_LABEL[div],
      value: openDeals
        .filter((d) => d.division === div)
        .reduce((sum, d) => sum + Number(d.estimatedValue), 0),
      color: DIVISION_COLOR[div],
    }))
    .filter((s) => s.value > 0);

  const pipelineRows = [...openDeals]
    .sort((a, b) => Number(b.estimatedValue) - Number(a.estimatedValue))
    .slice(0, 20);
  const accountRows = accounts.slice(0, 20);

  return (
    <div className="space-y-6">
      <PageHeading
        title="CRM"
        description="Digitalisasi CRM_Nomor_Surat_METITO_3.xlsx — pelanggan, pipeline, dan aktivitas dalam satu basis data."
        action={
          <KelolaLink
            href="/dashboard/crm"
            isAdmin={isAdmin}
            className="inline-flex items-center justify-center gap-2 rounded-[4px] bg-brand px-4 py-2.5 text-regular font-medium text-[#fff] transition-colors hover:bg-[#d64300]"
          >
            Kelola di konsol admin
          </KelolaLink>
        }
      />

      {/* statistik */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatTile
          label="Total pelanggan"
          value={accounts.length}
          hint={`${aktif} aktif · ${prospek} prospek`}
          accent="neutral"
        />
        <StatTile
          label="Peluang berjalan"
          value={openDeals.length}
          hint={`${wonCount} deal menang sepanjang data`}
          accent="blue"
        />
        <StatTile
          label="Nilai pipeline"
          value={formatCompactIDR(pipelineValue)}
          hint="Total estimasi peluang terbuka"
          accent="brand"
        />
        <StatTile
          label="Nilai tertimbang"
          value={formatCompactIDR(weighted)}
          hint="Estimasi × probabilitas closing"
          accent="green"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* pipeline */}
        <Card className="lg:col-span-2">
          <CardHeader
            title="Pipeline penjualan"
            subtitle="Peluang terbuka, diurutkan dari nilai terbesar"
            action={
              <KelolaLink href="/dashboard/crm/pipeline" isAdmin={isAdmin}>
                Papan pipeline
              </KelolaLink>
            }
          />
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="px-5">Peluang</TableHead>
                  <TableHead>Divisi</TableHead>
                  <TableHead>Tahap</TableHead>
                  <TableHead className="text-right">Estimasi</TableHead>
                  <TableHead className="pr-5 text-right">Target closing</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pipelineRows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="px-5 py-10 text-center text-muted-foreground">
                      Tidak ada peluang terbuka.
                    </TableCell>
                  </TableRow>
                ) : (
                  pipelineRows.map((d) => (
                    <TableRow key={d.id}>
                      <TableCell className="px-5">
                        <p className="max-w-[22rem] truncate font-medium text-navy" title={d.title}>
                          {d.title}
                        </p>
                        <p className="mt-0.5 max-w-[22rem] truncate text-tiny text-muted-foreground">
                          {d.account.name}
                          {d.ownerName ? ` · PIC ${d.ownerName}` : ""}
                        </p>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {d.division ? DIVISION_LABEL[d.division] : "—"}
                      </TableCell>
                      <TableCell>
                        <Badge tone={STAGE_TONE[d.stage]}>
                          {DEAL_STAGE_LABEL[d.stage]}
                          {d.probability ? ` · ${d.probability}%` : ""}
                        </Badge>
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-right font-medium text-navy">
                        {formatRupiah(d.estimatedValue)}
                      </TableCell>
                      <TableCell className="whitespace-nowrap pr-5 text-right">
                        {formatTanggal(d.targetCloseDate)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* nilai pipeline per divisi */}
        <Card>
          <CardHeader title="Pipeline per divisi" subtitle="Nilai estimasi peluang terbuka" />
          <div className="flex flex-col items-center gap-5 p-6">
            {perDivision.length === 0 ? (
              <p className="py-8 text-small text-muted-foreground">Belum ada data.</p>
            ) : (
              <>
                <DonutChart
                  segments={perDivision}
                  centerValue={formatCompactIDR(pipelineValue).replace("Rp ", "")}
                  centerLabel="total pipeline"
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

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* master pelanggan */}
        <Card className="lg:col-span-2">
          <CardHeader
            title="Data pelanggan"
            subtitle="Master pelanggan penjualan (sheet Data Pelanggan)"
            action={
              <KelolaLink href="/dashboard/crm" isAdmin={isAdmin}>
                Semua pelanggan
              </KelolaLink>
            }
          />
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="px-5">Perusahaan</TableHead>
                  <TableHead>Divisi terkait</TableHead>
                  <TableHead>PIC</TableHead>
                  <TableHead>Kontak</TableHead>
                  <TableHead className="pr-5">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {accountRows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="px-5 py-10 text-center text-muted-foreground">
                      Belum ada pelanggan. Tambahkan lewat konsol admin.
                    </TableCell>
                  </TableRow>
                ) : (
                  accountRows.map((a) => (
                    <TableRow key={a.id}>
                      <TableCell className="px-5">
                        <p className="max-w-[18rem] truncate font-medium text-navy" title={a.name}>
                          {a.name}
                        </p>
                        {a.industry ? (
                          <p className="mt-0.5 text-tiny text-muted-foreground">{a.industry}</p>
                        ) : null}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {a.division ? DIVISION_LABEL[a.division] : "—"}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {a.picName ?? "—"}
                        {a.picTitle ? (
                          <span className="block text-tiny text-muted-foreground">{a.picTitle}</span>
                        ) : null}
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-small">
                        {a.phone ?? a.email ?? "—"}
                      </TableCell>
                      <TableCell className="pr-5">
                        <Badge tone={ACCOUNT_TONE[a.status]} dot>
                          {ACCOUNT_STATUS_LABEL[a.status]}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* log aktivitas */}
        <Card>
          <CardHeader
            title="Aktivitas terakhir"
            subtitle="Log interaksi & tindak lanjut"
            action={
              <KelolaLink href="/dashboard/crm/activities" isAdmin={isAdmin}>
                Semua log
              </KelolaLink>
            }
          />
          <ul className="divide-y divide-border">
            {activities.length === 0 ? (
              <li className="px-5 py-8 text-center text-small text-muted-foreground">
                Belum ada aktivitas tercatat.
              </li>
            ) : (
              activities.map((act) => (
                <li key={act.id} className="px-5 py-3.5">
                  <div className="flex items-center justify-between gap-3">
                    <Eyebrow>{ACTIVITY_TYPE_LABEL[act.type]}</Eyebrow>
                    <span className="shrink-0 text-tiny text-muted-foreground">
                      {formatTanggal(act.occurredAt)}
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-small text-body">{act.description}</p>
                  <p className="mt-1 text-tiny text-muted-foreground">
                    {act.account?.name ?? act.contactName ?? "—"}
                    {act.nextAction ? (
                      <span className="text-blue"> · lanjut: {act.nextAction}</span>
                    ) : null}
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
