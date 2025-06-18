import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

function PriceComparison({ isOpen, onClose, product = null }) {
  const { darkMode } = useTheme();
  const [retailers, setRetailers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Format price with currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  // Calculate days ago from date string
  const getDaysAgo = (dateString) => {
    const days = Math.floor((new Date() - new Date(dateString)) / (1000 * 60 * 60 * 24));
    return days === 0 ? 'Bugün' : days === 1 ? 'Dün' : `${days} gün önce`;
  };

  useEffect(() => {
    if (isOpen && product) {
      // In a real app, we would fetch comparison data from API
      // Here we'll simulate this with mock data based on the current product
      setIsLoading(true);
      
      // Simulate API delay
      const timer = setTimeout(() => {
        // Generate mock retailers for this product model
        const mockRetailers = [
          {
            name: product.retailer, // Current retailer
            price: product.currentPrice,
            lastUpdated: product.lastUpdated,
            inStock: product.inStock,
            shipping: 'Free',
            url: product.url,
            isBestPrice: false, // Will determine later
            priceHistory: [...product.priceHistory] // Copy of price history
          },
          {
            name: 'Trendyol',
            price: Math.round(product.currentPrice * (Math.random() * 0.2 + 0.9)), // +/- 10% of original price
            lastUpdated: new Date(Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Random date within 3 days
            inStock: Math.random() > 0.2,
            shipping: Math.random() > 0.7 ? 'Free' : '₺49.90',
            url: '#',
            isBestPrice: false,
            priceHistory: product.priceHistory.map(item => ({
              ...item,
              price: Math.round(item.price * (Math.random() * 0.15 + 0.95)) // +/- 10% of original price history
            }))
          },
          {
            name: 'Hepsiburada',
            price: Math.round(product.currentPrice * (Math.random() * 0.2 + 0.9)),
            lastUpdated: new Date(Date.now() - Math.random() * 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            inStock: Math.random() > 0.1,
            shipping: Math.random() > 0.6 ? 'Free' : '₺39.90',
            url: '#',
            isBestPrice: false,
            priceHistory: product.priceHistory.map(item => ({
              ...item,
              price: Math.round(item.price * (Math.random() * 0.15 + 0.9))
            }))
          },
          {
            name: 'Amazon',
            price: Math.round(product.currentPrice * (Math.random() * 0.25 + 0.9)),
            lastUpdated: new Date(Date.now() - Math.random() * 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            inStock: Math.random() > 0.05,
            shipping: Math.random() > 0.8 ? 'Free' : '₺29.90',
            url: '#',
            isBestPrice: false,
            priceHistory: product.priceHistory.map(item => ({
              ...item,
              price: Math.round(item.price * (Math.random() * 0.2 + 0.9))
            }))
          },
        ];
        
        // Remove duplicate retailer if it matches the product's retailer
        const uniqueRetailers = mockRetailers.filter(
          (retailer, index, self) => 
            index === self.findIndex(r => r.name === retailer.name)
        );
        
        // Add more random retailers
        const otherRetailers = ['MediaMarkt', 'Vatan', 'n11', 'Teknosa']
          .filter(name => !uniqueRetailers.some(r => r.name === name))
          .slice(0, 3)
          .map(name => ({
            name,
            price: Math.round(product.currentPrice * (Math.random() * 0.3 + 0.85)),
            lastUpdated: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            inStock: Math.random() > 0.15,
            shipping: Math.random() > 0.7 ? 'Free' : '₺' + (Math.round(Math.random() * 4) * 10 + 19) + '.90',
            url: '#',
            isBestPrice: false,
            priceHistory: product.priceHistory.map(item => ({
              ...item,
              price: Math.round(item.price * (Math.random() * 0.2 + 0.85))
            }))
          }));
        
        const finalRetailers = [...uniqueRetailers, ...otherRetailers];
        
        // Determine the best price
        const bestPrice = Math.min(...finalRetailers.map(retailer => 
          retailer.inStock ? retailer.price + (retailer.shipping === 'Free' ? 0 : 40) : Infinity
        ));
        
        const sortedRetailers = finalRetailers.map(retailer => ({
          ...retailer,
          isBestPrice: retailer.inStock && 
            (retailer.price + (retailer.shipping === 'Free' ? 0 : 40)) === bestPrice
        })).sort((a, b) => {
          // Sort by price (in-stock first)
          if (a.inStock && !b.inStock) return -1;
          if (!a.inStock && b.inStock) return 1;
          return a.price - b.price;
        });
        
        setRetailers(sortedRetailers);
        setIsLoading(false);
      }, 800);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, product]);

  if (!isOpen) return null;
  
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4"
      onClick={onClose}
    >
      <div 
        className={`w-full max-w-4xl rounded-lg shadow-xl overflow-hidden ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}
        onClick={e => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        <div className={`px-6 py-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex justify-between items-center">
            <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Fiyat Karşılaştırma: {product ? product.name : 'Yükleniyor...'}
            </h2>
            <button 
              onClick={onClose}
              className={`p-1 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className={`px-6 py-4 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
          {isLoading ? (
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              <span className="ml-3 text-lg">Karşılaştırma verileri yükleniyor...</span>
            </div>
          ) : (
            <>
              {/* Price Bar Chart */}
              <div className={`mb-6 p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
                <h3 className={`text-lg font-medium mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Fiyat Karşılaştırması
                </h3>
                
                <div className="relative pt-8 pb-2">
                  {/* Price Scale */}
                  <div className={`absolute top-0 left-0 right-0 flex justify-between text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {[0, 1, 2, 3, 4].map(i => {
                      const minPrice = Math.min(...retailers.map(r => r.price));
                      const maxPrice = Math.max(...retailers.map(r => r.price)) * 1.1;
                      const range = maxPrice - minPrice;
                      const price = minPrice + (range / 4) * i;
                      return (
                        <div key={i} className="text-center" style={{width: '20%'}}>
                          {formatPrice(price)}
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Bars */}
                  <div className="h-52 mt-4 space-y-4">
                    {retailers.map((retailer, index) => {
                      const minPrice = Math.min(...retailers.map(r => r.price));
                      const maxPrice = Math.max(...retailers.map(r => r.price)) * 1.1;
                      const range = maxPrice - minPrice;
                      const width = ((retailer.price - minPrice) / range) * 100;
                      
                      return (
                        <div key={index} className="flex items-center h-9">
                          <div className="w-24 text-sm font-medium truncate mr-2">
                            {retailer.name}
                          </div>
                          <div className="relative flex-1 h-full">
                            <div 
                              className={`absolute top-0 left-0 h-full rounded ${
                                !retailer.inStock ? 'bg-gray-300' : 
                                  retailer.isBestPrice ? 'bg-green-500' : 'bg-blue-500'
                              }`}
                              style={{ width: `${width}%` }}
                            ></div>
                            <div 
                              className={`absolute top-0 left-0 h-full flex items-center px-2 ${
                                width > 15 ? 'text-white' : darkMode ? 'text-gray-200' : 'text-gray-800'
                              }`}
                              style={{ left: `${Math.min(width, 90)}%` }}
                            >
                              <span className="text-sm font-medium whitespace-nowrap">
                                {formatPrice(retailer.price)} 
                                {!retailer.inStock && " (Stokta Yok)"}
                                {retailer.isBestPrice && " ★ En İyi Fiyat"}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              
              {/* Detailed Comparison Table */}
              <div className={`overflow-hidden rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-white'} shadow`}>
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className={darkMode ? 'bg-gray-800' : 'bg-gray-50'}>
                    <tr>
                      <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                        Satıcı
                      </th>
                      <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                        Fiyat
                      </th>
                      <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                        Kargo
                      </th>
                      <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                        Son Güncelleme
                      </th>
                      <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                        Stok
                      </th>
                      <th scope="col" className={`px-6 py-3 text-right text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                        İşlem
                      </th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${darkMode ? 'divide-gray-600' : 'divide-gray-200'}`}>
                    {retailers.map((retailer, index) => (
                      <tr 
                        key={index} 
                        className={
                          retailer.isBestPrice 
                            ? darkMode ? 'bg-green-900 bg-opacity-20' : 'bg-green-50'
                            : index % 2 
                              ? darkMode ? 'bg-gray-800' : 'bg-gray-50' 
                              : darkMode ? 'bg-gray-700' : 'bg-white'
                        }
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                              {retailer.name}
                              {retailer.isBestPrice && (
                                <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                  En İyi Fiyat
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                            {formatPrice(retailer.price)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                            {retailer.shipping}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                            {getDaysAgo(retailer.lastUpdated)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {retailer.inStock ? (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              Stokta
                            </span>
                          ) : (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                              Stokta Yok
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <a 
                            href={retailer.url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Siteyi Ziyaret Et
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
        
        <div className={`px-6 py-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex justify-between">
            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Fiyatlar değişiklik gösterebilir. Son güncelleme: {new Date().toLocaleDateString()}
            </span>
            <button 
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Kapat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PriceComparison;