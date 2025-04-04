import React, { useState } from 'react';
import { BarChart3, Users, Package, AlertTriangle, DollarSign } from 'lucide-react';
import type { ServiceRecord, Staff, InventoryItem } from '../types';
import { formatCurrency } from '../utils/format';

export default function Dashboard() {
  const [isOwner] = useState(true); // This would come from auth context in a real app
  const [records] = useState<ServiceRecord[]>([]);
  const [staff] = useState<Staff[]>([]);
  const [inventory] = useState<InventoryItem[]>([]);

  const totalRevenue = records.reduce((sum, record) => sum + record.price, 0);
  const lowStockItems = inventory.filter(item => item.quantity <= item.alertLevel);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">
        {isOwner ? "Owner's Dashboard" : "Staff Dashboard"}
      </h1>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                {staff.filter(s => s.status === 'in').length}/{staff.length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <BarChart3 className="h-10 w-10 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Services Today</p>
              <p className="text-2xl font-semibold text-gray-900">{records.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <AlertTriangle className="h-10 w-10 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Low Stock Items</p>
              <p className="text-2xl font-semibold text-gray-900">{lowStockItems.length}</p>
            </div>
          </div>
        </div>
      </div>

      {isOwner && (
        <>
          {/* Revenue Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Revenue Overview</h2>
            <div className="h-64 flex items-center justify-center text-gray-500">
              Chart coming soon...
            </div>
          </div>

          {/* Staff Performance */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Staff Performance</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Services</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {staff.map((member) => {
                    const staffRecords = records.filter(r => r.staff === member.name);
                    const staffRevenue = staffRecords.reduce((sum, r) => sum + r.price, 0);
                    return (
                      <tr key={member.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{member.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{staffRecords.length}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(staffRevenue)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        {records.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No recent activity</p>
        ) : (
          <div className="space-y-4">
            {records.slice(0, 5).map((record) => (
              <div key={record.id} className="flex items-center justify-between border-b pb-4">
                <div>
                  <p className="font-medium text-gray-900">{record.service}</p>
                  <p className="text-sm text-gray-500">By {record.staff} for {record.clientName}</p>
                </div>
                <p className="text-purple-600 font-semibold">{formatCurrency(record.price)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}