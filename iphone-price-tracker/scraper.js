const puppeteer = require('puppeteer');

async function scrapeAkakcePrice(url) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'domcontentloaded' });

  // Akakçe'deki fiyat elemanının CSS selector'ünü kullanıyoruz
  const price = await page.evaluate(() => {
    const priceElement = document.querySelector('.product-price'); // Akakçe'nin fiyat selector'ü
    return priceElement ? priceElement.innerText : 'Fiyat bulunamadı';
  });

  await browser.close();
  return price;
}

module.exports = { scrapeAkakcePrice };
