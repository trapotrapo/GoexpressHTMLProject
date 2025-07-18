import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Package, Search, Truck, Globe, MessageCircle, ChevronRight, Cloud, Users } from 'lucide-react';
import TrackingForm from '../components/tracking/TrackingForm';
import ChatWidget from '../components/chat/ChatWidget';
import HeroImage from '../components/common/HeroImage';
import translations from '../utils/translations';

const HomePage: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language];
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleTrackingSubmit = (trackingNumber: string) => {
    // Navigate to tracking page with the tracking number
    window.location.href = `/track/${trackingNumber}`;
  };
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative">
        <HeroImage />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-blue-800/60 flex items-center">
          <div className="container mx-auto px-4 py-20 md:py-32">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-fade-in">
                {t.heroTitle}
              </h1>
              <p className="text-xl text-white/90 mb-8 animate-fade-in animation-delay-200">
                {t.heroSubtitle}
              </p>
              <TrackingForm 
                onSubmit={handleTrackingSubmit}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg animate-fade-in animation-delay-400" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Cloud Backend Notice */}
      <section className="py-8 bg-green-50 dark:bg-green-900/10 border-b border-green-200 dark:border-green-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center text-center">
            <Cloud className="w-6 h-6 text-green-600 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-green-800 dark:text-green-400">
                🍃 MongoDB Atlas Database
              </h3>
              <p className="text-sm text-green-700 dark:text-green-300">
                Track any shipment from any device, anywhere in the world. All shipments are stored in MongoDB Atlas cloud database - truly global access!
              </p>
            </div>
            <Users className="w-6 h-6 text-green-600 ml-3" />
          </div>
        </div>
      </section>
      {/* Services Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">{t.ourServices}</h2>
          
          {/* Real-time Tracking Info */}
          <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-12">
            <h3 className="text-lg font-semibold mb-4 text-blue-800 dark:text-blue-400">
              {t.realTimeTracking}
            </h3>
            <p className="text-sm text-blue-700 dark:text-blue-300 mb-4">
              {t.realTimeTrackingDescription}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-gray-800 p-4 rounded border flex items-center">
                <Cloud className="w-8 h-8 text-blue-600 mr-3" />
                <div>
                  <div className="font-medium">{t.cloudSync}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">{t.cloudSyncDesc}</div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded border flex items-center">
                <Users className="w-8 h-8 text-blue-600 mr-3" />
                <div>
                  <div className="font-medium">{t.multiDevice}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">{t.multiDeviceDesc}</div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded border flex items-center">
                <Package className="w-8 h-8 text-blue-600 mr-3" />
                <div>
                  <div className="font-medium">{t.allShipments}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">{t.allShipmentsDesc}</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                icon: <Package className="w-12 h-12 text-blue-600" />,
                title: t.servicePackageTitle,
                description: t.servicePackageDesc
              },
              { 
                icon: <Truck className="w-12 h-12 text-blue-600" />,
                title: t.serviceDeliveryTitle,
                description: t.serviceDeliveryDesc
              },
              { 
                icon: <Globe className="w-12 h-12 text-blue-600" />,
                title: t.serviceGlobalTitle,
                description: t.serviceGlobalDesc
              }
            ].map((service, index) => (
              <div 
                key={index} 
                className="bg-gray-50 dark:bg-gray-700 p-8 rounded-lg shadow-md transition-transform duration-300 hover:scale-105"
              >
                <div className="mb-4">{service.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{service.description}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link 
              to="/services" 
              className="inline-flex items-center text-blue-600 dark:text-blue-400 font-medium hover:underline"
            >
              {t.viewAllServices} <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* Tracking CTA Section */}
      <section className="py-16 bg-blue-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">{t.trackShipmentTitle}</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">{t.trackShipmentDesc}</p>
            <Link 
              to="/track" 
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-300 inline-flex items-center"
            >
              <Search className="w-5 h-5 mr-2" />
              {t.trackButtonText}
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">{t.whyChooseUs}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: t.feature1Title, description: t.feature1Desc },
              { title: t.feature2Title, description: t.feature2Desc },
              { title: t.feature3Title, description: t.feature3Desc },
              { title: t.feature4Title, description: t.feature4Desc }
            ].map((feature, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Chat Widget */}
      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg z-50 transition-transform duration-300 hover:scale-110"
        aria-label="Open chat"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
      
      {isChatOpen && <ChatWidget onClose={() => setIsChatOpen(false)} />}
    </div>
  );
};

export default HomePage;