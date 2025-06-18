import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';

// Simple SVG icons
const ShoppingCart = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="8" cy="21" r="1"></circle>
    <circle cx="19" cy="21" r="1"></circle>
    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
  </svg>
);

const Play = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="5 3 19 12 5 21 5 3"></polygon>
  </svg>
);

const Pause = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="6" y="4" width="4" height="16"></rect>
    <rect x="14" y="4" width="4" height="16"></rect>
  </svg>
);

const Settings = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

const AlertCircle = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="8" x2="12" y2="12"></line>
    <line x1="12" y1="16" x2="12.01" y2="16"></line>
  </svg>
);

const CheckCircle = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

const Clock = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

const AutoBuyer = ({ product, onClose }) => {
  // Create a portal container for the modal
  const [modalRoot] = useState(() => {
    const existingRoot = document.getElementById('auto-buyer-modal-root');
    if (existingRoot) return existingRoot;
    
    const root = document.createElement('div');
    root.id = 'auto-buyer-modal-root';
    document.body.appendChild(root);
    return root;
  });
  
  const [targetPrice, setTargetPrice] = useState(product?.currentPrice * 0.9 || 0);
  const [isEnabled, setIsEnabled] = useState(false);
  const [buyingStatus, setBuyingStatus] = useState('idle'); // idle, monitoring, buying, success, error
  const [lastCheck, setLastCheck] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [settings, setSettings] = useState({
    maxAttempts: 3,
    checkInterval: 5, // minutes
    autoRetry: true,
    notifyOnSuccess: true,
    notifyOnError: true
  });
  
  // Ref to track if component is mounted
  const isMounted = useRef(true);
  const intervalRef = useRef(null);
  
  // Clean up on unmount
  useEffect(() => {
    document.body.style.overflow = 'hidden'; // Prevent body scrolling while modal is open
    
    return () => {
      isMounted.current = false;
      document.body.style.overflow = ''; // Restore body scrolling
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Simulate monitoring and buying process with clean interval handling
  useEffect(() => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    // Only set a new interval if monitoring is active
    if (isEnabled && buyingStatus === 'monitoring' && isMounted.current) {
      // Using 5 seconds for testing instead of minutes
      intervalRef.current = setInterval(() => {
        if (isMounted.current) {
          checkPriceAndBuy();
        }
      }, settings.checkInterval * 5000);
    }
    
    // Clear interval on component unmount or when monitoring stops
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isEnabled, buyingStatus, settings.checkInterval]);

  const checkPriceAndBuy = async () => {
    // Safety check to prevent execution if component is unmounted
    if (!isMounted.current || buyingStatus !== 'monitoring') {
      return;
    }
    
    setLastCheck(new Date());
    
    // Simulate price check
    const currentPrice = product.currentPrice + (Math.random() - 0.5) * 1000;
    
    if (currentPrice <= targetPrice) {
      // Clear interval immediately to prevent multiple buying attempts
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      
      if (isMounted.current) {
        setBuyingStatus('buying');
      }
      
      // Simulate buying process
      try {
        await simulateBuyingProcess();
        
        // Only update state if still mounted
        if (isMounted.current) {
          setIsEnabled(false);
          setBuyingStatus('success');
          if (settings.notifyOnSuccess) {
            showNotification('Satın alma başarılı!', 'success');
          }
        }
      } catch (error) {
        // Only update state if still mounted
        if (isMounted.current) {
          setIsEnabled(false);
          setBuyingStatus('error');
          setErrorMessage('Satın alma sırasında hata oluştu: ' + error.message);
          if (settings.notifyOnError) {
            showNotification('Satın alma başarısız!', 'error');
          }
        }
      }
    }
  };

  const simulateBuyingProcess = () => {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        // 80% success rate for demo
        if (Math.random() > 0.2) {
          resolve();
        } else {
          reject(new Error('Stok yetersiz veya ödeme hatası'));
        }
      }, 3000);
      
      // Clean up timeout if component unmounts during the buying process
      return () => clearTimeout(timer);
    });
  };

  const showNotification = (message, type) => {
    // In a real app, this would trigger a proper notification system
    console.log(`${type.toUpperCase()}: ${message}`);
  };

  const startMonitoring = () => {
    if (targetPrice <= 0) {
      setErrorMessage('Geçerli bir hedef fiyat girin');
      return;
    }
    setIsEnabled(true);
    setBuyingStatus('monitoring');
    setErrorMessage('');
  };

  const stopMonitoring = () => {
    setIsEnabled(false);
    setBuyingStatus('idle');
    
    // Clear interval when stopping monitoring
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const getStatusColor = () => {
    switch (buyingStatus) {
      case 'monitoring': return 'text-blue-600';
      case 'buying': return 'text-yellow-600';
      case 'success': return 'text-green-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = () => {
    switch (buyingStatus) {
      case 'monitoring': return <Clock />;
      case 'buying': return <ShoppingCart />;
      case 'success': return <CheckCircle />;
      case 'error': return <AlertCircle />;
      default: return <Pause />;
    }
  };

  const getStatusText = () => {
    switch (buyingStatus) {
      case 'monitoring': return 'Fiyat izleniyor...';
      case 'buying': return 'Satın alınıyor...';
      case 'success': return 'Başarıyla satın alındı!';
      case 'error': return 'Hata oluştu';
      default: return 'Beklemede';
    }
  };

  // Prevent modal content from causing modal to close
  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  // Create a modal component with fixed size
  const Modal = (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
      style={{ 
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      }}
    >
      <div 
        onClick={handleModalClick} 
        className="bg-white dark:bg-gray-800 rounded-lg p-6"
        style={{
          position: 'relative',
          width: '600px',
          maxWidth: '95%',
          maxHeight: '90vh',
          overflowY: 'auto',
          margin: '0 auto',
          // IMPORTANT: Remove all transformations and animations
          transform: 'none',
          transition: 'none',
          animation: 'none',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
        }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Otomatik Satın Alma
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            style={{ fontSize: '24px', lineHeight: '1' }}
          >
            ×
          </button>
        </div>

        {/* Product Info */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
            {product?.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Mağaza: {product?.retailer}
          </p>
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            Mevcut Fiyat: ₺{product?.currentPrice?.toLocaleString('tr-TR')}
          </p>
        </div>

        {/* Status */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className={getStatusColor()} style={{ display: 'inline-flex', width: '20px', height: '20px' }}>{getStatusIcon()}</span>
            <span className={`font-medium ${getStatusColor()}`}>
              {getStatusText()}
            </span>
          </div>
          {lastCheck && (
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Son kontrol: {lastCheck.toLocaleTimeString('tr-TR')}
            </p>
          )}
          {errorMessage && (
            <p className="text-sm text-red-600 mt-2">{errorMessage}</p>
          )}
        </div>

        {/* Target Price */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Hedef Fiyat (₺)
          </label>
          <input
            type="number"
            value={targetPrice}
            onChange={(e) => setTargetPrice(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            placeholder="Hedef fiyatı girin"
            disabled={buyingStatus === 'buying'}
            style={{ outline: 'none' }}
          />
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Fiyat bu değere düştüğünde otomatik satın alma yapılacak
          </p>
        </div>

        {/* Settings */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span style={{ display: 'inline-flex', width: '20px', height: '20px' }}>
              <Settings />
            </span>
            <span className="font-medium text-gray-900 dark:text-white">
              Ayarlar
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Kontrol Aralığı (dakika)
              </label>
              <input
                type="number"
                value={settings.checkInterval}
                onChange={(e) => setSettings({...settings, checkInterval: Number(e.target.value)})}
                className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
                min="1"
                max="60"
                disabled={isEnabled}
                style={{ outline: 'none' }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Maksimum Deneme
              </label>
              <input
                type="number"
                value={settings.maxAttempts}
                onChange={(e) => setSettings({...settings, maxAttempts: Number(e.target.value)})}
                className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
                min="1"
                max="10"
                disabled={isEnabled}
                style={{ outline: 'none' }}
              />
            </div>
          </div>

          <div className="mt-3 space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.autoRetry}
                onChange={(e) => setSettings({...settings, autoRetry: e.target.checked})}
                className="rounded border-gray-300 text-blue-600"
                disabled={isEnabled}
                style={{ marginRight: '8px' }}
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Hata durumunda otomatik yeniden dene
              </span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.notifyOnSuccess}
                onChange={(e) => setSettings({...settings, notifyOnSuccess: e.target.checked})}
                className="rounded border-gray-300 text-blue-600"
                style={{ marginRight: '8px' }}
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Başarılı satın almada bildirim gönder
              </span>
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          {!isEnabled || buyingStatus === 'idle' ? (
            <button
              onClick={startMonitoring}
              disabled={buyingStatus === 'buying'}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2"
              style={{ border: 'none', outline: 'none' }}
            >
              <span style={{ display: 'inline-flex', width: '20px', height: '20px' }}>
                <Play />
              </span>
              İzlemeyi Başlat
            </button>
          ) : (
            <button
              onClick={stopMonitoring}
              disabled={buyingStatus === 'buying'}
              className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2"
              style={{ border: 'none', outline: 'none' }}
            >
              <span style={{ display: 'inline-flex', width: '20px', height: '20px' }}>
                <Pause />
              </span>
              İzlemeyi Durdur
            </button>
          )}
          
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            style={{ outline: 'none' }}
          >
            Kapat
          </button>
        </div>

        {/* Info */}
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-200 flex items-start">
            <span style={{ display: 'inline-flex', width: '20px', height: '20px', marginRight: '4px', flexShrink: 0 }}>
              <AlertCircle />
            </span>
            <span>
              Otomatik satın alma özelliği, belirlediğiniz hedef fiyata ulaştığında 
              ürünü otomatik olarak sepete ekler ve satın alma işlemini tamamlar.
            </span>
          </p>
        </div>
      </div>
    </div>
  );

  // Use ReactDOM.createPortal to render the modal outside the normal DOM hierarchy
  return ReactDOM.createPortal(Modal, modalRoot);
};

export default AutoBuyer;