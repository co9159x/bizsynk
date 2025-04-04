import { useEffect, useState } from 'react';
import { initializeDatabase, isDatabaseInitialized } from '../lib/firebase/client-initDb';
import { useAuth } from '../contexts/AuthContext';

export default function DatabaseInitializer() {
  const [isInitialized, setIsInitialized] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('Waiting for authentication...');
  const { currentUser } = useAuth();

  useEffect(() => {
    async function checkAndInitializeDatabase() {
      if (!currentUser) {
        setStatus('Waiting for authentication...');
        return;
      }

      try {
        setStatus('Checking if database is initialized...');
        // Check if database is already initialized
        const initialized = await isDatabaseInitialized();
        
        if (!initialized) {
          setStatus('Database not initialized. Starting initialization...');
          // Initialize database with sample data
          const success = await initializeDatabase();
          if (!success) {
            setError('Failed to initialize database. Please check the console for details.');
          } else {
            setStatus('Database initialized successfully!');
          }
        } else {
          setStatus('Database is already initialized.');
        }
        
        setIsInitialized(true);
      } catch (err) {
        console.error('Error during database initialization:', err);
        // Check if it's a permissions error
        if (err instanceof Error && err.message.includes('Missing or insufficient permissions')) {
          setError('Database access denied. Please check your Firebase security rules.');
        } else {
          setError('An error occurred while initializing the database. Please check the console for details.');
        }
        // Still set initialized to true so the app can continue
        setIsInitialized(true);
      }
    }

    checkAndInitializeDatabase();
  }, [currentUser]);

  if (error) {
    return (
      <div className="fixed inset-0 bg-red-50 flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-xl font-semibold text-red-600 mb-4">Database Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500 mb-4">Please check the browser console for more details.</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!isInitialized) {
    return (
      <div className="fixed inset-0 bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{status}</p>
        </div>
      </div>
    );
  }

  return null;
} 