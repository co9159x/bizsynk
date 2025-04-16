import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Scissors, Calendar, Users, Package, LayoutDashboard, LogOut, Home, MapPin } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

// Define navigation items for different roles
const staffNavItems = [
  { to: '/staff/home', label: 'Home', icon: Home },
  { to: '/staff/records', label: 'Records', icon: Calendar },
  { to: '/staff/attendance', label: 'Attendance', icon: Users },
  { to: '/staff/inventory', label: 'Inventory', icon: Package },
];

const adminNavItems = [
  { to: '/admin/home', label: 'Home', icon: Home },
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/inventory', label: 'Inventory', icon: Package },
  { to: '/admin/locations', label: 'Locations', icon: MapPin },
];

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { userRole, logout } = useAuth();
  
  // Determine which navigation items to show based on user role
  const navItems = userRole === 'admin' ? adminNavItems : staffNavItems;

  const handleLogout = async () => {
    try {
      await logout();
      // Redirect to appropriate login page based on role
      navigate(userRole === 'admin' ? '/admin/login' : '/staff/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  // Get the home path based on user role
  const homePath = userRole === 'admin' ? '/admin/home' : '/staff/home';

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-purple-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link 
              to={homePath}
              className="flex-shrink-0 flex items-center hover:bg-purple-500 px-3 py-2 rounded-md"
            >
              <Scissors className="h-8 w-8" />
              <span className="ml-2 text-xl font-bold">SalonSync</span>
            </Link>
            <div className="hidden md:flex items-center space-x-4">
              {navItems.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  className={`${
                    location.pathname === to
                      ? 'bg-purple-700'
                      : 'hover:bg-purple-500'
                  } px-3 py-2 rounded-md text-sm font-medium flex items-center`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {label}
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="hover:bg-purple-500 px-3 py-2 rounded-md text-sm font-medium flex items-center"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <Outlet />
      </main>

      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t">
        <div className="grid grid-cols-5 gap-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={`${
                location.pathname === to
                  ? 'text-purple-600'
                  : 'text-gray-600'
              } flex flex-col items-center py-2`}
            >
              <Icon className="h-6 w-6" />
              <span className="text-xs">{label}</span>
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="text-gray-600 flex flex-col items-center py-2"
          >
            <LogOut className="h-6 w-6" />
            <span className="text-xs">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}