import { chromium, devices } from 'playwright'
import { setTimeout as sleep } from 'node:timers/promises'

const URL = process.env.SCREENSHOT_URL ?? 'http://localhost:5173'

const browser = await chromium.launch()
const context = await browser.newContext({
  ...devices['iPhone 14 Pro'],
  locale: 'he-IL',
})
const page = await context.newPage()

await page.goto(URL, { waitUntil: 'networkidle' })
await page.waitForSelector('text=עגבניה')

// Hide the vite-plugin-vue-devtools floating panel so it doesn't appear in screenshots
await page.addStyleTag({
  content: `
    #__vue-devtools-container__,
    #vue-inspector-container {
      display: none !important;
    }
  `,
})
await sleep(300)

// Items are rendered in the order defined in vegetables.ts:
// 0: עגבניה, 1: מלפפון, 2: גמבה (regular)
const plusButtons = page.getByRole('button', { name: 'הוסף כמות' })
const targets = [
  { index: 0, clicks: 4 }, // עגבניה -> 2.0
  { index: 1, clicks: 3 }, // מלפפון -> 1.5
  { index: 2, clicks: 1 }, // גמבה   -> 0.5
]

for (const { index, clicks } of targets) {
  const btn = plusButtons.nth(index)
  for (let i = 0; i < clicks; i++) {
    await btn.click()
    await sleep(40)
  }
}

// Scroll back to top so the first items are visible in the screenshot
await page.evaluate(() => {
  const main = document.querySelector('main')
  if (main) main.scrollTop = 0
})
await sleep(300)

await page.screenshot({ path: 'docs/screenshot-list.png' })
console.log('Saved docs/screenshot-list.png')

// Open the modal
await page.getByRole('button', { name: /שלח הזמנה/ }).click()
await page.waitForSelector('textarea')
await page.locator('textarea').fill('משלוח עד 10:00, עגבניות בשלות')
await sleep(400)

await page.screenshot({ path: 'docs/screenshot-modal.png' })
console.log('Saved docs/screenshot-modal.png')

await browser.close()
