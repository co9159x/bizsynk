import { useState } from 'react';
import type { InventoryItem } from '../types';

export default function Inventory() {
  const [inventory] = useState<InventoryItem[]>([]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Inventory</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {inventory.map((item) => (
          <div key={item.id} className="p-4 border rounded-lg">
            <div className="flex items-center justify-between">
              <span className="font-medium">{item.name}</span>
              <span className="text-gray-500">Qty: {item.quantity}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}