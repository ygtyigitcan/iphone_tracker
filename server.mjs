// Gerekli modülleri dahil ediyoruz
import express from 'express';
import fs from 'fs';
import cors from 'cors';  // CORS modülünü dahil ediyoruz

// Express uygulamasını başlatıyoruz
const app = express();
const port = 5000;

// CORS hatalarını önlemek için CORS'u aktif hale getiriyoruz
app.use(cors());  // CORS middleware'ini kullanıyoruz

// API endpointi oluşturuyoruz, frontend bu endpoint'e istek göndererek veriyi alacak
app.get('/api/prices', (req, res) => {
    try {
        // config.json veya güncellenmiş ürünler dosyasını okuyoruz
        const products = JSON.parse(fs.readFileSync('./converted_products_updated.json', 'utf-8'));
        
        // JSON formatında frontend'e döndürüyoruz
        res.json(products);
    } catch (error) {
        // Eğer hata oluşursa, hata mesajını döndürüyoruz
        res.status(500).json({ message: 'Veri alınamadı', error: error.message });
    }
});

// Sunucu başlatılıyor
app.listen(port, () => {
    console.log(`API sunucusu http://localhost:${port} adresinde çalışıyor`);
});
