-- CreateTable
CREATE TABLE "whatsapp_contacts" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "email" TEXT,
    "role" TEXT,
    "color" TEXT NOT NULL DEFAULT 'bg-green-600',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "whatsapp_contacts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "whatsapp_contacts_isActive_idx" ON "whatsapp_contacts"("isActive");

-- CreateIndex
CREATE INDEX "whatsapp_contacts_sortOrder_idx" ON "whatsapp_contacts"("sortOrder");
