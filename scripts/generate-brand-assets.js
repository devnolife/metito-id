/**
 * Generates the official PT. METITO brand assets from the source letterhead
 * artwork in "DOKUMEN METITO/Kop Metito 2.png".
 *
 * The source is a flattened letterhead (kingfisher mark + METITO wordmark) on an
 * opaque near-white background. This script isolates the artwork, knocks the
 * background out to transparency, and emits every derivative the site needs:
 * app icons, favicon, OpenGraph image and the public logo files.
 *
 * Usage: npm run brand:assets
 */

const fs = require('fs')
const path = require('path')
const sharp = require('sharp')

const ROOT = path.join(__dirname, '..')
const SRC_KOP = path.join(ROOT, 'DOKUMEN METITO', 'Kop Metito 2.png')
const SRC_FOOTER = path.join(ROOT, 'DOKUMEN METITO', 'Footer Surat 1.jpeg')

const BRAND_DIR = path.join(ROOT, 'public', 'images', 'brand')
const IMAGES_DIR = path.join(ROOT, 'public', 'images')
const PUBLIC_DIR = path.join(ROOT, 'public')
const APP_DIR = path.join(ROOT, 'app')

/** Site background navy, kept in sync with `--navy` in app/globals.css. */
const NAVY = { r: 9, g: 22, b: 40 }
/** Site accent gold, kept in sync with `--gold` in app/globals.css. */
const GOLD = '#e1c378'

const TRANSPARENT = { r: 0, g: 0, b: 0, alpha: 0 }

/** A pixel counts as background when it is transparent or near-white. */
function isBackground(r, g, b, a) {
  if (a < 40) return true
  return r > 232 && g > 232 && b > 232
}

function raw(input) {
  return sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
}

/**
 * Separable 3-tap [1 2 1] blur over the coverage mask, to anti-alias the hard
 * edge left by the flood fill. Done here rather than via sharp because sharp
 * promotes single-channel raw input to 3-channel sRGB on output.
 */
function smoothMask(mask, W, H) {
  const tmp = new Uint8Array(W * H)
  const out = new Uint8Array(W * H)

  for (let y = 0; y < H; y++) {
    const row = y * W
    for (let x = 0; x < W; x++) {
      const l = mask[row + (x > 0 ? x - 1 : 0)]
      const c = mask[row + x]
      const r = mask[row + (x < W - 1 ? x + 1 : W - 1)]
      tmp[row + x] = (l + 2 * c + r) >> 2
    }
  }

  for (let y = 0; y < H; y++) {
    const up = (y > 0 ? y - 1 : 0) * W
    const dn = (y < H - 1 ? y + 1 : H - 1) * W
    const row = y * W
    for (let x = 0; x < W; x++) {
      out[row + x] = (tmp[up + x] + 2 * tmp[row + x] + tmp[dn + x]) >> 2
    }
  }

  return out
}

/**
 * Knocks out the flat backdrop while preserving white *inside* the artwork
 * (the bird's eye highlight, the counters in the letterforms). Only background
 * pixels reachable from the image border are removed, so enclosed whites stay.
 */
async function removeBackdrop(input) {
  const { data, info } = await raw(input)
  const { width: W, height: H, channels: C } = info

  const keep = new Uint8Array(W * H).fill(255)
  const seen = new Uint8Array(W * H)
  const queue = new Int32Array(W * H)
  let head = 0
  let tail = 0

  const push = (idx) => {
    if (seen[idx]) return
    const i = idx * C
    if (!isBackground(data[i], data[i + 1], data[i + 2], data[i + 3])) return
    seen[idx] = 1
    keep[idx] = 0
    queue[tail++] = idx
  }

  for (let x = 0; x < W; x++) {
    push(x)
    push((H - 1) * W + x)
  }
  for (let y = 0; y < H; y++) {
    push(y * W)
    push(y * W + W - 1)
  }

  while (head < tail) {
    const idx = queue[head++]
    const x = idx % W
    const y = (idx / W) | 0
    if (x > 0) push(idx - 1)
    if (x < W - 1) push(idx + 1)
    if (y > 0) push(idx - W)
    if (y < H - 1) push(idx + W)
  }

  const mask = smoothMask(keep, W, H)

  const out = Buffer.alloc(W * H * 4)
  for (let idx = 0; idx < W * H; idx++) {
    const i = idx * C
    const o = idx * 4
    out[o] = data[i]
    out[o + 1] = data[i + 1]
    out[o + 2] = data[i + 2]
    out[o + 3] = Math.min(data[i + 3], mask[idx])
  }

  return { data: out, width: W, height: H }
}

const toPng = ({ data, width, height }) =>
  sharp(data, { raw: { width, height, channels: 4 } }).png()

/**
 * Bounding box of visible content. Computed directly from the alpha channel —
 * libvips' `trim()` flattens alpha before searching and returns a wrong box for
 * this artwork, so the geometry is derived here instead.
 */
function contentBBox({ data, width, height }, region) {
  const x0 = region ? region.left : 0
  const x1 = region ? region.left + region.width : width
  let minX = x1
  let minY = height
  let maxX = x0 - 1
  let maxY = -1

  for (let y = 0; y < height; y++) {
    for (let x = x0; x < x1; x++) {
      if (data[(y * width + x) * 4 + 3] <= 8) continue
      if (x < minX) minX = x
      if (x > maxX) maxX = x
      if (y < minY) minY = y
      if (y > maxY) maxY = y
    }
  }

  if (maxY < 0) throw new Error('contentBBox: region is empty')
  return { left: minX, top: minY, width: maxX - minX + 1, height: maxY - minY + 1 }
}

/** Widest run of fully empty columns — the gutter between mark and wordmark. */
function findGutter(image, searchUntil) {
  const { data, width, height } = image
  let best = null
  let start = -1

  for (let x = 0; x <= searchUntil; x++) {
    let empty = true
    for (let y = 0; y < height; y++) {
      if (data[(y * width + x) * 4 + 3] > 8) {
        empty = false
        break
      }
    }
    if (empty) {
      if (start < 0) start = x
    } else if (start >= 0) {
      const run = { start, end: x - 1, len: x - start }
      if (start > 0 && (!best || run.len > best.len)) best = run
      start = -1
    }
  }

  if (!best) throw new Error('findGutter: no gutter found')
  return Math.round((best.start + best.end) / 2)
}

/** Centres artwork inside a transparent square canvas. */
async function toSquare(artBuffer, size, paddingRatio = 0.04) {
  const inner = Math.max(1, Math.round(size * (1 - paddingRatio * 2)))
  const art = await sharp(artBuffer)
    .resize(inner, inner, { fit: 'contain', background: TRANSPARENT })
    .png()
    .toBuffer()

  return sharp({
    create: { width: size, height: size, channels: 4, background: TRANSPARENT },
  })
    .composite([{ input: art, gravity: 'center' }])
    .png()
}

/** Minimal ICO container embedding PNG frames (supported by every browser). */
function buildIco(frames) {
  const header = Buffer.alloc(6)
  header.writeUInt16LE(0, 0) // reserved
  header.writeUInt16LE(1, 2) // type: icon
  header.writeUInt16LE(frames.length, 4)

  const entries = []
  let offset = 6 + frames.length * 16

  for (const { size, buffer } of frames) {
    const entry = Buffer.alloc(16)
    entry.writeUInt8(size >= 256 ? 0 : size, 0)
    entry.writeUInt8(size >= 256 ? 0 : size, 1)
    entry.writeUInt8(0, 2) // palette size
    entry.writeUInt8(0, 3) // reserved
    entry.writeUInt16LE(1, 4) // colour planes
    entry.writeUInt16LE(32, 6) // bits per pixel
    entry.writeUInt32LE(buffer.length, 8)
    entry.writeUInt32LE(offset, 12)
    entries.push(entry)
    offset += buffer.length
  }

  return Buffer.concat([header, ...entries, ...frames.map((f) => f.buffer)])
}

async function main() {
  for (const dir of [BRAND_DIR, IMAGES_DIR, PUBLIC_DIR, APP_DIR]) {
    fs.mkdirSync(dir, { recursive: true })
  }

  const written = []
  const emit = async (pipeline, file) => {
    await pipeline.toFile(file)
    written.push(path.relative(ROOT, file))
  }

  const image = await removeBackdrop(SRC_KOP)
  const png = await toPng(image).toBuffer()

  // The letterhead is a two-part lockup: the kingfisher mark sits left of a
  // vertical gutter of empty columns, the wordmark to its right.
  const gutter = findGutter(image, Math.round(image.width / 3))
  const markBox = contentBBox(image, { left: 0, width: gutter })
  const wordBox = contentBBox(image, { left: gutter, width: image.width - gutter })
  const lockupBox = contentBBox(image)

  console.log(`source      ${image.width}x${image.height}`)
  console.log(`gutter at   x=${gutter}`)
  console.log(`mark box    ${JSON.stringify(markBox)}`)
  console.log(`wordmark    ${JSON.stringify(wordBox)}`)
  console.log(`lockup      ${JSON.stringify(lockupBox)}`)

  const markArt = await sharp(png).extract(markBox).png().toBuffer()
  const wordArt = await sharp(png).extract(wordBox).png().toBuffer()
  const lockupArt = await sharp(png).extract(lockupBox).png().toBuffer()

  // --- Horizontal lockup + wordmark -----------------------------------------
  await emit(
    sharp(lockupArt).resize({ width: 1600, withoutEnlargement: true }).png(),
    path.join(BRAND_DIR, 'logo-lockup.png')
  )
  await emit(
    sharp(wordArt).resize({ width: 1200, withoutEnlargement: true }).png(),
    path.join(BRAND_DIR, 'logo-wordmark.png')
  )

  // --- Square mark ----------------------------------------------------------
  for (const size of [512, 192, 96]) {
    await emit(await toSquare(markArt, size), path.join(BRAND_DIR, `logo-mark-${size}.png`))
  }

  const mark512 = await (await toSquare(markArt, 512)).toBuffer()
  await emit(sharp(mark512).png(), path.join(BRAND_DIR, 'logo-mark.png'))

  // Every existing component references /images/logo.png in a square slot.
  await emit(sharp(mark512).png(), path.join(IMAGES_DIR, 'logo.png'))

  // --- Favicons & app icons -------------------------------------------------
  // Favicons render as small as 16px, so they use a tighter crop than the
  // layout logo to keep the kingfisher readable.
  const iconArt = await (await toSquare(markArt, 512, 0.01)).toBuffer()
  await emit(sharp(iconArt).png(), path.join(APP_DIR, 'icon.png'))

  // iOS renders transparency as black, so the touch icon gets a white plate.
  const appleArt = await (await toSquare(markArt, 180, 0.1)).toBuffer()
  await emit(
    sharp({
      create: { width: 180, height: 180, channels: 4, background: { r: 255, g: 255, b: 255, alpha: 1 } },
    })
      .composite([{ input: appleArt, gravity: 'center' }])
      .png(),
    path.join(APP_DIR, 'apple-icon.png')
  )

  const frames = []
  for (const size of [16, 32, 48]) {
    frames.push({
      size,
      buffer: await sharp(iconArt).resize(size, size, { kernel: 'lanczos3' }).png().toBuffer(),
    })
  }
  // `app/favicon.ico` is a Next.js file convention: it is served at /favicon.ico
  // and the <link rel="icon"> tag is injected automatically.
  const icoPath = path.join(APP_DIR, 'favicon.ico')
  fs.writeFileSync(icoPath, buildIco(frames))
  written.push(path.relative(ROOT, icoPath))

  // Remove the pre-convention copy so there is a single source of truth.
  const staleIco = path.join(PUBLIC_DIR, 'favicon.ico')
  if (fs.existsSync(staleIco)) fs.unlinkSync(staleIco)

  // --- OpenGraph / social card ---------------------------------------------
  const plate = await sharp({
    create: { width: 1040, height: 300, channels: 4, background: { r: 255, g: 255, b: 255, alpha: 1 } },
  })
    .composite([
      {
        input: await sharp(lockupArt)
          .resize({ width: 940, height: 220, fit: 'inside', withoutEnlargement: false })
          .png()
          .toBuffer(),
        gravity: 'center',
      },
    ])
    .png()
    .toBuffer()

  const caption = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="130">
       <text x="600" y="48" text-anchor="middle" font-family="Segoe UI, Arial, Helvetica, sans-serif"
             font-size="36" font-weight="700" fill="#ffffff">PT. Multi Enviro Tirta Teknologi</text>
       <text x="600" y="98" text-anchor="middle" font-family="Segoe UI, Arial, Helvetica, sans-serif"
             font-size="26" fill="${GOLD}">Integrated Solutions for Water, Industry and Mining</text>
     </svg>`
  )

  await emit(
    sharp({
      create: { width: 1200, height: 630, channels: 4, background: { ...NAVY, alpha: 1 } },
    })
      .composite([
        { input: plate, top: 110, left: 80 },
        { input: caption, top: 452, left: 0 },
      ])
      .png(),
    path.join(APP_DIR, 'opengraph-image.png')
  )

  // --- Letterhead contact strip --------------------------------------------
  if (fs.existsSync(SRC_FOOTER)) {
    const footer = await removeBackdrop(SRC_FOOTER)
    const footerPng = await toPng(footer).toBuffer()
    await emit(
      sharp(footerPng).extract(contentBBox(footer)).png(),
      path.join(BRAND_DIR, 'letterhead-footer.png')
    )
  }

  console.log('\nBrand assets generated:')
  for (const file of written) {
    const { size } = fs.statSync(path.join(ROOT, file))
    console.log(`  ${file.replace(/\\/g, '/')}  (${(size / 1024).toFixed(1)} KB)`)
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
