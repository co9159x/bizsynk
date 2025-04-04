import { db } from './config';
import { ServiceRecord, Staff } from '../../types/index.js';
import { 
  collection, 
  getDocs, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  writeBatch, 
  doc, 
  setDoc,
  Timestamp
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