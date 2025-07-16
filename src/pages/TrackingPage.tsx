import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { useShipment } from "../contexts/ShipmentContext";
import { Package, Printer, ExternalLink, AlertTriangle } from "lucide-react";
import TrackingForm from "../components/tracking/TrackingForm";
import TrackingTimeline from "../components/tracking/TrackingTimeline";
import TrackingMap from "../components/tracking/TrackingMap";
import ShipmentDetails from "../components/tracking/ShipmentDetails";
import LoadingSpinner from "../components/common/LoadingSpinner";
import translations from "../utils/translations";

const TrackingPage: React.FC = () => {
  const { trackingNumber } = useParams<{ trackingNumber?: string }>();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { getShipment } = useShipment();
  const t = translations[language];

  const [shipment, setShipment] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (trackingNumber) {
      fetchShipment(trackingNumber);
    }
  }, [trackingNumber]);

  const fetchShipment = async (trackingNum: string) => {
    setLoading(true);
    setError(null);

    console.log("Fetching shipment for tracking number:", trackingNum); // Debug log

    try {
      const result = await getShipment(trackingNum);

      console.log("Fetched shipment result:", result); // Debug log

      if (result) {
        setShipment(result);
        console.log("Shipment state set:", result); // Debug log
      } else {
        setError(t.noShipmentFound);
      }
    } catch (err) {
      setError(t.errorFetchingShipment);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSearch = (trackingNum: string) => {
    navigate(`/track/${trackingNum}`);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 flex items-center">
          <Package className="mr-3 text-blue-600" /> {t.trackShipment}
        </h1>

        {!trackingNumber && (
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">
              {t.enterTrackingNumber}
            </h2>
            <TrackingForm onSubmit={handleSearch} />
          </div>
        )}

        {trackingNumber && (
          <div className="mb-6">
            <TrackingForm
              initialValue={trackingNumber}
              onSubmit={handleSearch}
              compact={true}
            />
          </div>
        )}

        {loading && (
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md text-center">
            <LoadingSpinner size="large" />
            <p className="mt-4 text-gray-600 dark:text-gray-300">
              {t.loadingShipment}
            </p>
          </div>
        )}

        {error && (
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
            <div className="flex items-center text-red-500 mb-4">
              <AlertTriangle className="mr-2" />
              <h2 className="text-xl font-semibold">{t.trackingError}</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
            <p className="text-gray-600 dark:text-gray-300">
              {t.tryAgainLater}
            </p>
          </div>
        )}

        {shipment && !loading && !error && (
          <div className="print:block">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6 print:shadow-none">
              <div className="flex justify-between items-center mb-4 print:hidden">
                <h2 className="text-xl font-semibold">{t.shipmentDetails}</h2>
                <div className="flex space-x-2">
                  <button
                    onClick={handlePrint}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center transition-colors duration-300"
                  >
                    <Printer className="w-4 h-4 mr-2" />
                    {t.printDetails}
                  </button>
                  <button
                    onClick={() =>
                      window.open(`/track/${trackingNumber}`, "_blank")
                    }
                    className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 px-4 py-2 rounded flex items-center transition-colors duration-300"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    {t.openInNewTab}
                  </button>
                </div>
              </div>

              <div className="print:block">
                <ShipmentDetails shipment={shipment} />
              </div>
            </div>

            <div className="print:hidden">
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold mb-4">
                    {t.shipmentProgress}
                  </h3>
                  <TrackingTimeline shipment={shipment} />
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold mb-4">
                    {t.deliveryLocation}
                  </h3>
                  <TrackingMap shipment={shipment} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackingPage;
