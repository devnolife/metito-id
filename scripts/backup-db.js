#!/usr/bin/env node
/**
 * Simple JSON backup for all Prisma models.
 * Usage: node scripts/backup-db.js (or pnpm backup)
 * Creates: backups/<timestamp>/<Model>.json
 */
const { mkdirSync, writeFileSync, existsSync } = require('fs')
const { join } = require('path')
const { PrismaClient } = require('@prisma/client')
const { MODEL_ORDER } = require('./backup-utils')

const prisma = new PrismaClient()

async function main() {
  const ts = new Date().toISOString().replace(/[:.]/g, '-')
  const dir = join(process.cwd(), 'backups', ts)
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
  console.log(`📁 Backup directory: ${dir}`)

  for (const model of MODEL_ORDER) {
    const accessor = model.charAt(0).toLowerCase() + model.slice(1)
    try {
      if (!prisma[accessor]) {
        console.warn(`⚠️  Skip ${model}: delegate not found on Prisma client`)
        continue
      }
      const data = await prisma[accessor].findMany()
      writeFileSync(join(dir, `${model}.json`), JSON.stringify(data, null, 2))
      console.log(`✅ ${model}: ${data.length} records`)
    } catch (e) {
      console.error(`❌ Failed ${model}:`, e.message)
    }
  }
  console.log('🎉 Backup complete.')
}

main().catch(e => {
  console.error(e)
  process.exit(1)
}).finally(async () => {
  await prisma.$disconnect()
})
