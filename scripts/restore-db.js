#!/usr/bin/env node
/**
 * Restore DB from a JSON backup directory previously created by backup-db.js
 * Usage:
 *   node scripts/restore-db.js <backupDir>
 * If <backupDir> omitted, uses the most recent directory under ./backups
 * NOTE: Does not delete existing data; it inserts missing rows (skipDuplicates=true).
 */
const { readdirSync, readFileSync, statSync } = require('fs')
const { join, resolve } = require('path')
const { PrismaClient } = require('@prisma/client')
const { MODEL_ORDER } = require('./backup-utils')

const prisma = new PrismaClient()

function findLatestBackupDir(base) {
  const dirs = readdirSync(base)
    .map(d => ({ d, path: join(base, d) }))
    .filter(o => {
      try { return statSync(o.path).isDirectory() } catch { return false }
    })
    .sort((a, b) => b.d.localeCompare(a.d))
  return dirs[0]?.path
}

async function main() {
  const base = resolve(process.cwd(), 'backups')
  let target = process.argv[2]
  if (!target) {
    target = findLatestBackupDir(base)
    if (!target) {
      console.error('No backup directory found under ./backups')
      process.exit(1)
    }
    console.log('ℹ️  Using latest backup:', target)
  } else {
    target = resolve(target)
  }

  for (const model of MODEL_ORDER) {
    const file = join(target, `${model}.json`)
    let records
    try {
      records = JSON.parse(readFileSync(file, 'utf8'))
    } catch {
      continue // file not present, skip
    }
    if (!Array.isArray(records) || records.length === 0) continue
    const accessor = model.charAt(0).toLowerCase() + model.slice(1)
    if (!prisma[accessor]) {
      console.warn(`⚠️  Skip ${model}: delegate missing`) ; continue
    }
    await prisma[accessor].createMany({ data: records, skipDuplicates: true })
    console.log(`✅ Restored ${model}: ${records.length} records (duplicates skipped)`)  
  }
  console.log('🎉 Restore complete.')
}

main().catch(e => { console.error(e); process.exit(1) }).finally(async () => { await prisma.$disconnect() })
