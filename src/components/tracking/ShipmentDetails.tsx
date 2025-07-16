import React from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import { Package, Calendar, MapPin, User, Truck, FileText } from "lucide-react";
import translations from "../../utils/translations";

interface ShipmentDetailsProps {
  shipment: any;
}

const ShipmentDetails: React.FC<ShipmentDetailsProps> = ({ shipment }) => {
  const { language } = useLanguage();
  const t = translations[language];

  // Debug: log shipment data for troubleshooting
  console.log("ShipmentDetails shipment:", shipment);

  // Format date based on language
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    if (language === "fr") {
      return new Intl.DateTimeFormat("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(date);
    } else if (language === "es") {
      return new Intl.DateTimeFormat("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(date);
    } else {
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(date);
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "in_transit":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "processing":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "pending":
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  return (
    <div>
      {/* Tracking and Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
        <div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            {t.trackingNumber}
          </div>
          <div className="text-2xl font-bold font-mono">
            {shipment.trackingNumber}
          </div>
        </div>

        <div className="mt-4 md:mt-0">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            {t.status}
          </div>
          <div
            className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
              shipment.status
            )}`}
          >
            {t[`status_${shipment.status}`] || shipment.status}
          </div>
        </div>
      </div>

      {/* Shipment Info */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">
            {t.shipmentInformation}
          </h3>

          <div className="space-y-3">
            <div className="flex">
              <Package className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {t.packageType}
                </div>
                <div>{shipment.packageType}</div>
              </div>
            </div>

            <div className="flex">
              <Calendar className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {t.shipDate}
                </div>
                <div>{formatDate(shipment.shipDate)}</div>
              </div>
            </div>

            <div className="flex">
              <Calendar className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {t.estimatedDelivery}
                </div>
                <div>{formatDate(shipment.estimatedDelivery)}</div>
              </div>
            </div>

            <div className="flex">
              <Truck className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {t.serviceType}
                </div>
                <div>{shipment.serviceType}</div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">{t.addressInformation}</h3>

          <div className="space-y-4">
            <div>
              <div className="flex items-center mb-2">
                <MapPin className="w-5 h-5 text-blue-600 mr-2" />
                <h4 className="font-medium">{t.origin}</h4>
              </div>
              <div className="ml-7 text-gray-600 dark:text-gray-400">
                <p>{shipment.origin.address}</p>
                <p>
                  {shipment.origin.city}, {shipment.origin.state}{" "}
                  {shipment.origin.zip}
                </p>
                <p>{shipment.origin.country}</p>
              </div>
            </div>

            <div>
              <div className="flex items-center mb-2">
                <MapPin className="w-5 h-5 text-blue-600 mr-2" />
                <h4 className="font-medium">{t.destination}</h4>
              </div>
              <div className="ml-7 text-gray-600 dark:text-gray-400">
                <p>{shipment.destination.address}</p>
                <p>
                  {shipment.destination.city}, {shipment.destination.state}{" "}
                  {shipment.destination.zip}
                </p>
                <p>{shipment.destination.country}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Details */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">{t.senderInformation}</h3>

          <div className="flex">
            <User className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
            <div className="text-gray-600 dark:text-gray-400">
              <p>{shipment.sender.name}</p>
              <p>{shipment.sender.phone}</p>
              <p>{shipment.sender.email}</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">
            {t.receiverInformation}
          </h3>

          <div className="flex">
            <User className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
            <div className="text-gray-600 dark:text-gray-400">
              <p>{shipment.receiver.name}</p>
              <p>{shipment.receiver.phone}</p>
              <p>{shipment.receiver.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Package Details Section */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <FileText className="w-5 h-5 text-blue-600 mr-2" />
          {t.packageDetails}
        </h3>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                <th className="px-4 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t.description}
                </th>
                <th className="px-4 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t.quantity}
                </th>
                <th className="px-4 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t.weight}
                </th>
                <th className="px-4 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t.dimensions}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {shipment.items.map((item: any, index: number) => (
                <tr
                  key={index}
                  className={
                    index % 2 === 0
                      ? "bg-white dark:bg-gray-800"
                      : "bg-gray-50 dark:bg-gray-700"
                  }
                >
                  <td className="px-4 py-3 whitespace-nowrap">
                    {item.description}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {item.quantity}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {item.weight} {item.weightUnit}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {item.dimensions}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ShipmentDetails;
