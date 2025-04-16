import { motion } from 'framer-motion';
import { Scissors, Calendar, Users, BarChart } from 'lucide-react';
import RoleSelectionModal from '../components/RoleSelectionModal';
import { useState } from 'react';

export default function Landing() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Scissors className="h-8 w-8 text-purple-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">SalonSync</span>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => setIsModalOpen(true)}
                className="ml-4 px-4 py-2 rounded-md text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl"
          >
            <span className="block">Streamline Your Salon</span>
            <span className="block text-purple-600">with SalonSync</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl"
          >
            Manage appointments, staff, inventory, and more with our comprehensive salon management solution.
          </motion.p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 md:py-4 md:text-lg md:px-10"
              >
                Get Started
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-white p-6 rounded-lg shadow-sm"
          >
            <Calendar className="h-8 w-8 text-purple-600" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">Service Records</h3>
            <p className="mt-2 text-base text-gray-500">
              Track daily services, client information, and payment records with detailed transaction history.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="bg-white p-6 rounded-lg shadow-sm"
          >
            <Users className="h-8 w-8 text-purple-600" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">Staff Management</h3>
            <p className="mt-2 text-base text-gray-500">
              Monitor staff attendance with location-based clock in/out system and role-based access control.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1 }}
            className="bg-white p-6 rounded-lg shadow-sm"
          >
            <BarChart className="h-8 w-8 text-purple-600" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">Real-time Analytics</h3>
            <p className="mt-2 text-base text-gray-500">
              Track daily revenue, staff performance, and inventory levels with live dashboard updates.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Role Selection Modal */}
      <RoleSelectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
} 