import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, UserCredential } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

interface UserRole {
  role: string;
}

interface AuthContextType {
  currentUser: User | null;
  userRole: string | null;
  loading: boolean;
  error: string | null;
  signUp: (email: string, password: string, role: string, firstName: string, lastName: string) => Promise<UserCredential>;
  signIn: (email: string, password: string) => Promise<UserCredential>;
  logout: () => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setCurrentUser(user);
      
      if (user) {
        // Fetch user role from Firestore
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data() as UserRole;
            setUserRole(userData.role);
          }
        } catch (err) {
          console.error('Error fetching user role:', err);
          setUserRole(null);
        }
      } else {
        setUserRole(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  async function signUp(email: string, password: string, role: string, firstName: string, lastName: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Store additional user data in Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email,
        role,
        firstName,
        lastName,
        isApproved: role === 'admin' ? true : false, // Only admin users are auto-approved
        createdAt: new Date().toISOString()
      });

      return userCredential;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign up');
      throw err;
    }
  }

  async function signIn(email: string, password: string) {
    try {
      return await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign in');
      throw err;
    }
  }

  async function logout() {
    try {
      return await signOut(auth);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to log out');
      throw err;
    }
  }

  const value = {
    currentUser,
    userRole,
    loading,
    error,
    signUp,
    signIn,
    logout
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
} 