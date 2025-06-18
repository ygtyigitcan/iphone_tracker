import React, { useState, useEffect } from 'react';
import { getTrackingProducts } from '../utils/mockData';
import ProductItem from './ProductItem';
import { loadUserPreferences } from '../services/localStorage';

function Favorites({ darkMode, onOpenAlert, onOpenHistory, onOpenComparison }) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userPreferences, setUserPreferences] = useState(null);

  useEffect(() => {
    // Load user preferences from localStorage
    const preferences = loadUserPreferences();
    setUserPreferences(preferences);

    // Fetch all products
    setLoading(true);
    const fetchFavorites = () => {
      const allProducts = getTrackingProducts();
      // Filter products based on the favoriteProducts array in preferences
      const favoritedProducts = allProducts.filter(product => 
        preferences.favoriteProducts && 
        preferences.favoriteProducts.includes(product.id)
      );
      
      setFavorites(favoritedProducts);
      setLoading(false);
    };

    fetchFavorites();

    // Set up periodic refresh every 15 minutes (900,000 milliseconds)
    const refreshInterval = setInterval(fetchFavorites, 900000);
    
    return () => {
      clearInterval(refreshInterval);
    };
  }, []);

  // We'll use the handlers passed from props

  // Render loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
      </div>
    );
  }

  // Render no favorites state
  if (favorites.length === 0) {
    return (
      <div className={`text-center py-20 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        <h2 className="text-2xl font-semibold mb-2">Henüz favori ürününüz yok</h2>
        <p className="text-gray-500 mt-2">
          Ürünleri favorilerinize eklemek için ürün kartlarındaki "Favorile" butonuna tıklayabilirsiniz.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex items-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-pink-500" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Favori Ürünleriniz
          </h2>
          <span className={`ml-2 px-2 py-1 rounded-full text-xs ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`}>
            {favorites.length}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map(product => (
            <ProductItem
              key={product.id}
              product={product}
              onOpenAlert={onOpenAlert}
              onOpenHistory={onOpenHistory}
              onOpenComparison={onOpenComparison}
              targetPrice={userPreferences?.priceAlerts?.[product.id]}
              darkMode={darkMode}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Favorites;