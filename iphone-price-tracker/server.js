const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const app = express();

// Frontend dosyalarına statik erişim
app.use(express.static('public'));

// Akakçe'den fiyat çekme fonksiyonu
async function fetchPrices() {
    try {
        // Akakçe linkini buraya koyabilirsiniz
        const url = 'https://www.akakce.com/iphone-16-fiyatlari'; // Akakçe URL
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        
        // Akakçe'deki fiyatları çekin (fiyatların doğru selector'ını belirleyin)
        let prices = [];
        $('.price-selector-class').each((index, element) => { // Doğru selector'ı kullanın
            prices.push($(element).text().trim());
        });

        return prices;
    } catch (error) {
        console.error(error);
        return [];
    }
}

// HTML sayfasını render etme
app.get('/', async (req, res) => {
    const prices = await fetchPrices();
    
    // Fiyatlar HTML'de gösterilecek şekilde yerleştirilir
    res.send(`
        <html lang="tr">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>iPhone Fiyatları</title>
            </head>
            <body>
                <h1>iPhone Fiyatları</h1>
                <div id="fiyatlar">
                    ${prices.length > 0 ? prices.join('<br>') : 'Fiyatlar alınamadı.'}
                </div>
            </body>
        </html>
    `);
});

// Sunucuyu başlatma
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
