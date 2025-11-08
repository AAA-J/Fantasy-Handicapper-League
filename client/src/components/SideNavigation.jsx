import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const SideNavigation = ({ selectedUser }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navigationItems = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/market-contracts', label: 'Market Contracts', icon: '📊' },
    { path: '/fantasy-league', label: 'Fantasy League', icon: '🏈' },
    { path: '/leaderboard', label: 'Leaderboard', icon: '🏆' },
    { path: '/social', label: 'Social', icon: '👥' },
    { path: '/competitions', label: 'Competitions', icon: '🎯' },
  ];

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-blue-600 text-white rounded-lg shadow-lg"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <motion.div
        className={`hidden lg:flex lg:flex-col bg-white shadow-lg border-r border-gray-200 transition-all duration-300 ${
          isCollapsed ? 'w-16' : 'w-64'
        }`}
        style={{ height: '100vh' }}
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <h2 className="text-lg font-semibold text-gray-800">Navigation</h2>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg
              className={`w-5 h-5 text-gray-600 transition-transform ${
                isCollapsed ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-2">
        <ul className="space-y-1">
          {navigationItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center px-3 py-3 rounded-lg transition-all duration-200 group ${
                  isActive(item.path)
                    ? 'bg-blue-100 text-blue-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <span className="text-xl mr-3">{item.icon}</span>
                {!isCollapsed && (
                  <span className="text-sm font-medium">{item.label}</span>
                )}
                {isActive(item.path) && (
                  <motion.div
                    className="ml-auto w-2 h-2 bg-blue-600 rounded-full"
                    layoutId="activeIndicator"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

        {/* User Profile Section */}
        {selectedUser && (
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <Link
              to={`/profile/${selectedUser.id}`}
              className={`flex items-center px-3 py-3 rounded-lg transition-all duration-200 group ${
                isActive(`/profile/${selectedUser.id}`)
                  ? 'bg-blue-100 text-blue-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold mr-3">
                {selectedUser.username.charAt(0).toUpperCase()}
              </div>
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{selectedUser.username}</p>
                  <p className="text-xs text-gray-500">Profile</p>
                </div>
              )}
            </Link>
          </div>
        )}
      </motion.div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="lg:hidden fixed left-0 top-0 h-full w-64 bg-white shadow-xl z-50 flex flex-col"
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Mobile Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800">Navigation</h2>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Mobile Navigation Items */}
            <nav className="flex-1 p-2">
              <ul className="space-y-1">
                {navigationItems.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`flex items-center px-3 py-3 rounded-lg transition-all duration-200 group ${
                        isActive(item.path)
                          ? 'bg-blue-100 text-blue-700 font-medium'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      <span className="text-xl mr-3">{item.icon}</span>
                      <span className="text-sm font-medium">{item.label}</span>
                      {isActive(item.path) && (
                        <motion.div
                          className="ml-auto w-2 h-2 bg-blue-600 rounded-full"
                          layoutId="mobileActiveIndicator"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Mobile User Profile Section */}
            {selectedUser && (
              <div className="p-4 border-t border-gray-200 bg-gray-50">
                <Link
                  to={`/profile/${selectedUser.id}`}
                  className={`flex items-center px-3 py-3 rounded-lg transition-all duration-200 group ${
                    isActive(`/profile/${selectedUser.id}`)
                      ? 'bg-blue-100 text-blue-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold mr-3">
                    {selectedUser.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{selectedUser.username}</p>
                    <p className="text-xs text-gray-500">Profile</p>
                  </div>
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SideNavigation;
