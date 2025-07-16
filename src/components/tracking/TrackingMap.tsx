import React from "react";

interface TrackingMapProps {
  shipment: any;
}

const TrackingMap: React.FC<TrackingMapProps> = ({ shipment }) => {
  // In a real implementation, you would use a mapping library like Google Maps, Mapbox, etc.
  // For this example, we'll just display a placeholder image

  // Determine the current location from the tracking history
  const currentEvent =
    shipment.trackingHistory.find(
      (event: any) => event.status === "in_progress"
    ) || shipment.trackingHistory[0];

  const currentLocation = currentEvent?.location || "Unknown";

  // Debug: log tracking history and current location for troubleshooting
  console.log(
    "TrackingMap shipment.trackingHistory:",
    shipment.trackingHistory
  );
  console.log("TrackingMap currentLocation:", currentLocation);

  return (
    <div className="h-64 relative overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-700">
      <img
        src="https://plus.unsplash.com/premium_photo-1712832296690-513c915baaa5?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="Map showing shipment location"
        className="w-full h-full object-cover"
      />

      <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col items-center justify-center text-white">
        <div className="bg-blue-600 text-white px-4 py-2 rounded-full mb-2 animate-bounce">
          {currentLocation}
        </div>
        <p className="text-sm">Current shipment location</p>
      </div>
    </div>
  );
};

export default TrackingMap;
