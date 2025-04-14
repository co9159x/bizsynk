import { db } from './config';
import { collection, getDocs, addDoc, Timestamp } from 'firebase/firestore';

export async function initializeDatabase(): Promise<boolean> {
  try {
    // Initialize collections
    const collections = [
      'staff',
      'services',
      'inventory',
      'records',
      'attendance',
      'clients'
    ];
    
    for (const collectionName of collections) {
      const collectionRef = collection(db, collectionName);
      const snapshot = await getDocs(collectionRef);
      
      if (snapshot.empty) {
        console.log(`Initializing ${collectionName} collection...`);
        
        // Add initial data based on collection
        switch (collectionName) {
          case 'services':
            // Add sample services with categories
            await addDoc(collectionRef, {
              name: 'Haircut',
              price: 5000,
              duration: 30,
              category: 'Hair',
              description: 'Basic haircut service',
              createdAt: Timestamp.now()
            });
            await addDoc(collectionRef, {
              name: 'Manicure',
              price: 3000,
              duration: 45,
              category: 'Nails',
              description: 'Basic manicure service',
              createdAt: Timestamp.now()
            });
            break;
            
          case 'inventory':
            await addDoc(collectionRef, {
              name: 'Shampoo',
              quantity: 10,
              lastUsed: null,
              category: 'Hair Care',
              minimumQuantity: 5,
              createdAt: Timestamp.now()
            });
            break;

          case 'clients':
            await addDoc(collectionRef, {
              name: 'Sample Client',
              phone: '+1234567890',
              email: 'sample@example.com',
              notes: 'Sample client record',
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
    const collections = ['staff', 'services', 'inventory', 'records', 'attendance', 'clients'];
    const results = await Promise.all(
      collections.map(async (collectionName) => {
        const collectionRef = collection(db, collectionName);
        const snapshot = await getDocs(collectionRef);
        return { name: collectionName, initialized: !snapshot.empty };
      })
    );
    
    const uninitializedCollections = results.filter(r => !r.initialized);
    if (uninitializedCollections.length > 0) {
      console.log('Uninitialized collections:', uninitializedCollections.map(c => c.name));
      return false;
    }
    return true;
  } catch (error) {
    console.error('Error checking database initialization:', error);
    return false;
  }
} 