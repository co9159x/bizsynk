import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync } from 'fs';

// Initialize Firebase Admin
const serviceAccount = JSON.parse(
  readFileSync('./serviceAccountKey.json', 'utf-8')
);

const app = initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore(app);

function capitalizeWords(str: string): string {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function withRetry<T>(
  operation: () => Promise<T>,
  retries = 3,
  initialDelay = 1000
): Promise<T> {
  let lastError;
  for (let i = 0; i < retries; i++) {
    try {
      return await operation();
    } catch (error: any) {
      lastError = error;
      if (error?.code === 8) { // RESOURCE_EXHAUSTED
        const backoffDelay = initialDelay * Math.pow(2, i);
        console.log(`Rate limited. Waiting ${backoffDelay}ms before retry ${i + 1}/${retries}`);
        await delay(backoffDelay);
        continue;
      }
      throw error;
    }
  }
  throw lastError;
}

async function updateStaffNames() {
  console.log('Starting staff name update...');
  
  try {
    // Get all staff documents in smaller chunks
    const batchSize = 3; // Very small batch size
    const delayBetweenBatches = 5000; // 5 seconds between batches
    let lastDoc = null;
    let processed = 0;
    let attempts = 0;
    
    while (true) {
      try {
        let query = db.collection('staff').orderBy('email');
        if (lastDoc) {
          query = query.startAfter(lastDoc);
        }
        query = query.limit(batchSize);
        
        const snapshot = await withRetry(async () => query.get());
        if (snapshot.empty) break;
        
        console.log(`Processing batch of ${snapshot.size} documents...`);
        
        const batch = db.batch();
        let batchCount = 0;
        
        for (const doc of snapshot.docs) {
          const staffData = doc.data();
          const firstName = staffData.firstName || '';
          const lastName = staffData.lastName || '';
          
          if (firstName !== capitalizeWords(firstName) || lastName !== capitalizeWords(lastName)) {
            batch.update(doc.ref, {
              firstName: capitalizeWords(firstName),
              lastName: capitalizeWords(lastName)
            });
            batchCount++;
          }
          
          lastDoc = doc;
        }
        
        if (batchCount > 0) {
          await withRetry(async () => batch.commit());
          processed += batchCount;
          console.log(`Processed ${processed} records so far`);
        }
        
        // Add delay between batches
        await delay(delayBetweenBatches);
        attempts = 0; // Reset attempts counter after successful batch
      } catch (error: any) {
        attempts++;
        if (attempts >= 3) {
          console.error('Too many failed attempts, stopping migration');
          throw error;
        }
        console.error('Error processing batch:', error);
        await delay(10000); // Wait 10 seconds before retrying
      }
    }
    
    console.log(`Successfully updated ${processed} staff records`);
  } catch (error) {
    console.error('Error updating staff names:', error);
    throw error;
  }
}

// Run the update
updateStaffNames()
  .then(() => {
    console.log('Migration completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  }); 