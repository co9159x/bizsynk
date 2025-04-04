import { db } from './config';
import { collection, getDocs, addDoc, Timestamp } from 'firebase/firestore';

export async function initializeDatabase(): Promise<boolean> {
  try {
    // Initialize collections
    const collections = ['staff', 'services', 'inventory', 'records'];
    
    for (const collectionName of collections) {
      const collectionRef = collection(db, collectionName);
      const snapshot = await getDocs(collectionRef);
      
      if (snapshot.empty) {
        console.log(`Initializing ${collectionName} collection...`);
        
        // Add initial data based on collection
        switch (collectionName) {
          case 'services':
            await addDoc(collectionRef, {
              name: 'Haircut',
              price: 5000,
              duration: 30,
              createdAt: Timestamp.now()
            });
            break;
            
          case 'inventory':
            await addDoc(collectionRef, {
              name: 'Shampoo',
              quantity: 10,
              lastUsed: null,
              createdAt: Timestamp.now()
            });
            break;
        }
      } else {
        console.log(`${collectionName} collection already exists with ${snapshot.size} documents`);
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error initializing database:', error);
    return false;
  }
}

// Function to check if database is initialized
export async function isDatabaseInitialized() {
  try {
    const staffCollection = collection(db, 'staff');
    const staffDocs = await getDocs(staffCollection);
    return !staffDocs.empty;
  } catch (error) {
    console.error('Error checking database initialization:', error);
    return false;
  }
} 