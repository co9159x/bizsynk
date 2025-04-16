import React, { useState, useCallback, useEffect } from 'react';
import { Clock, MapPin, Calendar } from 'lucide-react';
import type { Staff, Location } from '../types';
import { formatTime, capitalizeWords } from '../utils/format';
import { collection, getDocs, addDoc, query, where, updateDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';

interface ClockInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClockIn: (staffName: string, location: GeolocationCoordinates, locationId: string, locationName: string) => void;
}

interface ClockOutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClockOut: (staffName: string, location: GeolocationCoordinates, locationId: string, locationName: string) => void;
}

// Add this interface for attendance records
interface AttendanceRecord {
  id: string;
  staffName: string;
  date: string;
  timeIn: string;
  timeOut: string | null;
  status: 'present' | 'completed';
  locationId: string;
  locationName: string;
  createdAt: string;
}

function ClockInModal({ isOpen, onClose, onClockIn }: ClockInModalProps) {
  const { currentUser } = useAuth();
  const [staffName, setStaffName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeLocations, setActiveLocations] = useState<Location[]>([]);

  // Fetch staff name when component mounts
  useEffect(() => {
    const fetchStaffName = async () => {
      if (!currentUser) return;
      
      try {
        const staffQuery = query(
          collection(db, 'staff'),
          where('userId', '==', currentUser.uid)
        );
        const staffSnapshot = await getDocs(staffQuery);
        if (!staffSnapshot.empty) {
          const staffData = staffSnapshot.docs[0].data();
          setStaffName(capitalizeWords(staffData.name));
        }
      } catch (error) {
        console.error('Error fetching staff name:', error);
      }
    };

    fetchStaffName();
  }, [currentUser]);

  // Fetch active locations when modal opens
  useEffect(() => {
    const fetchActiveLocations = async () => {
      if (!isOpen) return;
      
      try {
        const locationsQuery = query(
          collection(db, 'locations'),
          where('isActive', '==', true)
        );
        const locationsSnapshot = await getDocs(locationsQuery);
        const locations = locationsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Location[];
        setActiveLocations(locations);
      } catch (error) {
        console.error('Error fetching active locations:', error);
        setError('Failed to fetch active locations');
      }
    };

    fetchActiveLocations();
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (activeLocations.length === 0) {
        throw new Error('No active locations found. Please contact your administrator.');
      }

      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        });
      });

      onClockIn(staffName, position.coords, activeLocations[0].id!, activeLocations[0].name);
      onClose();
    } catch (err) {
      console.error('Clock in error:', err);
      setError(err instanceof Error ? err.message : 'Failed to get location');
    } finally {
      setLoading(false);
    }
  };

  // Function to check if current time is early or late
  const getTimeStatus = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const totalMinutes = currentHour * 60 + currentMinute;
    const thresholdMinutes = 9 * 60 + 30; // 9:30 AM in minutes

    if (totalMinutes < thresholdMinutes) {
      return <span className="text-green-600 font-medium">Early</span>;
    } else {
      return <span className="text-red-600 font-medium">Late</span>;
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
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Date & Time</label>
            <div className="flex items-center justify-between mt-1">
              <input
                type="text"
                value={new Date().toLocaleString()}
                className="block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm"
                readOnly
              />
              <div className="ml-2">
                {getTimeStatus()}
              </div>
            </div>
          </div>
          
          {activeLocations.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Location Details</label>
              <div className="mt-1 p-2 bg-gray-50 rounded-md text-sm font-mono">
                <div>Active Location: {activeLocations[0].name}</div>
                <div>Latitude: {activeLocations[0].latitude.toFixed(6)}</div>
                <div>Maximum Distance: {activeLocations[0].maxDistance}m</div>
              </div>
            </div>
          )}
          
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
              disabled={loading || activeLocations.length === 0}
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
  const { currentUser } = useAuth();
  const [staffName, setStaffName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch staff name when component mounts
  useEffect(() => {
    const fetchStaffName = async () => {
      if (!currentUser) return;
      
      try {
        const staffQuery = query(
          collection(db, 'staff'),
          where('userId', '==', currentUser.uid)
        );
        const staffSnapshot = await getDocs(staffQuery);
        if (!staffSnapshot.empty) {
          const staffData = staffSnapshot.docs[0].data();
          setStaffName(capitalizeWords(staffData.name));
        }
      } catch (error) {
        console.error('Error fetching staff name:', error);
      }
    };

    fetchStaffName();
  }, [currentUser]);

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

      console.log('Current position:', {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });

      // For clock out, we don't need to check location
      onClockOut(staffName, position.coords, 'any', 'Remote Location');
      onClose();
    } catch (err) {
      console.error('Clock out error:', err);
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
              readOnly
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

export default function Attendance() {
  const { currentUser } = useAuth();
  const [staff, setStaff] = useState<Staff[]>([]);
  const [showClockInModal, setShowClockInModal] = useState(false);
  const [showClockOutModal, setShowClockOutModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch staff data
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        if (!currentUser) return;
        
        // Only fetch the current staff member's data
        const staffQuery = query(
          collection(db, 'staff'),
          where('userId', '==', currentUser.uid)
        );
        const staffSnapshot = await getDocs(staffQuery);
        const staffData = staffSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Staff[];
        setStaff(staffData);
      } catch (error) {
        console.error('Error fetching staff:', error);
      }
    };
    fetchStaff();
  }, [currentUser]);

  // Fetch attendance records for selected date
  useEffect(() => {
    const fetchAttendanceRecords = async () => {
      if (!currentUser || staff.length === 0) return;

      try {
        setLoading(true);
        const staffMember = staff[0];
        const formattedName = `${capitalizeWords(staffMember.firstName)} ${capitalizeWords(staffMember.lastName)}`;

        // Create date range for the selected date
        const startOfDay = new Date(selectedDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(selectedDate);
        endOfDay.setHours(23, 59, 59, 999);

        console.log('Fetching attendance records for:', {
          staffName: formattedName,
          startDate: startOfDay.toISOString(),
          endDate: endOfDay.toISOString()
        });

        // Simplified query that doesn't require a composite index
        const attendanceQuery = query(
          collection(db, 'attendance'),
          where('staffName', '==', formattedName)
        );

        const attendanceSnapshot = await getDocs(attendanceQuery);
        
        // Filter the results in memory instead of in the query
        const records = attendanceSnapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data()
          } as AttendanceRecord))
          .filter(record => {
            const recordDate = new Date(record.date);
            return recordDate >= startOfDay && recordDate <= endOfDay;
          })
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        
        console.log('Found attendance records:', records);
        setAttendanceRecords(records);
      } catch (error) {
        console.error('Error fetching attendance records:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceRecords();
  }, [currentUser, staff, selectedDate]);

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
          } as GeolocationCoordinates, 'auto', 'Auto Clock Out');
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

  const handleClockIn = async (staffName: string, _location: GeolocationCoordinates, locationId: string, locationName: string) => {
    try {
      const now = new Date();
      const today = now.toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

      // Check if staff has already clocked in today
      const todayAttendanceQuery = query(
        collection(db, 'attendance'),
        where('staffName', '==', staffName),
        where('date', '>=', today),
        where('date', '<', new Date(new Date(today).getTime() + 86400000).toISOString()) // Next day
      );
      const todayAttendanceSnapshot = await getDocs(todayAttendanceQuery);

      if (!todayAttendanceSnapshot.empty) {
        toast.error('You have already clocked in today');
        return;
      }

      const attendanceData = {
        staffName,
        date: now.toISOString(),
        timeIn: now.toISOString(),
        timeOut: null,
        status: 'present' as const,
        locationId,
        locationName,
        createdAt: now.toISOString()
      };

      console.log('Adding attendance record:', attendanceData);
      const docRef = await addDoc(collection(db, 'attendance'), attendanceData);
      console.log('Added attendance record with ID:', docRef.id);
      
      // Update staff status
      const staffQuery = query(collection(db, 'staff'), where('name', '==', staffName));
      const staffSnapshot = await getDocs(staffQuery);
      if (!staffSnapshot.empty) {
        const staffDoc = staffSnapshot.docs[0];
        await updateDoc(doc(db, 'staff', staffDoc.id), {
          status: 'in',
          lastClockIn: now.toISOString()
        });
        console.log('Updated staff status to in');
      }

      // Refresh staff data and attendance records
      const updatedStaffQuery = query(
        collection(db, 'staff'),
        where('userId', '==', currentUser?.uid)
      );
      const updatedStaffSnapshot = await getDocs(updatedStaffQuery);
      const updatedStaffData = updatedStaffSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Staff[];
      setStaff(updatedStaffData);

      // Refresh attendance records
      const startOfDay = new Date(selectedDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(selectedDate);
      endOfDay.setHours(23, 59, 59, 999);

      const updatedAttendanceQuery = query(
        collection(db, 'attendance'),
        where('staffName', '==', staffName)
      );

      const updatedAttendanceSnapshot = await getDocs(updatedAttendanceQuery);
      const updatedRecords = updatedAttendanceSnapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        } as AttendanceRecord))
        .filter(record => {
          const recordDate = new Date(record.date);
          return recordDate >= startOfDay && recordDate <= endOfDay;
        })
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setAttendanceRecords(updatedRecords);

      // Show success notification
      toast.success('Clock in successful! Welcome to work.');
    } catch (error) {
      console.error('Error recording clock in:', error);
      toast.error('Failed to clock in. Please try again.');
    }
  };

  const handleClockOut = async (staffName: string, _location: GeolocationCoordinates, locationId: string, locationName: string) => {
    try {
      const now = new Date();
      const today = now.toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

      // Find today's clock-in record for this staff member
      const todayAttendanceQuery = query(
        collection(db, 'attendance'),
        where('staffName', '==', staffName),
        where('date', '>=', today),
        where('date', '<', new Date(new Date(today).getTime() + 86400000).toISOString()), // Next day
        where('timeOut', '==', null)
      );
      const todayAttendanceSnapshot = await getDocs(todayAttendanceQuery);
      
      if (todayAttendanceSnapshot.empty) {
        toast.error('No active clock-in found for today');
        return;
      }

      const attendanceDoc = todayAttendanceSnapshot.docs[0];
      await updateDoc(doc(db, 'attendance', attendanceDoc.id), {
        timeOut: now.toISOString(),
        status: 'completed',
        locationId,
        locationName
      });

      // Update staff status
      const staffQuery = query(collection(db, 'staff'), where('name', '==', staffName));
      const staffSnapshot = await getDocs(staffQuery);
      if (!staffSnapshot.empty) {
        const staffDoc = staffSnapshot.docs[0];
        await updateDoc(doc(db, 'staff', staffDoc.id), {
          status: 'out',
          lastClockOut: now.toISOString()
        });
      }

      // Show success notification
      toast.success('Clock out successful! Have a great day!');
    } catch (error) {
      console.error('Error recording clock out:', error);
      toast.error('Failed to clock out. Please try again.');
    }
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

      {/* Attendance Records */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Attendance Records</h2>
          <div className="flex items-center space-x-4">
            <Calendar className="w-5 h-5 text-gray-500" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            />
          </div>
        </div>

        {staff.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No staff record found</p>
        ) : (
          <div>
            {loading ? (
              <p className="text-gray-500 text-center py-4">Loading records...</p>
            ) : attendanceRecords.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No records for this date</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time In</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time Out</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {attendanceRecords.map((record) => (
                      <tr key={record.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatTime(record.timeIn)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {record.timeOut ? formatTime(record.timeOut) : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {record.locationName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            record.status === 'present' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {record.status === 'present' ? 'Present' : 'Completed'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
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