// Service for managing localStorage operations for the iPhone price tracker

const LOCAL_STORAGE_KEY = 'iphone_price_tracker_data';

/**
 * Load user preferences from localStorage
 * @returns {Object} User preferences object
 */
export const loadUserPreferences = () => {
  try {
    const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedData) {
      return JSON.parse(storedData);
    }
    return getDefaultPreferences();
  } catch (error) {
    console.error('Error loading user preferences:', error);
    return getDefaultPreferences();
  }
};

/**
 * Save user preferences to localStorage
 * @param {Object} preferences User preferences object to save
 */
export const saveUserPreferences = (preferences) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(preferences));
  } catch (error) {
    console.error('Error saving user preferences:', error);
  }
};

/**
 * Delete all user preference data from localStorage
 */
export const clearUserPreferences = () => {
  try {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing user preferences:', error);
  }
};

/**
 * Get default preferences object
 * @returns {Object} Default preferences
 */
const getDefaultPreferences = () => {
  return {
    priceAlerts: {},
    favoriteProducts: [],
    recentlyViewed: [],
    notificationSettings: {
      email: false,
      browser: true,
      emailAddress: ''
    },
    lastVisit: new Date().toISOString()
  };
};

/**
 * Add a product to favorites
 * @param {number} productId ID of the product to add
 */
export const addToFavorites = (productId) => {
  const preferences = loadUserPreferences();
  if (!preferences.favoriteProducts.includes(productId)) {
    preferences.favoriteProducts.push(productId);
    saveUserPreferences(preferences);
  }
};

/**
 * Remove a product from favorites
 * @param {number} productId ID of the product to remove
 */
export const removeFromFavorites = (productId) => {
  const preferences = loadUserPreferences();
  preferences.favoriteProducts = preferences.favoriteProducts.filter(id => id !== productId);
  saveUserPreferences(preferences);
};

/**
 * Check if a product is in favorites
 * @param {number} productId ID of the product to check
 * @returns {boolean} True if product is in favorites
 */
export const isFavorite = (productId) => {
  const preferences = loadUserPreferences();
  return preferences.favoriteProducts.includes(productId);
};

/**
 * Add a product to recently viewed
 * @param {number} productId ID of the product to add
 */
export const addToRecentlyViewed = (productId) => {
  const preferences = loadUserPreferences();
  preferences.recentlyViewed = preferences.recentlyViewed.filter(id => id !== productId); // Remove if already exists
  preferences.recentlyViewed.unshift(productId); // Add to beginning
  
  // Keep only the latest 10 items
  if (preferences.recentlyViewed.length > 10) {
    preferences.recentlyViewed = preferences.recentlyViewed.slice(0, 10);
  }
  
  saveUserPreferences(preferences);
};

/**
 * Get all price alerts
 * @returns {Object} Object mapping product IDs to target prices
 */
export const getPriceAlerts = () => {
  const preferences = loadUserPreferences();
  return preferences.priceAlerts || {};
};

/**
 * Set a price alert for a specific product
 * @param {number} productId ID of the product
 * @param {number} targetPrice Target price for alert
 */
export const setPriceAlert = (productId, targetPrice) => {
  const preferences = loadUserPreferences();
  preferences.priceAlerts = {
    ...preferences.priceAlerts,
    [productId]: targetPrice
  };
  saveUserPreferences(preferences);
};

/**
 * Remove a price alert
 * @param {number} productId ID of the product
 */
export const removePriceAlert = (productId) => {
  const preferences = loadUserPreferences();
  const { [productId]: removed, ...remaining } = preferences.priceAlerts;
  preferences.priceAlerts = remaining;
  saveUserPreferences(preferences);
};

/**
 * Update notification settings
 * @param {Object} settings Notification settings object
 */
export const updateNotificationSettings = (settings) => {
  const preferences = loadUserPreferences();
  preferences.notificationSettings = {
    ...preferences.notificationSettings,
    ...settings
  };
  saveUserPreferences(preferences);
};

/**
 * Get notification settings
 * @returns {Object} Notification settings object
 */
export const getNotificationSettings = () => {
  const preferences = loadUserPreferences();
  return preferences.notificationSettings || { email: false, browser: true, emailAddress: '' };
};