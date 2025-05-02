import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { PAYMENT_METHODS } from '../constants';
import { type ServiceRecord } from '../types';
import { formatCurrency, capitalizeWords } from '../utils/format';
import { addServiceRecord, getServiceRecords, getStaff, getServices } from '../lib/firebase/client-services';
import SearchableServiceSelect from '../components/SearchableServiceSelect';
import SearchableStaffSelect from '../components/SearchableStaffSelect';
import { useAuth } from '../contexts/AuthContext';

export default function Records() {
  const { currentUser, userRole } = useAuth();
  const [records, setRecords] = useState<ServiceRecord[]>([]);
  const today = format(new Date(), 'yyyy-MM-dd');
  const [selectedDate, setSelectedDate] = useState(today);
  const [formData, setFormData] = useState({
    clientName: '',
    clientPhone: '',
    date: today,
    services: [] as { name: string; price: number }[],
    totalPrice: 0,
    discountAmount: '',
    finalPrice: 0,
    paymentMethod: '',
    staff: '',
    staffId: currentUser?.uid || ''
  });
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState<{ category: string; services: { name: string; price: number }[] }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [_, servicesData] = await Promise.all([
          getStaff(),
          getServices()
        ]);
        setServices(servicesData);

        // Fetch records for the selected date
        const dateRecords = await getServiceRecords(selectedDate, userRole === 'staff' ? currentUser?.uid : undefined);
        setRecords(dateRecords);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedDate, currentUser?.uid, userRole]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Update selected date when form date changes
    if (name === 'date') {
      setSelectedDate(value);
    }
  };

  const handleStaffChange = (staffId: string, staffName: string) => {
    setFormData(prev => ({
      ...prev,
      staffId: userRole === 'staff' ? currentUser?.uid || '' : staffId,
      staff: staffName
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const now = new Date();
      const currentDate = format(now, 'yyyy-MM-dd');
      const currentTime = format(now, 'HH:mm:ss');

      await addServiceRecord({
        date: currentDate,
        time: currentTime,
        staff: formData.staff,
        staffId: formData.staffId,
        clientName: capitalizeWords(formData.clientName),
        services: formData.services,
        totalPrice: formData.finalPrice,
        discountAmount: Number(formData.discountAmount) || 0,
        paymentMethod: formData.paymentMethod,
      });

      setFormData(prev => ({
        ...prev,
        clientName: '',
        clientPhone: '',
        services: [],
        totalPrice: 0,
        discountAmount: '',
        finalPrice: 0,
        paymentMethod: ''
      }));
      
      const dateRecords = await getServiceRecords(selectedDate, userRole === 'staff' ? currentUser?.uid : undefined);
      setRecords(dateRecords);
    } catch (error) {
      console.error('Error adding record:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter records based on user role and selected staff
  const filteredRecords = userRole === 'admin'
    ? (formData.staffId ? records.filter(record => record.staffId === formData.staffId) : records)
    : records.filter(record => record.staffId === currentUser?.uid);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Service Records</h1>

      {/* Add Record Form */}
      <div className="bg-white rounded-lg shadow p-6">
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

          <SearchableStaffSelect
            onChange={handleStaffChange}
            label="Staff Member *"
            required
          />

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
            <label className="block text-sm font-medium text-gray-700">Client Phone</label>
            <input
              type="tel"
              name="clientPhone"
              value={formData.clientPhone}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              placeholder="Enter client phone"
            />
          </div>

          <div className="md:col-span-2">
            <SearchableServiceSelect
              value={formData.services.map(s => s.name).join(', ')}
              onChange={(serviceName) => {
                // Find the service in the services data
                const selectedService = services.find(category => 
                  category.services.find(s => s.name === serviceName)
                )?.services.find(s => s.name === serviceName);

                if (selectedService) {
                  setFormData(prev => ({
                    ...prev,
                    services: [...prev.services, selectedService],
                    totalPrice: prev.totalPrice + selectedService.price,
                    finalPrice: prev.totalPrice + selectedService.price - (Number(prev.discountAmount) || 0)
                  }));
                }
              }}
              required
            />
          </div>

          {/* Selected Services List */}
          {formData.services.length > 0 && (
            <div className="md:col-span-2">
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Selected Services:</h3>
                <div className="space-y-2">
                  {formData.services.map((service, index) => (
                    <div key={`${service.name}-${index}`} className="flex justify-between items-center bg-gray-50 p-3 rounded-md">
                      <span className="text-gray-900">{service.name}</span>
                      <div className="flex items-center space-x-4">
                        <span className="text-gray-600">{formatCurrency(service.price)}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setFormData(prev => {
                              const newServices = prev.services.filter((_, i) => i !== index);
                              const newTotalPrice = newServices.reduce((sum, s) => sum + s.price, 0);
                              return {
                                ...prev,
                                services: newServices,
                                totalPrice: newTotalPrice,
                                finalPrice: newTotalPrice - (Number(prev.discountAmount) || 0)
                              };
                            });
                          }}
                          className="text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">Payment Method *</label>
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              required
            >
              <option value="">Select payment method</option>
              {PAYMENT_METHODS.map(method => (
                <option key={method} value={method}>{method}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Subtotal</label>
            <input
              type="text"
              value={formatCurrency(formData.totalPrice)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 bg-gray-50"
              disabled
            />
          </div>

          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">Discount Amount</label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                  ₦
                </span>
                <input
                  type="text"
                  name="discountAmount"
                  value={formData.discountAmount}
                  onChange={(e) => {
                    // Only allow numbers
                    const value = e.target.value.replace(/[^0-9]/g, '');
                    const discountAmount = value === '' ? '' : value;
                    setFormData(prev => ({
                      ...prev,
                      discountAmount,
                      finalPrice: prev.totalPrice - (Number(discountAmount) || 0)
                    }));
                  }}
                  className="flex-1 rounded-none rounded-r-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  placeholder="Enter amount (e.g. 500)"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Final Price</label>
            <input
              type="text"
              value={formatCurrency(formData.finalPrice || formData.totalPrice)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 bg-gray-50 font-bold"
              disabled
            />
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

      {/* Records Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">
            Records for {format(new Date(selectedDate), 'MMMM d, yyyy')}
          </h2>
          {loading ? (
            <p className="text-gray-500 text-center py-4">Loading records...</p>
          ) : filteredRecords.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No records for this date</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Original Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Final Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRecords.map((record) => (
                    <tr key={record.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.time}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.staff}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.clientName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.services.map(s => s.name).join(', ')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(record.services.reduce((sum, s) => sum + s.price, 0))}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.discountAmount ? formatCurrency(record.discountAmount) : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(record.totalPrice)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.paymentMethod}</td>
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