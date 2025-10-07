-- CreateTable
CREATE TABLE "page_contents" (
    "id" TEXT NOT NULL,
    "page" TEXT NOT NULL,
    "section" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "title" TEXT,
    "subtitle" TEXT,
    "description" TEXT,
    "content" JSONB,
    "imageUrl" TEXT,
    "link" TEXT,
    "icon" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "page_contents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "page_contents_page_idx" ON "page_contents"("page");

-- CreateIndex
CREATE INDEX "page_contents_section_idx" ON "page_contents"("section");

-- CreateIndex
CREATE INDEX "page_contents_isActive_idx" ON "page_contents"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "page_contents_page_section_key_key" ON "page_contents"("page", "section", "key");
