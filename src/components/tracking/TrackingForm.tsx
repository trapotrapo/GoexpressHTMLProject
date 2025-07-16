import React, { useState } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import { Search } from "lucide-react";
import translations from "../../utils/translations";

interface TrackingFormProps {
  onSubmit: (trackingNumber: string) => void;
  initialValue?: string;
  compact?: boolean;
  className?: string;
}

const TrackingForm: React.FC<TrackingFormProps> = ({
  onSubmit,
  initialValue = "",
  compact = false,
  className = "",
}) => {
  const [trackingNumber, setTrackingNumber] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);

  const { language } = useLanguage();
  const t = translations[language];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!trackingNumber.trim()) {
      setError(t.enterTrackingNumberError);
      return;
    }

    // Basic validation for tracking number format
    // This is a simple example, you can enhance with your tracking number format
    if (trackingNumber.trim().length < 5) {
      setError(t.invalidTrackingNumber);
      return;
    }

    console.log("Tracking number submitted:", trackingNumber.trim()); // Debug log

    setError(null);
    onSubmit(trackingNumber.trim());
  };

  if (compact) {
    return (
      <form
        onSubmit={handleSubmit}
        className={`flex flex-col sm:flex-row gap-2 ${className}`}
      >
        <div className="flex-grow">
          <input
            type="text"
            name="trackingNumber"
            autoComplete="off"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            placeholder={t.enterTrackingNumber}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700"
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-300 flex items-center justify-center sm:justify-start"
        >
          <Search className="w-5 h-5 mr-2" />
          {t.track}
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">{t.trackYourShipment}</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          {t.enterTrackingNumberBelow}
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-grow">
          <input
            type="text"
            name="trackingNumber"
            autoComplete="off"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            placeholder={t.enterTrackingNumber}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700"
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md transition-colors duration-300 flex items-center justify-center sm:justify-start whitespace-nowrap"
        >
          <Search className="w-5 h-5 mr-2" />
          {t.trackShipment}
        </button>
      </div>
    </form>
  );
};

export default TrackingForm;
