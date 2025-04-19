import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Firebase Admin
const app = initializeApp({
  credential: cert({
    projectId: "bizsynk-7737e",
    clientEmail: "firebase-adminsdk-fbsvc@bizsynk-7737e.iam.gserviceaccount.com",
    privateKey: process.env.VITE_FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
  })
});

const db = getFirestore(app);

async function checkCollections() {
  try {
    console.log('Checking Firestore collections...\n');
    
    // List of collections to check
    const collections = [
      'attendance',
      'clients',
      'inventory',
      'records',
      'serviceRecords',
      'services',
      'staff',
      'users'
    ];

    for (const collectionName of collections) {
      const collectionRef = db.collection(collectionName);
      const snapshot = await collectionRef.get();
      
      console.log(`Collection: ${collectionName}`);
      console.log(`Number of documents: ${snapshot.size}`);
      
      if (snapshot.size > 0) {
        console.log('Sample document fields:');
        const sampleDoc = snapshot.docs[0].data();
        console.log(Object.keys(sampleDoc));
      }
      
      console.log('-------------------\n');
    }
  } catch (error) {
    console.error('Error checking collections:', error);
  }
}

checkCollections(); 