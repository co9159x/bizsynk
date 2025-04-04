import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Scissors, Calendar, Users, Package, LayoutDashboard } from 'lucide-react';

const navItems = [
  { to: '/', label: 'Home', icon: Scissors },
  { to: '/records', label: 'Records', icon: Calendar },
  { to: '/attendance', label: 'Attendance', icon: Users },
  { to: '/inventory', label: 'Inventory', icon: Package },
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
];

export default function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-purple-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0 flex items-center">
              <Scissors className="h-8 w-8" />
              <span className="ml-2 text-xl font-bold">SalonSync</span>
            </div>
            <div className="hidden md:block">
              <div className="flex items-center space-x-4">
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
              </div>
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
        </div>
      </div>
    </div>
  );
}