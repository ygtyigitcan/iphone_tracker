import React, { useState, useEffect } from 'react';

const PriceList = () => {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('http://185.149.103.159:5000/api/prices')  // API URL'si
            .then((response) => response.json())
            .then((data) => setProducts(data))  // Veriyi set ediyoruz
            .catch((error) => setError(error.message));  // Hata olursa ekrana yazdırıyoruz
    }, []);

    // Hata varsa ekranda gösterelim
    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h1>Fiyat Listesi</h1>
            <ul>
                {products.map((product) => (
                    <li key={product.name}>
                        <strong>{product.name}</strong>: {product.currentPrice} TL
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PriceList;
