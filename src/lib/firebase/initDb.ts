import { adminDb } from './admin.js';

export async function initializeDatabase(): Promise<boolean> {
  try {
    // Initialize collections
    const collections = ['staff', 'services', 'inventory', 'records'];
    
    for (const collectionName of collections) {
      const collectionRef = adminDb.collection(collectionName);
      const snapshot = await collectionRef.get();
      
      if (snapshot.empty) {
        console.log(`Initializing ${collectionName} collection...`);
        
        // Add initial data based on collection
        switch (collectionName) {
          case 'services':
            await collectionRef.add({
              name: 'Haircut',
              price: 5000,
              duration: 30,
              createdAt: new Date()
            });
            break;
            
          case 'inventory':
            await collectionRef.add({
              name: 'Shampoo',
              quantity: 10,
              lastUsed: null,
              createdAt: new Date()
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
    const staffCollection = adminDb.collection('staff');
    const staffDocs = await staffCollection.get();
    return !staffDocs.empty;
  } catch (error) {
    console.error('Error checking database initialization:', error);
    return false;
  }
} 