import { useState, useEffect } from 'react';
import { BarChart3, Users, DollarSign } from 'lucide-react';
import type { ServiceRecord, Staff, AttendanceRecord } from '../types';
import { formatCurrency, formatDate, formatTime } from '../utils/format';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
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

        // Calculate revenue data for the last 7 days
        const last7Days = Array.from({ length: 7 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - i);
          return date;
        }).reverse();

        const revenueByDay = last7Days.map(date => {
          const dayRecords = recordsData.filter(record => {
            const recordDate = new Date(record.date);
            return recordDate.toDateString() === date.toDateString();
          });
          return {
            label: formatDate(date),
            revenue: dayRecords.reduce((sum, record) => sum + record.price, 0)
          };
        });

        setRevenueData({
          labels: revenueByDay.map(day => day.label),
          data: revenueByDay.map(day => day.revenue)
        });

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalRevenue = serviceRecords.reduce((sum, record) => sum + record.price, 0);
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
        <h2 className="text-xl font-semibold mb-4">Revenue Overview</h2>
        <div className="h-64">
          <Line
            data={{
              labels: revenueData.labels,
              datasets: [
                {
                  label: 'Daily Revenue',
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
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Services</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clients</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
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
                  (sum, record) => sum + record.price,
                  0
                );
                const uniqueClients = new Set(
                  staffRecords.map((record) => record.clientName)
                ).size;
                const attendance = attendanceRecords.find(
                  (record) => record.staffName === member.name
                );

                return (
                  <tr key={member.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{member.name}</div>
                      <div className="text-sm text-gray-500">{member.role}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{staffRecords.length}</div>
                      <div className="text-xs text-gray-500">
                        {staffRecords.map(s => s.service).join(', ')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {uniqueClients}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(staffRevenue)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        attendance?.status === 'present'
                          ? 'bg-green-100 text-green-800'
                          : attendance?.status === 'late'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                      }`}>
                        {attendance?.status || 'absent'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {attendance?.timeIn ? formatTime(attendance.timeIn) : '-'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
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
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        record.status === 'present' 
                          ? 'bg-green-100 text-green-800' 
                          : record.status === 'late' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-red-100 text-red-800'
                      }`}>
                        {record.status}
                      </span>
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