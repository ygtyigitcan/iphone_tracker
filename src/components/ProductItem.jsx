import { useState, useEffect } from 'react';
import { isFavorite, addToFavorites, removeFromFavorites } from '../services/localStorage';
import AutoBuyer from './AutoBuyer';

function ProductItem({ product, onOpenAlert, onOpenHistory, onOpenComparison, targetPrice }) {
  const [isHovering, setIsHovering] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [showAutoBuyer, setShowAutoBuyer] = useState(false);
  
  useEffect(() => {
    // Check if this product is in favorites on mount
    setIsFavorited(isFavorite(product.id));
  }, [product.id]);
  
  const toggleFavorite = (e) => {
    e.stopPropagation();
    if (isFavorited) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(product.id);
    }
    setIsFavorited(!isFavorited);
  };
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const getBadgeColor = (retailer) => {
    const colors = {
      'trendyol': 'bg-orange-100 text-orange-800',
      'hepsiburada': 'bg-red-100 text-red-800',
      'n11': 'bg-blue-100 text-blue-800',
      'amazon': 'bg-yellow-100 text-yellow-800',
      'vatan': 'bg-purple-100 text-purple-800',
      'mediamarkt': 'bg-red-100 text-red-800',
      'teknosa': 'bg-blue-100 text-blue-700'
    };
    return colors[retailer.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };
  
  const isPriceDropped = targetPrice && product.currentPrice <= targetPrice;
  
  return (
    <div 
      className={`bg-white rounded-lg shadow-md overflow-hidden border transition-all duration-200 ${isPriceDropped ? 'border-green-500' : 'border-gray-200'} ${isHovering ? 'shadow-lg transform -translate-y-1' : ''}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {isPriceDropped && (
        <div className="bg-green-500 text-white text-center py-1 px-2 text-sm font-medium">
          Fiyat hedef fiyatınızın altına düştü!
        </div>
      )}
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <span className={`px-2 py-1 text-xs font-semibold rounded ${getBadgeColor(product.retailer)}`}>
            {product.retailer}
          </span>
          <span className="text-sm text-gray-500">{product.lastUpdated}</span>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{product.name}</h3>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-baseline">
            <span className="text-2xl font-bold text-gray-900">
              {formatPrice(product.currentPrice)}
            </span>
            
            {product.previousPrice > product.currentPrice && (
              <span className="ml-2 text-sm text-gray-500 line-through">
                {formatPrice(product.previousPrice)}
              </span>
            )}
          </div>
          
          {product.previousPrice > product.currentPrice && (
            <span className="text-green-500 text-sm font-medium">
              -{Math.round(((product.previousPrice - product.currentPrice) / product.previousPrice) * 100)}%
            </span>
          )}
        </div>
        
        {/* İndirim Oranı Section in Turkish with color-coding */}
        {product.previousPrice > product.currentPrice && (() => {
          const discountRate = Math.round(((product.previousPrice - product.currentPrice) / product.previousPrice) * 100);
          const savedAmount = product.previousPrice - product.currentPrice;
          
          // Color coding based on discount percentage tiers
          let colorClasses = {
            bg: 'bg-green-50',
            border: 'border-green-100',
            textTitle: 'text-green-800',
            textValue: 'text-green-700',
            textSaved: 'text-green-600'
          };
          
          if (discountRate >= 30) {
            colorClasses = {
              bg: 'bg-red-50',
              border: 'border-red-100',
              textTitle: 'text-red-800',
              textValue: 'text-red-700',
              textSaved: 'text-red-600'
            };
          } else if (discountRate >= 20) {
            colorClasses = {
              bg: 'bg-orange-50',
              border: 'border-orange-100',
              textTitle: 'text-orange-800',
              textValue: 'text-orange-700',
              textSaved: 'text-orange-600'
            };
          } else if (discountRate >= 10) {
            colorClasses = {
              bg: 'bg-yellow-50',
              border: 'border-yellow-100',
              textTitle: 'text-yellow-800',
              textValue: 'text-yellow-700',
              textSaved: 'text-yellow-600'
            };
          }
          
          return (
            <div className={`mb-4 py-2 px-3 ${colorClasses.bg} rounded-md border ${colorClasses.border}`}>
              <div className="flex justify-between items-center">
                <span className={`text-sm font-medium ${colorClasses.textTitle}`}>İndirim Oranı:</span>
                <span className={`text-sm font-bold ${colorClasses.textValue}`}>
                  %{discountRate}
                </span>
              </div>
              <div className={`mt-1 text-xs ${colorClasses.textSaved}`}>
                {formatPrice(savedAmount)} tasarruf
              </div>
            </div>
          );
        })()}
        
        <div className="grid grid-cols-2 gap-3 mb-4 text-sm text-gray-600">
          <div>
            <span className="font-medium">Model:</span> {product.model}
          </div>
          <div>
            <span className="font-medium">Renk:</span> {product.color}
          </div>
          <div>
            <span className="font-medium">Hafıza:</span> {product.memory}
          </div>
          <div>
            <span className="font-medium">Stok:</span> {product.inStock ? 'Var' : 'Yok'}
          </div>
        </div>
        
        {targetPrice && (
          <div className="mb-4 py-2 px-3 bg-blue-50 rounded-md border border-blue-100">
            <span className="text-sm text-blue-800">
              Hedef fiyatınız: <span className="font-semibold">{formatPrice(targetPrice)}</span>
            </span>
          </div>
        )}
        
        <div className="flex justify-between gap-2 mb-2">
          <button 
            onClick={toggleFavorite}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isFavorited ? 'bg-pink-100 text-pink-700 hover:bg-pink-200' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            title={isFavorited ? "Remove from favorites" : "Add to favorites"}
          >
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill={isFavorited ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span>{isFavorited ? 'Favorilerde' : 'Favorile'}</span>
            </div>
          </button>
          
          <button 
            onClick={() => onOpenComparison(product)} 
            className="px-3 py-2 bg-purple-100 text-purple-700 hover:bg-purple-200 rounded-md text-sm font-medium transition-colors"
          >
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span>Karşılaştır</span>
            </div>
          </button>
        </div>
        
        <div className="flex justify-between gap-2 mb-2">
          <button 
            onClick={() => onOpenAlert(product)} 
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-md text-sm font-medium transition-colors"
          >
            {targetPrice ? 'Uyarıyı Güncelle' : 'Fiyat Uyarısı Kur'}
          </button>
          
          <button 
            onClick={() => onOpenHistory(product)} 
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-3 rounded-md text-sm font-medium transition-colors"
          >
            Fiyat Geçmişi
          </button>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={() => setShowAutoBuyer(true)}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded-md text-sm font-medium transition-colors"
          >
            Otomatik Satın Al
          </button>
        </div>
        
        <a 
          href={product.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="block w-full mt-2 text-center py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-sm transition-colors"
        >
          Ürün Sayfasını Ziyaret Et
        </a>
      </div>
      
      {showAutoBuyer && (
        <AutoBuyer 
          product={product}
          onClose={() => setShowAutoBuyer(false)}
        />
      )}
    </div>
  );
}

export default ProductItem;