import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface RoleBasedRouteProps {
  allowedRoles: string[];
}

export default function RoleBasedRoute({ allowedRoles }: RoleBasedRouteProps) {
  const { currentUser, userRole, loading } = useAuth();

  if (loading) {
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
      return <Navigate to="/admin/dashboard" />;
    }
    return <Navigate to="/staff/records" />;
  }

  return <Outlet />;
} 