import React, { useEffect, useState } from 'react';

const PriceList = () => {
  const [products, setProducts] = useState([]); // Ürünler state'i

  // Fiyatları çekmek için API'yi çağırma
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await fetch('http://185.149.103.159:5000/api/prices');
        const data = await response.json();
        setProducts(data); // Gelen veriyi state'e kaydediyoruz
      } catch (error) {
        console.error('Fiyatlar alınamadı:', error);
      }
    };

    fetchPrices();
  }, []); // Bu effect yalnızca component mount olduğunda çalışacak

  return (
    <div>
      <h1>Ürün Fiyatları</h1>
      <ul>
        {products.map((product, index) => (
          <li key={index}>
            {product.name} - {product.currentPrice} TL
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PriceList;
