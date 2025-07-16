import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Truck, Award, Clock, Globe, Users, ShieldCheck } from 'lucide-react';
import translations from '../utils/translations';

const AboutPage: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">{t.aboutUs}</h1>
        
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t.ourStory}</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            {t.aboutStoryPara1}
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            {t.aboutStoryPara2}
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <Award className="mr-3 text-blue-600" /> {t.ourMission}
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              {t.missionStatement}
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <ShieldCheck className="mr-3 text-blue-600" /> {t.ourValues}
            </h2>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 rounded-full bg-blue-600 mt-2 mr-2"></span>
                {t.value1}
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 rounded-full bg-blue-600 mt-2 mr-2"></span>
                {t.value2}
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 rounded-full bg-blue-600 mt-2 mr-2"></span>
                {t.value3}
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 rounded-full bg-blue-600 mt-2 mr-2"></span>
                {t.value4}
              </li>
            </ul>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-semibold mb-6">{t.whyChooseUs}</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { 
                icon: <Clock className="w-10 h-10 text-blue-600" />, 
                title: t.benefitTimely, 
                description: t.benefitTimelyDesc 
              },
              { 
                icon: <Globe className="w-10 h-10 text-blue-600" />, 
                title: t.benefitGlobal, 
                description: t.benefitGlobalDesc 
              },
              { 
                icon: <ShieldCheck className="w-10 h-10 text-blue-600" />, 
                title: t.benefitSecure, 
                description: t.benefitSecureDesc
              },
              { 
                icon: <Truck className="w-10 h-10 text-blue-600" />, 
                title: t.benefitReliable, 
                description: t.benefitReliableDesc 
              },
              { 
                icon: <Users className="w-10 h-10 text-blue-600" />, 
                title: t.benefitSupport, 
                description: t.benefitSupportDesc 
              },
              { 
                icon: <Award className="w-10 h-10 text-blue-600" />, 
                title: t.benefitInnovative, 
                description: t.benefitInnovativeDesc 
              }
            ].map((benefit, index) => (
              <div key={index} className="flex flex-col items-center text-center p-4">
                <div className="mb-3">{benefit.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;