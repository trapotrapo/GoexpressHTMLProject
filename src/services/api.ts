// Cloud Backend Service using REST API
// This replaces direct MongoDB connection with HTTP-based backend

interface Shipment {
  id: string;
  trackingNumber: string;
  status: string;
  packageType: string;
  serviceType: string;
  shipDate: string;
  estimatedDelivery: string;
  sender: any;
  receiver: any;
  origin: any;
  destination: any;
  items: any[];
  trackingHistory: any[];
  createdAt?: string;
  updatedAt?: string;
}

// Backend API configuration
const API_BASE_URL = 'https://api.jsonbin.io/v3/b';
const API_KEY = '$2a$10$8K9wX2vN5qL3mR7pT4uE6eH1sF9dG8cV2bN4mK6jL9pQ3rT5yU8wE';
const BIN_ID = '6751a2b8ad19ca34f8c8f123'; // Your MongoDB-backed bin

class CloudBackendService {
  private baseUrl: string;
  private headers: Record<string, string>;
  private isInitialized = false;
  private initPromise: Promise<void> | null = null;

  constructor() {
    this.baseUrl = `${API_BASE_URL}/${BIN_ID}`;
    this.headers = {
      'Content-Type': 'application/json',
      'X-Master-Key': API_KEY,
      'X-Bin-Meta': 'false'
    };
  }

  private async initialize(): Promise<void> {
    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = this.performInitialization();
    return this.initPromise;
  }

  private async performInitialization(): Promise<void> {
    try {
      console.log('🔄 Initializing cloud backend...');
      
      // Try to fetch existing data
      const response = await fetch(this.baseUrl, {
        method: 'GET',
        headers: this.headers
      });

      if (response.status === 404) {
        // Initialize with demo data if bin doesn't exist
        await this.initializeWithDemoData();
      } else if (response.ok) {
        console.log('✅ Cloud backend already initialized');
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      this.isInitialized = true;
      console.log('✅ Cloud backend ready');
      
    } catch (error) {
      console.error('❌ Failed to initialize cloud backend:', error);
      this.isInitialized = false;
      throw error;
    }
  }

  private async ensureInitialized(): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }
  }

  async getAllShipments(): Promise<Shipment[]> {
    try {
      await this.ensureInitialized();
      console.log('🔍 Fetching all shipments from cloud...');
      
      const response = await fetch(this.baseUrl, {
        method: 'GET',
        headers: this.headers
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const shipments = data.shipments || [];

      console.log(`📦 Retrieved ${shipments.length} shipments from cloud`);
      return shipments;
      
    } catch (error) {
      console.error('❌ Error fetching shipments from cloud:', error);
      throw new Error('Failed to fetch shipments from cloud database');
    }
  }

  async getShipmentByTrackingNumber(trackingNumber: string): Promise<Shipment | null> {
    try {
      console.log(`🔍 Looking for shipment with tracking number: ${trackingNumber}`);
      
      const shipments = await this.getAllShipments();
      const shipment = shipments.find(s => s.trackingNumber === trackingNumber);
      
      if (shipment) {
        console.log(`✅ Found shipment: ${trackingNumber}`);
        return shipment;
      }
      
      console.log(`❌ No shipment found with tracking number: ${trackingNumber}`);
      return null;
      
    } catch (error) {
      console.error('❌ Error fetching shipment by tracking number:', error);
      return null;
    }
  }

  async getShipmentById(id: string): Promise<Shipment | null> {
    try {
      console.log(`🔍 Looking for shipment with ID: ${id}`);
      
      const shipments = await this.getAllShipments();
      const shipment = shipments.find(s => s.id === id || s.trackingNumber === id);
      
      if (shipment) {
        console.log(`✅ Found shipment: ${id}`);
        return shipment;
      }
      
      console.log(`❌ No shipment found with ID: ${id}`);
      return null;
      
    } catch (error) {
      console.error('❌ Error fetching shipment by ID:', error);
      return null;
    }
  }

  async createShipment(shipment: Omit<Shipment, 'id'>): Promise<Shipment> {
    try {
      await this.ensureInitialized();
      console.log(`📝 Creating new shipment: ${shipment.trackingNumber}`);
      
      const shipments = await this.getAllShipments();
      
      // Check for duplicate tracking number
      const existingShipment = shipments.find(s => s.trackingNumber === shipment.trackingNumber);
      if (existingShipment) {
        throw new Error('Shipment with this tracking number already exists');
      }
      
      const newShipment: Shipment = {
        ...shipment,
        id: this.generateId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const updatedShipments = [newShipment, ...shipments];
      
      const response = await fetch(this.baseUrl, {
        method: 'PUT',
        headers: this.headers,
        body: JSON.stringify({ shipments: updatedShipments })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log(`✅ Successfully created shipment: ${shipment.trackingNumber}`);
      
      // Broadcast change for real-time updates
      this.broadcastChange('shipment_created', newShipment);
      
      return newShipment;
      
    } catch (error) {
      console.error('❌ Error creating shipment:', error);
      throw error;
    }
  }

  async updateShipment(id: string, updates: Partial<Shipment>): Promise<Shipment> {
    try {
      await this.ensureInitialized();
      console.log(`📝 Updating shipment: ${id}`);
      
      const shipments = await this.getAllShipments();
      const shipmentIndex = shipments.findIndex(s => s.id === id || s.trackingNumber === id);
      
      if (shipmentIndex === -1) {
        throw new Error('Shipment not found');
      }

      const updatedShipment = {
        ...shipments[shipmentIndex],
        ...updates,
        updatedAt: new Date().toISOString()
      };

      shipments[shipmentIndex] = updatedShipment;
      
      const response = await fetch(this.baseUrl, {
        method: 'PUT',
        headers: this.headers,
        body: JSON.stringify({ shipments })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log(`✅ Successfully updated shipment: ${id}`);
      
      // Broadcast change for real-time updates
      this.broadcastChange('shipment_updated', updatedShipment);
      
      return updatedShipment;
      
    } catch (error) {
      console.error('❌ Error updating shipment:', error);
      throw error;
    }
  }

  async deleteShipment(id: string): Promise<void> {
    try {
      await this.ensureInitialized();
      console.log(`🗑️ Deleting shipment: ${id}`);
      
      const shipments = await this.getAllShipments();
      const filteredShipments = shipments.filter(s => s.id !== id && s.trackingNumber !== id);
      
      if (filteredShipments.length === shipments.length) {
        throw new Error('Shipment not found');
      }

      const response = await fetch(this.baseUrl, {
        method: 'PUT',
        headers: this.headers,
        body: JSON.stringify({ shipments: filteredShipments })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log(`✅ Successfully deleted shipment: ${id}`);
      
      // Broadcast change for real-time updates
      this.broadcastChange('shipment_deleted', { id });
      
    } catch (error) {
      console.error('❌ Error deleting shipment:', error);
      throw error;
    }
  }

  async addTrackingEvent(id: string, event: any): Promise<void> {
    try {
      await this.ensureInitialized();
      console.log(`📍 Adding tracking event to shipment: ${id}`);
      
      const shipments = await this.getAllShipments();
      const shipmentIndex = shipments.findIndex(s => s.id === id || s.trackingNumber === id);
      
      if (shipmentIndex === -1) {
        throw new Error('Shipment not found');
      }

      const trackingEvent = {
        ...event,
        timestamp: event.timestamp || new Date().toISOString(),
        id: this.generateId()
      };

      const updatedShipment = {
        ...shipments[shipmentIndex],
        trackingHistory: [trackingEvent, ...(shipments[shipmentIndex].trackingHistory || [])],
        updatedAt: new Date().toISOString()
      };

      shipments[shipmentIndex] = updatedShipment;
      
      const response = await fetch(this.baseUrl, {
        method: 'PUT',
        headers: this.headers,
        body: JSON.stringify({ shipments })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log(`✅ Successfully added tracking event to shipment: ${id}`);
      
      // Broadcast change for real-time updates
      this.broadcastChange('tracking_updated', updatedShipment);
      
    } catch (error) {
      console.error('❌ Error adding tracking event:', error);
      throw error;
    }
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private broadcastChange(type: string, data: any): void {
    // Broadcast changes to all open tabs/windows for real-time sync
    window.dispatchEvent(new CustomEvent('shipmentsUpdated', { 
      detail: { type, data } 
    }));
  }

  // Initialize with demo data if needed
  async initializeWithDemoData(): Promise<void> {
    try {
      console.log('📦 Initializing cloud with demo shipments...');
      
      // Import demo data
      const { default: demoShipments } = await import('../data/globalShipments');
      
      // Add metadata to demo shipments
      const shipmentsWithMetadata = demoShipments.map(shipment => ({
        ...shipment,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }));
      
      const response = await fetch(this.baseUrl, {
        method: 'PUT',
        headers: this.headers,
        body: JSON.stringify({ shipments: shipmentsWithMetadata })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      console.log(`✅ Successfully initialized cloud with ${demoShipments.length} demo shipments`);
      
    } catch (error) {
      console.error('❌ Failed to initialize demo data:', error);
      throw error;
    }
  }

  // Health check method
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'GET',
        headers: this.headers
      });
      return response.ok;
    } catch (error) {
      console.error('❌ Cloud health check failed:', error);
      return false;
    }
  }

  // Cleanup method (no-op for HTTP service)
  async disconnect(): Promise<void> {
    console.log('🔌 Disconnected from cloud service');
  }
}

export const cloudBackend = new CloudBackendService();
export default cloudBackend;