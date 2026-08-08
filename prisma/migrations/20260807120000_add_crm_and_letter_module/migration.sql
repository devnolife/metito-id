-- CreateEnum
CREATE TYPE "CrmDivision" AS ENUM ('CSC', 'ES', 'EQS', 'CSP', 'MMH');

-- CreateEnum
CREATE TYPE "CrmAccountStatus" AS ENUM ('PROSPEK', 'AKTIF', 'TIDAK_AKTIF');

-- CreateEnum
CREATE TYPE "CrmDealStage" AS ENUM ('PROSPEK', 'PENAWARAN', 'NEGOSIASI', 'DEAL', 'KALAH');

-- CreateEnum
CREATE TYPE "CrmActivityType" AS ENUM ('TELEPON', 'EMAIL', 'MEETING', 'KUNJUNGAN', 'WHATSAPP', 'LAINNYA');

-- CreateEnum
CREATE TYPE "LetterType" AS ENUM ('SPH', 'SPK', 'SJ', 'BA', 'MOU', 'SK', 'MEMO', 'SI', 'SL');

-- CreateEnum
CREATE TYPE "LetterStatus" AS ENUM ('DRAFT', 'TERKIRIM', 'DISETUJUI', 'DIBATALKAN');

-- CreateTable
CREATE TABLE "crm_accounts" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "industry" TEXT,
    "division" "CrmDivision",
    "address" TEXT,
    "picName" TEXT,
    "picTitle" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "leadSource" TEXT,
    "status" "CrmAccountStatus" NOT NULL DEFAULT 'PROSPEK',
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "crm_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crm_deals" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "division" "CrmDivision",
    "estimatedValue" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "stage" "CrmDealStage" NOT NULL DEFAULT 'PROSPEK',
    "probability" INTEGER NOT NULL DEFAULT 0,
    "startDate" TIMESTAMP(3),
    "targetCloseDate" TIMESTAMP(3),
    "ownerName" TEXT,
    "notes" TEXT,
    "quotationId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "crm_deals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crm_activities" (
    "id" TEXT NOT NULL,
    "accountId" TEXT,
    "dealId" TEXT,
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "contactName" TEXT,
    "type" "CrmActivityType" NOT NULL DEFAULT 'TELEPON',
    "description" TEXT NOT NULL,
    "nextAction" TEXT,
    "nextActionDate" TIMESTAMP(3),
    "ownerName" TEXT,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "crm_activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "letter_counters" (
    "year" INTEGER NOT NULL,
    "type" "LetterType" NOT NULL,
    "division" TEXT NOT NULL DEFAULT '-',
    "lastSeq" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "letter_counters_pkey" PRIMARY KEY ("year","type","division")
);

-- CreateTable
CREATE TABLE "letters" (
    "id" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "seq" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "type" "LetterType" NOT NULL,
    "division" "CrmDivision",
    "letterDate" TIMESTAMP(3) NOT NULL,
    "subject" TEXT NOT NULL,
    "recipient" TEXT NOT NULL,
    "issuerName" TEXT NOT NULL,
    "status" "LetterStatus" NOT NULL DEFAULT 'DRAFT',
    "notes" TEXT,
    "accountId" TEXT,
    "quotationId" TEXT,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "letters_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "crm_accounts_status_idx" ON "crm_accounts"("status");

-- CreateIndex
CREATE INDEX "crm_accounts_division_idx" ON "crm_accounts"("division");

-- CreateIndex
CREATE INDEX "crm_accounts_name_idx" ON "crm_accounts"("name");

-- CreateIndex
CREATE UNIQUE INDEX "crm_deals_quotationId_key" ON "crm_deals"("quotationId");

-- CreateIndex
CREATE INDEX "crm_deals_accountId_idx" ON "crm_deals"("accountId");

-- CreateIndex
CREATE INDEX "crm_deals_stage_idx" ON "crm_deals"("stage");

-- CreateIndex
CREATE INDEX "crm_deals_division_idx" ON "crm_deals"("division");

-- CreateIndex
CREATE INDEX "crm_deals_targetCloseDate_idx" ON "crm_deals"("targetCloseDate");

-- CreateIndex
CREATE INDEX "crm_activities_accountId_idx" ON "crm_activities"("accountId");

-- CreateIndex
CREATE INDEX "crm_activities_dealId_idx" ON "crm_activities"("dealId");

-- CreateIndex
CREATE INDEX "crm_activities_occurredAt_idx" ON "crm_activities"("occurredAt");

-- CreateIndex
CREATE INDEX "crm_activities_nextActionDate_idx" ON "crm_activities"("nextActionDate");

-- CreateIndex
CREATE UNIQUE INDEX "letters_number_key" ON "letters"("number");

-- CreateIndex
CREATE UNIQUE INDEX "letters_quotationId_key" ON "letters"("quotationId");

-- CreateIndex
CREATE INDEX "letters_type_year_idx" ON "letters"("type", "year");

-- CreateIndex
CREATE INDEX "letters_letterDate_idx" ON "letters"("letterDate");

-- CreateIndex
CREATE INDEX "letters_status_idx" ON "letters"("status");

-- CreateIndex
CREATE INDEX "letters_accountId_idx" ON "letters"("accountId");

-- AddForeignKey
ALTER TABLE "crm_deals" ADD CONSTRAINT "crm_deals_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "crm_accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crm_deals" ADD CONSTRAINT "crm_deals_quotationId_fkey" FOREIGN KEY ("quotationId") REFERENCES "quotations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crm_activities" ADD CONSTRAINT "crm_activities_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "crm_accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crm_activities" ADD CONSTRAINT "crm_activities_dealId_fkey" FOREIGN KEY ("dealId") REFERENCES "crm_deals"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crm_activities" ADD CONSTRAINT "crm_activities_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "letters" ADD CONSTRAINT "letters_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "crm_accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "letters" ADD CONSTRAINT "letters_quotationId_fkey" FOREIGN KEY ("quotationId") REFERENCES "quotations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "letters" ADD CONSTRAINT "letters_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
