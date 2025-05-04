import React, { useState, useEffect } from 'react';
import { Clock, MapPin, Calendar } from 'lucide-react';
import type { Location } from '../types';
import { formatTime } from '../utils/format';
import { collection, getDocs, addDoc, query, where, updateDoc, doc, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import SearchableStaffSelect from '../components/SearchableStaffSelect';

interface ClockInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClockIn: (staffId: string, staffName: string, location: GeolocationCoordinates, locationId: string, locationName: string) => void;
}

interface ClockOutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClockOut: (params: { staffId: string; locationId: string; locationName: string }) => Promise<void>;
}

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
  clockInStatus: 'early' | 'late';
  clockOutStatus: 'on-time' | 'left-early' | null;
}

function ClockInModal({ isOpen, onClose, onClockIn }: ClockInModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeLocations, setActiveLocations] = useState<Location[]>([]);
  const [selectedStaff, setSelectedStaff] = useState<{ id: string; name: string } | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

  useEffect(() => {
    if (!isOpen) {
      // Reset states when modal closes
      setSelectedStaff(null);
      setSelectedLocation(null);
      return;
    }
      
    const fetchLocations = async () => {
      try {
        setLoading(true);
        setError(null);
        const locationsRef = collection(db, 'locations');
        const locationsSnapshot = await getDocs(locationsRef);
        const locations = locationsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Location[];
        setActiveLocations(locations);
        // If there's only one location, auto-select it
        if (locations.length === 1) {
          setSelectedLocation(locations[0]);
        }
      } catch (err) {
        setError('Failed to fetch locations. Please try again.');
        console.error('Error fetching locations:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (activeLocations.length === 0) {
      setError('No active locations available');
      return;
    }

    if (!selectedStaff) {
      setError('Please select a staff member first');
      return;
    }

    if (!selectedLocation) {
      setError('Please select a location');
      return;
    }

    setLoading(true);
    try {
      if (!selectedLocation.id || !selectedLocation.name) {
        throw new Error('Invalid location data');
      }
      await onClockIn(
        selectedStaff.id,
        selectedStaff.name,
        { latitude: selectedLocation.latitude, longitude: selectedLocation.longitude } as GeolocationCoordinates,
        selectedLocation.id,
        selectedLocation.name
      );
      onClose();
    } catch (err) {
      setError('Failed to clock in. Please try again.');
      console.error('Error during clock in:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStaffChange = (staffId: string, staffName: string) => {
    setSelectedStaff({ id: staffId, name: staffName });
  };

  const handleLocationChange = (location: Location) => {
    setSelectedLocation(location);
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
            <SearchableStaffSelect
              onChange={handleStaffChange}
              label="Select Staff"
              required
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              {activeLocations.length === 1 ? (
                // If only one location, show its details
                <div className="mt-1 p-2 bg-gray-50 rounded-md text-sm font-mono">
                  <div>Active Location: {activeLocations[0].name}</div>
                  <div>Latitude: {activeLocations[0].latitude.toFixed(6)}</div>
                  <div>Maximum Distance: {activeLocations[0].maxDistance}m</div>
                </div>
              ) : (
                // If multiple locations, show a selection dropdown
                <div className="space-y-2">
                  <select
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    value={selectedLocation?.id || ''}
                    onChange={(e) => {
                      const location = activeLocations.find(loc => loc.id === e.target.value);
                      if (location) handleLocationChange(location);
                    }}
                    required
                  >
                    <option value="">Select a location</option>
                    {activeLocations.map(location => (
                      <option key={location.id} value={location.id}>
                        {location.name}
                      </option>
                    ))}
                  </select>
                  {selectedLocation && (
                    <div className="p-2 bg-gray-50 rounded-md text-sm font-mono">
                      <div>Selected Location: {selectedLocation.name}</div>
                      <div>Latitude: {selectedLocation.latitude.toFixed(6)}</div>
                      <div>Maximum Distance: {selectedLocation.maxDistance}m</div>
                    </div>
                  )}
                </div>
              )}
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
              disabled={loading || activeLocations.length === 0 || !selectedLocation}
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<{ id: string; name: string } | null>(null);
  const [activeLocations, setActiveLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [clockedInStaff, setClockedInStaff] = useState<Array<{ id: string; name: string }>>([]); 

  useEffect(() => {
    if (!isOpen) {
      setSelectedStaff(null);
      setSelectedLocation(null);
      return;
    }

    const fetchClockedInStaff = async () => {
      try {
        setLoading(true);
        setError(null);
        const today = new Date().toISOString().split('T')[0];
        const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0];

        const attendanceQuery = query(
          collection(db, 'attendance'),
          where('date', '>=', today),
          where('date', '<', tomorrow),
          where('timeOut', '==', null)
        );

        const snapshot = await getDocs(attendanceQuery);
        const staff = snapshot.docs.map(doc => ({
          id: doc.data().staffId,
          name: doc.data().staffName
        }));

        setClockedInStaff(staff);
      } catch (err) {
        console.error('Error fetching clocked-in staff:', err);
        setError('Failed to fetch clocked-in staff');
      } finally {
        setLoading(false);
      }
    };

    fetchClockedInStaff();

    const fetchLocations = async () => {
      try {
        setLoading(true);
        setError(null);
        const locationsRef = collection(db, 'locations');
        const locationsSnapshot = await getDocs(locationsRef);
        const locations = locationsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Location[];
        setActiveLocations(locations);
        if (locations.length === 1) {
          setSelectedLocation(locations[0]);
        }
      } catch (err) {
        setError('Failed to fetch locations. Please try again.');
        console.error('Error fetching locations:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStaff) {
      setError('Please select a staff member first');
      return;
    }

    if (!selectedLocation || !selectedLocation.id || !selectedLocation.name) {
      setError('Please select a valid location');
      return;
    }

    setLoading(true);
    try {
      await onClockOut({
        staffId: selectedStaff.id,
        locationId: selectedLocation.id,
        locationName: selectedLocation.name
      });
      onClose();
    } catch (err) {
      setError('Failed to clock out. Please try again.');
      console.error('Error during clock out:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStaffChange = (staffId: string, staffName: string) => {
    setSelectedStaff({ id: staffId, name: staffName });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h2 className="text-2xl font-bold mb-4">Clock Out</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <SearchableStaffSelect
              onChange={handleStaffChange}
              label="Select Staff"
              required
              staffList={clockedInStaff}
              placeholder="Select clocked-in staff"
            />
            {clockedInStaff.length === 0 && !loading && (
              <p className="text-sm text-gray-500 mt-1">No staff members are currently clocked in</p>
            )}
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

          {activeLocations.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              {activeLocations.length === 1 ? (
                // If only one location, show its details
                <div className="mt-1 p-2 bg-gray-50 rounded-md text-sm font-mono">
                  <div>Active Location: {activeLocations[0].name}</div>
                  <div>Latitude: {activeLocations[0].latitude.toFixed(6)}</div>
                  <div>Maximum Distance: {activeLocations[0].maxDistance}m</div>
                </div>
              ) : (
                // If multiple locations, show a selection dropdown
                <div className="space-y-2">
                  <select
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    value={selectedLocation?.id || ''}
                    onChange={(e) => {
                      const locationId = e.target.value;
                      if (locationId) {
                        const location = activeLocations.find(loc => loc.id === locationId);
                        if (location) {
                          setSelectedLocation(location);
                        }
                      }
                    }}
                    required
                  >
                    <option value="">Select a location</option>
                    {activeLocations.map(location => (
                      <option key={location.id} value={location.id}>
                        {location.name}
                      </option>
                    ))}
                  </select>
                  {selectedLocation && (
                    <div className="p-2 bg-gray-50 rounded-md text-sm font-mono">
                      <div>Selected Location: {selectedLocation.name}</div>
                      <div>Latitude: {selectedLocation.latitude.toFixed(6)}</div>
                      <div>Maximum Distance: {selectedLocation.maxDistance}m</div>
                    </div>
                  )}
                </div>
              )}
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
              disabled={loading || !selectedLocation}
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
  const [showClockInModal, setShowClockInModal] = useState(false);
  const [showClockOutModal, setShowClockOutModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(false);

  // Extract fetchAttendanceRecords to be reusable
  const fetchAttendanceRecords = async () => {
    try {
      setLoading(true);
      
      // Create date range for the selected date
      const startOfDay = new Date(selectedDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(selectedDate);
      endOfDay.setHours(23, 59, 59, 999);

      // Simple query using only date field - no composite index needed
      const attendanceQuery = query(
        collection(db, 'attendance'),
        orderBy('date', 'desc'),
        where('date', '>=', startOfDay.toISOString()),
        where('date', '<=', endOfDay.toISOString())
      );

      const attendanceSnapshot = await getDocs(attendanceQuery);
      
      const records = attendanceSnapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        } as AttendanceRecord));
      
      setAttendanceRecords(records);
    } catch (error) {
      console.error('Error fetching attendance records:', error);
      toast.error('Failed to fetch attendance records');
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch of attendance records
  useEffect(() => {
    fetchAttendanceRecords();
  }, [selectedDate]);

  const getTimeStatus = (time: string | null, type: 'in' | 'out'): string => {
    if (!time) return '';
    
    const timeDate = new Date(time);
    const hours = timeDate.getHours();
    const minutes = timeDate.getMinutes();
    const totalMinutes = hours * 60 + minutes;

    if (type === 'in') {
      const startTime = 9 * 60 + 30; // 9:30 AM
      return totalMinutes < startTime ? 'early' : 'late';
    } else {
      const endTime = 21 * 60; // 9:00 PM
      return totalMinutes < endTime ? 'left-early' : 'on-time';
    }
  };

  const handleClockIn = async (staffId: string, staffName: string, _location: GeolocationCoordinates, locationId: string, locationName: string) => {
    try {
      const now = new Date();
      const clockInStatus = getTimeStatus(now.toISOString(), 'in');
      const today = now.toISOString().split('T')[0];
      const tomorrowDate = new Date(now);
      tomorrowDate.setDate(tomorrowDate.getDate() + 1);
      const tomorrow = tomorrowDate.toISOString().split('T')[0];

      // Check if staff has already clocked in today
      try {
        const todayAttendanceQuery = query(
          collection(db, 'attendance'),
          where('staffId', '==', staffId),
          where('date', '>=', today),
          where('date', '<', tomorrow)
        );
        const todayAttendanceSnapshot = await getDocs(todayAttendanceQuery);

        if (!todayAttendanceSnapshot.empty) {
          toast.error('Staff member has already clocked in today');
          return;
        }
      } catch (queryError: any) {
        if (queryError?.message?.includes('index is currently building')) {
          toast.error('System is being updated. Please try again in a few minutes.');
          console.log('Waiting for index to build. Status URL:', queryError?.message?.match(/https:\/\/console\.firebase\.google\.com[^\s]*/)?.[0]);
          return;
        }
        throw queryError;
      }

      const attendanceData = {
        staffId,
        staffName,
        date: now.toISOString(),
        timeIn: now.toISOString(),
        timeOut: null,
        status: 'present' as const,
        locationId,
        locationName,
        createdAt: now.toISOString(),
        clockInStatus,
        clockOutStatus: null
      };

      await addDoc(collection(db, 'attendance'), attendanceData);
      
      // Update staff status
      const staffQuery = query(collection(db, 'staff'), where('userId', '==', staffId));
      const staffSnapshot = await getDocs(staffQuery);
      if (!staffSnapshot.empty) {
        const staffDoc = staffSnapshot.docs[0];
        await updateDoc(doc(db, 'staff', staffDoc.id), {
          status: 'in',
          lastClockIn: now.toISOString()
        });
      }

      toast.success('Clock in successful! Welcome to work.');
      
      // Refresh attendance records after successful clock in
      await fetchAttendanceRecords();
    } catch (error: any) {
      console.error('Error recording clock in:', error);
      if (error?.message?.includes('index is currently building')) {
        toast.error('System is being updated. Please try again in a few minutes.');
      } else if (error?.code === 'permission-denied') {
        toast.error('You do not have permission to perform this action.');
      } else {
        toast.error('Failed to clock in. Please try again.');
      }
    }
  };

  const handleClockOut = async (params: { staffId: string; locationId: string; locationName: string }) => {
    try {
      const { staffId, locationId, locationName } = params;
      const now = new Date();
      const clockOutStatus = getTimeStatus(now.toISOString(), 'out');
      
      // Find today's clock-in record for this staff member
      try {
        const todayAttendanceQuery = query(
          collection(db, 'attendance'),
          where('staffId', '==', staffId),
          where('timeOut', '==', null),
          where('date', '>=', now.toISOString().split('T')[0]),
          where('date', '<', now.toISOString().split('T')[0] + 'T24:00:00')
        );
        const todayAttendanceSnapshot = await getDocs(todayAttendanceQuery);
        
        if (todayAttendanceSnapshot.empty) {
          toast.error('No active clock-in found for today');
          return;
        }

        const attendanceDoc = todayAttendanceSnapshot.docs[0];

        // Use the selected location for clock-out
        await updateDoc(doc(db, 'attendance', attendanceDoc.id), {
          timeOut: now.toISOString(),
          status: 'completed',
          locationId,
          locationName,
          clockOutStatus
        });
      } catch (queryError: any) {
        if (queryError?.message?.includes('index is currently building')) {
          toast.error('System is updating the clock-out index. Please try again in a few minutes.');
          const indexUrl = queryError?.message?.match(/https:\/\/console\.firebase\.google\.com[^\s]*/)?.[0];
          if (indexUrl) {
            console.log('Clock-out index status URL:', indexUrl);
          }
          return;
        }
        throw queryError;
      }

      // Update staff status
      const staffQuery = query(collection(db, 'staff'), where('userId', '==', staffId));
      const staffSnapshot = await getDocs(staffQuery);
      if (!staffSnapshot.empty) {
        const staffDoc = staffSnapshot.docs[0];
        await updateDoc(doc(db, 'staff', staffDoc.id), {
          status: 'out',
          lastClockOut: now.toISOString()
        });
      }

      toast.success('Clock out successful! Have a great day!');
      
      // Refresh attendance records after successful clock out
      await fetchAttendanceRecords();
    } catch (error: any) {
      console.error('Error recording clock out:', error);
      if (error?.message?.includes('index is currently building')) {
        toast.error('System is updating the clock-out index. Please try again in a few minutes.');
      } else if (error?.code === 'permission-denied') {
        toast.error('You do not have permission to perform this action.');
      } else {
        toast.error('Failed to clock out. Please try again.');
      }
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

        {loading ? (
          <p className="text-gray-500 text-center py-4">Loading records...</p>
        ) : attendanceRecords.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No records for this date</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time In</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clock In Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time Out</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clock Out Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {attendanceRecords.map((record) => (
                  <tr key={record.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.staffName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatTime(record.timeIn)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        record.clockInStatus === 'early' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {record.clockInStatus === 'early' ? 'Early' : 'Late'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.timeOut ? formatTime(record.timeOut) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {record.clockOutStatus && (
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          record.clockOutStatus === 'on-time' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {record.clockOutStatus === 'on-time' ? 'On Time' : 'Left Early'}
                        </span>
                      )}
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