import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import DatabaseInitializer from './components/DatabaseInitializer';
import PrivateRoute from './components/PrivateRoute';
import RoleBasedRoute from './components/RoleBasedRoute';

// Lazy load pages
const Home = lazy(() => import('./pages/Home'));
const Records = lazy(() => import('./pages/Records'));
const Attendance = lazy(() => import('./pages/Attendance'));
const Inventory = lazy(() => import('./pages/Inventory'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const StaffLogin = lazy(() => import('./pages/StaffLogin'));
const SignUp = lazy(() => import('./pages/SignUp'));

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
        <Suspense fallback={<Loading />}>
          <Routes>
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
                  <Route index element={<Navigate to="records" replace />} />
                </Route>
              </Route>
            </Route>

            {/* Redirect root to appropriate login based on role */}
            <Route path="/" element={<Navigate to="/staff/login" replace />} />
          </Routes>
        </Suspense>
      </Router>
    </AuthProvider>
  );
}

export default App;