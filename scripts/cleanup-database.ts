import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Firebase Admin
const app = initializeApp({
  credential: cert({
    projectId: "salonsync-7737e",
    clientEmail: "firebase-adminsdk-fbsvc@salonsync-7737e.iam.gserviceaccount.com",
    privateKey: process.env.VITE_FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
  })
});

const db = getFirestore(app);

async function cleanupDatabase() {
  try {
    console.log('Starting database cleanup...\n');

    // 1. Clean up staff collection - remove unregistered staff
    console.log('Cleaning up staff collection...');
    const staffRef = db.collection('staff');
    const staffSnapshot = await staffRef.get();
    const batch = db.batch();
    let staffCount = 0;

    for (const doc of staffSnapshot.docs) {
      const staffData = doc.data();
      // Check if staff has a userId (registered) and is not mock data
      if (!staffData.userId || staffData.name.includes('Mock')) {
        batch.delete(doc.ref);
        staffCount++;
      }
    }
    await batch.commit();
    console.log(`Removed ${staffCount} unregistered staff members\n`);

    // 2. Remove serviceRecords collection
    console.log('Removing serviceRecords collection...');
    const serviceRecordsRef = db.collection('serviceRecords');
    const serviceRecordsSnapshot = await serviceRecordsRef.get();
    const serviceRecordsBatch = db.batch();
    serviceRecordsSnapshot.docs.forEach(doc => {
      serviceRecordsBatch.delete(doc.ref);
    });
    await serviceRecordsBatch.commit();
    console.log(`Removed ${serviceRecordsSnapshot.size} service records\n`);

    // 3. Remove clients collection
    console.log('Removing clients collection...');
    const clientsRef = db.collection('clients');
    const clientsSnapshot = await clientsRef.get();
    const clientsBatch = db.batch();
    clientsSnapshot.docs.forEach(doc => {
      clientsBatch.delete(doc.ref);
    });
    await clientsBatch.commit();
    console.log(`Removed ${clientsSnapshot.size} client records\n`);

    // 4. Clean up attendance collection - remove mock data
    console.log('Cleaning up attendance collection...');
    const attendanceRef = db.collection('attendance');
    const attendanceSnapshot = await attendanceRef.get();
    const attendanceBatch = db.batch();
    let attendanceCount = 0;

    for (const doc of attendanceSnapshot.docs) {
      const attendanceData = doc.data();
      // Remove mock attendance records or records without staffName
      if (!attendanceData.staffName || attendanceData.staffName.includes('Mock')) {
        attendanceBatch.delete(doc.ref);
        attendanceCount++;
      }
    }
    await attendanceBatch.commit();
    console.log(`Removed ${attendanceCount} mock attendance records\n`);

    // 5. Create locations collection if it doesn't exist
    console.log('Creating locations collection...');
    const locationsRef = db.collection('locations');
    const locationsSnapshot = await locationsRef.get();
    
    if (locationsSnapshot.empty) {
      // Add a default location if none exist
      await locationsRef.add({
        name: 'Main Salon',
        latitude: 0,
        longitude: 0,
        maxDistance: 100, // 100 meters
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      console.log('Added default location\n');
    } else {
      console.log('Locations collection already exists\n');
    }

    console.log('Database cleanup completed successfully!');
  } catch (error) {
    console.error('Error during database cleanup:', error);
  }
}

cleanupDatabase(); 