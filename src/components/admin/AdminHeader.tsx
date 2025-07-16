import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Bell, Moon, Sun, Globe, ChevronDown, User } from 'lucide-react';
import translations from '../../utils/translations';

const AdminHeader: React.FC = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const navigate = useNavigate();
  
  const t = translations[language];
  
  const [notificationsOpen, setNotificationsOpen] = React.useState(false);
  const [profileOpen, setProfileOpen] = React.useState(false);
  const [languageOpen, setLanguageOpen] = React.useState(false);
  
  // Mock notifications
  const notifications = [
    { id: 1, message: t.newShipmentNotification, time: '5m', read: false },
    { id: 2, message: t.statusUpdateNotification, time: '1h', read: false },
    { id: 3, message: t.deliveredNotification, time: '3h', read: true }
  ];

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
    <header className="bg-white dark:bg-gray-800 shadow-sm px-6 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t.adminDashboard}</h1>
        
        <div className="flex items-center space-x-4">
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
              onClick={() => setLanguageOpen(!languageOpen)}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center space-x-1"
              aria-label={t.changeLanguage}
            >
              <Globe className="h-5 w-5" />
              <span className="text-sm">{currentLanguage?.flag}</span>
            </button>
            
            {languageOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 ring-1 ring-black ring-opacity-5 max-h-80 overflow-y-auto">
                {languageOptions.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
                      setLanguageOpen(false);
                    }}
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
          
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 relative"
              aria-label={t.notifications}
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white dark:border-gray-800"></span>
            </button>
            
            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 ring-1 ring-black ring-opacity-5">
                <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-sm font-semibold">{t.notifications}</h3>
                </div>
                
                <div className="max-h-60 overflow-y-auto">
                  {notifications.length > 0 ? (
                    <div>
                      {notifications.map((notification) => (
                        <div 
                          key={notification.id}
                          className={`px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer ${
                            !notification.read ? 'bg-blue-50 dark:bg-blue-900/10' : ''
                          }`}
                        >
                          <div className="flex justify-between">
                            <p className="text-sm">{notification.message}</p>
                            <span className="text-xs text-gray-500">{notification.time}</span>
                          </div>
                          {!notification.read && (
                            <div className="mt-1 w-2 h-2 bg-blue-600 rounded-full"></div>
                          )}
                        </div>
                      ))}
                      
                      <div className="px-4 py-2 text-center border-t border-gray-200 dark:border-gray-700">
                        <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                          {t.viewAllNotifications}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="px-4 py-6 text-center text-gray-500">
                      <p>{t.noNotifications}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          
          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center space-x-2 focus:outline-none"
              aria-label={t.userProfile}
            >
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                <User className="h-5 w-5" />
              </div>
              <span className="hidden md:block font-medium">{user?.name || 'Admin'}</span>
              <ChevronDown className="h-4 w-4" />
            </button>
            
            {profileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 ring-1 ring-black ring-opacity-5">
                <button
                  onClick={() => {
                    navigate('/admin/profile');
                    setProfileOpen(false);
                  }}
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                >
                  {t.profile}
                </button>
                <button
                  onClick={() => {
                    navigate('/admin/settings');
                    setProfileOpen(false);
                  }}
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                >
                  {t.settings}
                </button>
                <div className="border-t border-gray-200 dark:border-gray-700"></div>
                <button
                  onClick={() => {
                    // Handle logout logic
                    navigate('/admin/login');
                    setProfileOpen(false);
                  }}
                  className="block px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                >
                  {t.logout}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;