import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

function NotificationSettings({ isOpen, onClose }) {
  const { darkMode } = useTheme();
  
  // Initial state for notification preferences
  const [notificationPrefs, setNotificationPrefs] = useState({
    emailNotifications: true,
    email: '',
    browserNotifications: true,
    notificationFrequency: 'immediate',
    priceDropThreshold: 5, // Default 5%
    favoriteNotificationsOnly: false
  });
  
  // Load saved preferences on mount
  useEffect(() => {
    const savedPrefs = localStorage.getItem('notificationPreferences');
    if (savedPrefs) {
      setNotificationPrefs(JSON.parse(savedPrefs));
    }
  }, []);
  
  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNotificationPrefs(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  // Save preferences
  const savePreferences = () => {
    localStorage.setItem('notificationPreferences', JSON.stringify(notificationPrefs));
    
    // Request browser notification permission if enabled
    if (notificationPrefs.browserNotifications && "Notification" in window) {
      Notification.requestPermission();
    }
    
    onClose();
  };
  
  // If modal is not open, don't render anything
  if (!isOpen) return null;
  
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div 
        className={`relative w-full max-w-md p-6 rounded-lg shadow-xl ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}
        onClick={e => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        <h2 className={`text-2xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Bildirim Ayarları
        </h2>
        
        <button 
          onClick={onClose}
          className={`absolute top-4 right-4 p-1 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div className="space-y-6">
          {/* Email Notifications */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                E-posta Bildirimleri
              </label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="emailNotifications"
                  checked={notificationPrefs.emailNotifications}
                  onChange={handleInputChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            {notificationPrefs.emailNotifications && (
              <input
                type="email"
                name="email"
                placeholder="E-posta adresiniz"
                value={notificationPrefs.email}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                }`}
              />
            )}
          </div>
          
          {/* Browser Notifications */}
          <div className="flex items-center justify-between">
            <label className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              Tarayıcı Bildirimleri
            </label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="browserNotifications"
                checked={notificationPrefs.browserNotifications}
                onChange={handleInputChange}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          {/* Notification Frequency */}
          <div>
            <label className={`block font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              Bildirim Sıklığı
            </label>
            <div className={`grid grid-cols-3 gap-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              {[{value: 'immediate', label: 'Anında'}, {value: 'daily', label: 'Günlük'}, {value: 'weekly', label: 'Haftalık'}].map(({value, label}) => (
                <label 
                  key={value} 
                  className={`flex items-center justify-center px-3 py-2 border rounded-md cursor-pointer ${
                    notificationPrefs.notificationFrequency === value
                      ? darkMode 
                        ? 'bg-blue-600 border-blue-700 text-white' 
                        : 'bg-blue-50 border-blue-500 text-blue-700'
                      : darkMode
                        ? 'border-gray-700 hover:bg-gray-700'
                        : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="notificationFrequency"
                    value={value}
                    checked={notificationPrefs.notificationFrequency === value}
                    onChange={handleInputChange}
                    className="hidden"
                  />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          </div>
          
          {/* Price Drop Threshold */}
          <div>
            <label className={`block font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              Fiyat Düşüş Eşiği: {notificationPrefs.priceDropThreshold}%
            </label>
            <input
              type="range"
              name="priceDropThreshold"
              min="1"
              max="20"
              value={notificationPrefs.priceDropThreshold}
              onChange={handleInputChange}
              className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between mt-1 text-xs text-gray-500">
              <span>1%</span>
              <span>5%</span>
              <span>10%</span>
              <span>15%</span>
              <span>20%</span>
            </div>
          </div>
          
          {/* Favorites Only */}
          <div className="flex items-center justify-between">
            <label className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              Sadece favori ürünler için bildir
            </label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="favoriteNotificationsOnly"
                checked={notificationPrefs.favoriteNotificationsOnly}
                onChange={handleInputChange}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          {/* Save Button */}
          <div className="flex justify-end pt-4">
            <button
              onClick={savePreferences}
              className="px-5 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
            >
              Tercihleri Kaydet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotificationSettings;