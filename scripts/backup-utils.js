// Shared utilities for DB backup/restore
const { PrismaClient } = require('@prisma/client')

// Order chosen so parent / referenced data appears before dependents
// Adjust if you add new relations.
const MODEL_ORDER = [
  'User',
  'Category',
  'Product',
  'Image',
  'BlogTag',
  'BlogPost',
  'Service',
  'GalleryItem',
  'Certification',
  'Testimonial',
  'Inquiry',
  'CartItem',
  'Setting',
  'Customer',
  'Newsletter'
]

function getAccessor(model) {
  return model.charAt(0).toLowerCase() + model.slice(1)
}

async function exportAll(prisma) {
  const result = {}
  for (const model of MODEL_ORDER) {
    const accessor = getAccessor(model)
    if (!prisma[accessor]) continue
    result[model] = await prisma[accessor].findMany()
  }
  return result
}

async function importAll(prisma, data, { skipExisting = true } = {}) {
  for (const model of MODEL_ORDER) {
    if (!data[model]) continue
    const accessor = getAccessor(model)
    if (!prisma[accessor]) continue
    const records = data[model]
    if (!Array.isArray(records) || records.length === 0) continue
    // Use createMany for speed; assumes IDs provided.
    await prisma[accessor].createMany({ data: records, skipDuplicates: !!skipExisting })
  }
}

module.exports = {
  MODEL_ORDER,
  exportAll,
  importAll,
  getAccessor,
  PrismaClient
}
