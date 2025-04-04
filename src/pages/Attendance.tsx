import { useState, useEffect } from 'react';
import type { Staff } from '../types';
import { getStaff } from '../lib/firebase/client-services';

export default function Attendance() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStaff() {
      try {
        setLoading(true);
        const staffData = await getStaff();
        setStaff(staffData);
      } catch (err) {
        console.error('Error fetching staff:', err);
        setError('Failed to load staff data');
      } finally {
        setLoading(false);
      }
    }

    fetchStaff();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Attendance</h1>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Attendance</h1>
        <div className="bg-red-50 p-4 rounded-lg text-red-600">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Attendance</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {staff.map((member) => (
          <div key={member.id} className="p-4 border rounded-lg">
            <div className="flex items-center justify-between">
              <span className="font-medium">{member.name}</span>
              <span className={member.status === 'in' ? 'text-green-500' : 'text-red-500'}>
                {member.status === 'in' ? 'Present' : 'Absent'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}