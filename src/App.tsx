import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import DatabaseInitializer from './components/DatabaseInitializer';
import PrivateRoute from './components/PrivateRoute';
import RoleBasedRoute from './components/RoleBasedRoute';
import { Toaster } from 'react-hot-toast';

// Lazy load pages
const Landing = lazy(() => import('./pages/Landing'));
const Home = lazy(() => import('./pages/Home'));
const Records = lazy(() => import('./pages/Records'));
const Attendance = lazy(() => import('./pages/Attendance'));
const Inventory = lazy(() => import('./pages/Inventory'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const StaffLogin = lazy(() => import('./pages/StaffLogin'));
const SignUp = lazy(() => import('./pages/SignUp'));
const Locations = lazy(() => import('./pages/Locations'));

// Loading component
const Loading = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <DatabaseInitializer />
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Toaster position="top-right" />
          <Suspense fallback={<Loading />}>
            <Routes>
              {/* Landing page */}
              <Route path="/" element={<Landing />} />
              
              {/* Public routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/staff/login" element={<StaffLogin />} />
              <Route path="/signup" element={<SignUp />} />
              
              {/* Admin routes */}
              <Route path="/admin" element={<PrivateRoute />}>
                <Route element={<RoleBasedRoute allowedRoles={['admin']} />}>
                  <Route element={<Layout />}>
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="inventory" element={<Inventory />} />
                    <Route path="home" element={<Home />} />
                    <Route path="locations" element={<Locations />} />
                    <Route index element={<Navigate to="dashboard" replace />} />
                  </Route>
                </Route>
              </Route>

              {/* Staff routes */}
              <Route path="/staff" element={<PrivateRoute />}>
                <Route element={<RoleBasedRoute allowedRoles={['staff']} />}>
                  <Route element={<Layout />}>
                    <Route path="records" element={<Records />} />
                    <Route path="attendance" element={<Attendance />} />
                    <Route path="inventory" element={<Inventory />} />
                    <Route path="home" element={<Home />} />
                    <Route index element={<Navigate to="home" replace />} />
                  </Route>
                </Route>
              </Route>

              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;