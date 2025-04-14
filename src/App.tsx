import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
const Login = lazy(() => import('./pages/Login'));
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
            {/* Auth routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            
            {/* Protected routes */}
            <Route element={<PrivateRoute />}>
              <Route element={<Layout />}>
                {/* Common routes for all authenticated users */}
                <Route index element={<Home />} />
                
                {/* Staff-only routes */}
                <Route element={<RoleBasedRoute allowedRoles={['staff']} />}>
                  <Route path="records" element={<Records />} />
                  <Route path="attendance" element={<Attendance />} />
                </Route>
                
                {/* Admin-only routes */}
                <Route element={<RoleBasedRoute allowedRoles={['admin']} />}>
                  <Route path="dashboard" element={<Dashboard />} />
                </Route>
                
                {/* Routes accessible by both roles */}
                <Route element={<RoleBasedRoute allowedRoles={['admin', 'staff']} />}>
                  <Route path="inventory" element={<Inventory />} />
                </Route>
              </Route>
            </Route>
          </Routes>
        </Suspense>
      </Router>
    </AuthProvider>
  );
}

export default App;