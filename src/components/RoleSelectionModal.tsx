import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { UserCog, Users, X } from 'lucide-react';

interface RoleSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RoleSelectionModal({ isOpen, onClose }: RoleSelectionModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4 z-10"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
            >
              <X size={24} />
            </button>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Select Your Role
            </h2>
            
            <div className="grid grid-cols-1 gap-4">
              <Link
                to="/admin/login"
                className="flex items-center p-4 border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors"
                onClick={onClose}
              >
                <UserCog className="h-8 w-8 text-purple-600 mr-4" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Admin</h3>
                  <p className="text-gray-600">Manage salon operations and staff</p>
                </div>
              </Link>
              
              <Link
                to="/staff/login"
                className="flex items-center p-4 border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors"
                onClick={onClose}
              >
                <Users className="h-8 w-8 text-purple-600 mr-4" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Staff</h3>
                  <p className="text-gray-600">Manage services and client records</p>
                </div>
              </Link>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
} 