import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import cloudBackend from '../services/api';

interface ShipmentContextType {
  getShipments: () => Promise<any[]>;
  getShipment: (id: string) => Promise<any>;
  createShipment: (shipment: any) => Promise<any>;
  updateShipment: (id: string, shipment: any) => Promise<any>;
  deleteShipment: (id: string) => Promise<void>;
  updateShipmentStatus: (id: string, status: string) => Promise<void>;
  addTrackingEvent: (id: string, event: any) => Promise<void>;
  updateShipmentLocation: (id: string, location: string, details: string) => Promise<void>;
  isLoading: boolean;
}

const ShipmentContext = createContext<ShipmentContextType | undefined>(undefined);

export const useShipment = () => {
  const context = useContext(ShipmentContext);
  if (!context) {
    throw new Error('useShipment must be used within a ShipmentProvider');
  }
  return context;
};

interface ShipmentProviderProps {
  children: ReactNode;
}

export const ShipmentProvider: React.FC<ShipmentProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    // Initialize the global cloud backend with demo data if needed
    const initializeGlobalBackend = async () => {
      try {
        console.log('Initializing global cloud backend...');
        await cloudBackend.initializeWithDemoData();
        
        // Verify cloud connectivity
        const isHealthy = await cloudBackend.healthCheck();
        if (isHealthy) {
          console.log('✅ Global cloud backend is healthy and ready');
        } else {
          console.warn('⚠️ Cloud backend connectivity issues detected');
        }
      } catch (error) {
        console.error('Failed to initialize global backend:', error);
      }
    };
    
    initializeGlobalBackend();
    
    // Listen for shipment updates from other tabs/windows
    const handleShipmentsUpdated = (event: CustomEvent) => {
      console.log('Global shipments updated - refreshing data');
      // You could trigger a refresh here if needed
    };
    
    window.addEventListener('shipmentsUpdated', handleShipmentsUpdated as EventListener);
    
    return () => {
      window.removeEventListener('shipmentsUpdated', handleShipmentsUpdated as EventListener);
    };
  }, []);
  
  const getShipments = async (): Promise<any[]> => {
    setIsLoading(true);
    try {
      const shipments = await cloudBackend.getAllShipments();
      console.log('ShipmentContext: Retrieved', shipments.length, 'shipments');
      return shipments;
    } catch (error) {
      console.error('Error fetching shipments:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const getShipment = async (id: string): Promise<any> => {
    setIsLoading(true);
    try {
      console.log('ShipmentContext: Looking for shipment:', id);
      
      // Try to find by tracking number first
      let shipment = await cloudBackend.getShipmentByTrackingNumber(id);
      
      // If not found by tracking number, try by ID
      if (!shipment) {
        shipment = await cloudBackend.getShipmentById(id);
      }
      
      console.log('ShipmentContext: Found shipment:', !!shipment);
      return shipment;
    } catch (error) {
      console.error('Error fetching shipment:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const createShipment = async (shipment: any): Promise<any> => {
    setIsLoading(true);
    try {
      console.log('ShipmentContext: Creating shipment:', shipment.trackingNumber);
      const newShipment = await cloudBackend.createShipment(shipment);
      console.log('ShipmentContext: Created shipment successfully');
      return newShipment;
    } catch (error) {
      console.error('Error creating shipment:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const updateShipment = async (id: string, shipment: any): Promise<any> => {
    setIsLoading(true);
    try {
      console.log('ShipmentContext: Updating shipment:', id);
      const updatedShipment = await cloudBackend.updateShipment(id, shipment);
      console.log('ShipmentContext: Updated shipment successfully');
      return updatedShipment;
    } catch (error) {
      console.error('Error updating shipment:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const deleteShipment = async (id: string): Promise<void> => {
    setIsLoading(true);
    try {
      console.log('ShipmentContext: Deleting shipment:', id);
      await cloudBackend.deleteShipment(id);
      console.log('ShipmentContext: Deleted shipment successfully');
    } catch (error) {
      console.error('Error deleting shipment:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const updateShipmentStatus = async (id: string, status: string): Promise<void> => {
    setIsLoading(true);
    try {
      console.log('ShipmentContext: Updating status for:', id, 'to:', status);
      await cloudBackend.updateShipment(id, { status });
      console.log('ShipmentContext: Status updated successfully');
    } catch (error) {
      console.error('Error updating shipment status:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const addTrackingEvent = async (id: string, event: any): Promise<void> => {
    setIsLoading(true);
    try {
      console.log('ShipmentContext: Adding tracking event to:', id);
      await cloudBackend.addTrackingEvent(id, event);
      console.log('ShipmentContext: Tracking event added successfully');
    } catch (error) {
      console.error('Error adding tracking event:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const updateShipmentLocation = async (id: string, location: string, details: string): Promise<void> => {
    setIsLoading(true);
    try {
      console.log('ShipmentContext: Updating location for:', id, 'to:', location);
      
      const locationUpdateEvent = {
        status: 'completed',
        statusCode: 'location_updated',
        location,
        timestamp: new Date().toISOString(),
        details: details || `Location updated to ${location}`
      };
      
      await cloudBackend.addTrackingEvent(id, locationUpdateEvent);
      console.log('ShipmentContext: Location updated successfully');
    } catch (error) {
      console.error('Error updating shipment location:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const value = {
    getShipments,
    getShipment,
    createShipment,
    updateShipment,
    deleteShipment,
    updateShipmentStatus,
    addTrackingEvent,
    updateShipmentLocation,
    isLoading
  };
  
  return <ShipmentContext.Provider value={value}>{children}</ShipmentContext.Provider>;
};