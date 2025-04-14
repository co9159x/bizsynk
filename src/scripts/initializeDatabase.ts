import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, Timestamp } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import fs from 'fs';

// Load environment variables from .env file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = resolve(__dirname, '../../.env');

if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
  console.log('Environment variables loaded from .env file');
} else {
  console.error('.env file not found at:', envPath);
  process.exit(1);
}

// Your Firebase configuration
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

async function initializeDatabase() {
  try {
    // Create admin user
    const adminEmail = 'admin@gmghairsalon.com';
    const adminPassword = 'Gabriella16$';
    
    console.log('Creating admin user...');
    const adminUserCredential = await createUserWithEmailAndPassword(auth, adminEmail, adminPassword);
    const adminUid = adminUserCredential.user.uid;

    // Initialize users collection with admin
    console.log('Initializing users collection...');
    await setDoc(doc(db, 'users', adminUid), {
      email: adminEmail,
      role: 'admin',
      firstName: 'Admin',
      lastName: 'User',
      createdAt: Timestamp.now()
    });

    // Initialize staff collection with a template
    console.log('Initializing staff collection...');
    const staffDoc = doc(collection(db, 'staff'));
    await setDoc(staffDoc, {
      name: 'Template Staff',
      role: 'Barber',
      email: '',
      phone: '',
      status: 'out',
      lastClockIn: null,
      lastClockOut: null,
      userId: null,
      firstName: '',
      lastName: '',
      createdAt: Timestamp.now()
    });

    // Initialize records collection
    console.log('Initializing records collection...');
    const recordDoc = doc(collection(db, 'records'));
    await setDoc(recordDoc, {
      date: Timestamp.now(),
      staff: 'Template Staff',
      clientName: 'Sample Client',
      service: 'Haircut',
      price: 5000,
      paymentMethod: 'cash'
    });

    // Initialize inventory collection
    console.log('Initializing inventory collection...');
    const inventoryItems = [
      {
        name: 'Hair Clippers',
        quantity: 5,
        lastUsed: Timestamp.now(),
        lastUsedBy: 'System'
      },
      {
        name: 'Scissors',
        quantity: 10,
        lastUsed: Timestamp.now(),
        lastUsedBy: 'System'
      },
      {
        name: 'Hair Dryer',
        quantity: 3,
        lastUsed: Timestamp.now(),
        lastUsedBy: 'System'
      }
    ];

    for (const item of inventoryItems) {
      const inventoryDoc = doc(collection(db, 'inventory'));
      await setDoc(inventoryDoc, item);
    }

    console.log('Database initialization completed successfully!');
    console.log('Admin credentials:');
    console.log('Email:', adminEmail);
    console.log('Password:', adminPassword);
    console.log('\nNote: Staff members can now create their own accounts through the application.');

  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

// Run the initialization
initializeDatabase(); 