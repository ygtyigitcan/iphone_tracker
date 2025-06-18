import { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import Navbar from './components/Navbar';
import NotificationSettings from './components/NotificationSettings';
import Favorites from './components/Favorites';
import PriceAlert from './components/PriceAlert';
import PriceHistory from './components/PriceHistory';
import PriceComparison from './components/PriceComparison';
import { loadUserPreferences, saveUserPreferences } from './services/localStorage';
import { ThemeProvider, useTheme } from './context/ThemeContext';

const AppContent = () => {
  const [activeSite, setActiveSite] = useState('all');
  const [activeModel, setActiveModel] = useState('all');
  const [userPreferences, setUserPreferences] = useState(null);
  const [showNotificationSettings, setShowNotificationSettings] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [comparisonOpen, setComparisonOpen] = useState(false);
  const { darkMode, toggleDarkMode } = useTheme();

  useEffect(() => {
    // Load user preferences from localStorage on mount
    const preferences = loadUserPreferences();
    setUserPreferences(preferences);
  }, []);

  // Handlers for product interactions
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
    // Update user preferences with new price alert
    const updatedPreferences = {
      ...userPreferences,
      priceAlerts: {
        ...(userPreferences?.priceAlerts || {}),
        [productId]: targetPrice
      }
    };
    
    setUserPreferences(updatedPreferences);
    saveUserPreferences(updatedPreferences);
    setAlertOpen(false);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50'} transition-colors duration-200`}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex-1"></div>
          <div className="flex flex-col items-center text-center flex-1">
            <div className="flex items-center justify-center">
              <img src="/data/chats/i5e1p/workspace/uploads/a3d9e604-f30d-4844-b373-939f09901d34-72511.png" alt="Logo" className="h-10 w-auto mr-3" />
              <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Yazar İletisim Iphone Fiyat Takibi</h1>
            </div>
            <p className={`mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Bu program Yazar İletişim adına özel olarak hazırlanmıştır.
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowFavorites(!showFavorites)}
              className={`p-2 rounded-full ${showFavorites ? 'bg-pink-100 text-pink-700' : darkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              title="Favoriler"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill={showFavorites ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>

            <button
              onClick={() => setShowNotificationSettings(true)}
              className={`p-2 rounded-full ${darkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              title="Bildirim Ayarları"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full ${darkMode ? 'bg-gray-800 text-yellow-300 hover:bg-gray-700' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              title={darkMode ? 'Aydınlık Moda Geç' : 'Karanlık Moda Geç'}
            >
              {darkMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          </div>
        </div>


        {/* Filter controls */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
          <div className="filter-group">
            <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Siteler</label>
            <select 
              className={`px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${darkMode ? 'bg-gray-800 border-gray-600 text-gray-200' : 'bg-white border-gray-300 text-gray-800'}`}
              value={activeSite}
              onChange={(e) => setActiveSite(e.target.value)}
            >
              <option value="all">Tüm Siteler</option>
              <option value="trendyol">Trendyol</option>
              <option value="hepsiburada">Hepsiburada</option>
              <option value="n11">N11</option>
              <option value="amazon">Amazon</option>
              <option value="vatan">Vatan</option>
              <option value="mediamarkt">MediaMarkt</option>
              <option value="teknosa">Teknosa</option>
            </select>
          </div>

          <div className="filter-group">
            <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>iPhone Modeli</label>
            <select 
              className={`px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${darkMode ? 'bg-gray-800 border-gray-600 text-gray-200' : 'bg-white border-gray-300 text-gray-800'}`}
              value={activeModel}
              onChange={(e) => setActiveModel(e.target.value)}
            >
              <option value="all">Tüm Modeller</option>
              <option value="iphone16e">iPhone 16e</option>
              <option value="iphone16">iPhone 16</option>
              <option value="iphone16plus">iPhone 16 Plus</option>
              <option value="iphone16pro">iPhone 16 Pro</option>
              <option value="iphone16promax">iPhone 16 Pro Max</option>
              <option value="iphone15">iPhone 15</option>
              <option value="iphone15plus">iPhone 15 Plus</option>
              <option value="iphone15pro">iPhone 15 Pro</option>
              <option value="iphone15promax">iPhone 15 Pro Max</option>
            </select>
          </div>
        </div>

        {/* Toggle between Dashboard and Favorites */}
        {showFavorites ? (
          <Favorites 
            darkMode={darkMode}
            onOpenAlert={handleOpenAlert}
            onOpenHistory={handleOpenHistory}
            onOpenComparison={handleOpenComparison}
          />
        ) : (
          <Dashboard 
            activeSite={activeSite} 
            activeModel={activeModel} 
            userPreferences={userPreferences}
            darkMode={darkMode}
            onOpenNotificationSettings={() => setShowNotificationSettings(true)}
            onOpenAlert={handleOpenAlert}
            onOpenHistory={handleOpenHistory}
            onOpenComparison={handleOpenComparison}
          />
        )}
        
        {/* Notification Settings Modal */}
        <NotificationSettings 
          isOpen={showNotificationSettings} 
          onClose={() => setShowNotificationSettings(false)} 
        />
        
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
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;