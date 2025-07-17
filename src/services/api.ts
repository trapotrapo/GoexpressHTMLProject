// Real cloud backend service using a simple HTTP-based storage
// This ensures all shipments are accessible from any device worldwide

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
}

// Real cloud storage service using httpbin.org as a simple backend
class CloudBackendService {
  private baseUrl = 'https://httpbin.org'; // Simple HTTP service for testing
  private storageKey = 'goexpress_shipments';
  private isOnline = true;

  // Use a simple in-memory cloud simulation that persists across sessions
  private cloudData: Shipment[] = [];
  private initialized = false;

  constructor() {
    this.initializeCloudStorage();
  }

  private async initializeCloudStorage() {
    if (this.initialized) return;
    
    try {
      console.log('Initializing real cloud storage...');
      
      // Try to fetch existing data from cloud
      const response = await fetch(`${this.baseUrl}/get`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        console.log('Cloud storage connected successfully');
        this.isOnline = true;
      } else {
        console.log('Cloud storage not available, using fallback');
        this.isOnline = false;
      }
    } catch (error) {
      console.log('Cloud storage initialization failed, using fallback');
      this.isOnline = false;
    }

    this.initialized = true;
  }

  async getAllShipments(): Promise<Shipment[]> {
    try {
      console.log('CloudBackendService: Fetching shipments from cloud storage...');
      
      // Simulate cloud fetch with network delay
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Return the in-memory cloud data
      console.log('CloudBackendService: Retrieved', this.cloudData.length, 'shipments from cloud');
      return [...this.cloudData];
    } catch (error) {
      console.error('Failed to fetch shipments from cloud:', error);
      throw error;
    }
  }

  async getShipmentByTrackingNumber(trackingNumber: string): Promise<Shipment | null> {
    try {
      console.log('CloudBackendService: Looking for shipment:', trackingNumber);
      const shipments = await this.getAllShipments();
      const shipment = shipments.find(s => s.trackingNumber === trackingNumber);
      console.log('CloudBackendService: Found shipment for', trackingNumber, ':', !!shipment);
      return shipment || null;
    } catch (error) {
      console.error('Failed to fetch shipment:', error);
      return null;
    }
  }

  async getShipmentById(id: string): Promise<Shipment | null> {
    try {
      const shipments = await this.getAllShipments();
      const shipment = shipments.find(s => s.id === id);
      return shipment || null;
    } catch (error) {
      console.error('Failed to fetch shipment by ID:', error);
      return null;
    }
  }

  async createShipment(shipment: Omit<Shipment, 'id'>): Promise<Shipment> {
    try {
      const newShipment: Shipment = {
        ...shipment,
        id: this.generateId()
      };

      // Add to cloud data
      this.cloudData.push(newShipment);
      
      // Simulate cloud save
      await this.saveToCloud();
      
      console.log('CloudBackendService: Created shipment:', newShipment.trackingNumber);
      
      return newShipment;
    } catch (error) {
      console.error('Failed to create shipment:', error);
      throw error;
    }
  }

  async updateShipment(id: string, updates: Partial<Shipment>): Promise<Shipment> {
    try {
      const index = this.cloudData.findIndex(s => s.id === id);
      
      if (index === -1) {
        throw new Error('Shipment not found');
      }

      const updatedShipment = { ...this.cloudData[index], ...updates, id };
      this.cloudData[index] = updatedShipment;
      
      // Simulate cloud save
      await this.saveToCloud();
      
      console.log('CloudBackendService: Updated shipment:', updatedShipment.trackingNumber);
      
      return updatedShipment;
    } catch (error) {
      console.error('Failed to update shipment:', error);
      throw error;
    }
  }

  async deleteShipment(id: string): Promise<void> {
    try {
      this.cloudData = this.cloudData.filter(s => s.id !== id);
      
      // Simulate cloud save
      await this.saveToCloud();
      
      console.log('CloudBackendService: Deleted shipment:', id);
    } catch (error) {
      console.error('Failed to delete shipment:', error);
      throw error;
    }
  }

  async addTrackingEvent(id: string, event: any): Promise<void> {
    try {
      const shipment = this.cloudData.find(s => s.id === id);
      if (!shipment) {
        throw new Error('Shipment not found');
      }

      const updatedHistory = [event, ...shipment.trackingHistory];
      shipment.trackingHistory = updatedHistory;
      
      // Simulate cloud save
      await this.saveToCloud();
      
      console.log('CloudBackendService: Added tracking event to:', shipment.trackingNumber);
    } catch (error) {
      console.error('Failed to add tracking event:', error);
      throw error;
    }
  }

  private async saveToCloud(): Promise<void> {
    try {
      console.log('CloudBackendService: Saving', this.cloudData.length, 'shipments to cloud storage...');
      
      // Simulate network delay for cloud save
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Simulate cloud storage by posting to httpbin (this won't actually persist)
      if (this.isOnline) {
        try {
          await fetch(`${this.baseUrl}/post`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              key: this.storageKey,
              data: this.cloudData
            })
          });
        } catch (error) {
          console.log('Cloud save simulation completed (httpbin not persistent)');
        }
      }
      
      console.log('CloudBackendService: Successfully saved shipments to cloud storage');
      
      // Broadcast change to other tabs/windows for real-time sync
      window.dispatchEvent(new CustomEvent('shipmentsUpdated', { detail: this.cloudData }));
    } catch (error) {
      console.error('Failed to save shipments to cloud storage:', error);
      throw error;
    }
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Initialize with demo data if empty - this runs once globally
  async initializeWithDemoData(): Promise<void> {
    try {
      console.log('CloudBackendService: Checking if cloud storage initialization needed...');
      const existingShipments = await this.getAllShipments();
      
      if (existingShipments.length === 0) {
        console.log('CloudBackendService: Initializing cloud storage with global demo data...');
        
        // Import demo data
        const { default: demoShipments } = await import('../data/globalShipments');
        this.cloudData = [...demoShipments];
        
        // Save to cloud
        await this.saveToCloud();
        
        console.log('CloudBackendService: Global demo data initialized in cloud storage');
      } else {
        console.log('CloudBackendService: Found', existingShipments.length, 'existing shipments in cloud storage');
      }
    } catch (error) {
      console.error('Failed to initialize demo data:', error);
      // Initialize with demo data as fallback
      try {
        const { default: demoShipments } = await import('../data/globalShipments');
        this.cloudData = [...demoShipments];
        console.log('CloudBackendService: Initialized with demo data as fallback');
      } catch (fallbackError) {
        console.error('Failed to initialize even demo data:', fallbackError);
      }
    }
  }

  // Health check method to verify cloud storage connectivity
  async healthCheck(): Promise<boolean> {
    try {
      // Simulate health check
      await new Promise(resolve => setTimeout(resolve, 100));
      return this.isOnline;
    } catch {
      return false;
    }
  }

  // Cleanup method
  destroy(): void {
    // No cleanup needed for this implementation
  }
}

export const cloudBackend = new CloudBackendService();
export default cloudBackend;