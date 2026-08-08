import { PrismaClient } from '@prisma/client'

// In dev we keep a single global PrismaClient instance to avoid exhausting DB connections.
// However, when the schema changes (e.g. new model added) the existing instance does NOT
// automatically gain the new model properties. This caused `db.customer` to be undefined
// after adding the Customer model, resulting in 500 errors. We detect this and recreate.
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined }

function createClient() {
  return new PrismaClient({ log: ['query'] })
}

let prismaInstance = globalForPrisma.prisma ?? createClient()

// Guard: if the new Customer model (or any future model) is missing, recreate the client.
if (!(prismaInstance as any).customer) {
  prismaInstance = createClient()
  if (process.env.NODE_ENV !== 'production') {
    console.warn('[prisma] Recreated PrismaClient due to missing new model properties')
  }
}

export const db = prismaInstance
export const prisma = db

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prismaInstance
