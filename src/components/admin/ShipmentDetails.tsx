import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useShipment } from "../../contexts/ShipmentContext";
import { useLanguage } from "../../contexts/LanguageContext";
import {
  Package,
  Edit,
  ArrowLeft,
  Trash,
  Clock,
  Plus,
  AlertTriangle,
  CheckCheck,
  Printer,
  MapPin,
  Receipt,
} from "lucide-react";
import TrackingTimeline from "../tracking/TrackingTimeline";
import ShipmentDetailsView from "../tracking/ShipmentDetails";
import ShipmentReceipt from "../tracking/ShipmentReceipt";
import translations from "../../utils/translations";

const AdminShipmentDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    getShipment,
    deleteShipment,
    updateShipmentStatus,
    addTrackingEvent,
    updateShipmentLocation,
  } = useShipment();
  const { language } = useLanguage();
  const t = translations[language];

  const [shipment, setShipment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showReceipt, setShowReceipt] = useState(false);

  const [showAddEvent, setShowAddEvent] = useState(false);
  const [showLocationUpdate, setShowLocationUpdate] = useState(false);
  const [newEvent, setNewEvent] = useState({
    status: "in_progress",
    statusCode: "status_update",
    location: "",
    details: "",
  });

  const [locationUpdate, setLocationUpdate] = useState({
    location: "",
    details: "",
  });

  useEffect(() => {
    fetchShipment();
  }, [id]);

  const fetchShipment = async () => {
    setLoading(true);
    try {
      const data = await getShipment(id || "");
      if (data) {
        setShipment(data);
        // Set current location for update form
        if (data.trackingHistory && data.trackingHistory.length > 0) {
          setLocationUpdate({
            location: data.trackingHistory[0].location,
            details: "",
          });
        }
      } else {
        setError(t.shipmentNotFound);
      }
    } catch (error) {
      console.error("Error fetching shipment:", error);
      setError(t.errorFetchingShipment);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(t.confirmDelete)) {
      try {
        await deleteShipment(id || "");
        navigate("/admin/shipments");
      } catch (error) {
        console.error("Error deleting shipment:", error);
        alert(t.errorDeletingShipment);
      }
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      await updateShipmentStatus(id || "", newStatus);

      // Update local state
      setShipment((prev) => ({
        ...prev,
        status: newStatus,
      }));

      // Add a tracking event for the status change
      const statusCode = `${newStatus}`;
      const location =
        shipment.trackingHistory[0]?.location ||
        `${shipment.origin.city}, ${shipment.origin.country}`;

      await addTrackingEvent(id || "", {
        status: "completed",
        statusCode,
        location,
        timestamp: new Date().toISOString(),
        details: t[`status_${newStatus}`] || t.statusUpdated,
      });

      // Refresh shipment data to get the new tracking event
      fetchShipment();
    } catch (error) {
      console.error("Error updating status:", error);
      alert(t.errorUpdatingStatus);
    }
  };

  const handleAddEvent = async () => {
    try {
      console.log("Adding tracking event:", {
        ...newEvent,
        timestamp: new Date().toISOString(),
      }); // Debug log
      await addTrackingEvent(id || "", {
        ...newEvent,
        timestamp: new Date().toISOString(),
      });

      setShowAddEvent(false);
      setNewEvent({
        status: "in_progress",
        statusCode: "status_update",
        location: "",
        details: "",
      });

      // Refresh shipment data
      fetchShipment();
    } catch (error) {
      console.error("Error adding tracking event:", error);
      alert(t.errorAddingTrackingEvent);
    }
  };

  const handleLocationUpdate = async () => {
    try {
      await updateShipmentLocation(
        id || "",
        locationUpdate.location,
        locationUpdate.details
      );

      setShowLocationUpdate(false);
      setLocationUpdate({
        location: "",
        details: "",
      });

      // Refresh shipment data
      fetchShipment();
    } catch (error) {
      console.error("Error updating location:", error);
      alert(t.errorUpdatingLocation);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "in_transit":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "processing":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "label_created":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400";
      case "On_Hold":
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
          <div className="h-60 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div className="flex items-center text-red-500 mb-4">
          <AlertTriangle className="mr-2" />
          <h2 className="text-xl font-semibold">{t.error}</h2>
        </div>
        <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
        <button
          onClick={() => navigate("/admin/shipments")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-300 flex items-center"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          {t.backToShipments}
        </button>
      </div>
    );
  }

  if (!shipment) {
    return null;
  }

  if (showReceipt) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-6 print:hidden">
          <button
            onClick={() => setShowReceipt(false)}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 flex items-center"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            {t.backToDetails}
          </button>

          <button
            onClick={handlePrint}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-300 flex items-center"
          >
            <Printer className="w-5 h-5 mr-2" />
            {t.printReceipt}
          </button>
        </div>

        <ShipmentReceipt shipment={shipment} />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <button
            onClick={() => navigate("/admin/shipments")}
            className="mr-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-semibold">
            <Package className="inline-block mr-2" />
            {t.shipmentDetails}: {shipment.trackingNumber}
          </h2>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={() => setShowReceipt(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors duration-300 flex items-center"
          >
            <Receipt className="w-5 h-5 mr-2" />
            {t.viewReceipt}
          </button>

          <button
            onClick={handlePrint}
            className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-md transition-colors duration-300 flex items-center"
          >
            <Printer className="w-5 h-5 mr-2" />
            {t.print}
          </button>

          <Link
            to={`/admin/shipments/${id}/edit`}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md transition-colors duration-300 flex items-center"
          >
            <Edit className="w-5 h-5 mr-2" />
            {t.edit}
          </Link>

          <button
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors duration-300 flex items-center"
          >
            <Trash className="w-5 h-5 mr-2" />
            {t.delete}
          </button>
        </div>
      </div>

      {/* Status and Actions Section */}
      <div className="bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-md p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-4 md:mb-0">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              {t.currentStatus}
            </div>
            <div
              className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                shipment.status
              )}`}
            >
              {t[`status_${shipment.status}`] || shipment.status}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleStatusChange("pending")}
              className={`px-3 py-1 rounded-md text-sm ${
                shipment.status === "pending"
                  ? "bg-gray-700 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              {t.status_pending}
            </button>
            <button
              onClick={() => handleStatusChange("label_created")}
              className={`px-3 py-1 rounded-md text-sm ${
                shipment.status === "label_created"
                  ? "bg-purple-700 text-white"
                  : "bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-900/30"
              }`}
            >
              {t.status_label_created}
            </button>
            <button
              onClick={() => handleStatusChange("processing")}
              className={`px-3 py-1 rounded-md text-sm ${
                shipment.status === "processing"
                  ? "bg-yellow-700 text-white"
                  : "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400 hover:bg-yellow-200 dark:hover:bg-yellow-900/30"
              }`}
            >
              {t.status_processing}
            </button>
            <button
              onClick={() => handleStatusChange("in_transit")}
              className={`px-3 py-1 rounded-md text-sm ${
                shipment.status === "in_transit"
                  ? "bg-blue-700 text-white"
                  : "bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/30"
              }`}
            >
              {t.status_in_transit}
            </button>
            <button
              onClick={() => handleStatusChange("delivered")}
              className={`px-3 py-1 rounded-md text-sm ${
                shipment.status === "delivered"
                  ? "bg-green-700 text-white"
                  : "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/30"
              }`}
            >
              {t.status_delivered}
            </button>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Shipment Details */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md p-4">
          <h3 className="font-semibold mb-4">{t.shipmentDetails}</h3>
          <ShipmentDetailsView shipment={shipment} />
        </div>

        {/* Tracking History */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">{t.trackingHistory}</h3>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowLocationUpdate(!showLocationUpdate)}
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm transition-colors duration-300 flex items-center"
              >
                <MapPin className="w-4 h-4 mr-1" />
                {t.updateLocation}
              </button>
              <button
                onClick={() => setShowAddEvent(!showAddEvent)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm transition-colors duration-300 flex items-center"
              >
                <Plus className="w-4 h-4 mr-1" />
                {t.addEvent}
              </button>
            </div>
          </div>

          {showLocationUpdate && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-md">
              <h4 className="font-medium mb-3">{t.updateShipmentLocation}</h4>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t.newLocation}
                  </label>
                  <input
                    type="text"
                    value={locationUpdate.location}
                    onChange={(e) =>
                      setLocationUpdate({
                        ...locationUpdate,
                        location: e.target.value,
                      })
                    }
                    placeholder={t.enterNewLocation}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t.details}
                  </label>
                  <textarea
                    value={locationUpdate.details}
                    onChange={(e) =>
                      setLocationUpdate({
                        ...locationUpdate,
                        details: e.target.value,
                      })
                    }
                    placeholder={t.enterLocationDetails}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700"
                    required
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={handleLocationUpdate}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors duration-300 flex items-center"
                  >
                    <MapPin className="w-5 h-5 mr-2" />
                    {t.updateLocation}
                  </button>

                  <button
                    onClick={() => setShowLocationUpdate(false)}
                    className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-md transition-colors duration-300"
                  >
                    {t.cancel}
                  </button>
                </div>
              </div>
            </div>
          )}

          {showAddEvent && (
            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-md">
              <h4 className="font-medium mb-3">{t.addNewTrackingEvent}</h4>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t.status}
                  </label>
                  <select
                    value={newEvent.status}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, status: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700"
                  >
                    <option value="completed">{t.completed}</option>
                    <option value="in_progress">{t.inProgress}</option>
                    <option value="on_hold">{t.pending}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t.eventType}
                  </label>
                  <select
                    value={newEvent.statusCode}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, statusCode: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700"
                  >
                    <option value="status_update">{t.statusUpdate}</option>
                    <option value="on_hold">{t.status_pending}</option>
                    <option value="label_created">
                      {t.status_label_created}
                    </option>
                    <option value="processing">{t.status_processing}</option>
                    <option value="arrived_at_facility">
                      {t.arrivedAtFacility}
                    </option>
                    <option value="departed_facility">
                      {t.departedFacility}
                    </option>
                    <option value="in_transit">{t.inTransit}</option>
                    <option value="out_for_delivery">{t.outForDelivery}</option>
                    <option value="delivery_attempted">
                      {t.deliveryAttempted}
                    </option>
                    <option value="delivered">{t.delivered}</option>
                    <option value="exception">{t.exception}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t.location}
                  </label>
                  <input
                    type="text"
                    value={newEvent.location}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, location: e.target.value })
                    }
                    placeholder={t.enterLocation}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t.details}
                  </label>
                  <textarea
                    value={newEvent.details}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, details: e.target.value })
                    }
                    placeholder={t.enterEventDetails}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700"
                    required
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={handleAddEvent}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-300 flex items-center"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    {t.addEvent}
                  </button>

                  <button
                    onClick={() => setShowAddEvent(false)}
                    className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-md transition-colors duration-300"
                  >
                    {t.cancel}
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="overflow-y-auto max-h-[400px] pr-2">
            <TrackingTimeline shipment={shipment} />
          </div>
        </div>
      </div>

      {/* Mark as Delivered Quick Action */}
      {shipment.status !== "delivered" && (
        <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-md p-4 flex items-center justify-between">
          <div>
            <h3 className="font-medium text-green-800 dark:text-green-400">
              {t.completeShipment}
            </h3>
            <p className="text-sm text-green-700 dark:text-green-500">
              {t.markAsDeliveredDescription}
            </p>
          </div>

          <button
            onClick={() => handleStatusChange("delivered")}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors duration-300 flex items-center"
          >
            <CheckCheck className="w-5 h-5 mr-2" />
            {t.markAsDelivered}
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminShipmentDetails;
