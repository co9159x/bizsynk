import { useState, useEffect } from 'react';
import { BarChart3, Users, DollarSign, Calendar, Filter } from 'lucide-react';
import type { ServiceRecord, Staff, AttendanceRecord } from '../types';
import { formatCurrency, formatDate } from '../utils/format';
import { collection, getDocs, query, where, orderBy, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const [serviceRecords, setServiceRecords] = useState<ServiceRecord[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [revenueData, setRevenueData] = useState<{ labels: string[]; data: number[] }>({
    labels: [],
    data: []
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [revenueFilter, setRevenueFilter] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [allServiceRecords, setAllServiceRecords] = useState<ServiceRecord[]>([]);
  const [staffPerformanceDate, setStaffPerformanceDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [staffMonthlyPerformance, setStaffMonthlyPerformance] = useState<Record<string, number>>({});
  const [savingPerformance, setSavingPerformance] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch service records for today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const recordsQuery = query(
          collection(db, 'records'),
          where('date', '>=', today.toISOString()),
          orderBy('date', 'desc')
        );
        const recordsSnapshot = await getDocs(recordsQuery);
        const recordsData = recordsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as ServiceRecord[];
        setServiceRecords(recordsData);

        // Fetch all service records for the past 30 days for revenue chart
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        thirtyDaysAgo.setHours(0, 0, 0, 0);
        
        const allRecordsQuery = query(
          collection(db, 'records'),
          where('date', '>=', thirtyDaysAgo.toISOString()),
          orderBy('date', 'desc')
        );
        const allRecordsSnapshot = await getDocs(allRecordsQuery);
        const allRecordsData = allRecordsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as ServiceRecord[];
        setAllServiceRecords(allRecordsData);

        // Fetch staff
        const staffSnapshot = await getDocs(collection(db, 'staff'));
        const staffData = staffSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Staff[];
        setStaff(staffData);

        // Fetch attendance records for today
        const attendanceQuery = query(
          collection(db, 'attendance'),
          where('date', '>=', today.toISOString()),
          orderBy('date', 'desc')
        );
        const attendanceSnapshot = await getDocs(attendanceQuery);
        const attendanceData = attendanceSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as AttendanceRecord[];
        setAttendanceRecords(attendanceData);

        // Calculate initial revenue data (daily view)
        calculateRevenueData(allRecordsData, 'daily');

        // Calculate monthly performance for each staff
        calculateMonthlyStaffPerformance(allRecordsData, staffData);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Update revenue data when filter changes
  useEffect(() => {
    if (allServiceRecords.length > 0) {
      calculateRevenueData(allServiceRecords, revenueFilter);
    }
  }, [revenueFilter, allServiceRecords]);

  // Update staff performance when date changes
  useEffect(() => {
    if (allServiceRecords.length > 0 && staff.length > 0) {
      const selectedDate = new Date(staffPerformanceDate);
      selectedDate.setHours(0, 0, 0, 0);
      
      const nextDay = new Date(selectedDate);
      nextDay.setDate(nextDay.getDate() + 1);
      
      const filteredRecords = allServiceRecords.filter(record => {
        const recordDate = new Date(record.date);
        return recordDate >= selectedDate && recordDate < nextDay;
      });
      
      setServiceRecords(filteredRecords);
    }
  }, [staffPerformanceDate, allServiceRecords, staff]);

  const calculateRevenueData = (records: ServiceRecord[], filter: 'daily' | 'weekly' | 'monthly') => {
    let labels: string[] = [];
    let data: number[] = [];
    
    if (filter === 'daily') {
      // Daily view - last 7 days
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return date;
      }).reverse();

      labels = last7Days.map(date => formatDate(date));
      data = last7Days.map(date => {
        const dayRecords = records.filter(record => {
          const recordDate = new Date(record.date);
          return recordDate.toDateString() === date.toDateString();
        });
        return dayRecords.reduce((sum, record) => sum + record.totalPrice, 0);
      });
    } else if (filter === 'weekly') {
      // Weekly view - last 4 weeks
      const last4Weeks = Array.from({ length: 4 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (i * 7));
        return date;
      }).reverse();

      labels = last4Weeks.map(date => `Week of ${formatDate(date)}`);
      data = last4Weeks.map(date => {
        const weekStart = new Date(date);
        const weekEnd = new Date(date);
        weekEnd.setDate(weekEnd.getDate() + 6);
        
        const weekRecords = records.filter(record => {
          const recordDate = new Date(record.date);
          return recordDate >= weekStart && recordDate <= weekEnd;
        });
        return weekRecords.reduce((sum, record) => sum + record.totalPrice, 0);
      });
    } else if (filter === 'monthly') {
      // Monthly view - last 6 months
      const last6Months = Array.from({ length: 6 }, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        return date;
      }).reverse();

      labels = last6Months.map(date => date.toLocaleString('default', { month: 'short', year: 'numeric' }));
      data = last6Months.map(date => {
        const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
        const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        
        const monthRecords = records.filter(record => {
          const recordDate = new Date(record.date);
          return recordDate >= monthStart && recordDate <= monthEnd;
        });
        return monthRecords.reduce((sum, record) => sum + record.totalPrice, 0);
      });
    }

    setRevenueData({ labels, data });
  };

  const calculateMonthlyStaffPerformance = (records: ServiceRecord[], staffMembers: Staff[]) => {
    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    
    const monthlyPerformance: Record<string, number> = {};
    
    staffMembers.forEach(member => {
      const staffRecords = records.filter(record => {
        const recordDate = new Date(record.date);
        return record.staff === member.name && 
               recordDate >= firstDayOfMonth && 
               recordDate <= lastDayOfMonth;
      });
      
      const monthlyRevenue = staffRecords.reduce(
        (sum, record) => sum + record.totalPrice, 0
      );
      
      monthlyPerformance[member.name] = monthlyRevenue;
    });
    
    setStaffMonthlyPerformance(monthlyPerformance);
  };

  const saveStaffPerformanceToDatabase = async () => {
    try {
      setSavingPerformance(true);
      
      const currentDate = new Date();
      const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      
      // Create a document for each staff member's monthly performance
      for (const [staffName, revenue] of Object.entries(staffMonthlyPerformance)) {
        await addDoc(collection(db, 'staffPerformance'), {
          staffName,
          revenue,
          month: firstDayOfMonth.toISOString(),
          createdAt: Timestamp.now()
        });
      }
      
      alert('Staff performance data saved successfully!');
    } catch (error) {
      console.error('Error saving staff performance:', error);
      alert('Error saving staff performance data');
    } finally {
      setSavingPerformance(false);
    }
  };

  const totalRevenue = serviceRecords.reduce((sum, record) => sum + record.totalPrice, 0);
  const staffPresent = attendanceRecords.filter(record => record.status === 'present').length;

  // Filter staff based on search query
  const filteredStaff = staff.filter((member) =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <DollarSign className="h-10 w-10 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Today's Revenue</p>
              <p className="text-2xl font-semibold text-gray-900">{formatCurrency(totalRevenue)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Users className="h-10 w-10 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Staff Present</p>
              <p className="text-2xl font-semibold text-gray-900">
                {staffPresent}/{staff.length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <BarChart3 className="h-10 w-10 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Services Today</p>
              <p className="text-2xl font-semibold text-gray-900">{serviceRecords.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Revenue Overview</h2>
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-gray-500" />
            <select
              value={revenueFilter}
              onChange={(e) => setRevenueFilter(e.target.value as 'daily' | 'weekly' | 'monthly')}
              className="rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
        </div>
        <div className="h-64">
          <Line
            data={{
              labels: revenueData.labels,
              datasets: [
                {
                  label: `${revenueFilter.charAt(0).toUpperCase() + revenueFilter.slice(1)} Revenue`,
                  data: revenueData.data,
                  borderColor: 'rgb(147, 51, 234)',
                  backgroundColor: 'rgba(147, 51, 234, 0.1)',
                  tension: 0.4
                }
              ]
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'top' as const
                },
                title: {
                  display: false
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    callback: (value) => formatCurrency(value as number)
                  }
                }
              }
            }}
          />
        </div>
      </div>

      {/* Staff Performance */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-700">Staff Performance</h2>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-500" />
              <input
                type="date"
                value={staffPerformanceDate}
                onChange={(e) => setStaffPerformanceDate(e.target.value)}
                className="rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              />
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search staff..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <svg
                className="w-5 h-5 text-gray-400 absolute left-3 top-2.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Services</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clients</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Daily Revenue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monthly Revenue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time In</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStaff.map((member) => {
                const staffRecords = serviceRecords.filter(
                  (record) => record.staff === member.name
                );
                const staffRevenue = staffRecords.reduce(
                  (sum, record) => sum + record.totalPrice,
                  0
                );
                const uniqueClients = new Set(
                  staffRecords.map((record) => record.clientName)
                ).size;
                const attendance = attendanceRecords.find(
                  (record) => record.staffName === member.name
                );
                const monthlyRevenue = staffMonthlyPerformance[member.name] || 0;

                return (
                  <tr key={member.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{member.name}</div>
                      <div className="text-sm text-gray-500">{member.role}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{staffRecords.length}</div>
                      <div className="text-xs text-gray-500">
                        {staffRecords.map(s => s.services.map(service => service.name)).join(', ')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {uniqueClients}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(staffRevenue)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(monthlyRevenue)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {attendance?.status === 'present'
                        ? <span className="text-green-500">Present</span>
                        : <span className="text-red-500">Completed</span>
                      }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {attendance?.timeIn ? new Date(attendance.timeIn).toLocaleTimeString() : '-'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={saveStaffPerformanceToDatabase}
            disabled={savingPerformance}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {savingPerformance ? 'Saving...' : 'Save Monthly Performance'}
          </button>
        </div>
      </div>

      {/* Staff Attendance Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Staff Attendance Today</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time In</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time Out</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {attendanceRecords.length > 0 ? (
                attendanceRecords.map((record) => (
                  <tr key={record.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{record.staffName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.timeIn || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.timeOut || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {record.status === 'present'
                        ? <span className="text-green-500">Present</span>
                        : <span className="text-red-500">Completed</span>
                      }
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                    No attendance records found for today
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}