import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface RoleBasedRouteProps {
  allowedRoles: string[];
}

export default function RoleBasedRoute({ allowedRoles }: RoleBasedRouteProps) {
  const { currentUser, userRole, loading } = useAuth();
  const [isApproved, setIsApproved] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkApprovalStatus() {
      if (currentUser) {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setIsApproved(userData.isApproved);
        }
      }
    }
    checkApprovalStatus();
  }, [currentUser]);

  if (loading || isApproved === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!currentUser) {
    // Redirect to the appropriate login page based on the current path
    const path = window.location.pathname;
    if (path.startsWith('/admin')) {
      return <Navigate to="/admin/login" />;
    }
    return <Navigate to="/staff/login" />;
  }

  if (!userRole) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">Error: User role not found</div>
      </div>
    );
  }

  if (!allowedRoles.includes(userRole)) {
    // Redirect to the appropriate home page based on the user's role
    if (userRole === 'admin') {
      return <Navigate to="/admin/home" />;
    }
    return <Navigate to="/staff/home" />;
  }

  // Check if user is approved (except for admin users)
  if (userRole !== 'admin' && !isApproved) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Account Pending Approval</h2>
          <p className="text-gray-600">Your account is waiting for admin approval. Please check back later.</p>
        </div>
      </div>
    );
  }

  return <Outlet />;
} 