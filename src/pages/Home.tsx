import { Link } from 'react-router-dom';
import { Calendar, Users, Package, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useEffect } from 'react';

const staffFeatures = [
  {
    icon: Calendar,
    title: 'Daily Records',
    description: 'Log and track daily services and transactions',
    link: '/staff/records'
  },
  {
    icon: Users,
    title: 'Attendance Monitoring',
    description: 'Monitor staff clock-in/out times',
    link: '/staff/attendance'
  },
  {
    icon: Package,
    title: 'Inventory Management',
    description: 'Track products and get low stock alerts',
    link: '/staff/inventory'
  }
];

const adminFeatures = [
  {
    icon: LayoutDashboard,
    title: 'Dashboard',
    description: 'View reports and analytics',
    link: '/admin/dashboard'
  },
  {
    icon: Package,
    title: 'Inventory Management',
    description: 'Track products and get low stock alerts',
    link: '/admin/inventory'
  }
];

export default function Home() {
  const { currentUser, userRole } = useAuth();

  useEffect(() => {
    async function fetchUserData() {
      if (currentUser) {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          // Assuming you want to set the first name
          // You might want to handle this differently based on your data structure
          // For example, you might want to use a state to handle this
        }
      }
    }
    fetchUserData();
  }, [currentUser]);

  const features = userRole === 'admin' ? adminFeatures : staffFeatures;

  return (
    <div className="py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to SalonSync
        </h1>
        <p className="text-lg text-gray-600">
          Manage your salon efficiently with our comprehensive management system
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {features.map(({ icon: Icon, title, description, link }) => (
          <Link
            key={title}
            to={link}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <Icon className="h-12 w-12 text-purple-600 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">{title}</h2>
            <p className="text-gray-600">{description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}