import { useState, useEffect } from 'react';
import { Package } from 'lucide-react';
import type { InventoryItem } from '../types';
import { getInventory, addInventoryItem, updateInventoryItem } from '../lib/firebase/client-services';
import { useAuth } from '../contexts/AuthContext';

export default function Inventory() {
  const { userRole } = useAuth();
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    quantity: ''
  });
  const [useItemData, setUseItemData] = useState({
    itemId: '',
    quantity: ''
  });

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
      [name]: value
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
    
    try {
      const success = await addInventoryItem({
        name: formData.name,
        quantity: parseInt(formData.quantity, 10),
        createdAt: new Date().toISOString()
      });

      if (success) {
        // Reset form
        setFormData({
          name: '',
          quantity: ''
        });
        // Reload inventory
        await loadInventory();
      }
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const handleUseItem = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const item = inventory.find(i => i.id === useItemData.itemId);
      if (!item) return;

      const quantityToUse = parseInt(useItemData.quantity, 10);
      if (quantityToUse > item.quantity) {
        alert('Cannot use more items than available in inventory');
        return;
      }

      const currentDate = new Date();
      const success = await updateInventoryItem(useItemData.itemId, {
        quantity: item.quantity - quantityToUse,
        lastUsed: currentDate.toISOString(),
        lastUsedBy: userRole === 'staff' ? 'Staff' : 'Admin'
      });

      if (success) {
        // Reset form
        setUseItemData({
          itemId: '',
          quantity: ''
        });
        // Reload inventory
        await loadInventory();
      }
    } catch (error) {
      console.error('Error using item:', error);
    }
  };

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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Added</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Used</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {inventory.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.quantity}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.quantity === 0 ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Out of Stock
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <Package className="w-4 h-4 mr-1" />
                            In Stock
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.createdAt ? new Date(item.createdAt).toLocaleString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.lastUsed ? new Date(item.lastUsed).toLocaleString() : 'Never'}
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