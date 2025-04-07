import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { PAYMENT_METHODS } from '../constants';
import { type ServiceRecord, Staff } from '../types';
import { formatCurrency } from '../utils/format';
import { addServiceRecord, getServiceRecords, getStaff } from '../lib/firebase/client-services';
import SearchableStaffSelect from '../components/SearchableStaffSelect';
import SearchableServiceSelect from '../components/SearchableServiceSelect';

export default function Records() {
  const [records, setRecords] = useState<ServiceRecord[]>([]);
  const today = format(new Date(), 'yyyy-MM-dd');
  const [formData, setFormData] = useState({
    date: today,
    staff: '',
    clientName: '',
    service: '',
    price: '',
    paymentMethod: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [staff, setStaff] = useState<Staff[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [todayRecords, staffData] = await Promise.all([
          getServiceRecords(today),
          getStaff()
        ]);
        setRecords(todayRecords);
        setStaff(staffData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [today]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const success = await addServiceRecord({
        ...formData,
        price: parseFloat(formData.price)
      });

      if (success) {
        // Reset form
        setFormData({
          date: today,
          staff: '',
          clientName: '',
          service: '',
          price: '',
          paymentMethod: ''
        });
        // Refresh records
        const todayRecords = await getServiceRecords(today);
        setRecords(todayRecords);
      }
    } catch (error) {
      console.error('Error adding record:', error);
      setError('Failed to add record. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Service Records</h1>
      
      {/* Add New Record Form */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Add New Record</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Date *</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Staff Member *</label>
            <SearchableStaffSelect
              staff={staff}
              value={formData.staff}
              onChange={(value) => setFormData(prev => ({ ...prev, staff: value }))}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Client Name *</label>
            <input
              type="text"
              name="clientName"
              value={formData.clientName}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              placeholder="Enter client name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Service *</label>
            <SearchableServiceSelect
              value={formData.service}
              onChange={(value) => setFormData(prev => ({ ...prev, service: value }))}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Price (₦) *</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              placeholder="Enter price"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Payment Method *</label>
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              required
            >
              <option value="">Select Payment Method</option>
              {PAYMENT_METHODS.map(method => (
                <option key={method} value={method}>
                  {method}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Add Record'}
            </button>
          </div>
        </form>
      </div>

      {/* Today's Records Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Today's Records</h2>
          {loading ? (
            <p className="text-gray-500 text-center py-4">Loading records...</p>
          ) : records.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No records for today</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {records.map((record) => (
                    <tr key={record.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {format(new Date(record.date), 'hh:mm a')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.staff}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.clientName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.service}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(record.price)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">{record.paymentMethod}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}