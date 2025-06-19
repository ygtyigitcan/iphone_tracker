import productData from "../data/config.json"; // ✅ Doğru
import { useState, useEffect } from 'react';
import ProductItem from './ProductItem';
import PriceAlert from './PriceAlert';
import PriceHistory from './PriceHistory';
import PriceComparison from './PriceComparison';
import { saveUserPreferences } from '../services/localStorage';

function Dashboard({ activeSite, activeModel, userPreferences, darkMode = false, onOpenNotificationSettings, onOpenAlert, onOpenHistory, onOpenComparison }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [comparisonOpen, setComparisonOpen] = useState(false);
  const [sortByDiscountRate, setSortByDiscountRate] = useState(true);
  
  useEffect(() => {
    // Function to fetch and filter products
    const fetchProducts = () => {
      setLoading(true);
      setTimeout(() => {
        let filteredProducts = productData; // ✅ ürünlere ulaş
        
        if (activeSite !== 'all') {
          filteredProducts = filteredProducts.filter(product => 
            product.retailer.toLowerCase() === activeSite.toLowerCase()
          );
        }
        
        if (activeModel !== 'all') {
          // Convert format from iphone16 to iPhone 16 for matching
          let formattedModel = '';
          
          if (activeModel === 'iphone16e') {
            formattedModel = 'iPhone 16e';
          } else {
            formattedModel = activeModel
              .replace('iphone', 'iPhone ')
              .replace('plus', ' Plus')
              .replace('pro', ' Pro')
              .replace('max', ' Max');
          }
          
          console.log('Model selected:', activeModel, 'Formatted to:', formattedModel);
          
          filteredProducts = filteredProducts.filter(product => 
            product.model === formattedModel
          );
        }
        
        // Sort by discount rate (from most reduced to least reduced) if enabled
        if (sortByDiscountRate) {
          filteredProducts.sort((a, b) => {
            const discountRateA = a.previousPrice > a.currentPrice ? 
              (a.previousPrice - a.currentPrice) / a.previousPrice : 0;
            const discountRateB = b.previousPrice > b.currentPrice ? 
              (b.previousPrice - b.currentPrice) / b.previousPrice : 0;
            return discountRateB - discountRateA; // Sort from highest to lowest discount
          });
        }
        
        setProducts(filteredProducts);
        setLoading(false);
      }, 500); // Simulate loading delay
    };
    
    // Initial fetch
    fetchProducts();
    
    // Set up refresh interval - 15 minutes (900000 milliseconds)
    const refreshInterval = setInterval(fetchProducts, 900000);
    
    // Clean up interval on unmount
    return () => clearInterval(refreshInterval);
  }, [activeSite, activeModel, sortByDiscountRate]);
  
  const handleOpenAlert = (product) => {
    setSelectedProduct(product);
    setAlertOpen(true);
  };
  
  const handleOpenHistory = (product) => {
    setSelectedProduct(product);
    setHistoryOpen(true);
  };

  const handleOpenComparison = (product) => {
    setSelectedProduct(product);
    setComparisonOpen(true);
  };
  
  const handleSetPriceAlert = (productId, targetPrice) => {
    // Update the target price in the UI
    setProducts(products.map(p => 
      p.id === productId 
        ? { ...p, targetPrice } 
        : p
    ));
    
    // Save to localStorage through our service
    const updatedPreferences = {
      ...userPreferences,
      priceAlerts: {
        ...(userPreferences?.priceAlerts || {}),
        [productId]: targetPrice
      }
    };
    
    saveUserPreferences(updatedPreferences);
    setAlertOpen(false);
  };

  // Render loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
      </div>
    );
  }

  // Render no results state
  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-semibold text-gray-700">No products found</h2>
        <p className="text-gray-500 mt-2">Try changing your filters or adding more products to track</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="mb-4 flex items-center justify-between bg-gray-100 p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
          </svg>
          <span className="font-medium text-gray-700 text-lg">Sıralama:</span>
        </div>
        
        <div className="flex">
          <button
            onClick={() => setSortByDiscountRate(true)}
            className={`px-4 py-2 text-sm font-medium rounded-l-md transition-colors border-r border-white ${sortByDiscountRate ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 11l5-5m0 0l5 5m-5-5v12" />
              </svg>
              En Yüksek İndirimli Ürünler
            </div>
          </button>
          <button
            onClick={() => setSortByDiscountRate(false)}
            className={`px-4 py-2 text-sm font-medium rounded-r-md transition-colors ${!sortByDiscountRate ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
              </svg>
              Varsayılan Sıralama
            </div>
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <ProductItem 
            key={product.id}
            product={product}
            onOpenAlert={onOpenAlert || handleOpenAlert}
            onOpenHistory={onOpenHistory || handleOpenHistory}
            onOpenComparison={onOpenComparison || handleOpenComparison}
            targetPrice={userPreferences?.priceAlerts?.[product.id]}
            darkMode={darkMode}
          />
        ))}
      </div>
      
      {/* Price Alert Modal */}
      {alertOpen && selectedProduct && (
        <PriceAlert 
          product={selectedProduct}
          isOpen={alertOpen}
          onClose={() => setAlertOpen(false)}
          onSetAlert={handleSetPriceAlert}
          currentTargetPrice={userPreferences?.priceAlerts?.[selectedProduct.id]}
          darkMode={darkMode}
        />
      )}
      
      {/* Price History Modal */}
      {historyOpen && selectedProduct && (
        <PriceHistory
          product={selectedProduct}
          isOpen={historyOpen}
          onClose={() => setHistoryOpen(false)}
          darkMode={darkMode}
        />
      )}
      
      {/* Price Comparison Modal */}
      {comparisonOpen && selectedProduct && (
        <PriceComparison
          product={selectedProduct}
          isOpen={comparisonOpen}
          onClose={() => setComparisonOpen(false)}
        />
      )}
    </div>
  );
}

export default Dashboard;