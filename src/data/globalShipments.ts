import { v4 as uuidv4 } from 'uuid';

const generateTrackingNumber = () => {
  const prefix = 'SHIP';
  const randomPart = Math.floor(Math.random() * 10000000).toString().padStart(7, '0');
  return `${prefix}${randomPart}`;
};

const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);
const nextWeek = new Date(today);
nextWeek.setDate(nextWeek.getDate() + 7);
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);
const lastWeek = new Date(today);
lastWeek.setDate(lastWeek.getDate() - 7);

// Global shipments that work across all devices
const globalShipments = [
  {
    id: uuidv4(),
    trackingNumber: 'SHIP1234567',
    status: 'in_transit',
    packageType: 'package',
    serviceType: 'express',
    shipDate: lastWeek.toISOString(),
    estimatedDelivery: tomorrow.toISOString(),
    sender: {
      name: 'John Smith',
      phone: '+1 (555) 123-4567',
      email: 'john.smith@example.com'
    },
    receiver: {
      name: 'Sarah Johnson',
      phone: '+1 (555) 987-6543',
      email: 'sarah.johnson@example.com'
    },
    origin: {
      address: '123 Main St',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      country: 'USA'
    },
    destination: {
      address: '456 Market St',
      city: 'San Francisco',
      state: 'CA',
      zip: '94103',
      country: 'USA'
    },
    items: [
      {
        description: 'Electronics',
        quantity: 1,
        weight: 2.5,
        weightUnit: 'kg',
        dimensions: '30 x 20 x 10 cm'
      }
    ],
    trackingHistory: [
      {
        status: 'in_progress',
        statusCode: 'in_transit',
        location: 'Chicago, IL',
        timestamp: today.toISOString(),
        details: 'Package in transit to destination'
      },
      {
        status: 'completed',
        statusCode: 'departed_facility',
        location: 'Chicago, IL',
        timestamp: yesterday.toISOString(),
        details: 'Departed from sorting facility'
      },
      {
        status: 'completed',
        statusCode: 'arrived_at_facility',
        location: 'Chicago, IL',
        timestamp: yesterday.toISOString(),
        details: 'Arrived at sorting facility'
      },
      {
        status: 'completed',
        statusCode: 'label_created',
        location: 'New York, NY',
        timestamp: new Date(lastWeek.getTime() + 3600000).toISOString(),
        details: 'Shipping label created and package prepared'
      },
      {
        status: 'completed',
        statusCode: 'On_Hold',
        location: 'New York, NY',
        timestamp: lastWeek.toISOString(),
        details: 'Shipment created and pending pickup'
      }
    ]
  },
  {
    id: uuidv4(),
    trackingNumber: 'SHIP2345678',
    status: 'delivered',
    packageType: 'document',
    serviceType: 'standard',
    shipDate: lastWeek.toISOString(),
    estimatedDelivery: yesterday.toISOString(),
    sender: {
      name: 'Michael Brown',
      phone: '+1 (555) 234-5678',
      email: 'michael.brown@example.com'
    },
    receiver: {
      name: 'Emily Davis',
      phone: '+1 (555) 876-5432',
      email: 'emily.davis@example.com'
    },
    origin: {
      address: '789 Oak St',
      city: 'Chicago',
      state: 'IL',
      zip: '60601',
      country: 'USA'
    },
    destination: {
      address: '321 Pine St',
      city: 'Seattle',
      state: 'WA',
      zip: '98101',
      country: 'USA'
    },
    items: [
      {
        description: 'Legal Documents',
        quantity: 1,
        weight: 0.5,
        weightUnit: 'kg',
        dimensions: '30 x 21 x 1 cm'
      }
    ],
    trackingHistory: [
      {
        status: 'completed',
        statusCode: 'delivered',
        location: 'Seattle, WA',
        timestamp: yesterday.toISOString(),
        details: 'Package delivered to recipient'
      },
      {
        status: 'completed',
        statusCode: 'out_for_delivery',
        location: 'Seattle, WA',
        timestamp: yesterday.toISOString(),
        details: 'Out for delivery'
      },
      {
        status: 'completed',
        statusCode: 'arrived_at_facility',
        location: 'Seattle, WA',
        timestamp: new Date(yesterday.getTime() - 86400000).toISOString(),
        details: 'Arrived at delivery facility'
      },
      {
        status: 'completed',
        statusCode: 'in_transit',
        location: 'Portland, OR',
        timestamp: new Date(yesterday.getTime() - 86400000 * 2).toISOString(),
        details: 'In transit to destination'
      },
      {
        status: 'completed',
        statusCode: 'label_created',
        location: 'Chicago, IL',
        timestamp: new Date(lastWeek.getTime() + 3600000).toISOString(),
        details: 'Shipping label created'
      },
      {
        status: 'completed',
        statusCode: 'On_Hold',
        location: 'Chicago, IL',
        timestamp: lastWeek.toISOString(),
        details: 'Shipment created'
      }
    ]
  },
  {
    id: uuidv4(),
    trackingNumber: 'SHIP3456789',
    status: 'processing',
    packageType: 'package',
    serviceType: 'standard',
    shipDate: today.toISOString(),
    estimatedDelivery: nextWeek.toISOString(),
    sender: {
      name: 'Robert Wilson',
      phone: '+1 (555) 345-6789',
      email: 'robert.wilson@example.com'
    },
    receiver: {
      name: 'Jennifer Taylor',
      phone: '+1 (555) 765-4321',
      email: 'jennifer.taylor@example.com'
    },
    origin: {
      address: '567 Elm St',
      city: 'Boston',
      state: 'MA',
      zip: '02108',
      country: 'USA'
    },
    destination: {
      address: '890 Cedar St',
      city: 'Miami',
      state: 'FL',
      zip: '33101',
      country: 'USA'
    },
    items: [
      {
        description: 'Clothing',
        quantity: 3,
        weight: 1.2,
        weightUnit: 'kg',
        dimensions: '25 x 20 x 15 cm'
      },
      {
        description: 'Books',
        quantity: 2,
        weight: 3,
        weightUnit: 'kg',
        dimensions: '30 x 20 x 10 cm'
      }
    ],
    trackingHistory: [
      {
        status: 'in_progress',
        statusCode: 'processing',
        location: 'Boston, MA',
        timestamp: new Date(today.getTime() - 3600000).toISOString(),
        details: 'Package is being processed at origin facility'
      },
      {
        status: 'completed',
        statusCode: 'label_created',
        location: 'Boston, MA',
        timestamp: new Date(today.getTime() - 7200000).toISOString(),
        details: 'Shipping label created and package prepared for pickup'
      },
      {
        status: 'completed',
        statusCode: 'On_Hold',
        location: 'Boston, MA',
        timestamp: today.toISOString(),
        details: 'Shipment created and pending label creation'
      }
    ]
  },
  {
    id: uuidv4(),
    trackingNumber: 'SHIP4567890',
    status: 'out_for_delivery',
    packageType: 'package',
    serviceType: 'express',
    shipDate: new Date(today.getTime() - 86400000 * 2).toISOString(),
    estimatedDelivery: today.toISOString(),
    sender: {
      name: 'Lisa Anderson',
      phone: '+1 (555) 456-7890',
      email: 'lisa.anderson@example.com'
    },
    receiver: {
      name: 'David Martinez',
      phone: '+1 (555) 654-3210',
      email: 'david.martinez@example.com'
    },
    origin: {
      address: '246 Pine Ave',
      city: 'Los Angeles',
      state: 'CA',
      zip: '90210',
      country: 'USA'
    },
    destination: {
      address: '135 Oak Blvd',
      city: 'Phoenix',
      state: 'AZ',
      zip: '85001',
      country: 'USA'
    },
    items: [
      {
        description: 'Gift Package',
        quantity: 1,
        weight: 1.8,
        weightUnit: 'kg',
        dimensions: '20 x 15 x 10 cm'
      }
    ],
    trackingHistory: [
      {
        status: 'in_progress',
        statusCode: 'out_for_delivery',
        location: 'Phoenix, AZ',
        timestamp: new Date(today.getTime() - 3600000).toISOString(),
        details: 'Package is out for delivery and will arrive today'
      },
      {
        status: 'completed',
        statusCode: 'arrived_at_facility',
        location: 'Phoenix, AZ',
        timestamp: new Date(today.getTime() - 7200000).toISOString(),
        details: 'Arrived at local delivery facility'
      },
      {
        status: 'completed',
        statusCode: 'in_transit',
        location: 'Flagstaff, AZ',
        timestamp: new Date(today.getTime() - 86400000).toISOString(),
        details: 'Package in transit to destination city'
      },
      {
        status: 'completed',
        statusCode: 'departed_facility',
        location: 'Los Angeles, CA',
        timestamp: new Date(today.getTime() - 86400000 * 2).toISOString(),
        details: 'Departed from origin facility'
      },
      {
        status: 'completed',
        statusCode: 'processing',
        location: 'Los Angeles, CA',
        timestamp: new Date(today.getTime() - 86400000 * 2 - 3600000).toISOString(),
        details: 'Package processed and ready for shipment'
      }
    ]
  },
  {
    id: uuidv4(),
    trackingNumber: 'SHIP5678901',
    status: 'pending',
    packageType: 'document',
    serviceType: 'overnight',
    shipDate: today.toISOString(),
    estimatedDelivery: tomorrow.toISOString(),
    sender: {
      name: 'Thomas Clark',
      phone: '+1 (555) 567-8901',
      email: 'thomas.clark@example.com'
    },
    receiver: {
      name: 'Maria Rodriguez',
      phone: '+1 (555) 543-2109',
      email: 'maria.rodriguez@example.com'
    },
    origin: {
      address: '789 Broadway',
      city: 'Denver',
      state: 'CO',
      zip: '80202',
      country: 'USA'
    },
    destination: {
      address: '456 State St',
      city: 'Austin',
      state: 'TX',
      zip: '73301',
      country: 'USA'
    },
    items: [
      {
        description: 'Urgent Documents',
        quantity: 1,
        weight: 0.3,
        weightUnit: 'kg',
        dimensions: '32 x 23 x 2 cm'
      }
    ],
    trackingHistory: [
      {
        status: 'pending',
        statusCode: 'On_Hold',
        location: 'Denver, CO',
        timestamp: today.toISOString(),
        details: 'Shipment created and awaiting pickup'
      }
    ]
  }
];

export default globalShipments;