import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { SERVICES, PAYMENT_METHODS } from '../constants';
import { type ServiceRecord, Staff } from '../types';
import { formatCurrency } from '../utils/format';
import { addServiceRecord, getServiceRecords, getStaff } from '../lib/firebase/client-services';

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
  const [selectedStaff, setSelectedStaff] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [clientName, setClientName] = useState('');
  const [price, setPrice] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        setLoading(true);
        const todayRecords = await getServiceRecords(today);
        setRecords(todayRecords);
      } catch (error) {
        console.error('Error fetching records:', error);
        setError('Failed to load records. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    const fetchStaff = async () => {
      try {
        const staffData = await getStaff();
        setStaff(staffData);
      } catch (error) {
        console.error('Error fetching staff:', error);
      }
    };

    fetchRecords();
    fetchStaff();
  }, [today]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError('');
      
      const newRecord: Omit<ServiceRecord, 'id'> = {
        date: formData.date,
        staff: formData.staff,
        clientName: formData.clientName,
        service: formData.service,
        price: parseFloat(formData.price),
        paymentMethod: formData.paymentMethod
      };
      
      await handleAddRecord(newRecord);
      
      // Reset form
      setFormData({
        date: today,
        staff: '',
        clientName: '',
        service: '',
        price: '',
        paymentMethod: ''
      });
    } catch (error) {
      console.error('Error adding record:', error);
      setError('Failed to add record. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddRecord = async (record: ServiceRecord) => {
    try {
      const addedRecord = await addServiceRecord(record);
      if (addedRecord && typeof addedRecord !== 'boolean') {
        setRecords(prev => [addedRecord, ...prev]);
      }
    } catch (error) {
      console.error('Error adding record:', error);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Daily Records</h1>
      
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
            <label className="block text-sm font-medium text-gray-700">Staff *</label>
            <select 
              name="staff"
              value={formData.staff}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              required
            >
              <option value="">Select Staff</option>
              <optgroup label="Barbers">
                {staff
                  .filter(member => member.role === 'Barber')
                  .map((member) => (
                    <option key={member.id} value={member.name}>
                      {member.name}
                    </option>
                  ))}
              </optgroup>
              <optgroup label="Stylists">
                {staff
                  .filter(member => member.role === 'Stylist')
                  .map((member) => (
                    <option key={member.id} value={member.name}>
                      {member.name}
                    </option>
                  ))}
              </optgroup>
            </select>
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
            <select 
              name="service"
              value={formData.service}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              required
            >
              <option value="">Select Service</option>
              {SERVICES.map(service => (
                <option key={service} value={service}>{service}</option>
              ))}
            </select>
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
              min="0"
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
                <option key={method} value={method.toLowerCase()}>{method}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            {error && (
              <div className="mb-4 text-red-500 text-sm">
                {error}
              </div>
            )}
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

      {/* Today's Records */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Today's Records</h2>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
          ) : records.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No records for today</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Method</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {records.map((record) => (
                    <tr key={record.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.staff}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.clientName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.service}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(record.price)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.paymentMethod}</td>
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