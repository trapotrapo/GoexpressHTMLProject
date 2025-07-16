import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import {
  Package, List, PlusCircle, User, Settings, LogOut, X
} from 'lucide-react';
import translations from '../../utils/translations';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, onClose }) => {
  const { logout } = useAuth();
  const { language } = useLanguage();
  const location = useLocation();
  const t = translations[language];

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  const navItems = [
    { 
      path: '/admin/dashboard', 
      label: t.dashboard, 
      icon: <List className="w-5 h-5" /> 
    },
    { 
      path: '/admin/shipments', 
      label: t.shipments, 
      icon: <Package className="w-5 h-5" /> 
    },
    { 
      path: '/admin/shipments/new', 
      label: t.newShipment, 
      icon: <PlusCircle className="w-5 h-5" /> 
    },
    { 
      path: '/admin/profile', 
      label: t.profile, 
      icon: <User className="w-5 h-5" /> 
    },
    { 
      path: '/admin/settings', 
      label: t.settings, 
      icon: <Settings className="w-5 h-5" /> 
    }
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40" 
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 w-64 bg-gray-800 text-white transform transition-transform duration-300 ease-in-out z-50 md:relative md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Close button for mobile */}
        <button 
          className="md:hidden absolute top-4 right-4 text-gray-400 hover:text-white" 
          onClick={onClose}
        >
          <X className="h-6 w-6" />
        </button>

        {/* Logo */}
        <div className="flex items-center justify-center h-16 border-b border-gray-700">
          <Package className="h-8 w-8 text-blue-500 mr-2" />
          <span className="text-xl font-bold">GoExpress Admin</span>
        </div>

        {/* Navigation */}
        <nav className="mt-8 px-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center px-4 py-3 rounded-md transition-colors duration-200 ${
                    isActive(item.path)
                      ? 'bg-blue-700 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-700'
                  }`}
                  onClick={onClose}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout button */}
        <div className="absolute bottom-0 w-full px-4 py-4 border-t border-gray-700">
          <button
            onClick={logout}
            className="flex items-center px-4 py-3 w-full text-left text-gray-400 hover:text-white hover:bg-gray-700 rounded-md transition-colors duration-200"
          >
            <LogOut className="w-5 h-5 mr-3" />
            <span>{t.logout}</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;