import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-primary-600">FoodCritic</span>
            </Link>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
            <Link to="/" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-600">
              Home
            </Link>
            {currentUser ? (
              <>
                <Link to="/dashboard" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-600">
                  Dashboard
                </Link>
                <button 
                  onClick={logout}
                  className="px-3 py-2 text-sm font-medium bg-primary-600 text-white rounded-md hover:bg-primary-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-600">
                  Login
                </Link>
                <Link to="/register" className="px-3 py-2 text-sm font-medium bg-primary-600 text-white rounded-md hover:bg-primary-700">
                  Register
                </Link>
              </>
            )}
          </div>
          
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {mobileMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link 
              to="/"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            {currentUser ? (
              <>
                <Link 
                  to="/dashboard"
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <button 
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login"
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/register"
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;