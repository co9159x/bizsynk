import React, { useState, useCallback, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, MapPin } from 'lucide-react';
import type { Staff } from '../types';
import { formatTime } from '../utils/format';

// Salon's location (example coordinates)
const SALON_LOCATION = {
  latitude: 6.5244,  // Lagos coordinates (example)
  longitude: 3.3792,
  maxDistance: 100 // meters
};

interface ClockInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClockIn: (staffName: string, location: GeolocationCoordinates) => void;
}

interface ClockOutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClockOut: (staffName: string, location: GeolocationCoordinates) => void;
}

function ClockInModal({ isOpen, onClose, onClockIn }: ClockInModalProps) {
  const [staffName, setStaffName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        });
      });

      // Calculate distance between staff and salon
      const distance = calculateDistance(
        position.coords.latitude,
        position.coords.longitude,
        SALON_LOCATION.latitude,
        SALON_LOCATION.longitude
      );

      if (distance > SALON_LOCATION.maxDistance) {
        throw new Error('You must be at the salon to clock in');
      }

      onClockIn(staffName, position.coords);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get location');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h2 className="text-2xl font-bold mb-4">Clock In</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              value={staffName}
              onChange={(e) => setStaffName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              placeholder="Enter your full name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Date & Time</label>
            <input
              type="text"
              value={new Date().toLocaleString()}
              className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm"
              readOnly
            />
          </div>
          {error && (
            <div className="text-red-600 text-sm">
              {error}
            </div>
          )}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                  Verifying...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  Clock In
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ClockOutModal({ isOpen, onClose, onClockOut }: ClockOutModalProps) {
  const [staffName, setStaffName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        });
      });

      onClockOut(staffName, position.coords);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get location');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h2 className="text-2xl font-bold mb-4">Clock Out</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              value={staffName}
              onChange={(e) => setStaffName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              placeholder="Enter your full name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Date & Time</label>
            <input
              type="text"
              value={new Date().toLocaleString()}
              className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm"
              readOnly
            />
          </div>
          {error && (
            <div className="text-red-600 text-sm">
              {error}
            </div>
          )}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                  Processing...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <Clock className="w-4 h-4 mr-2" />
                  Clock Out
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c; // Distance in meters
}

export default function Attendance() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [showClockInModal, setShowClockInModal] = useState(false);
  const [showClockOutModal, setShowClockOutModal] = useState(false);

  // Function to check and auto clock out staff
  const checkAndAutoClockOut = useCallback(() => {
    const now = new Date();
    const currentHour = now.getHours();
    
    if (currentHour >= 21) { // 9 PM
      staff.forEach(async (member) => {
        if (member.status === 'in') {
          // Auto clock out the staff member
          await handleClockOut(member.name, {
            latitude: 0,
            longitude: 0,
            accuracy: 0,
            altitude: null,
            altitudeAccuracy: null,
            heading: null,
            speed: null
          } as GeolocationCoordinates);
        }
      });
    }
  }, [staff]);

  // Set up interval to check for auto clock out
  useEffect(() => {
    // Check immediately
    checkAndAutoClockOut();
    
    // Then check every minute
    const interval = setInterval(checkAndAutoClockOut, 60000);
    
    return () => clearInterval(interval);
  }, [checkAndAutoClockOut]);

  const handleClockIn = async (staffName: string, location: GeolocationCoordinates) => {
    // Here you would typically save to Firebase
    console.log('Staff clocked in:', {
      name: staffName,
      timestamp: new Date(),
      location: {
        latitude: location.latitude,
        longitude: location.longitude
      }
    });
  };

  const handleClockOut = async (staffName: string, location: GeolocationCoordinates) => {
    // Here you would typically save to Firebase
    console.log('Staff clocked out:', {
      name: staffName,
      timestamp: new Date(),
      location: {
        latitude: location.latitude,
        longitude: location.longitude
      }
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Attendance Monitoring</h1>
      
      {/* Clock In/Out Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Clock In/Out</h2>
        <div className="flex gap-4">
          <button 
            onClick={() => setShowClockInModal(true)}
            className="flex-1 bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            <Clock className="inline-block w-5 h-5 mr-2" />
            Clock In
          </button>
          <button 
            onClick={() => setShowClockOutModal(true)}
            className="flex-1 bg-red-600 text-white py-3 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            <Clock className="inline-block w-5 h-5 mr-2" />
            Clock Out
          </button>
        </div>
      </div>

      {/* Staff Status */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Staff Status</h2>
        {staff.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No staff members found</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {staff.map((member) => (
              <div key={member.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{member.name}</span>
                  {member.status === 'in' ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                </div>
                <div className="mt-2 text-sm text-gray-500">
                  {member.status === 'in' && member.lastClockIn && (
                    <p>In since {formatTime(new Date(member.lastClockIn))}</p>
                  )}
                  {member.status === 'out' && member.lastClockOut && (
                    <p>Out since {formatTime(new Date(member.lastClockOut))}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ClockInModal
        isOpen={showClockInModal}
        onClose={() => setShowClockInModal(false)}
        onClockIn={handleClockIn}
      />

      <ClockOutModal
        isOpen={showClockOutModal}
        onClose={() => setShowClockOutModal(false)}
        onClockOut={handleClockOut}
      />
    </div>
  );
}