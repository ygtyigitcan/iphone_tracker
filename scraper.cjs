const fs = require('fs');
const cheerio = require('cheerio');

// config.json dosyasını yükle
const products = JSON.parse(fs.readFileSync('./config.json', 'utf-8')).products;

// Fiyat güncellenme fonksiyonu
const updatePrices = async () => {
    const updatedProducts = [];
  
    for (const product of products) {
        try {
            // Dinamik olarak fetch fonksiyonunu yükle
            const { default: fetch } = await import('node-fetch');

            const response = await fetch(product.url, {
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
                },
            });
    
            const html = await response.text();
            const $ = cheerio.load(html);
            const priceText = $(product.price_selector).first().text().replace(/\./g, '').replace(',', '.').match(/[\d\.]+/g);
    
            if (priceText && priceText.length > 0) {
                const newPrice = parseFloat(priceText[0]);
                updatedProducts.push({
                    ...product,
                    previousPrice: product.currentPrice,
                    currentPrice: newPrice,
                    lastUpdated: new Date().toISOString(),
                });
                console.log(`✅ ${product.name} => ${newPrice} TL`);
            } else {
                console.log(`⚠️  ${product.name} için fiyat bulunamadı.`);
                updatedProducts.push(product);
            }
        } catch (error) {
            console.log(`❌ ${product.name} alınamadı:`, error.message);
            updatedProducts.push(product);
        }
    }

    try {
        // Güncellenmiş ürünleri dosyaya kaydediyoruz
        fs.writeFileSync(
            './converted_products_updated.json', // Dosya yolunu dikkatlice kontrol edin
            JSON.stringify(updatedProducts, null, 2), // İçeriği düzgün biçimde kaydediyoruz
            'utf-8'
        );
        console.log('📦 Güncellenmiş ürünler converted_products_updated.json dosyasına kaydedildi.');
    } catch (error) {
        console.log('Dosya yazma hatası:', error.message);
    }
};

updatePrices();
