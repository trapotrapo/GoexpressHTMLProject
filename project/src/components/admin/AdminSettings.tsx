import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Settings, Bell, Globe, Moon, Sun, Save } from 'lucide-react';
import translations from '../../utils/translations';

const AdminSettings: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const t = translations[language];
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    newShipmentAlerts: true,
    statusChangeAlerts: true,
    deliveryAlerts: true,
    marketingEmails: false
  });
  
  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: theme,
    language: language,
    compactMode: false,
    highContrastMode: false
  });

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
  
  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNotificationSettings(prev => ({ ...prev, [name]: checked }));
  };
  
  const handleAppearanceChange = (name: string, value: any) => {
    setAppearanceSettings(prev => ({ ...prev, [name]: value }));
    
    // Apply changes immediately for some settings
    if (name === 'language') {
      setLanguage(value);
    }
  };
  
  const handleSaveSettings = async () => {
    setLoading(true);
    setMessage(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMessage({ type: 'success', text: t.settingsSavedSuccessfully });
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage({ type: 'error', text: t.errorSavingSettings });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <div className="flex items-center mb-6">
        <Settings className="h-8 w-8 text-blue-600 mr-3" />
        <div>
          <h2 className="text-xl font-semibold">{t.accountSettings}</h2>
          <p className="text-gray-600 dark:text-gray-400">{t.customizeYourExperience}</p>
        </div>
      </div>
      
      {message && (
        <div className={`mb-6 p-4 rounded-md ${
          message.type === 'success' 
            ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800' 
            : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'
        }`}>
          {message.text}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Notification Settings */}
        <div className="bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-md p-4">
          <div className="flex items-center mb-4">
            <Bell className="h-5 w-5 text-blue-600 mr-2" />
            <h3 className="font-semibold">{t.notificationPreferences}</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label htmlFor="emailNotifications" className="text-sm font-medium">
                {t.emailNotifications}
              </label>
              <div className="relative inline-block w-10 align-middle select-none">
                <input
                  type="checkbox"
                  id="emailNotifications"
                  name="emailNotifications"
                  checked={notificationSettings.emailNotifications}
                  onChange={handleNotificationChange}
                  className="sr-only"
                />
                <div className={`block w-10 h-6 rounded-full ${notificationSettings.emailNotifications ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'} transition-colors duration-300`}></div>
                <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 ${notificationSettings.emailNotifications ? 'transform translate-x-4' : ''}`}></div>
              </div>
            </div>
            
            <div className="pl-6 space-y-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="newShipmentAlerts"
                  name="newShipmentAlerts"
                  checked={notificationSettings.newShipmentAlerts}
                  onChange={handleNotificationChange}
                  disabled={!notificationSettings.emailNotifications}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="newShipmentAlerts" className={`ml-2 text-sm ${!notificationSettings.emailNotifications ? 'text-gray-400 dark:text-gray-500' : ''}`}>
                  {t.newShipmentAlerts}
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="statusChangeAlerts"
                  name="statusChangeAlerts"
                  checked={notificationSettings.statusChangeAlerts}
                  onChange={handleNotificationChange}
                  disabled={!notificationSettings.emailNotifications}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="statusChangeAlerts" className={`ml-2 text-sm ${!notificationSettings.emailNotifications ? 'text-gray-400 dark:text-gray-500' : ''}`}>
                  {t.statusChangeAlerts}
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="deliveryAlerts"
                  name="deliveryAlerts"
                  checked={notificationSettings.deliveryAlerts}
                  onChange={handleNotificationChange}
                  disabled={!notificationSettings.emailNotifications}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="deliveryAlerts" className={`ml-2 text-sm ${!notificationSettings.emailNotifications ? 'text-gray-400 dark:text-gray-500' : ''}`}>
                  {t.deliveryAlerts}
                </label>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
              <label htmlFor="marketingEmails" className="text-sm font-medium">
                {t.marketingEmails}
              </label>
              <div className="relative inline-block w-10 align-middle select-none">
                <input
                  type="checkbox"
                  id="marketingEmails"
                  name="marketingEmails"
                  checked={notificationSettings.marketingEmails}
                  onChange={handleNotificationChange}
                  className="sr-only"
                />
                <div className={`block w-10 h-6 rounded-full ${notificationSettings.marketingEmails ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'} transition-colors duration-300`}></div>
                <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 ${notificationSettings.marketingEmails ? 'transform translate-x-4' : ''}`}></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Appearance Settings */}
        <div className="bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-md p-4">
          <div className="flex items-center mb-4">
            <Globe className="h-5 w-5 text-blue-600 mr-2" />
            <h3 className="font-semibold">{t.appearanceAndLanguage}</h3>
          </div>
          
          <div className="space-y-4">
            {/* Theme */}
            <div>
              <label className="block text-sm font-medium mb-2">
                {t.theme}
              </label>
              <div className="flex space-x-4">
                <button
                  onClick={() => {
                    handleAppearanceChange('theme', 'light');
                    if (theme === 'dark') toggleTheme();
                  }}
                  className={`flex items-center px-3 py-2 rounded-md ${
                    appearanceSettings.theme === 'light'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <Sun className="h-4 w-4 mr-2" />
                  {t.lightMode}
                </button>
                
                <button
                  onClick={() => {
                    handleAppearanceChange('theme', 'dark');
                    if (theme === 'light') toggleTheme();
                  }}
                  className={`flex items-center px-3 py-2 rounded-md ${
                    appearanceSettings.theme === 'dark'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <Moon className="h-4 w-4 mr-2" />
                  {t.darkMode}
                </button>
              </div>
            </div>
            
            {/* Language */}
            <div>
              <label htmlFor="language" className="block text-sm font-medium mb-2">
                {t.language}
              </label>
              <select
                id="language"
                value={appearanceSettings.language}
                onChange={(e) => handleAppearanceChange('language', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700"
              >
                {languageOptions.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Display Options */}
            <div>
              <p className="text-sm font-medium mb-2">{t.displayOptions}</p>
              
              <div className="space-y-3 pl-1">
                <div className="flex items-center justify-between">
                  <label htmlFor="compactMode" className="text-sm">
                    {t.compactMode}
                  </label>
                  <div className="relative inline-block w-10 align-middle select-none">
                    <input
                      type="checkbox"
                      id="compactMode"
                      checked={appearanceSettings.compactMode}
                      onChange={(e) => handleAppearanceChange('compactMode', e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`block w-10 h-6 rounded-full ${appearanceSettings.compactMode ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'} transition-colors duration-300`}></div>
                    <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 ${appearanceSettings.compactMode ? 'transform translate-x-4' : ''}`}></div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <label htmlFor="highContrastMode" className="text-sm">
                    {t.highContrastMode}
                  </label>
                  <div className="relative inline-block w-10 align-middle select-none">
                    <input
                      type="checkbox"
                      id="highContrastMode"
                      checked={appearanceSettings.highContrastMode}
                      onChange={(e) => handleAppearanceChange('highContrastMode', e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`block w-10 h-6 rounded-full ${appearanceSettings.highContrastMode ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'} transition-colors duration-300`}></div>
                    <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 ${appearanceSettings.highContrastMode ? 'transform translate-x-4' : ''}`}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSaveSettings}
          disabled={loading}
          className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-300 flex items-center ${
            loading ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {loading ? (
            <>
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
              {t.saving}
            </>
          ) : (
            <>
              <Save className="w-5 h-5 mr-2" />
              {t.saveSettings}
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default AdminSettings;