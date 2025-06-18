// Utility to generate mock data for the iPhone price tracker application

// Function to generate a random price within a range
const randomPrice = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Function to get a random date within the last 30 days
const randomDate = (daysBack) => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysBack));
  return date.toISOString();
};

// Generate price history data for a product
const generatePriceHistory = (currentPrice, daysBack = 30) => {
  const history = [];
  let price = currentPrice;
  
  // Generate data points for each day
  for (let i = daysBack; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    // Random price fluctuation (+/- 5%)
    const fluctuation = (Math.random() * 10 - 5) / 100;
    price = Math.round(price * (1 + fluctuation));
    
    history.push({
      date: date.toISOString(),
      price
    });
  }
  
  // Make sure the last price matches the current price
  history[history.length - 1].price = currentPrice;
  
  return history;
};

// iPhone model data
const iPhoneModels = {
  // iPhone 16 models
  'iPhone 16e': {
    basePrice: 38999,
    colors: ['Siyah', 'Beyaz', 'Mavi', 'Pembe', 'Sarı'],
    memory: ['128GB', '256GB', '512GB']
  },
  'iPhone 16': {
    basePrice: 65999,
    colors: ['Siyah', 'Beyaz', 'Mavi', 'Pembe', 'Sarı'],
    memory: ['128GB', '256GB', '512GB']
  },
  'iPhone 16 Plus': {
    basePrice: 75999,
    colors: ['Siyah', 'Beyaz', 'Mavi', 'Pembe', 'Sarı'],
    memory: ['128GB', '256GB', '512GB']
  },
  'iPhone 16 Pro': {
    basePrice: 86999,
    colors: ['Siyah Titanyum', 'Beyaz Titanyum', 'Doğal Titanyum', 'Mavi Titanyum'],
    memory: ['128GB', '256GB', '512GB', '1TB']
  },
  'iPhone 16 Pro Max': {
    basePrice: 99999,
    colors: ['Siyah Titanyum', 'Beyaz Titanyum', 'Doğal Titanyum', 'Mavi Titanyum'],
    memory: ['256GB', '512GB', '1TB']
  },
  
  // iPhone 15 models
  'iPhone 15': {
    basePrice: 56999,
    colors: ['Siyah', 'Yeşil', 'Sarı', 'Mavi', 'Pembe'],
    memory: ['128GB', '256GB', '512GB']
  },
  'iPhone 15 Plus': {
    basePrice: 66999,
    colors: ['Siyah', 'Yeşil', 'Sarı', 'Mavi', 'Pembe'],
    memory: ['128GB', '256GB', '512GB']
  },
  'iPhone 15 Pro': {
    basePrice: 79999,
    colors: ['Siyah Titanyum', 'Beyaz Titanyum', 'Doğal Titanyum', 'Mavi Titanyum'],
    memory: ['128GB', '256GB', '512GB', '1TB']
  },
  'iPhone 15 Pro Max': {
    basePrice: 89999,
    colors: ['Siyah Titanyum', 'Beyaz Titanyum', 'Doğal Titanyum', 'Mavi Titanyum'],
    memory: ['256GB', '512GB', '1TB']
  }
};

// E-commerce retailers in Turkey
const retailers = [
  'Trendyol',
  'Hepsiburada',
  'N11',
  'Amazon',
  'Vatan',
  'MediaMarkt',
  'Teknosa'
];

// Generate product data for all models, colors, and memory options across retailers
const generateProductData = () => {
  let id = 1;
  const products = [];
  
  Object.entries(iPhoneModels).forEach(([model, details]) => {
    details.colors.forEach(color => {
      details.memory.forEach(memory => {
        // Add price variations based on color and memory
        const memoryMultiplier = {
          '128GB': 1,
          '256GB': 1.25,
          '512GB': 1.5,
          '1TB': 2
        };
        
        const basePrice = details.basePrice * memoryMultiplier[memory];
        
        // Create product listings for each retailer
        retailers.forEach(retailer => {
          // Add some price variation between retailers
          const priceVariation = (Math.random() * 0.2) - 0.1; // -10% to +10%
          const currentPrice = Math.round(basePrice * (1 + priceVariation));
          
          // Previous price is 0-15% higher than current price for some products
          const hasPriceReduction = Math.random() > 0.5;
          const previousPrice = hasPriceReduction 
            ? Math.round(currentPrice * (1 + Math.random() * 0.15)) 
            : currentPrice;
          
          // Generate product
          const product = {
            id: id++,
            name: `${model} ${memory} ${color}`,
            model: model,
            color: color,
            memory: memory,
            retailer: retailer,
            url: `https://www.${retailer.toLowerCase()}.com/iphone-${model.toLowerCase().replace(/\s+/g, '-')}`,
            currentPrice: currentPrice,
            previousPrice: previousPrice,
            inStock: Math.random() > 0.1, // 90% chance of being in stock
            lastUpdated: new Date().toLocaleString(),
            priceHistory: generatePriceHistory(currentPrice, 30)
          };
          
          products.push(product);
        });
      });
    });
  });
  
  return products;
};

// Get all products for tracking
export const getTrackingProducts = () => {
  return generateProductData();
};

// Get a single product by ID (for detail views)
export const getProductById = (id) => {
  const allProducts = generateProductData();
  return allProducts.find(product => product.id === id) || null;
};

// Get the best price for a specific iPhone model across all retailers
export const getBestPrice = (model, color, memory) => {
  const allProducts = generateProductData();
  const matchingProducts = allProducts.filter(
    p => p.model === model && p.color === color && p.memory === memory
  );
  
  if (matchingProducts.length === 0) return null;
  
  return matchingProducts.reduce((best, current) => 
    current.currentPrice < best.currentPrice ? current : best
  );
};

// Get price trends for a specific model over time
export const getPriceTrends = (model) => {
  const allProducts = generateProductData();
  const matchingProducts = allProducts.filter(p => p.model === model);
  
  // Group by retailer
  const retailers = {};
  matchingProducts.forEach(product => {
    if (!retailers[product.retailer]) {
      retailers[product.retailer] = [];
    }
    retailers[product.retailer].push(product);
  });
  
  return retailers;
};

// Get all available models
export const getAvailableModels = () => {
  return Object.keys(iPhoneModels);
};

// Get colors for a specific model
export const getColorsForModel = (model) => {
  return iPhoneModels[model]?.colors || [];
};

// Get memory options for a specific model
export const getMemoryOptionsForModel = (model) => {
  return iPhoneModels[model]?.memory || [];
};