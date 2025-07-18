// MongoDB Atlas Cloud Backend Service
// This ensures all shipments are accessible from any device worldwide

import { MongoClient, Db, Collection, ObjectId } from 'mongodb';

interface Shipment {
  _id?: string;
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
  createdAt?: Date;
  updatedAt?: Date;
}

// MongoDB Atlas configuration
const MONGODB_URI = 'mongodb+srv://dagrind2nd:AzVLAWgtxtM9rq7Q@clustertrapo.jachvjy.mongodb.net/?retryWrites=true&w=majority&appName=ClusterTrapo';
const DATABASE_NAME = 'Trapo101';
const COLLECTION_NAME = 'God man';

class MongoDBCloudService {
  private client: MongoClient | null = null;
  private db: Db | null = null;
  private collection: Collection<Shipment> | null = null;
  private isConnected = false;
  private connectionPromise: Promise<void> | null = null;

  constructor() {
    this.initializeConnection();
  }

  private async initializeConnection(): Promise<void> {
    if (this.connectionPromise) {
      return this.connectionPromise;
    }

    this.connectionPromise = this.connect();
    return this.connectionPromise;
  }

  private async connect(): Promise<void> {
    try {
      console.log('🔄 Connecting to MongoDB Atlas...');
      
      this.client = new MongoClient(MONGODB_URI, {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });

      await this.client.connect();
      this.db = this.client.db(DATABASE_NAME);
      this.collection = this.db.collection(COLLECTION_NAME);
      this.isConnected = true;

      console.log('✅ Successfully connected to MongoDB Atlas');
      console.log(`📊 Database: ${DATABASE_NAME}`);
      console.log(`📦 Collection: ${COLLECTION_NAME}`);

      // Create indexes for better performance
      await this.createIndexes();
      
    } catch (error) {
      console.error('❌ Failed to connect to MongoDB Atlas:', error);
      this.isConnected = false;
      throw error;
    }
  }

  private async createIndexes(): Promise<void> {
    if (!this.collection) return;

    try {
      // Create index on trackingNumber for fast lookups
      await this.collection.createIndex({ trackingNumber: 1 }, { unique: true });
      // Create index on id for fast lookups
      await this.collection.createIndex({ id: 1 }, { unique: true });
      // Create index on status for filtering
      await this.collection.createIndex({ status: 1 });
      // Create index on createdAt for sorting
      await this.collection.createIndex({ createdAt: -1 });
      
      console.log('📊 MongoDB indexes created successfully');
    } catch (error) {
      console.warn('⚠️ Index creation warning:', error);
    }
  }

  private async ensureConnection(): Promise<void> {
    if (!this.isConnected || !this.collection) {
      await this.initializeConnection();
    }
  }

  async getAllShipments(): Promise<Shipment[]> {
    try {
      await this.ensureConnection();
      console.log('🔍 Fetching all shipments from MongoDB Atlas...');
      
      const shipments = await this.collection!
        .find({})
        .sort({ createdAt: -1 })
        .toArray();

      console.log(`📦 Retrieved ${shipments.length} shipments from MongoDB Atlas`);
      
      // Convert MongoDB _id to string id for frontend compatibility
      return shipments.map(shipment => ({
        ...shipment,
        id: shipment.id || shipment._id?.toString(),
        _id: undefined
      }));
      
    } catch (error) {
      console.error('❌ Error fetching shipments from MongoDB:', error);
      throw new Error('Failed to fetch shipments from cloud database');
    }
  }

  async getShipmentByTrackingNumber(trackingNumber: string): Promise<Shipment | null> {
    try {
      await this.ensureConnection();
      console.log(`🔍 Looking for shipment with tracking number: ${trackingNumber}`);
      
      const shipment = await this.collection!.findOne({ trackingNumber });
      
      if (shipment) {
        console.log(`✅ Found shipment: ${trackingNumber}`);
        return {
          ...shipment,
          id: shipment.id || shipment._id?.toString(),
          _id: undefined
        };
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
      await this.ensureConnection();
      console.log(`🔍 Looking for shipment with ID: ${id}`);
      
      // Try to find by custom id first, then by MongoDB _id
      let shipment = await this.collection!.findOne({ id });
      
      if (!shipment && ObjectId.isValid(id)) {
        shipment = await this.collection!.findOne({ _id: new ObjectId(id) });
      }
      
      if (shipment) {
        console.log(`✅ Found shipment: ${id}`);
        return {
          ...shipment,
          id: shipment.id || shipment._id?.toString(),
          _id: undefined
        };
      }
      
      console.log(`❌ No shipment found with ID: ${id}`);
      return null;
      
    } catch (error) {
      console.error('❌ Error fetching shipment by ID:', error);
      return null;
    }
  }

  async createShipment(shipment: Omit<Shipment, 'id' | '_id'>): Promise<Shipment> {
    try {
      await this.ensureConnection();
      console.log(`📝 Creating new shipment: ${shipment.trackingNumber}`);
      
      const newShipment: Shipment = {
        ...shipment,
        id: this.generateId(),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const result = await this.collection!.insertOne(newShipment);
      
      if (result.acknowledged) {
        console.log(`✅ Successfully created shipment: ${shipment.trackingNumber}`);
        
        // Broadcast change for real-time updates
        this.broadcastChange('shipment_created', newShipment);
        
        return {
          ...newShipment,
          _id: undefined
        };
      } else {
        throw new Error('Failed to create shipment in database');
      }
      
    } catch (error) {
      console.error('❌ Error creating shipment:', error);
      if (error.code === 11000) {
        throw new Error('Shipment with this tracking number already exists');
      }
      throw new Error('Failed to create shipment in cloud database');
    }
  }

  async updateShipment(id: string, updates: Partial<Shipment>): Promise<Shipment> {
    try {
      await this.ensureConnection();
      console.log(`📝 Updating shipment: ${id}`);
      
      const updateData = {
        ...updates,
        updatedAt: new Date(),
        _id: undefined // Remove _id from updates
      };

      // Try to update by custom id first, then by MongoDB _id
      let result = await this.collection!.updateOne(
        { id },
        { $set: updateData }
      );

      if (result.matchedCount === 0 && ObjectId.isValid(id)) {
        result = await this.collection!.updateOne(
          { _id: new ObjectId(id) },
          { $set: updateData }
        );
      }

      if (result.matchedCount === 0) {
        throw new Error('Shipment not found');
      }

      console.log(`✅ Successfully updated shipment: ${id}`);
      
      // Get the updated shipment
      const updatedShipment = await this.getShipmentById(id);
      
      if (updatedShipment) {
        // Broadcast change for real-time updates
        this.broadcastChange('shipment_updated', updatedShipment);
        return updatedShipment;
      } else {
        throw new Error('Failed to retrieve updated shipment');
      }
      
    } catch (error) {
      console.error('❌ Error updating shipment:', error);
      throw new Error('Failed to update shipment in cloud database');
    }
  }

  async deleteShipment(id: string): Promise<void> {
    try {
      await this.ensureConnection();
      console.log(`🗑️ Deleting shipment: ${id}`);
      
      // Try to delete by custom id first, then by MongoDB _id
      let result = await this.collection!.deleteOne({ id });

      if (result.deletedCount === 0 && ObjectId.isValid(id)) {
        result = await this.collection!.deleteOne({ _id: new ObjectId(id) });
      }

      if (result.deletedCount === 0) {
        throw new Error('Shipment not found');
      }

      console.log(`✅ Successfully deleted shipment: ${id}`);
      
      // Broadcast change for real-time updates
      this.broadcastChange('shipment_deleted', { id });
      
    } catch (error) {
      console.error('❌ Error deleting shipment:', error);
      throw new Error('Failed to delete shipment from cloud database');
    }
  }

  async addTrackingEvent(id: string, event: any): Promise<void> {
    try {
      await this.ensureConnection();
      console.log(`📍 Adding tracking event to shipment: ${id}`);
      
      const trackingEvent = {
        ...event,
        timestamp: event.timestamp || new Date().toISOString(),
        id: this.generateId()
      };

      // Try to update by custom id first, then by MongoDB _id
      let result = await this.collection!.updateOne(
        { id },
        { 
          $push: { trackingHistory: { $each: [trackingEvent], $position: 0 } },
          $set: { updatedAt: new Date() }
        }
      );

      if (result.matchedCount === 0 && ObjectId.isValid(id)) {
        result = await this.collection!.updateOne(
          { _id: new ObjectId(id) },
          { 
            $push: { trackingHistory: { $each: [trackingEvent], $position: 0 } },
            $set: { updatedAt: new Date() }
          }
        );
      }

      if (result.matchedCount === 0) {
        throw new Error('Shipment not found');
      }

      console.log(`✅ Successfully added tracking event to shipment: ${id}`);
      
      // Get updated shipment and broadcast change
      const updatedShipment = await this.getShipmentById(id);
      if (updatedShipment) {
        this.broadcastChange('tracking_updated', updatedShipment);
      }
      
    } catch (error) {
      console.error('❌ Error adding tracking event:', error);
      throw new Error('Failed to add tracking event to cloud database');
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

  // Initialize with demo data if collection is empty
  async initializeWithDemoData(): Promise<void> {
    try {
      await this.ensureConnection();
      console.log('🔍 Checking if MongoDB collection needs initialization...');
      
      const count = await this.collection!.countDocuments();
      
      if (count === 0) {
        console.log('📦 Initializing MongoDB with demo shipments...');
        
        // Import demo data
        const { default: demoShipments } = await import('../data/globalShipments');
        
        // Add metadata to demo shipments
        const shipmentsWithMetadata = demoShipments.map(shipment => ({
          ...shipment,
          createdAt: new Date(),
          updatedAt: new Date()
        }));
        
        await this.collection!.insertMany(shipmentsWithMetadata);
        
        console.log(`✅ Successfully initialized MongoDB with ${demoShipments.length} demo shipments`);
      } else {
        console.log(`📊 MongoDB collection already has ${count} shipments`);
      }
      
    } catch (error) {
      console.error('❌ Failed to initialize demo data:', error);
      throw error;
    }
  }

  // Health check method
  async healthCheck(): Promise<boolean> {
    try {
      await this.ensureConnection();
      await this.db!.admin().ping();
      return true;
    } catch (error) {
      console.error('❌ MongoDB health check failed:', error);
      return false;
    }
  }

  // Cleanup method
  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.close();
      this.isConnected = false;
      console.log('🔌 Disconnected from MongoDB Atlas');
    }
  }
}

export const cloudBackend = new MongoDBCloudService();
export default cloudBackend;