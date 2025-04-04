import { initializeDatabase } from '../src/lib/firebase/initDb.js';

async function main() {
  console.log('Starting database initialization script...');
  
  try {
    const success = await initializeDatabase();
    if (success) {
      console.log('Database initialization completed successfully!');
      process.exit(0);
    } else {
      console.error('Database initialization failed.');
      process.exit(1);
    }
  } catch (error) {
    console.error('Error during database initialization:', error);
    process.exit(1);
  }
}

main(); 