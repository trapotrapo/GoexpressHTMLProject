import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Package, Truck, Globe, Clock, Award, Shield, ShieldCheck } from 'lucide-react';
import translations from '../utils/translations';

const ServicesPage: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language];

  const services = [
    {
      icon: <Package className="w-12 h-12 text-blue-600" />,
      title: t.servicePackageTitle,
      description: t.servicePackageFullDesc,
      features: [
        t.servicePackageFeature1,
        t.servicePackageFeature2,
        t.servicePackageFeature3,
        t.servicePackageFeature4
      ]
    },
    {
      icon: <Truck className="w-12 h-12 text-blue-600" />,
      title: t.serviceDeliveryTitle,
      description: t.serviceDeliveryFullDesc,
      features: [
        t.serviceDeliveryFeature1,
        t.serviceDeliveryFeature2,
        t.serviceDeliveryFeature3,
        t.serviceDeliveryFeature4
      ]
    },
    {
      icon: <Globe className="w-12 h-12 text-blue-600" />,
      title: t.serviceGlobalTitle,
      description: t.serviceGlobalFullDesc,
      features: [
        t.serviceGlobalFeature1,
        t.serviceGlobalFeature2,
        t.serviceGlobalFeature3,
        t.serviceGlobalFeature4
      ]
    },
    {
      icon: <Clock className="w-12 h-12 text-blue-600" />,
      title: t.serviceExpressTitle,
      description: t.serviceExpressFullDesc,
      features: [
        t.serviceExpressFeature1,
        t.serviceExpressFeature2,
        t.serviceExpressFeature3,
        t.serviceExpressFeature4
      ]
    },
    {
      icon: <ShieldCheck className="w-12 h-12 text-blue-600" />,
      title: t.serviceInsuranceTitle,
      description: t.serviceInsuranceFullDesc,
      features: [
        t.serviceInsuranceFeature1,
        t.serviceInsuranceFeature2,
        t.serviceInsuranceFeature3,
        t.serviceInsuranceFeature4
      ]
    },
    {
      icon: <Award className="w-12 h-12 text-blue-600" />,
      title: t.servicePremiumTitle,
      description: t.servicePremiumFullDesc,
      features: [
        t.servicePremiumFeature1,
        t.servicePremiumFeature2,
        t.servicePremiumFeature3,
        t.servicePremiumFeature4
      ]
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">{t.ourServices}</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-12">{t.servicesSubtitle}</p>
        
        <div className="space-y-12">
          {services.map((service, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/3 bg-blue-50 dark:bg-blue-900/20 p-8 flex flex-col items-center justify-center text-center">
                  <div className="mb-4">{service.icon}</div>
                  <h2 className="text-2xl font-bold">{service.title}</h2>
                </div>
                
                <div className="md:w-2/3 p-8">
                  <p className="text-gray-700 dark:text-gray-300 mb-6">{service.description}</p>
                  
                  <h3 className="text-lg font-semibold mb-4">{t.keyFeatures}</h3>
                  <ul className="space-y-3">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <Shield className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;