import { chromium } from "playwright"
const OUT = "C:/Users/devno/.copilot/session-state/e5800128-7cf3-47e9-84d7-6b282f0de7fe/files"
const URL = "http://localhost:3000/"
const browser = await chromium.launch()
const d = await browser.newPage({ viewport: { width: 1440, height: 1024 }, deviceScaleFactor: 1 })
await d.goto(URL, { waitUntil: "networkidle", timeout: 90000 })
await d.waitForTimeout(2000)
await d.screenshot({ path: `${OUT}/premium-outfit-hero.png`, fullPage: false })
await d.screenshot({ path: `${OUT}/premium-outfit-full.png`, fullPage: true })
const m = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 })
await m.goto(URL, { waitUntil: "networkidle", timeout: 90000 })
await m.waitForTimeout(2000)
await m.screenshot({ path: `${OUT}/premium-outfit-mobile.png`, fullPage: true })
await browser.close()
console.log("premium outfit shots done")
