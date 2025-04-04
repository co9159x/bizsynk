import { useState } from 'react';
import type { ServiceRecord } from '../types';

export default function Dashboard() {
  const [records] = useState<ServiceRecord[]>([]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="grid gap-4">
        {records.map((record) => (
          <div key={record.id} className="p-4 border rounded-lg">
            <div className="flex items-center justify-between">
              <span className="font-medium">{record.service}</span>
              <span className="text-gray-500">${record.price}</span>
            </div>
            <div className="text-sm text-gray-500">
              By {record.staff} for {record.clientName}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}