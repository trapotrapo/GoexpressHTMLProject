// Simulated cloud backend service
// In production, this would connect to your actual backend API

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

// Using JSONBin.io as a free cloud storage solution for demo purposes
// In production, replace this with your actual backend API
const API_BASE_URL = 'https://api.jsonbin.io/v3/b';
const BIN_ID = '676b8e4aad19ca34f8d4f8e2'; // This will be created automatically
const API_KEY = '$2a$10$8vF4QqjK9mF4QqjK9mF4QqjK9mF4QqjK9mF4QqjK9mF4QqjK9mF4Qq'; // Demo key

class CloudBackendService {
  private baseURL = API_BASE_URL;
  private binId = BIN_ID;
  private headers = {
    'Content-Type': 'application/json',
    'X-Master-Key': API_KEY,
    'X-Bin-Name': 'goexpress-shipments'
  };

  // Fallback to localStorage if cloud service fails
  private getLocalFallback(): Shipment[] {
    try {
      const stored = localStorage.getItem('goexpress_shipments');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  private setLocalFallback(shipments: Shipment[]): void {
    try {
      localStorage.setItem('goexpress_shipments', JSON.stringify(shipments));
    } catch (error) {
      console.warn('Failed to save to localStorage:', error);
    }
  }

  async getAllShipments(): Promise<Shipment[]> {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // For demo purposes, we'll use localStorage but structure it like a cloud service
      // In production, this would be: const response = await fetch(`${this.baseURL}/${this.binId}/latest`, { headers: this.headers });
      
      const shipments = this.getLocalFallback();
      console.log('CloudBackendService: Retrieved shipments:', shipments.length);
      return shipments;
    } catch (error) {
      console.error('Failed to fetch shipments from cloud:', error);
      return this.getLocalFallback();
    }
  }

  async getShipmentByTrackingNumber(trackingNumber: string): Promise<Shipment | null> {
    try {
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
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // For demo purposes, save to localStorage
      // In production, this would be: await fetch(`${this.baseURL}/${this.binId}`, { method: 'PUT', headers: this.headers, body: JSON.stringify(shipments) });
      
      this.setLocalFallback(shipments);
      
      // Broadcast change to other tabs/windows
      window.dispatchEvent(new CustomEvent('shipmentsUpdated', { detail: shipments }));
    } catch (error) {
      console.error('Failed to save shipments to cloud:', error);
      // Fallback to localStorage
      this.setLocalFallback(shipments);
      throw error;
    }
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Initialize with demo data if empty
  async initializeWithDemoData(): Promise<void> {
    try {
      const existingShipments = await this.getAllShipments();
      if (existingShipments.length === 0) {
        console.log('CloudBackendService: Initializing with demo data...');
        
        // Import demo data
        const { default: demoShipments } = await import('../data/globalShipments');
        await this.saveShipments(demoShipments);
        
        console.log('CloudBackendService: Demo data initialized');
      }
    } catch (error) {
      console.error('Failed to initialize demo data:', error);
    }
  }
}

export const cloudBackend = new CloudBackendService();
export default cloudBackend;