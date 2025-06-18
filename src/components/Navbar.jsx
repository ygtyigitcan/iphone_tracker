import { useState, useEffect } from 'react';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  
  useEffect(() => {
    // Check if user prefers dark theme
    const darkModePreference = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkTheme(darkModePreference.matches);
    
    // Listen for changes in theme preference
    const handleChange = (e) => setIsDarkTheme(e.matches);
    darkModePreference.addEventListener('change', handleChange);
    
    return () => darkModePreference.removeEventListener('change', handleChange);
  }, []);
  
  return (
    <nav className={`${isDarkTheme ? 'bg-gray-800 text-white' : 'bg-white shadow-sm text-gray-800'}`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              {/* iPhone Logo - A phone with price tag */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 512 512" fill="none">
                {/* Phone Body */}
                <rect x="128" y="48" width="256" height="416" rx="48" fill={isDarkTheme ? '#2563eb' : '#3B82F6'} stroke="currentColor" strokeWidth="16" />
                
                {/* Screen */}
                <rect x="160" y="80" width="192" height="320" rx="16" fill={isDarkTheme ? '#1e3a8a' : '#93c5fd'} />
                
                {/* Home Button */}
                <circle cx="256" cy="432" r="24" fill={isDarkTheme ? '#bfdbfe' : '#1e3a8a'} />
                
                {/* Price Tag */}
                <rect x="192" y="136" width="128" height="64" rx="8" fill={isDarkTheme ? '#4ade80' : '#22c55e'} />
                <text x="208" y="180" fontFamily="Arial" fontSize="36" fontWeight="bold" fill={isDarkTheme ? '#042f2e' : '#ecfdf5'}>₺</text>
                
                {/* Price Chart Line */}
                <polyline points="200,250 240,230 280,260 320,210" stroke={isDarkTheme ? '#ffffff' : '#1e3a8a'} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
                
                {/* Notification Badge */}
                <circle cx="320" y="96" r="32" fill="#ef4444" />
                <text x="310" y="104" fontFamily="Arial" fontSize="24" fontWeight="bold" fill="white">%</text>
              </svg>
              
              <span className="ml-3 text-xl font-bold">iPhone Tracker</span>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <a href="#" className={`${isDarkTheme ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-blue-600'} px-3 py-2 rounded-md text-sm font-medium`}>Dashboard</a>
            <a href="#" className={`${isDarkTheme ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-blue-600'} px-3 py-2 rounded-md text-sm font-medium`}>My Alerts</a>
            <a href="#" className={`${isDarkTheme ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-blue-600'} px-3 py-2 rounded-md text-sm font-medium`}>Price History</a>
          </div>
          
          <div className="-mr-2 flex items-center md:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`inline-flex items-center justify-center p-2 rounded-md ${isDarkTheme ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-400 hover:text-gray-500 hover:bg-gray-100'} focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500`}
              aria-expanded={isMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu, show/hide based on menu state */}
      <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
        <div className="pt-2 pb-3 space-y-1">
          <a href="#" className={`block px-3 py-2 rounded-md text-base font-medium ${isDarkTheme ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'}`}>Dashboard</a>
          <a href="#" className={`block px-3 py-2 rounded-md text-base font-medium ${isDarkTheme ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'}`}>My Alerts</a>
          <a href="#" className={`block px-3 py-2 rounded-md text-base font-medium ${isDarkTheme ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'}`}>Price History</a>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;