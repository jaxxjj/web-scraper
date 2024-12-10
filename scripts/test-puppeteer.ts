import puppeteer from 'puppeteer'

export default async function testPuppeteer() {
  try {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox'],
      headless: false,
    })

    const page = await browser.newPage()
    await page.goto('https://example.com')
    console.log('puppeteer working!')

    await browser.close()
  } catch (error) {
    console.error('puppeteer error:', error)
  }
}
