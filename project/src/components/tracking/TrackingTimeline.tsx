import React from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import { CheckCircle, Circle, Clock, MapPin } from "lucide-react";
import translations from "../../utils/translations";

interface TrackingTimelineProps {
  shipment: any;
}

const TrackingTimeline: React.FC<TrackingTimelineProps> = ({ shipment }) => {
  const { language } = useLanguage();
  const t = translations[language];

  // Debug: log tracking history for troubleshooting
  console.log(
    "TrackingTimeline shipment.trackingHistory:",
    shipment.trackingHistory
  );

  // Format date based on language
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    if (language === "fr") {
      return new Intl.DateTimeFormat("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
    } else if (language === "es") {
      return new Intl.DateTimeFormat("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
    } else {
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
    }
  };

  // Get icon based on status
  const getStatusIcon = (status: string, completed: boolean) => {
    if (completed) {
      return <CheckCircle className="w-6 h-6 text-green-600" />;
    } else if (status === "in_progress") {
      return <Clock className="w-6 h-6 text-blue-600 animate-pulse" />;
    } else {
      return <Circle className="w-6 h-6 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {shipment.trackingHistory.map((event: any, index: number) => {
        const isCompleted = event.status === "completed";
        const isInProgress = event.status === "in_progress";
        const isPending = event.status === "pending";

        return (
          <div key={index} className="relative pl-8">
            {/* Status icon */}
            <div className="absolute left-0 top-0">
              {getStatusIcon(event.status, isCompleted)}
            </div>

            {/* Connecting line */}
            {index < shipment.trackingHistory.length - 1 && (
              <div
                className={`absolute left-3 top-6 bottom-0 w-0.5 ${
                  isCompleted
                    ? "bg-green-600"
                    : isInProgress
                    ? "bg-blue-600"
                    : "bg-gray-300"
                }`}
              ></div>
            )}

            {/* Event details */}
            <div
              className={`transition-opacity duration-300 ${
                isPending ? "opacity-50" : "opacity-100"
              }`}
            >
              <div className="flex items-center">
                <h4
                  className={`font-semibold ${
                    isCompleted
                      ? "text-green-700 dark:text-green-500"
                      : isInProgress
                      ? "text-blue-700 dark:text-blue-500"
                      : "text-gray-500"
                  }`}
                >
                  {t[`status_${event.statusCode}`] || event.status}
                </h4>
              </div>

              <div className="mt-1 flex items-start">
                <MapPin className="w-4 h-4 text-gray-500 mr-1 mt-0.5 flex-shrink-0" />
                <span className="text-gray-600 dark:text-gray-400">
                  {event.location}
                </span>
              </div>

              <p className="text-sm text-gray-500 mt-1">
                {formatDate(event.timestamp)}
              </p>

              {event.details && (
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  {event.details}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TrackingTimeline;
