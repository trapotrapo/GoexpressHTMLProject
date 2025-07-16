import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Sun, Moon, Globe, Menu, X, Search, Package, LogIn, LogOut, User
} from 'lucide-react';
import translations from '../../utils/translations';

const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  
  const t = translations[language];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const toggleLanguageMenu = () => {
    setLanguageMenuOpen(!languageMenuOpen);
  };

  const changeLanguage = (lang: string) => {
    setLanguage(lang);
    setLanguageMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeMenu();
  };

  // Track scroll position to change navbar style
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navLinks = [
    { path: '/', label: t.home },
    { path: '/track', label: t.track },
    { path: '/services', label: t.services },
    { path: '/about', label: t.about },
    { path: '/contact', label: t.contact }
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  // Language options with their display names
  const languageOptions = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
    { code: 'da', name: 'Dansk', flag: '🇩🇰' },
    { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' }
  ];

  const currentLanguage = languageOptions.find(lang => lang.code === language);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white dark:bg-gray-800 shadow-md'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Package className="h-8 w-8 text-blue-600" />
            <span className="font-bold text-xl">GoExpress</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-medium transition-colors duration-200 ${
                  isActive(link.path)
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions: Theme, Language, Login */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Track Shipment Button */}
            <Link
              to="/track"
              className="inline-flex items-center text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
            >
              <Search className="h-5 w-5 mr-1" />
              <span>{t.track}</span>
            </Link>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
              aria-label={theme === 'dark' ? t.lightMode : t.darkMode}
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>

            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={toggleLanguageMenu}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center space-x-1"
                aria-label={t.changeLanguage}
              >
                <Globe className="h-5 w-5" />
                <span className="text-sm font-medium">{currentLanguage?.flag}</span>
              </button>

              {languageMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 ring-1 ring-black ring-opacity-5 max-h-80 overflow-y-auto">
                  {languageOptions.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => changeLanguage(lang.code)}
                      className={`flex items-center w-full px-4 py-2 text-sm ${
                        language === lang.code
                          ? 'bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <span className="mr-3 text-lg">{lang.flag}</span>
                      <span className={language === lang.code ? 'font-medium' : ''}>{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Login/Admin Button */}
            {isAuthenticated ? (
              <div className="relative">
                <Link
                  to="/admin/dashboard"
                  className="inline-flex items-center px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200"
                >
                  <User className="h-5 w-5 mr-2" />
                  {t.adminDashboard}
                </Link>
              </div>
            ) : (
              <Link
                to="/admin/login"
                className="inline-flex items-center px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <LogIn className="h-5 w-5 mr-2" />
                {t.adminLogin}
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label={isMenuOpen ? t.closeMenu : t.openMenu}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden absolute top-16 inset-x-0 bg-white dark:bg-gray-800 shadow-md transition-all duration-300 ${
          isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
        } overflow-hidden`}
      >
        <nav className="flex flex-col px-4 py-2">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={closeMenu}
              className={`py-3 border-b border-gray-200 dark:border-gray-700 ${
                isActive(link.path)
                  ? 'text-blue-600 dark:text-blue-400 font-medium'
                  : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              {link.label}
            </Link>
          ))}

          {/* Mobile Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300"
          >
            <span>{theme === 'dark' ? t.lightMode : t.darkMode}</span>
            {theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>

          {/* Mobile Language Toggle */}
          <div className="py-3 border-b border-gray-200 dark:border-gray-700">
            <div
              onClick={toggleLanguageMenu}
              className="flex items-center justify-between text-gray-700 dark:text-gray-300 cursor-pointer"
            >
              <span>{t.language}</span>
              <div className="flex items-center space-x-2">
                <span>{currentLanguage?.flag}</span>
                <Globe className="h-5 w-5" />
              </div>
            </div>

            {languageMenuOpen && (
              <div className="mt-2 space-y-1 pl-4 max-h-60 overflow-y-auto">
                {languageOptions.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className={`flex items-center w-full py-2 text-sm ${
                      language === lang.code
                        ? 'text-blue-600 dark:text-blue-400 font-medium'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <span className="mr-3 text-lg">{lang.flag}</span>
                    <span>{lang.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Mobile Login/Admin */}
          {isAuthenticated ? (
            <>
              <Link
                to="/admin/dashboard"
                onClick={closeMenu}
                className="flex items-center py-3 border-b border-gray-200 dark:border-gray-700 text-blue-600 dark:text-blue-400"
              >
                <User className="h-5 w-5 mr-2" />
                {t.adminDashboard}
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center py-3 text-red-600 dark:text-red-400"
              >
                <LogOut className="h-5 w-5 mr-2" />
                {t.logout}
              </button>
            </>
          ) : (
            <Link
              to="/admin/login"
              onClick={closeMenu}
              className="flex items-center py-3 text-gray-700 dark:text-gray-300"
            >
              <LogIn className="h-5 w-5 mr-2" />
              {t.adminLogin}
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;