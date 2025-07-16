import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useShipment } from "../../contexts/ShipmentContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { Save, ArrowLeft, Package, Trash, Plus } from "lucide-react";
import translations from "../../utils/translations";

const ShipmentForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getShipment, createShipment, updateShipment } = useShipment();
  const { language } = useLanguage();
  const t = translations[language];

  const isEditMode = !!id;

  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);

  const emptyItem = {
    description: "",
    quantity: 1,
    weight: 0,
    weightUnit: "kg",
    dimensions: "",
  };

  const [formData, setFormData] = useState({
    trackingNumber: "",
    status: "pending",
    packageType: "package",
    serviceType: "standard",
    shipDate: "",
    estimatedDelivery: "",
    sender: {
      name: "",
      phone: "",
      email: "",
    },
    receiver: {
      name: "",
      phone: "",
      email: "",
    },
    origin: {
      address: "",
      city: "",
      state: "",
      zip: "",
      country: "",
    },
    destination: {
      address: "",
      city: "",
      state: "",
      zip: "",
      country: "",
    },
    items: [{ ...emptyItem }],
    trackingHistory: [],
  });

  useEffect(() => {
    if (isEditMode) {
      fetchShipment();
    } else {
      // Generate a random tracking number for new shipments
      setFormData((prev) => ({
        ...prev,
        trackingNumber: generateTrackingNumber(),
        shipDate: new Date().toISOString().split("T")[0],
        estimatedDelivery: getEstimatedDeliveryDate(),
      }));
    }
  }, [id]);

  const fetchShipment = async () => {
    try {
      const shipment = await getShipment(id || "");
      if (shipment) {
        // Format dates for input fields
        shipment.shipDate = new Date(shipment.shipDate)
          .toISOString()
          .split("T")[0];
        shipment.estimatedDelivery = new Date(shipment.estimatedDelivery)
          .toISOString()
          .split("T")[0];

        setFormData(shipment);
      }
    } catch (error) {
      console.error("Error fetching shipment:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateTrackingNumber = () => {
    const prefix = "SHIP";
    const randomPart = Math.floor(Math.random() * 10000000)
      .toString()
      .padStart(7, "0");
    return `${prefix}${randomPart}`;
  };

  const getEstimatedDeliveryDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 5); // Add 5 days
    return date.toISOString().split("T")[0];
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    // Handle nested properties
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleItemChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const updatedItems = [...formData.items];
    updatedItems[index] = { ...updatedItems[index], [name]: value };

    setFormData((prev) => ({ ...prev, items: updatedItems }));
  };

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { ...emptyItem }],
    }));
  };

  const removeItem = (index: number) => {
    if (formData.items.length === 1) {
      return; // Don't remove the last item
    }

    const updatedItems = formData.items.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, items: updatedItems }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (isEditMode) {
        console.log("Updating shipment:", formData); // Debug log
        await updateShipment(id || "", formData);
      } else {
        // For new shipments, add an initial tracking history entry
        const newShipmentData = {
          ...formData,
          trackingHistory: [
            {
              status: "completed",
              statusCode: "shipment_created",
              location: formData.origin.city + ", " + formData.origin.country,
              timestamp: new Date().toISOString(),
              details: t.shipmentCreated,
            },
          ],
        };
        console.log("Creating shipment:", newShipmentData); // Debug log
        await createShipment(newShipmentData);
      }

      navigate("/admin/shipments");
    } catch (error) {
      console.error("Error saving shipment:", error);
      alert(t.errorSavingShipment);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
          <div className="grid gap-6 mb-6">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="h-10 bg-gray-200 dark:bg-gray-700 rounded"
              ></div>
            ))}
          </div>
        </div>
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
            {isEditMode ? t.editShipment : t.createNewShipment}
          </h2>
        </div>

        <button
          type="submit"
          form="shipment-form"
          disabled={submitting}
          className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-300 flex items-center ${
            submitting ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {submitting ? (
            <>
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
              {t.saving}
            </>
          ) : (
            <>
              <Save className="w-5 h-5 mr-2" />
              {t.saveShipment}
            </>
          )}
        </button>
      </div>

      <form id="shipment-form" onSubmit={handleSubmit}>
        <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-md p-4 mb-6">
          <h3 className="font-semibold mb-2">{t.shipmentDetails}</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t.trackingNumber}
              </label>
              <input
                type="text"
                name="trackingNumber"
                value={formData.trackingNumber}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700"
                readOnly={isEditMode} // Can't change tracking number for existing shipments
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t.status}
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700"
                required
              >
                <option value="On Hold">{t.status_pending}</option>
                <option value="processing">{t.status_processing}</option>
                <option value="in_transit">{t.status_in_transit}</option>
                <option value="delivered">{t.status_delivered}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t.packageType}
              </label>
              <select
                name="packageType"
                value={formData.packageType}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700"
                required
              >
                <option value="package">{t.regularPackage}</option>
                <option value="document">{t.document}</option>
                <option value="pallet">{t.pallet}</option>
                <option value="oversize">{t.oversizePackage}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t.serviceType}
              </label>
              <select
                name="serviceType"
                value={formData.serviceType}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700"
                required
              >
                <option value="standard">{t.standardShipping}</option>
                <option value="express">{t.expressShipping}</option>
                <option value="overnight">{t.overnightShipping}</option>
                <option value="international">{t.internationalShipping}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t.shipDate}
              </label>
              <input
                type="date"
                name="shipDate"
                value={formData.shipDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t.estimatedDelivery}
              </label>
              <input
                type="date"
                name="estimatedDelivery"
                value={formData.estimatedDelivery}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700"
                required
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Sender Information */}
          <div className="bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-md p-4">
            <h3 className="font-semibold mb-4">{t.senderInformation}</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t.fullName}
                </label>
                <input
                  type="text"
                  name="sender.name"
                  value={formData.sender.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t.phoneNumber}
                </label>
                <input
                  type="tel"
                  name="sender.phone"
                  value={formData.sender.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t.email}
                </label>
                <input
                  type="email"
                  name="sender.email"
                  value={formData.sender.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700"
                  required
                />
              </div>
            </div>
          </div>

          {/* Receiver Information */}
          <div className="bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-md p-4">
            <h3 className="font-semibold mb-4">{t.receiverInformation}</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t.fullName}
                </label>
                <input
                  type="text"
                  name="receiver.name"
                  value={formData.receiver.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t.phoneNumber}
                </label>
                <input
                  type="tel"
                  name="receiver.phone"
                  value={formData.receiver.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t.email}
                </label>
                <input
                  type="email"
                  name="receiver.email"
                  value={formData.receiver.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Origin Address */}
          <div className="bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-md p-4">
            <h3 className="font-semibold mb-4">{t.originAddress}</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t.streetAddress}
                </label>
                <input
                  type="text"
                  name="origin.address"
                  value={formData.origin.address}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t.city}
                  </label>
                  <input
                    type="text"
                    name="origin.city"
                    value={formData.origin.city}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t.stateProvince}
                  </label>
                  <input
                    type="text"
                    name="origin.state"
                    value={formData.origin.state}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t.postalCode}
                  </label>
                  <input
                    type="text"
                    name="origin.zip"
                    value={formData.origin.zip}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t.country}
                  </label>
                  <input
                    type="text"
                    name="origin.country"
                    value={formData.origin.country}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Destination Address */}
          <div className="bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-md p-4">
            <h3 className="font-semibold mb-4">{t.destinationAddress}</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t.streetAddress}
                </label>
                <input
                  type="text"
                  name="destination.address"
                  value={formData.destination.address}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t.city}
                  </label>
                  <input
                    type="text"
                    name="destination.city"
                    value={formData.destination.city}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t.stateProvince}
                  </label>
                  <input
                    type="text"
                    name="destination.state"
                    value={formData.destination.state}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t.postalCode}
                  </label>
                  <input
                    type="text"
                    name="destination.zip"
                    value={formData.destination.zip}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t.country}
                  </label>
                  <input
                    type="text"
                    name="destination.country"
                    value={formData.destination.country}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Package Items */}
        <div className="bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-md p-4 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">{t.packageItems}</h3>
            <button
              type="button"
              onClick={addItem}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm transition-colors duration-300 flex items-center"
            >
              <Plus className="w-4 h-4 mr-1" />
              {t.addItem}
            </button>
          </div>

          {formData.items.map((item, index) => (
            <div
              key={index}
              className="mb-4 p-4 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800"
            >
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium">
                  {t.item} #{index + 1}
                </h4>
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                  disabled={formData.items.length === 1}
                >
                  <Trash className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t.description}
                  </label>
                  <input
                    type="text"
                    name="description"
                    value={item.description}
                    onChange={(e) => handleItemChange(index, e)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t.quantity}
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, e)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t.weight}
                  </label>
                  <div className="flex">
                    <input
                      type="number"
                      name="weight"
                      min="0"
                      step="0.1"
                      value={item.weight}
                      onChange={(e) => handleItemChange(index, e)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700"
                      required
                    />
                    <select
                      name="weightUnit"
                      value={item.weightUnit}
                      onChange={(e) => handleItemChange(index, e)}
                      className="px-3 py-2 border border-l-0 border-gray-300 dark:border-gray-600 rounded-r-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700"
                    >
                      <option value="kg">kg</option>
                      <option value="lb">lb</option>
                      <option value="g">g</option>
                      <option value="oz">oz</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t.dimensions} (L x W x H)
                  </label>
                  <input
                    type="text"
                    name="dimensions"
                    placeholder="10 x 10 x 5 cm"
                    value={item.dimensions}
                    onChange={(e) => handleItemChange(index, e)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700"
                    required
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </form>
    </div>
  );
};

export default ShipmentForm;
