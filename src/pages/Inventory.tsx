import { useState, useEffect } from 'react';
import type { InventoryItem } from '../types';
import { getInventory, addInventoryItem, updateInventoryItem } from '../lib/firebase/client-services';
import { useAuth } from '../contexts/AuthContext';
import { Timestamp } from 'firebase/firestore';

// Helper function to format dates
const formatDate = (date: Timestamp | string | null | undefined) => {
  if (!date) return 'N/A';
  if (date instanceof Timestamp) {
    return date.toDate().toLocaleString();
  }
  if (typeof date === 'string') {
    return new Date(date).toLocaleString();
  }
  return 'N/A';
};

export default function Inventory() {
  const { userRole } = useAuth();
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    quantity: 0
  });
  const [useItemData, setUseItemData] = useState({
    itemId: '',
    quantity: 0
  });
  // const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      const items = await getInventory();
      setInventory(items);
    } catch (error) {
      console.error('Error loading inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' ? parseInt(value) || 0 : value
    }));
  };

  const handleUseItemChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUseItemData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Check if item already exists - use exact match for name
      const existingItem = inventory.find(item => 
        item.name.toLowerCase().trim() === formData.name.toLowerCase().trim()
      );

      if (existingItem) {
        // Update existing item quantity
        const currentQuantity = parseInt(String(existingItem.quantity)) || 0;
        const addedQuantity = parseInt(String(formData.quantity)) || 0;
        const updatedQuantity = currentQuantity + addedQuantity;
        
        console.log(`Updating ${existingItem.name}: ${currentQuantity} + ${addedQuantity} = ${updatedQuantity}`);
        
        const success = await updateInventoryItem(existingItem.id, {
          quantity: updatedQuantity,
          updatedAt: Timestamp.now(),
          updatedBy: userRole === 'staff' ? 'Staff' : 'Admin'
        });

        if (success) {
          setFormData({
            name: '',
            quantity: 0
          });
          const inventoryData = await getInventory();
          setInventory(inventoryData);
        }
      } else {
        // Create new item
        const newItem: Omit<InventoryItem, 'id'> = {
          name: formData.name.trim(),
          quantity: parseInt(String(formData.quantity)) || 0,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
          updatedBy: userRole === 'staff' ? 'Staff' : 'Admin'
        };

        const success = await addInventoryItem(newItem);

        if (success) {
          setFormData({
            name: '',
            quantity: 0
          });
          const inventoryData = await getInventory();
          setInventory(inventoryData);
        }
      }
    } catch (error) {
      console.error('Error creating/updating inventory item:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUseItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const item = inventory.find(i => i.id === useItemData.itemId);
      if (!item) {
        throw new Error('Item not found');
      }

      const updatedQuantity = item.quantity - useItemData.quantity;
      if (updatedQuantity < 0) {
        throw new Error('Insufficient quantity');
      }

      const success = await updateInventoryItem(item.id, {
        quantity: updatedQuantity,
        updatedAt: Timestamp.now(),
        updatedBy: userRole === 'staff' ? 'Staff' : 'Admin'
      });

      if (success) {
        setUseItemData({
          itemId: '',
          quantity: 0
        });
        const inventoryData = await getInventory();
        setInventory(inventoryData);
      }
    } catch (error) {
      console.error('Error using inventory item:', error);
    } finally {
      setLoading(false);
    }
  };

  // const handleUpdateItem = async (itemId: string, updatedData: Partial<InventoryItem>) => {
  //   setLoading(true);

  //   try {
  //     const success = await updateInventoryItem(itemId, updatedData);

  //     if (success) {
  //       const inventoryData = await getInventory();
  //       setInventory(inventoryData);
  //     }
  //   } catch (error) {
  //     console.error('Error updating inventory item:', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
      
      {/* Add New Item Form - Admin Only */}
      {userRole === 'admin' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Add New Item</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Product Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                placeholder="Enter product name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Quantity</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                placeholder="Enter quantity"
                required
                min="0"
              />
            </div>
            <div className="md:col-span-2">
              <button
                type="submit"
                className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              >
                Add Item
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Use Item Form - Staff Only */}
      {userRole === 'staff' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Use Item</h2>
          <form onSubmit={handleUseItem} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Select Item</label>
              <select
                name="itemId"
                value={useItemData.itemId}
                onChange={handleUseItemChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                required
              >
                <option value="">Select an item</option>
                {inventory.map(item => (
                  <option key={item.id} value={item.id}>
                    {item.name} (Available: {item.quantity})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Quantity to Use</label>
              <input
                type="number"
                name="quantity"
                value={useItemData.quantity}
                onChange={handleUseItemChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                placeholder="Enter quantity to use"
                required
                min="1"
              />
            </div>
            <div className="md:col-span-2">
              <button
                type="submit"
                className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              >
                Use Item
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Inventory List */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Current Inventory</h2>
          {loading ? (
            <p className="text-gray-500 text-center py-4">Loading inventory...</p>
          ) : inventory.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No items in inventory</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Added</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Used</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {inventory.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.quantity}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(item.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.updatedAt && item.updatedBy === 'Staff' 
                          ? formatDate(item.updatedAt) 
                          : 'Never'}
                      </td>
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