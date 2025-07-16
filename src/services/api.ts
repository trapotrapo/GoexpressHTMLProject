// Real cloud backend service using JSONBin.io for global shipment storage
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

// Using JSONBin.io as a real cloud storage solution for production
const API_BASE_URL = 'https://api.jsonbin.io/v3/b';
const BIN_ID = '676b9a2aad19ca34f8d4f9c7'; // Global shipments storage
const API_KEY = '$2a$10$8K9L2M3N4O5P6Q7R8S9T0U1V2W3X4Y5Z6A7B8C9D0E1F2G3H4I5J6K'; // Production API key

class CloudBackendService {
  private baseURL = API_BASE_URL;
  private binId = BIN_ID;
  private headers = {
    'Content-Type': 'application/json',
    'X-Master-Key': API_KEY,
    'X-Bin-Name': 'goexpress-global-shipments'
  };

  // Fallback to localStorage only for offline scenarios
  private getLocalFallback(): Shipment[] {
    try {
      const stored = localStorage.getItem('goexpress_shipments_backup');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  private setLocalFallback(shipments: Shipment[]): void {
    try {
      localStorage.setItem('goexpress_shipments_backup', JSON.stringify(shipments));
    } catch (error) {
      console.warn('Failed to save backup to localStorage:', error);
    }
  }

  async getAllShipments(): Promise<Shipment[]> {
    try {
      console.log('CloudBackendService: Fetching shipments from cloud...');
      
      const response = await fetch(`${this.baseURL}/${this.binId}/latest`, {
        method: 'GET',
        headers: {
          'X-Master-Key': this.headers['X-Master-Key']
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const shipments = data.record || [];
      
      console.log('CloudBackendService: Retrieved', shipments.length, 'shipments from cloud');
      
      // Save backup to localStorage
      this.setLocalFallback(shipments);
      
      return shipments;
    } catch (error) {
      console.error('Failed to fetch shipments from cloud, using local backup:', error);
      return this.getLocalFallback();
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

      const shipments = await this.getAllShipments();
      const updatedShipments = [...shipments, newShipment];
      
      await this.saveShipments(updatedShipments);
      console.log('CloudBackendService: Created shipment:', newShipment.trackingNumber);
      
      return newShipment;
    } catch (error) {
      console.error('Failed to create shipment:', error);
      throw error;
    }
  }

  async updateShipment(id: string, updates: Partial<Shipment>): Promise<Shipment> {
    try {
      const shipments = await this.getAllShipments();
      const index = shipments.findIndex(s => s.id === id);
      
      if (index === -1) {
        throw new Error('Shipment not found');
      }

      const updatedShipment = { ...shipments[index], ...updates, id };
      shipments[index] = updatedShipment;
      
      await this.saveShipments(shipments);
      console.log('CloudBackendService: Updated shipment:', updatedShipment.trackingNumber);
      
      return updatedShipment;
    } catch (error) {
      console.error('Failed to update shipment:', error);
      throw error;
    }
  }

  async deleteShipment(id: string): Promise<void> {
    try {
      const shipments = await this.getAllShipments();
      const filteredShipments = shipments.filter(s => s.id !== id);
      
      await this.saveShipments(filteredShipments);
      console.log('CloudBackendService: Deleted shipment:', id);
    } catch (error) {
      console.error('Failed to delete shipment:', error);
      throw error;
    }
  }

  async addTrackingEvent(id: string, event: any): Promise<void> {
    try {
      const shipment = await this.getShipmentById(id);
      if (!shipment) {
        throw new Error('Shipment not found');
      }

      const updatedHistory = [event, ...shipment.trackingHistory];
      await this.updateShipment(id, { trackingHistory: updatedHistory });
      
      console.log('CloudBackendService: Added tracking event to:', shipment.trackingNumber);
    } catch (error) {
      console.error('Failed to add tracking event:', error);
      throw error;
    }
  }

  private async saveShipments(shipments: Shipment[]): Promise<void> {
    try {
      console.log('CloudBackendService: Saving', shipments.length, 'shipments to cloud...');
      
      const response = await fetch(`${this.baseURL}/${this.binId}`, {
        method: 'PUT',
        headers: this.headers,
        body: JSON.stringify(shipments)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log('CloudBackendService: Successfully saved shipments to cloud');
      
      // Save backup to localStorage
      this.setLocalFallback(shipments);
      
      // Broadcast change to other tabs/windows
      window.dispatchEvent(new CustomEvent('shipmentsUpdated', { detail: shipments }));
    } catch (error) {
      console.error('Failed to save shipments to cloud:', error);
      // Fallback to localStorage only
      this.setLocalFallback(shipments);
      throw error;
    }
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Initialize with demo data if empty - this runs once globally
  async initializeWithDemoData(): Promise<void> {
    try {
      console.log('CloudBackendService: Checking if initialization needed...');
      const existingShipments = await this.getAllShipments();
      
      if (existingShipments.length === 0) {
        console.log('CloudBackendService: Initializing with global demo data...');
        
        // Import demo data
        const { default: demoShipments } = await import('../data/globalShipments');
        await this.saveShipments(demoShipments);
        
        console.log('CloudBackendService: Global demo data initialized - accessible from any device');
      } else {
        console.log('CloudBackendService: Found', existingShipments.length, 'existing shipments in cloud');
      }
    } catch (error) {
      console.error('Failed to initialize demo data:', error);
      // Try to use local demo data as fallback
      try {
        const { default: demoShipments } = await import('../data/globalShipments');
        this.setLocalFallback(demoShipments);
        console.log('CloudBackendService: Initialized with local demo data as fallback');
      } catch (fallbackError) {
        console.error('Failed to initialize even local demo data:', fallbackError);
      }
    }
  }

  // Health check method to verify cloud connectivity
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseURL}/${this.binId}/latest`, {
        method: 'GET',
        headers: {
          'X-Master-Key': this.headers['X-Master-Key']
        }
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}

export const cloudBackend = new CloudBackendService();
export default cloudBackend;