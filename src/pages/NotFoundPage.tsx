import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Home, Search } from 'lucide-react';
import translations from '../utils/translations';

const NotFoundPage: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-blue-600">404</h1>
        <h2 className="text-3xl font-bold mt-8 mb-4">{t.pageNotFound}</h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-8">
          {t.pageNotFoundMessage}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Link
            to="/"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md transition-colors duration-300 inline-flex items-center"
          >
            <Home className="w-5 h-5 mr-2" />
            {t.backToHome}
          </Link>
          <Link
            to="/track"
            className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 px-6 py-3 rounded-md transition-colors duration-300 inline-flex items-center"
          >
            <Search className="w-5 h-5 mr-2" />
            {t.trackShipment}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;