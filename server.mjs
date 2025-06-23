import express from 'express';
import fs from 'fs';
import cors from 'cors';

const app = express();
const port = 5000;

// CORS hatalarını önlemek için
app.use(cors());

// API endpointi oluşturun, frontend bu endpoint'e istek göndererek veriyi alacak
app.get('/api/prices', (req, res) => {
    try {
        const products = JSON.parse(fs.readFileSync('./converted_products_updated.json', 'utf-8'));
        res.json(products); // JSON formatında frontend'e döner
    } catch (error) {
        res.status(500).json({ message: 'Veri alınamadı', error: error.message });
    }
});

// Sunucu başlatma
app.listen(port, '0.0.0.0', () => {  // Burada sunucu IP adresi belirledik
    console.log(`API sunucusu http://0.0.0.0:${port} adresinde çalışıyor`);
});
