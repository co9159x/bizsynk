import { motion } from 'framer-motion';
import { 
  Scissors, 
  Calendar, 
  Users, 
  BarChart, 
  Package, 
  MapPin, 
  Clock, 
  CheckCircle, 
  DollarSign, 
  Smartphone,
  ArrowRight
} from 'lucide-react';
import RoleSelectionModal from '../components/RoleSelectionModal';
import { useState } from 'react';

export default function Landing() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Scissors className="h-8 w-8 text-purple-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">BizSynk</span>
            </div>
            <div className="flex items-center space-x-4">
              <a href="#features" className="text-gray-600 hover:text-purple-600 transition-colors">Features</a>
              <a href="#testimonials" className="text-gray-600 hover:text-purple-600 transition-colors">Testimonials</a>
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl"
          >
            <span className="block">Transform Your Salon</span>
            <span className="block text-purple-600">with BizSynk</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl"
          >
            The all-in-one salon management solution that streamlines operations, boosts productivity, and enhances client satisfaction.
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

      {/* Main Features Section */}
      <div id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Powerful Features for Modern Salons
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Everything you need to manage your salon efficiently
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Service Records */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="ml-4 text-lg font-medium text-gray-900">Service Records</h3>
            </div>
            <p className="mt-4 text-base text-gray-500">
              Track daily services, client information, and payment records with detailed transaction history. Keep organized records of all salon activities.
            </p>
            <ul className="mt-4 space-y-2">
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-600">Client service history</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-600">Payment tracking</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-600">Service analytics</span>
              </li>
            </ul>
          </motion.div>

          {/* Staff Management */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="ml-4 text-lg font-medium text-gray-900">Staff Management</h3>
            </div>
            <p className="mt-4 text-base text-gray-500">
              Monitor staff attendance with location-based clock in/out system and role-based access control. Manage your team efficiently.
            </p>
            <ul className="mt-4 space-y-2">
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-600">Location-based attendance</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-600">Role-based permissions</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-600">Performance tracking</span>
              </li>
            </ul>
          </motion.div>

          {/* Inventory Management */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1 }}
            className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
                <Package className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="ml-4 text-lg font-medium text-gray-900">Inventory Management</h3>
            </div>
            <p className="mt-4 text-base text-gray-500">
              Track products, monitor stock levels, and receive low stock alerts. Never run out of essential supplies again.
            </p>
            <ul className="mt-4 space-y-2">
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-600">Stock level tracking</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-600">Low stock alerts</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-600">Usage analytics</span>
              </li>
            </ul>
          </motion.div>

          {/* Location Management */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.2 }}
            className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
                <MapPin className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="ml-4 text-lg font-medium text-gray-900">Location Management</h3>
            </div>
            <p className="mt-4 text-base text-gray-500">
              Set up and manage salon locations with attendance zones. Ensure staff are clocking in from the correct location.
            </p>
            <ul className="mt-4 space-y-2">
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-600">Multiple location support</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-600">Attendance zone configuration</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-600">Location-based reporting</span>
              </li>
            </ul>
          </motion.div>

          {/* Attendance Tracking */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.4 }}
            className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="ml-4 text-lg font-medium text-gray-900">Attendance Tracking</h3>
            </div>
            <p className="mt-4 text-base text-gray-500">
              Monitor staff attendance with detailed clock in/out records. Track punctuality and attendance patterns.
            </p>
            <ul className="mt-4 space-y-2">
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-600">Early/late status tracking</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-600">Attendance history</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-600">Attendance reports</span>
              </li>
            </ul>
          </motion.div>

          {/* Analytics Dashboard */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.6 }}
            className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
                <BarChart className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="ml-4 text-lg font-medium text-gray-900">Analytics Dashboard</h3>
            </div>
            <p className="mt-4 text-base text-gray-500">
              Track daily revenue, staff performance, and inventory levels with live dashboard updates. Make data-driven decisions.
            </p>
            <ul className="mt-4 space-y-2">
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-600">Revenue tracking</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-600">Staff performance metrics</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-600">Business insights</span>
              </li>
            </ul>
          </motion.div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-purple-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Why Choose BizSynk?
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
              The benefits of using our comprehensive salon management solution
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <DollarSign className="h-10 w-10 text-purple-600 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Increase Revenue</h3>
              <p className="text-gray-500">
                Streamline operations and improve efficiency to maximize your salon's revenue potential.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Smartphone className="h-10 w-10 text-purple-600 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Easy to Use</h3>
              <p className="text-gray-500">
                Intuitive interface designed for salon professionals, with no complex training required.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <CheckCircle className="h-10 w-10 text-purple-600 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Comprehensive Solution</h3>
              <p className="text-gray-500">
                All the tools you need in one place, from staff management to inventory tracking.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-purple-600 rounded-lg shadow-xl overflow-hidden">
          <div className="px-6 py-12 sm:px-12 sm:py-16 lg:flex lg:items-center lg:justify-between">
            <div className="lg:w-0 lg:flex-1">
              <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Ready to transform your salon?
              </h2>
              <p className="mt-4 max-w-3xl text-lg text-purple-100">
                Join hundreds of salons already using BizSynk to streamline their operations and boost productivity.
              </p>
            </div>
            <div className="mt-8 lg:mt-0 lg:ml-8">
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-purple-600 bg-white hover:bg-purple-50"
              >
                Get Started Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <Scissors className="h-8 w-8 text-purple-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">BizSynk</span>
          </div>
          <p className="mt-4 text-center text-base text-gray-500">
            &copy; {new Date().getFullYear()} BizSynk. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Role Selection Modal */}
      <RoleSelectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
} 