import { adminDb } from './admin.js';
import { ServiceRecord, Staff } from '../../types/index.js';
import { Query, CollectionReference } from 'firebase-admin/firestore';

export const clearStaffCollection = async () => {
  try {
    console.log('Clearing staff collection...');
    const staffRef = adminDb.collection('staff');
    const snapshot = await staffRef.get();
    
    const batch = adminDb.batch();
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
    const recordsRef = adminDb.collection('records');
    await recordsRef.add({
      ...record,
      createdAt: new Date()
    });
    return true;
  } catch (error) {
    console.error('Error adding service record:', error);
    return false;
  }
};

export const getServiceRecords = async (date?: string) => {
  try {
    const recordsRef = adminDb.collection('records');
    let query: Query | CollectionReference = recordsRef;
    
    if (date) {
      query = query.where('date', '==', date);
    }
    
    query = query.orderBy('createdAt', 'desc');
    const snapshot = await query.get();
    
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
    const staffRef = adminDb.collection('staff');
    const snapshot = await staffRef.get();
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
    const batch = adminDb.batch();
    const staffCollection = adminDb.collection('staff');
    
    staffList.forEach((staff) => {
      const docRef = staffCollection.doc();
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