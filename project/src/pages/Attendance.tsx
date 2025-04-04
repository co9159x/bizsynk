import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, MapPin } from 'lucide-react';
import type { Staff } from '../types';
import { formatTime } from '../utils/format';

// Salon's location (Ahmadu Bello Way, Gudu, Abuja coordinates)
const SALON_LOCATION = {
  latitude: 9.0335,  // Abuja coordinates
  longitude: 7.4898,
  maxDistance: 100, // meters
  address: 'Ahmadu Bello Way, Gudu, Abuja 900110, Federal Capital Territory, Nigeria'
};

interface ClockInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClockIn: (staffName: string, location: GeolocationCoordinates) => void;
  isClockOut?: boolean;
}

function ClockInModal({ isOpen, onClose, onClockIn, isClockOut }: ClockInModalProps) {
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
        throw new Error(`You must be at ${SALON_LOCATION.address} to ${isClockOut ? 'clock out' : 'clock in'}`);
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
        <h2 className="text-2xl font-bold mb-4">{isClockOut ? 'Clock Out' : 'Clock In'}</h2>
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
          <div>
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <input
              type="text"
              value={SALON_LOCATION.address}
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
              className={`flex-1 ${
                isClockOut ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
              } text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                isClockOut ? 'focus:ring-red-500' : 'focus:ring-green-500'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                  Verifying...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  {isClockOut ? 'Clock Out' : 'Clock In'}
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

  // Function to check if it's 9 PM and clock out staff if needed
  useEffect(() => {
    const checkTimeAndClockOut = () => {
      const now = new Date();
      if (now.getHours() === 21 && now.getMinutes() === 0) { // 9 PM
        const updatedStaff = staff.map(member => {
          if (member.status === 'in') {
            return {
              ...member,
              status: 'out',
              lastClockOut: new Date().toISOString()
            };
          }
          return member;
        });
        setStaff(updatedStaff);
      }
    };

    // Check every minute
    const interval = setInterval(checkTimeAndClockOut, 60000);
    return () => clearInterval(interval);
  }, [staff]);

  const handleClockIn = async (staffName: string, location: GeolocationCoordinates) => {
    const newStaff: Staff = {
      id: Date.now().toString(),
      name: staffName,
      role: 'staff',
      status: 'in',
      lastClockIn: new Date().toISOString()
    };

    setStaff(prev => [...prev, newStaff]);
    setShowClockInModal(false);
  };

  const handleClockOut = async (staffName: string, location: GeolocationCoordinates) => {
    setStaff(prev => prev.map(member => {
      if (member.name === staffName) {
        return {
          ...member,
          status: 'out',
          lastClockOut: new Date().toISOString()
        };
      }
      return member;
    }));
    setShowClockOutModal(false);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Attendance Monitoring</h1>
      
      {/* Location Display */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Salon Location</h2>
        <p className="text-gray-600">{SALON_LOCATION.address}</p>
      </div>

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

      <ClockInModal
        isOpen={showClockOutModal}
        onClose={() => setShowClockOutModal(false)}
        onClockIn={handleClockOut}
        isClockOut={true}
      />
    </div>
  );
}