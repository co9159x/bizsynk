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

async function migrateCollections() {
  try {
    console.log('Starting migration...\n');

    // 1. Update staff collection
    console.log('Updating staff collection...');
    const staffSnapshot = await db.collection('staff').get();
    const staffBatch = db.batch();
    
    staffSnapshot.docs.forEach(doc => {
      const data = doc.data();
      const [firstName = '', lastName = ''] = data.name.split(' ');
      
      staffBatch.update(doc.ref, {
        firstName,
        lastName,
        userId: data.userId || null,
        createdAt: data.createdAt || new Date().toISOString()
      });
    });
    await staffBatch.commit();
    console.log(`Updated ${staffSnapshot.size} staff documents`);

    // 2. Update services collection
    console.log('\nUpdating services collection...');
    const servicesSnapshot = await db.collection('services').get();
    const servicesBatch = db.batch();
    
    servicesSnapshot.docs.forEach(doc => {
      const data = doc.data();
      servicesBatch.update(doc.ref, {
        price: data.price || 0,
        duration: data.duration || 30,
        description: data.description || `${data.name} service`,
        createdAt: data.createdAt || new Date().toISOString()
      });
    });
    await servicesBatch.commit();
    console.log(`Updated ${servicesSnapshot.size} service documents`);

    // 3. Update inventory collection
    console.log('\nUpdating inventory collection...');
    const inventorySnapshot = await db.collection('inventory').get();
    const inventoryBatch = db.batch();
    
    inventorySnapshot.docs.forEach(doc => {
      const data = doc.data();
      inventoryBatch.update(doc.ref, {
        category: data.category || 'General',
        minimumQuantity: data.minimumQuantity || 5,
        createdAt: data.createdAt || new Date().toISOString()
      });
    });
    await inventoryBatch.commit();
    console.log(`Updated ${inventorySnapshot.size} inventory documents`);

    // 4. Update records collection
    console.log('\nUpdating records collection...');
    const recordsSnapshot = await db.collection('records').get();
    const recordsBatch = db.batch();
    
    recordsSnapshot.docs.forEach(doc => {
      const data = doc.data();
      recordsBatch.update(doc.ref, {
        services: [{ name: data.service, price: data.price }],
        totalPrice: data.price,
        createdAt: data.createdAt || new Date().toISOString()
      });
    });
    await recordsBatch.commit();
    console.log(`Updated ${recordsSnapshot.size} record documents`);

    // 5. Update attendance collection
    console.log('\nUpdating attendance collection...');
    const attendanceSnapshot = await db.collection('attendance').get();
    const attendanceBatch = db.batch();
    
    attendanceSnapshot.docs.forEach(doc => {
      const data = doc.data();
      attendanceBatch.update(doc.ref, {
        createdAt: data.createdAt || new Date().toISOString()
      });
    });
    await attendanceBatch.commit();
    console.log(`Updated ${attendanceSnapshot.size} attendance documents`);

    // 6. Add sample clients
    console.log('\nAdding sample clients...');
    const sampleClients = [
      {
        name: 'John Doe',
        phone: '+1234567890',
        email: 'john.doe@example.com',
        notes: 'Regular customer, prefers haircuts on weekends',
        createdAt: new Date().toISOString()
      },
      {
        name: 'Jane Smith',
        phone: '+1234567891',
        email: 'jane.smith@example.com',
        notes: 'Loyal customer, monthly appointments',
        createdAt: new Date().toISOString()
      },
      {
        name: 'Mike Johnson',
        phone: '+1234567892',
        email: 'mike.johnson@example.com',
        notes: 'New customer, interested in styling services',
        createdAt: new Date().toISOString()
      }
    ];

    const clientsBatch = db.batch();
    sampleClients.forEach(client => {
      const docRef = db.collection('clients').doc();
      clientsBatch.set(docRef, client);
    });
    await clientsBatch.commit();
    console.log(`Added ${sampleClients.length} sample clients`);

    console.log('\nMigration completed successfully!');
  } catch (error) {
    console.error('Error during migration:', error);
  }
}

migrateCollections(); 