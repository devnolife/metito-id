-- CreateTable
CREATE TABLE "customers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "company" TEXT,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "address" TEXT,
    "industry" TEXT,
    "projectType" TEXT,
    "testimonial" TEXT,
    "rating" INTEGER NOT NULL DEFAULT 0,
    "avatar" TEXT,
    "website" TEXT,
    "contactDate" TIMESTAMP(3),
    "projectValue" TEXT,
    "status" TEXT NOT NULL DEFAULT 'potential',
    "isPublicTestimonial" BOOLEAN NOT NULL DEFAULT false,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "customers_email_key" ON "customers"("email");

-- CreateIndex
CREATE INDEX "customers_status_idx" ON "customers"("status");

-- CreateIndex
CREATE INDEX "customers_industry_idx" ON "customers"("industry");

-- CreateIndex
CREATE INDEX "customers_featured_idx" ON "customers"("featured");
