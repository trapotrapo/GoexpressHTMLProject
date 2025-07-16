import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useShipment } from "../../contexts/ShipmentContext";
import { useLanguage } from "../../contexts/LanguageContext";
import {
  Package, Cloud,
  Search,
  Filter,
  PlusCircle,
  Edit,
  Eye,
  Trash,
  Check,
  X,
  ArrowUpDown,
} from "lucide-react";
import translations from "../../utils/translations";

const ShipmentList: React.FC = () => {
  const { getShipments, deleteShipment, updateShipmentStatus, isLoading: contextLoading } = useShipment();
  const { language } = useLanguage();
  const t = translations[language];

  const [shipments, setShipments] = useState<any[]>([]);
  const [loading, setLoading] = useState(contextLoading);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortField, setSortField] = useState("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const [selectedShipments, setSelectedShipments] = useState<string[]>([]);
  const [bulkActionOpen, setBulkActionOpen] = useState(false);

  useEffect(() => {
    fetchShipments();
  }, []);
  
  useEffect(() => {
    setLoading(contextLoading);
  }, [contextLoading]);

  const fetchShipments = async () => {
    setLoading(true);
    try {
      const data = await getShipments();
      console.log("ShipmentList fetched shipments:", data); // Debug log
      setShipments(data);
    } catch (error) {
      console.error("Error fetching shipments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setStatusFilter(e.target.value);
  };

  const handleDeleteShipment = async (id: string) => {
    if (window.confirm(t.confirmDelete)) {
      try {
        await deleteShipment(id);
        setShipments(shipments.filter((shipment) => shipment.id !== id));
      } catch (error) {
        console.error("Error deleting shipment:", error);
      }
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await updateShipmentStatus(id, newStatus);
      setShipments(
        shipments.map((shipment) =>
          shipment.id === id ? { ...shipment, status: newStatus } : shipment
        )
      );
    } catch (error) {
      console.error("Error updating shipment status:", error);
    }
  };

  const toggleShipmentSelection = (id: string) => {
    setSelectedShipments((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleAllShipments = () => {
    if (selectedShipments.length === filteredShipments.length) {
      setSelectedShipments([]);
    } else {
      setSelectedShipments(filteredShipments.map((s) => s.id));
    }
  };

  const handleBulkAction = async (action: string) => {
    if (action === "delete" && window.confirm(t.confirmBulkDelete)) {
      try {
        for (const id of selectedShipments) {
          await deleteShipment(id);
        }
        setShipments(
          shipments.filter((s) => !selectedShipments.includes(s.id))
        );
        setSelectedShipments([]);
      } catch (error) {
        console.error("Error performing bulk delete:", error);
      }
    } else if (action.startsWith("status:")) {
      const newStatus = action.split(":")[1];
      try {
        for (const id of selectedShipments) {
          await updateShipmentStatus(id, newStatus);
        }
        setShipments(
          shipments.map((shipment) =>
            selectedShipments.includes(shipment.id)
              ? { ...shipment, status: newStatus }
              : shipment
          )
        );
        setSelectedShipments([]);
      } catch (error) {
        console.error("Error performing bulk status update:", error);
      }
    }

    setBulkActionOpen(false);
  };

  // Apply filtering
  const filteredShipments = shipments.filter((shipment) => {
    const matchesSearch =
      shipment.trackingNumber
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      shipment.receiver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.destination.city
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || shipment.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Apply sorting
  const sortedShipments = [...filteredShipments].sort((a, b) => {
    let valueA: any = a[sortField];
    let valueB: any = b[sortField];

    // Special case for nested fields
    if (sortField === "receiver.name") {
      valueA = a.receiver.name;
      valueB = b.receiver.name;
    } else if (sortField === "destination.city") {
      valueA = a.destination.city;
      valueB = b.destination.city;
    }

    if (typeof valueA === "string") {
      if (sortDirection === "asc") {
        return valueA.localeCompare(valueB);
      } else {
        return valueB.localeCompare(valueA);
      }
    } else {
      if (sortDirection === "asc") {
        return valueA - valueB;
      } else {
        return valueB - valueA;
      }
    }
  });

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "in_transit":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "processing":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "on_hold":
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
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-16 bg-gray-200 dark:bg-gray-700 rounded"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      {/* Cloud Status Indicator */}
      <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-md p-3 mb-6 flex items-center">
        <Cloud className="w-5 h-5 text-green-600 mr-2" />
        <div className="flex-1">
          <p className="text-sm font-medium text-green-800 dark:text-green-400">
            {t.cloudBackendActive}
          </p>
          <p className="text-xs text-green-700 dark:text-green-300">
            All shipments are automatically synced across all devices and can be tracked by customers worldwide.
          </p>
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">
          <Package className="inline-block mr-2" />
          {t.manageShipments}
        </h2>
        <Link
          to="/admin/shipments/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-300 flex items-center"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          {t.addNewShipment}
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {/* Search */}
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder={t.searchShipments}
            className="pl-10 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700"
          />
        </div>

        {/* Status Filter */}
        <div className="sm:w-48">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-5 w-5 text-gray-400" />
            </div>
            <select
              value={statusFilter}
              onChange={handleStatusFilterChange}
              className="pl-10 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 appearance-none"
            >
              <option value="all">{t.allStatuses}</option>
              <option value="on_hold">{t.status_pending}</option>
              <option value="processing">{t.status_processing}</option>
              <option value="in_transit">{t.status_in_transit}</option>
              <option value="delivered">{t.status_delivered}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedShipments.length > 0 && (
        <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-md p-3 mb-4 flex items-center justify-between">
          <div className="flex items-center">
            <Check className="w-5 h-5 text-blue-600 mr-2" />
            <span>{t.selectedItems(selectedShipments.length)}</span>
          </div>

          <div className="relative">
            <button
              onClick={() => setBulkActionOpen(!bulkActionOpen)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-300 flex items-center"
            >
              {t.bulkActions}
            </button>

            {bulkActionOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 ring-1 ring-black ring-opacity-5">
                <button
                  onClick={() => handleBulkAction("status:processing")}
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                >
                  {t.markAsProcessing}
                </button>
                <button
                  onClick={() => handleBulkAction("status:in_transit")}
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                >
                  {t.markAsInTransit}
                </button>
                <button
                  onClick={() => handleBulkAction("status:delivered")}
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                >
                  {t.markAsDelivered}
                </button>
                <div className="border-t border-gray-200 dark:border-gray-700"></div>
                <button
                  onClick={() => handleBulkAction("delete")}
                  className="block px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                >
                  {t.deleteSelected}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {filteredShipments.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-900 rounded-md">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            {t.noShipmentsFound}
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            {t.tryDifferentSearch}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={
                      selectedShipments.length === filteredShipments.length &&
                      filteredShipments.length > 0
                    }
                    onChange={toggleAllShipments}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("trackingNumber")}
                >
                  <div className="flex items-center">
                    {t.trackingNumber}
                    {sortField === "trackingNumber" && (
                      <ArrowUpDown className="ml-1 h-4 w-4" />
                    )}
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("receiver.name")}
                >
                  <div className="flex items-center">
                    {t.recipient}
                    {sortField === "receiver.name" && (
                      <ArrowUpDown className="ml-1 h-4 w-4" />
                    )}
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("destination.city")}
                >
                  <div className="flex items-center">
                    {t.destination}
                    {sortField === "destination.city" && (
                      <ArrowUpDown className="ml-1 h-4 w-4" />
                    )}
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("status")}
                >
                  <div className="flex items-center">
                    {t.status}
                    {sortField === "status" && (
                      <ArrowUpDown className="ml-1 h-4 w-4" />
                    )}
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("estimatedDelivery")}
                >
                  <div className="flex items-center">
                    {t.estimatedDelivery}
                    {sortField === "estimatedDelivery" && (
                      <ArrowUpDown className="ml-1 h-4 w-4" />
                    )}
                  </div>
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t.actions}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {sortedShipments.map((shipment) => (
                <tr
                  key={shipment.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                >
                  <td className="px-4 py-3 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedShipments.includes(shipment.id)}
                      onChange={() => toggleShipmentSelection(shipment.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="font-medium">{shipment.trackingNumber}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {shipment.receiver.name}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {shipment.destination.city}, {shipment.destination.country}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <select
                      value={shipment.status}
                      onChange={(e) =>
                        handleStatusChange(shipment.id, e.target.value)
                      }
                      className={`px-2 py-1 rounded-full text-sm ${getStatusColor(
                        shipment.status
                      )}`}
                    >
                      <option value="on_hold">{t.status_pending}</option>
                      <option value="processing">{t.status_processing}</option>
                      <option value="in_transit">{t.status_in_transit}</option>
                      <option value="delivered">{t.status_delivered}</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {new Date(shipment.estimatedDelivery).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right">
                    <div className="flex justify-end space-x-2">
                      <Link
                        to={`/admin/shipments/${shipment.id}`}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        title={t.view}
                      >
                        <Eye className="w-5 h-5" />
                      </Link>
                      <Link
                        to={`/admin/shipments/${shipment.id}/edit`}
                        className="text-yellow-600 hover:text-yellow-800 dark:text-yellow-400 dark:hover:text-yellow-300"
                        title={t.edit}
                      >
                        <Edit className="w-5 h-5" />
                      </Link>
                      <button
                        onClick={() => handleDeleteShipment(shipment.id)}
                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                        title={t.delete}
                      >
                        <Trash className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ShipmentList;
