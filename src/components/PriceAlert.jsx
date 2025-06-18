import { useState, useEffect } from 'react';

function PriceAlert({ product, isOpen, onClose, onSetAlert, currentTargetPrice, darkMode = false }) {
  const [targetPrice, setTargetPrice] = useState(currentTargetPrice || product.currentPrice);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reductionType, setReductionType] = useState('absolute'); // 'absolute' or 'percentage'
  const [percentReduction, setPercentReduction] = useState(10); // Default 10% reduction
  
  useEffect(() => {
    // Reset form when the modal opens
    if (isOpen) {
      setTargetPrice(currentTargetPrice || product.currentPrice);
      setIsSubmitting(false);
      setReductionType('absolute');
      setPercentReduction(10);
    }
  }, [isOpen, product, currentTargetPrice]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate some processing time
    setTimeout(() => {
      onSetAlert(product.id, parseFloat(targetPrice));
      setIsSubmitting(false);
    }, 500);
  };
  
  const handlePercentChange = (percent) => {
    setPercentReduction(percent);
    const newPrice = product.currentPrice * (1 - percent / 100);
    setTargetPrice(Math.round(newPrice));
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex justify-center items-center p-4">
      <div className={`relative rounded-lg max-w-md w-full shadow-xl ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Fiyat Alarmı Ayarla</h3>
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
            <p className={`${darkMode ? 'text-white' : 'text-gray-700'}`}>{product.name}</p>
            <p className={`text-sm mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>{product.retailer} mağazasından</p>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              {/* Toggle between absolute and percentage price */}
              <div className="flex space-x-2 mb-4">
                <button 
                  type="button"
                  onClick={() => setReductionType('absolute')}
                  className={`flex-1 py-1 px-2 text-sm rounded-md ${reductionType === 'absolute' 
                    ? (darkMode ? 'bg-blue-700 text-white' : 'bg-blue-600 text-white')
                    : (darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700')}`}
                >
                  Tam Fiyat
                </button>
                <button 
                  type="button"
                  onClick={() => setReductionType('percentage')}
                  className={`flex-1 py-1 px-2 text-sm rounded-md ${reductionType === 'percentage' 
                    ? (darkMode ? 'bg-blue-700 text-white' : 'bg-blue-600 text-white')
                    : (darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700')}`}
                >
                  Yüzde İndirim
                </button>
              </div>
              
              {reductionType === 'absolute' ? (
                <>
                  <label htmlFor="targetPrice" className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Hedef Fiyat (TL)
                  </label>
                  <input
                    type="number"
                    id="targetPrice"
                    value={targetPrice}
                    onChange={(e) => setTargetPrice(e.target.value)}
                    min="0"
                    step="1"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'}`}
                    required
                  />
                  
                  <div className="mt-4">
                    <div className={`text-sm mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Fiyat ayarlayıcı</div>
                    <input
                      type="range"
                      min={Math.floor(product.currentPrice * 0.7)}
                      max={Math.ceil(product.currentPrice * 1.3)}
                      value={targetPrice}
                      onChange={(e) => setTargetPrice(e.target.value)}
                      className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}
                    />
                    <div className={`flex justify-between text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      <span>{Math.floor(product.currentPrice * 0.7)} TL</span>
                      <span>{Math.ceil(product.currentPrice * 1.3)} TL</span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <label htmlFor="percentReduction" className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    İndirim Yüzdesi (%)
                  </label>
                  <input
                    type="number"
                    id="percentReduction"
                    value={percentReduction}
                    onChange={(e) => handlePercentChange(Number(e.target.value))}
                    min="1"
                    max="50"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'}`}
                    required
                  />
                  
                  <div className="mt-4">
                    <div className={`text-sm mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>İndirim ayarlayıcı</div>
                    <input
                      type="range"
                      min={1}
                      max={50}
                      step={1}
                      value={percentReduction}
                      onChange={(e) => handlePercentChange(Number(e.target.value))}
                      className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}
                    />
                    <div className={`flex justify-between text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      <span>%1</span>
                      <span>%50</span>
                    </div>
                    <p className={`mt-2 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Hesaplanan fiyat: {Math.round(product.currentPrice * (1 - percentReduction / 100))} TL
                      <span className="ml-1 text-xs text-green-600">(%{percentReduction} indirim)</span>
                    </p>
                  </div>
                </>
              )}
            </div>
            
            <div className={`text-sm mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              <p>Mevcut fiyat: <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-700'}`}>{product.currentPrice} TL</span></p>
              {currentTargetPrice && (
                <p className="mt-1">Mevcut alarm: <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-700'}`}>{currentTargetPrice} TL</span></p>
              )}
            </div>
            
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className={`flex-1 py-2 px-4 border rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${darkMode ? 'border-gray-600 text-gray-300 bg-gray-700 hover:bg-gray-600' : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'}`}
                disabled={isSubmitting}
              >
                İptal
              </button>
              <button
                type="submit"
                className={`flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white flex justify-center items-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${darkMode ? 'bg-blue-700 hover:bg-blue-800' : 'bg-blue-600 hover:bg-blue-700'}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  "Alarm Kur"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PriceAlert;