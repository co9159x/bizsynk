import { db } from './config';
import { ServiceRecord, Staff, InventoryItem } from '../../types/index.js';
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
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as InventoryItem[];
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
      createdAt: Timestamp.now()
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
    await updateDoc(itemRef, {
      ...updates,
      updatedAt: Timestamp.now()
    });
    return true;
  } catch (error) {
    console.error('Error updating inventory item:', error);
    return false;
  }
};

export const getServices = async () => {
  try {
    const servicesRef = collection(db, 'services');
    const snapshot = await getDocs(servicesRef);
    
    const services = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Group services by category
    const groupedServices = services.reduce((acc, service) => {
      const category = service.category || 'Other';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push({
        name: service.name,
        price: service.price
      });
      return acc;
    }, {} as Record<string, { name: string; price: number }[]>);

    // Convert to the format expected by the UI
    return Object.entries(groupedServices).map(([category, services]) => ({
      category,
      services
    }));
  } catch (error) {
    console.error('Error getting services:', error);
    return [];
  }
}; 