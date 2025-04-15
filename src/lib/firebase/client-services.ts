import { db } from './config';
import { ServiceRecord, Staff, InventoryItem, Service } from '../../types/index.js';
import { 
  collection, 
  getDocs, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  writeBatch, 
  doc,
  Timestamp,
  updateDoc
} from 'firebase/firestore';

export const clearStaffCollection = async () => {
  try {
    console.log('Clearing staff collection...');
    const staffRef = collection(db, 'staff');
    const snapshot = await getDocs(staffRef);
    
    const batch = writeBatch(db);
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    
    await batch.commit();
    console.log('Staff collection cleared successfully');
    return true;
  } catch (error) {
    console.error('Error clearing staff collection:', error);
    return false;
  }
};

export const addServiceRecord = async (record: Omit<ServiceRecord, 'id'>) => {
  try {
    const recordsRef = collection(db, 'records');
    await addDoc(recordsRef, {
      ...record,
      createdAt: Timestamp.now()
    });
    return true;
  } catch (error) {
    console.error('Error adding service record:', error);
    return false;
  }
};

export const getServiceRecords = async (date?: string) => {
  try {
    const recordsRef = collection(db, 'records');
    let q = query(recordsRef);
    
    if (date) {
      q = query(q, where('date', '==', date));
    }
    
    q = query(q, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as ServiceRecord[];
  } catch (error) {
    console.error('Error getting service records:', error);
    if (error instanceof Error && error.message.includes('index')) {
      try {
        const recordsRef = collection(db, 'records');
        const q = date 
          ? query(recordsRef, where('date', '==', date))
          : query(recordsRef);
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as ServiceRecord[];
      } catch (fallbackError) {
        console.error('Error with fallback query:', fallbackError);
        return [];
      }
    }
    return [];
  }
};

export const getStaff = async () => {
  try {
    const staffRef = collection(db, 'staff');
    const snapshot = await getDocs(staffRef);
    console.log(`Found ${snapshot.size} staff members`);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Staff[];
  } catch (error) {
    console.error('Error getting staff:', error);
    return [];
  }
};

export const addMultipleStaff = async (staffList: Omit<Staff, 'id'>[]) => {
  try {
    console.log('Adding multiple staff members...');
    const batch = writeBatch(db);
    const staffCollection = collection(db, 'staff');
    
    staffList.forEach((staff) => {
      const docRef = doc(staffCollection);
      batch.set(docRef, staff);
    });

    await batch.commit();
    console.log('Successfully added staff members');
    return true;
  } catch (error) {
    console.error('Error adding multiple staff:', error);
    throw error;
  }
};

export const getInventory = async () => {
  try {
    const inventoryRef = collection(db, 'inventory');
    const snapshot = await getDocs(inventoryRef);
    
    // Process the data to ensure proper types and prevent duplicates
    const items = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        quantity: parseInt(String(data.quantity)) || 0
      };
    }) as InventoryItem[];
    
    // Group by name (case-insensitive) and sum quantities
    const groupedItems = items.reduce((acc, item) => {
      const key = item.name.toLowerCase().trim();
      if (!acc[key]) {
        acc[key] = {
          ...item,
          quantity: 0
        };
      }
      acc[key].quantity += parseInt(String(item.quantity)) || 0;
      return acc;
    }, {} as Record<string, InventoryItem>);
    
    // Convert back to array
    return Object.values(groupedItems);
  } catch (error) {
    console.error('Error getting inventory:', error);
    return [];
  }
};

export const addInventoryItem = async (item: Omit<InventoryItem, 'id'>) => {
  try {
    const inventoryRef = collection(db, 'inventory');
    await addDoc(inventoryRef, {
      ...item,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return true;
  } catch (error) {
    console.error('Error adding inventory item:', error);
    return false;
  }
};

export const updateInventoryItem = async (id: string, updates: Partial<InventoryItem>) => {
  try {
    const itemRef = doc(db, 'inventory', id);
    
    // Ensure quantity is a number
    const processedUpdates = {
      ...updates,
      quantity: updates.quantity !== undefined ? parseInt(String(updates.quantity)) || 0 : undefined,
      updatedAt: Timestamp.now()
    };
    
    await updateDoc(itemRef, processedUpdates);
    return true;
  } catch (error) {
    console.error('Error updating inventory item:', error);
    return false;
  }
};

interface ServiceCategory {
  category: string;
  services: Service[];
}

export const getServices = async (): Promise<ServiceCategory[]> => {
  try {
    const servicesRef = collection(db, 'services');
    const snapshot = await getDocs(servicesRef);
    const servicesData = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Service[];

    // Group services by category
    const servicesByCategory = servicesData.reduce((acc, service) => {
      const category = service.category || 'Uncategorized';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(service);
      return acc;
    }, {} as Record<string, Service[]>);

    // Convert to array format
    return Object.entries(servicesByCategory).map(([category, services]) => ({
      category,
      services
    }));
  } catch (error) {
    console.error('Error fetching services:', error);
    throw error;
  }
}; 