import React from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import {
  Package,
  Calendar,
  MapPin,
  User,
  Truck,
  FileText,
  Phone,
  Mail,
} from "lucide-react";
import translations from "../../utils/translations";

interface ShipmentReceiptProps {
  shipment: any;
}

const ShipmentReceipt: React.FC<ShipmentReceiptProps> = ({ shipment }) => {
  const { language } = useLanguage();
  const t = translations[language];

  // Format date based on language
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    const locales = {
      en: "en-US",
      fr: "fr-FR",
      es: "es-ES",
      pt: "pt-BR",
      da: "da-DK",
      nl: "nl-NL",
      ru: "ru-RU",
      ar: "ar-SA",
      zh: "zh-CN",
      ko: "ko-KR",
    };

    return new Intl.DateTimeFormat(locales[language] || "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(language === "en" ? "en-US" : language, {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Calculate shipping cost based on service type and weight
  const calculateShippingCost = () => {
    const totalWeight = shipment.items.reduce(
      (sum: number, item: any) => sum + item.weight,
      0
    );
    const baseRate =
      {
        standard: 5.99,
        express: 12.99,
        overnight: 24.99,
        international: 19.99,
      }[shipment.serviceType] || 5.99;

    return baseRate + totalWeight * 2.5;
  };

  const shippingCost = calculateShippingCost();
  const insurance = shippingCost * 0.02; // 2% insurance
  const tax = (shippingCost + insurance) * 0.08; // 8% tax
  const total = shippingCost + insurance + tax;

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 print:p-6 print:shadow-none shadow-lg">
      {/* Header with Company Logo */}
      <div className="border-b-2 border-blue-600 pb-6 mb-6">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <Package className="h-12 w-12 text-blue-600 mr-4" />
            <div>
              <h1 className="text-3xl font-bold text-blue-600">GoExpress</h1>
              <p className="text-gray-600">{t.globalShippingSolutions}</p>
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-bold text-gray-800">
              {t.shippingReceipt}
            </h2>
            <p className="text-gray-600">
              {t.trackingNumber}:{" "}
              <span className="font-mono font-bold">
                {shipment.trackingNumber}
              </span>
            </p>
            <p className="text-gray-600">{formatDate(shipment.shipDate)}</p>
          </div>
        </div>
      </div>

      {/* Company Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="text-lg font-semibold mb-3 text-blue-600">
            {t.companyInformation}
          </h3>
          <div className="space-y-2">
            <p className="font-semibold">GoExpresswideworld</p>
            <p>
              1070 Park Ave. <br />
              Suite 56D New York, NY 10128
              <br />
              United States
              <br />
              <br />
              3236+592, V. Goopio Street,
              <br />
              Bogo City, Cebu, 6010
              <br />
              Philippines
              <br />
            </p>
            <div className="flex items-center mt-2">
              <Phone className="w-4 h-4 mr-2 text-blue-600" />
              <span>+1 (252) 655-2297</span>
            </div>
            <div className="flex items-center">
              <Mail className="w-4 h-4 mr-2 text-blue-600" />
              <span>support@goexpresswideworld.com</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3 text-blue-600">
            {t.shipmentSummary}
          </h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">{t.status}:</span>
                <p className="font-semibold capitalize">
                  {t[`status_${shipment.status}`] || shipment.status}
                </p>
              </div>
              <div>
                <span className="text-gray-600">{t.serviceType}:</span>
                <p className="font-semibold capitalize">
                  {shipment.serviceType}
                </p>
              </div>
              <div>
                <span className="text-gray-600">{t.packageType}:</span>
                <p className="font-semibold">{shipment.packageType}</p>
              </div>
              <div>
                <span className="text-gray-600">{t.estimatedDelivery}:</span>
                <p className="font-semibold">
                  {formatDate(shipment.estimatedDelivery)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sender and Receiver Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center text-blue-600">
            <User className="w-5 h-5 mr-2" />
            {t.senderInformation}
          </h3>
          <div className="space-y-2">
            <p className="font-semibold">{shipment.sender.name}</p>
            <p>{shipment.origin.address}</p>
            <p>
              {shipment.origin.city}, {shipment.origin.state}{" "}
              {shipment.origin.zip}
            </p>
            <p>{shipment.origin.country}</p>
            <div className="pt-2 border-t border-gray-200 mt-3">
              <p className="text-sm text-gray-600">
                {t.phoneNumber}: {shipment.sender.phone}
              </p>
              <p className="text-sm text-gray-600">
                {t.email}: {shipment.sender.email}
              </p>
            </div>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center text-blue-600">
            <MapPin className="w-5 h-5 mr-2" />
            {t.receiverInformation}
          </h3>
          <div className="space-y-2">
            <p className="font-semibold">{shipment.receiver.name}</p>
            <p>{shipment.destination.address}</p>
            <p>
              {shipment.destination.city}, {shipment.destination.state}{" "}
              {shipment.destination.zip}
            </p>
            <p>{shipment.destination.country}</p>
            <div className="pt-2 border-t border-gray-200 mt-3">
              <p className="text-sm text-gray-600">
                {t.phoneNumber}: {shipment.receiver.phone}
              </p>
              <p className="text-sm text-gray-600">
                {t.email}: {shipment.receiver.email}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Package Details */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 flex items-center text-blue-600">
          <FileText className="w-5 h-5 mr-2" />
          {t.packageDetails}
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  {t.description}
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  {t.quantity}
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  {t.weight}
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  {t.dimensions}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {shipment.items.map((item: any, index: number) => (
                <tr key={index}>
                  <td className="px-4 py-3">{item.description}</td>
                  <td className="px-4 py-3">{item.quantity}</td>
                  <td className="px-4 py-3">
                    {item.weight} {item.weightUnit}
                  </td>
                  <td className="px-4 py-3">{item.dimensions}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>


      {/* Cost Summary
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 text-blue-600">
          {t.shippingCosts}
        </h3>
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>{t.shippingFee}:</span>
              <span>{formatCurrency(shippingCost)}</span>
            </div>
            <div className="flex justify-between">
              <span>{t.insurance}:</span>
              <span>{formatCurrency(insurance)}</span>
            </div>
            <div className="flex justify-between">
              <span>{t.tax}:</span>
              <span>{formatCurrency(tax)}</span>
            </div>
            <div className="border-t border-gray-300 pt-3">
              <div className="flex justify-between font-bold text-lg">
                <span>{t.total}:</span>
                <span className="text-blue-600">{formatCurrency(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>*/}

      {/* Tracking History */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 text-blue-600">
          {t.trackingHistory}
        </h3>
        <div className="space-y-3">
          {shipment.trackingHistory.map((event: any, index: number) => (
            <div key={index} className="border-l-4 border-blue-600 pl-4 py-2">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold">
                    {t[`status_${event.statusCode}`] || event.statusCode}
                  </p>
                  <p className="text-sm text-gray-600">{event.location}</p>
                  <p className="text-sm text-gray-500">{event.details}</p>
                </div>
                <span className="text-sm text-gray-500">
                  {formatDate(event.timestamp)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 pt-6 text-center text-sm text-gray-600">
        <p className="mb-2">{t.receiptFooterText}</p>
        <p>{t.customerServiceText}: support@goexpresswideworld.com | +1 (252) 655-2297</p>
        <p className="mt-2">
          © 2025 goexpresswideworld. {t.allRightsReserved}
        </p>
      </div>
    </div>
  );
};

export default ShipmentReceipt;
