import React from 'react';

function PriceHistory({ product, isOpen, onClose }) {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const renderPriceChart = () => {
    // In a real implementation, we would use Chart.js or similar library
    // For now, we'll create a simplified visualization
    const prices = product.priceHistory.map(item => item.price);
    const maxPrice = Math.max(...prices);
    const minPrice = Math.min(...prices);
    const range = maxPrice - minPrice;
    
    // Calculate average price
    const avgPrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;
    
    // Calculate price trend (positive if prices are trending up, negative if trending down)
    const firstHalf = prices.slice(0, Math.floor(prices.length / 2));
    const secondHalf = prices.slice(Math.floor(prices.length / 2));
    const firstHalfAvg = firstHalf.reduce((sum, price) => sum + price, 0) / firstHalf.length;
    const secondHalfAvg = secondHalf.reduce((sum, price) => sum + price, 0) / secondHalf.length;
    const trend = secondHalfAvg - firstHalfAvg;
    const trendPercentage = (trend / firstHalfAvg) * 100;

    return (
      <>
        <div className="mb-3 grid grid-cols-2 gap-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm font-medium text-blue-800">Price Trend</p>
            <div className="flex items-center mt-1">
              <span className={`text-base font-bold ${trend > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {trend > 0 ? '↑' : '↓'} {Math.abs(trendPercentage).toFixed(1)}%
              </span>
              <span className="ml-1 text-sm text-gray-500">
                {trend > 0 ? 'Rising' : 'Falling'}
              </span>
            </div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm font-medium text-gray-800">Price Volatility</p>
            <div className="flex items-center mt-1">
              <span className="text-base font-bold text-gray-700">
                {(((maxPrice - minPrice) / avgPrice) * 100).toFixed(1)}%
              </span>
              <span className="ml-1 text-sm text-gray-500">
                Range variation
              </span>
            </div>
          </div>
        </div>
        
        <div className="h-52 mt-4 px-4 relative">
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500">
            <span>{formatPrice(maxPrice)}</span>
            <span>{formatPrice(avgPrice)}</span>
            <span>{formatPrice(minPrice)}</span>
          </div>
          
          {/* Average price line */}
          <div 
            className="absolute left-10 right-0 border-t border-dashed border-gray-400 z-10" 
            style={{ top: `${Math.max(0, 100 - ((avgPrice - minPrice) / range) * 100)}%` }}
          ></div>

          {/* Chart area */}
          <div className="ml-10 h-full flex items-end relative">
            {/* Connect dots with line */}
            <svg className="absolute bottom-0 left-0 w-full h-full" style={{zIndex: 5}}>
              <polyline 
                points={product.priceHistory.map((point, index) => {
                  const height = Math.max(0, ((point.price - minPrice) / range) * 100);
                  const width = 100 / (product.priceHistory.length - 1);
                  return `${index * width}% ${100 - height}%`;
                }).join(' ')} 
                className="stroke-blue-500 stroke-2 fill-none" 
              />
            </svg>
            
            {product.priceHistory.map((point, index) => {
              const height = Math.max(20, ((point.price - minPrice) / range) * 100);
              const isLowestPrice = point.price === minPrice;
              const isHighestPrice = point.price === maxPrice;
              const isCurrentPrice = index === product.priceHistory.length - 1;

              return (
                <div key={index} className="flex flex-col items-center mx-1 flex-1 relative">
                  <div 
                    className={`w-full opacity-70 ${isLowestPrice ? 'bg-green-500' : isHighestPrice ? 'bg-red-500' : isCurrentPrice ? 'bg-blue-600' : 'bg-blue-400'}`} 
                    style={{ height: `${height}%` }}
                  ></div>
                  
                  {/* Price point marker */}
                  <div 
                    className={`absolute w-3 h-3 rounded-full z-10 ${isLowestPrice ? 'bg-green-500' : isHighestPrice ? 'bg-red-500' : isCurrentPrice ? 'bg-blue-600' : 'bg-blue-400'}`}
                    style={{ bottom: `${height}%`, transform: 'translate(-50%, 50%)' }}
                  ></div>
                  
                  <div className="mt-3 text-xs text-gray-500 transform -rotate-45 origin-top-left">
                    {formatDate(point.date)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex justify-center items-center p-4">
      <div className="relative bg-white rounded-lg max-w-2xl w-full shadow-xl">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800">Price History</h3>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="mb-4">
            <p className="text-gray-700">{product.name}</p>
            <p className="text-sm text-gray-500 mt-1">from {product.retailer}</p>
          </div>
          
          <div className="mb-6">
            <h4 className="text-md font-medium text-gray-700 mb-2">Price Trends</h4>
            {product.priceHistory.length > 0 ? (
              <>
                {renderPriceChart()}
                <div className="mt-6 flex justify-between text-sm">
                  <div>
                    <p className="text-gray-600">Current Price:</p>
                    <p className="font-semibold text-lg">{formatPrice(product.currentPrice)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Highest Price:</p>
                    <p className="font-semibold text-lg">{formatPrice(Math.max(...product.priceHistory.map(p => p.price)))}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Lowest Price:</p>
                    <p className="font-semibold text-lg">{formatPrice(Math.min(...product.priceHistory.map(p => p.price)))}</p>
                  </div>
                </div>
              </>
            ) : (
              <div className="py-10 text-center text-gray-500">
                No price history available for this product
              </div>
            )}
          </div>
          
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PriceHistory;