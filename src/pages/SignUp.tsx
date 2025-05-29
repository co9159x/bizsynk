import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { doc, setDoc, collection } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { capitalizeWords } from '../utils/format';
import PasswordInput from '../components/PasswordInput';
import { Scissors } from 'lucide-react';
import { toast } from 'react-hot-toast';

const STAFF_ROLES = [
  'Cashier',
  'Supervisor',
  'Manager'
] as const;

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState<typeof STAFF_ROLES[number]>('Cashier');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    try {
      setError('');
      setLoading(true);

      // Format first and last names
      const formattedFirstName = capitalizeWords(firstName.trim());
      const formattedLastName = capitalizeWords(lastName.trim());
      const fullName = `${formattedFirstName} ${formattedLastName}`;

      const userCredential = await signUp(email, password, 'staff', formattedFirstName, formattedLastName);
      
      // Create staff record
      const staffDoc = doc(collection(db, 'staff'));
      await setDoc(staffDoc, {
        name: fullName,
        firstName: formattedFirstName,
        lastName: formattedLastName,
        role,
        email: email.toLowerCase().trim(),
        phone: '',
        status: 'out',
        lastClockIn: null,
        lastClockOut: null,
        userId: userCredential.user.uid,
        createdAt: new Date().toISOString()
      });

      navigate('/staff/home');
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        toast.error('This email is already registered. Please use a different email or sign in.');
      } else {
        toast.error('Failed to create an account. Please try again.');
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to format name input
  const handleNameInput = (value: string, setter: React.Dispatch<React.SetStateAction<string>>) => {
    // Remove any non-letter characters except spaces and hyphens
    const sanitized = value.replace(/[^a-zA-Z\s-]/g, '');
    setter(sanitized);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center items-center">
            <Scissors className="h-8 w-8 text-purple-600" />
            <span className="ml-2 text-2xl font-bold text-gray-900">BizSynk</span>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="firstName" className="sr-only">
                First Name
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                required
                value={firstName}
                onChange={(e) => handleNameInput(e.target.value, setFirstName)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                placeholder="First Name"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="sr-only">
                Last Name
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                required
                value={lastName}
                onChange={(e) => handleNameInput(e.target.value, setLastName)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                placeholder="Last Name"
              />
            </div>
            <div>
              <label htmlFor="role" className="sr-only">
                Role
              </label>
              <select
                id="role"
                name="role"
                required
                value={role}
                onChange={(e) => setRole(e.target.value as typeof STAFF_ROLES[number])}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
              >
                {STAFF_ROLES.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <PasswordInput
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                autoComplete="new-password"
                className="rounded-none"
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="sr-only">
                Confirm Password
              </label>
              <PasswordInput
                id="confirm-password"
                name="confirm-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                autoComplete="new-password"
                className="rounded-b-md"
              />
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              {loading ? 'Creating account...' : 'Sign up'}
            </button>
          </div>

          <div className="text-sm text-center">
            <Link to="/staff/login" className="font-medium text-purple-600 hover:text-purple-500">
              Already have an account? Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
} 