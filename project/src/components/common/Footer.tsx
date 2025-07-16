import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext";
import {
  Package,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import translations from "../../utils/translations";

const Footer: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language];

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Package className="h-8 w-8 text-blue-500" />
              <span className="font-bold text-xl text-white">GoExpress</span>
            </div>
            <p className="mb-4 text-gray-400">{t.footerAboutText}</p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">
              {t.quickLinks}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  {t.home}
                </Link>
              </li>
              <li>
                <Link
                  to="/track"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  {t.track}
                </Link>
              </li>
              <li>
                <Link
                  to="/services"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  {t.services}
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  {t.about}
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  {t.contact}
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">
              {t.ourServices}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/services"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  {t.servicePackageTitle}
                </Link>
              </li>
              <li>
                <Link
                  to="/services"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  {t.serviceDeliveryTitle}
                </Link>
              </li>
              <li>
                <Link
                  to="/services"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  {t.serviceGlobalTitle}
                </Link>
              </li>
              <li>
                <Link
                  to="/services"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  {t.serviceExpressTitle}
                </Link>
              </li>
              <li>
                <Link
                  to="/services"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  {t.serviceInsuranceTitle}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">
              {t.contactUs}
            </h3>
            <ul className="space-y-4">
              <li className="flex">
                <MapPin className="h-5 w-5 mr-3 text-blue-500 flex-shrink-0" />
                <span>
                  1070 Park Avenue Suite 56D
                  <br />
                  New York, NY 10128
                  <br />
                  USA.
                  <br />
                  3236+592, V. Goopio Street. <br />
                  Bogo City. Cebu, <br />
                  Philippines.
                </span>
              </li>
              <li className="flex">
                <Phone className="h-5 w-5 mr-3 text-blue-500 flex-shrink-0" />
                <span>
                  +1 (252) 655-2297 <br />
                  +63 90695-05219 <br />
                  WhatsApp:+1 (808) 460-3426
                </span>
              </li>
              <li className="flex">
                <Mail className="h-5 w-5 mr-3 text-blue-500 flex-shrink-0" />
                <span>support@goexpresswideworld.com</span>
              </li>
            </ul>
          </div>
        </div>

        <hr className="border-gray-800 my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center">
          <p>
            &copy; {currentYear} goexpresswideworld {t.allRightsReserved}
          </p>
          <div className="mt-4 md:mt-0 flex space-x-4">
            <Link
              to="/privacy"
              className="text-gray-400 hover:text-white transition-colors duration-200"
            >
              {t.privacyPolicy}
            </Link>
            <Link
              to="/terms"
              className="text-gray-400 hover:text-white transition-colors duration-200"
            >
              {t.termsOfService}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
