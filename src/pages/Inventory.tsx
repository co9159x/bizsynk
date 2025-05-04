import { useState, useEffect } from 'react';
import type { InventoryItem } from '../types';
import { getInventory, addInventoryItem, updateInventoryItem } from '../lib/firebase/client-services';
import { useAuth } from '../contexts/AuthContext';
import { Timestamp } from 'firebase/firestore';
import { AlertTriangle, CheckCircle, XCircle, Filter, Trash2 } from 'lucide-react';
import { collection, getDocs, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase/config';
import { capitalizeWords } from '../utils/format';

const formatDate = (date: Timestamp | string | null | undefined) => {
  if (!date) return 'N/A';
  if (date instanceof Timestamp) return date.toDate().toLocaleString();
  if (typeof date === 'string') return new Date(date).toLocaleString();
  return 'N/A';
};

// Define low stock threshold
const LOW_STOCK_THRESHOLD = 5;

// Toast component
const Toast = ({ message, type, onClose }: { message: string; type: 'success' | 'error' | 'info'; onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed top-4 right-4 z-50 p-4 rounded-md shadow-lg flex items-center ${
      type === 'success' ? 'bg-green-100 text-green-800' : 
      type === 'error' ? 'bg-red-100 text-red-800' : 
      'bg-blue-100 text-blue-800'
    }`}>
      {type === 'success' ? (
        <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
      ) : type === 'error' ? (
        <XCircle className="h-5 w-5 mr-2 text-red-500" />
      ) : (
        <AlertTriangle className="h-5 w-5 mr-2 text-blue-500" />
      )}
      <span>{message}</span>
    </div>
  );
};

export default function Inventory() {
  const { userRole } = useAuth();
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [filteredInventory, setFilteredInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: '', quantity: 0 });
  const [useItemData, setUseItemData] = useState({ itemId: '', quantity: 0 });
  const [lowStockItems, setLowStockItems] = useState<string[]>([]);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [filter, setFilter] = useState<'all' | 'in-stock' | 'low-stock' | 'out-of-stock'>('all');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadInventory();
  }, []);

  useEffect(() => {
    // Update low stock items whenever inventory changes
    const lowStock = inventory
      .filter(item => item.quantity <= LOW_STOCK_THRESHOLD && item.quantity > 0)
      .map(item => item.id);
    setLowStockItems(lowStock);
  }, [inventory]);

  useEffect(() => {
    // Apply filter whenever inventory or filter changes
    applyFilter();
  }, [inventory, filter]);

  const applyFilter = () => {
    switch (filter) {
      case 'in-stock':
        setFilteredInventory(inventory.filter(item => item.quantity > LOW_STOCK_THRESHOLD));
        break;
      case 'low-stock':
        setFilteredInventory(inventory.filter(item => item.quantity > 0 && item.quantity <= LOW_STOCK_THRESHOLD));
        break;
      case 'out-of-stock':
        setFilteredInventory(inventory.filter(item => item.quantity === 0));
        break;
      default:
        setFilteredInventory(inventory);
    }
  };

  const loadInventory = async () => {
    setLoading(true);
    try {
      const items = await getInventory();
      console.log('Loaded inventory items:', items);
      setInventory(items);
      // Apply current filter to the newly loaded items
      applyFilter();
    } catch (error) {
      console.error('Error loading inventory:', error);
      setToast({ message: 'Error loading inventory', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' ? (value === '' ? '' : parseInt(value)) : value,
    }));
  };

  const handleUseItemChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUseItemData(prev => ({
      ...prev,
      [name]: name === 'quantity' ? (value === '' ? '' : parseInt(value)) : value,
    }));
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(e.target.value as 'all' | 'in-stock' | 'low-stock' | 'out-of-stock');
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const trimmedName = formData.name.trim().toLowerCase();
      const existingItem = inventory.find(item => item.name.trim().toLowerCase() === trimmedName);

      if (existingItem) {
        setToast({ message: `Item "${existingItem.name}" already exists. Use the Update button to add more.`, type: 'error' });
        setLoading(false);
        return;
      }

      const newItem: Omit<InventoryItem, 'id'> = {
        name: formData.name.trim(),
        quantity: formData.quantity,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        updatedBy: userRole === 'admin' ? 'Admin' : userRole ? capitalizeWords(userRole) : 'Unknown',
      };

      const success = await addInventoryItem(newItem);
      if (success) {
        setFormData({ name: '', quantity: 0 });
        await loadInventory();
        setToast({ message: `Item "${newItem.name}" added successfully`, type: 'success' });
      }
    } catch (error) {
      console.error('Error adding inventory item:', error);
      setToast({ message: 'Error adding item', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const trimmedName = formData.name.trim().toLowerCase();
      const existingItem = inventory.find(item => item.name.trim().toLowerCase() === trimmedName);

      if (!existingItem) {
        setToast({ message: `Item "${formData.name}" not found. Use the Add button to create a new item.`, type: 'error' });
        setLoading(false);
        return;
      }

      // Update existing item - add the new quantity to the existing quantity
      const updatedQuantity = existingItem.quantity + formData.quantity;
      const success = await updateInventoryItem(existingItem.id, {
        quantity: updatedQuantity,
        updatedAt: Timestamp.now(),
        updatedBy: userRole === 'admin' ? 'Admin' : userRole ? capitalizeWords(userRole) : 'Unknown',
      });

      if (success) {
        setFormData({ name: '', quantity: 0 });
        await loadInventory();
        setToast({ message: `Item "${existingItem.name}" updated successfully. New quantity: ${updatedQuantity}`, type: 'success' });
      }
    } catch (error) {
      console.error('Error updating inventory item:', error);
      setToast({ message: 'Error updating item', type: 'error' });
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
        setToast({ message: 'Item not found', type: 'error' });
        setLoading(false);
        return;
      }

      // Check if item has 0 quantity
      if (item.quantity === 0) {
        setToast({ message: `Cannot use "${item.name}" - out of stock`, type: 'error' });
        setLoading(false);
        return;
      }

      // Check if trying to use more than available
      if (useItemData.quantity > item.quantity) {
        setToast({ message: `Cannot use ${useItemData.quantity} of "${item.name}" - only ${item.quantity} available`, type: 'error' });
        setLoading(false);
        return;
      }

      const updatedQuantity = item.quantity - useItemData.quantity;
      
      const success = await updateInventoryItem(item.id, {
        quantity: updatedQuantity,
        updatedAt: Timestamp.now(),
        updatedBy: userRole === 'staff' ? 'Staff' : 'Admin',
      });

      if (success) {
        setUseItemData({ itemId: '', quantity: 0 });
        await loadInventory();
        
        // Check if item is now empty
        if (updatedQuantity === 0) {
          setToast({ message: `Used all ${useItemData.quantity} of "${item.name}" - now out of stock`, type: 'success' });
        } else {
          setToast({ message: `Used ${useItemData.quantity} of "${item.name}" - ${updatedQuantity} remaining`, type: 'success' });
        }
      }
    } catch (error) {
      console.error('Error using inventory item:', error);
      setToast({ message: 'Error using item', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const deleteAllInventory = async () => {
    if (!window.confirm('Are you sure you want to delete ALL inventory items? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    try {
      const inventoryRef = collection(db, 'inventory');
      const snapshot = await getDocs(inventoryRef);
      
      console.log(`Found ${snapshot.docs.length} inventory items to delete`);
      
      if (snapshot.docs.length === 0) {
        setToast({ message: 'No inventory items found to delete', type: 'info' });
        setIsDeleting(false);
        return;
      }
      
      const deletePromises = snapshot.docs.map(doc => {
        console.log(`Deleting item: ${doc.id} - ${doc.data().name}`);
        return deleteDoc(doc.ref);
      });
      
      await Promise.all(deletePromises);
      
      // Clear the local state
      setInventory([]);
      setFilteredInventory([]);
      
      // Force a refresh of the inventory data
      await loadInventory();
      
      // Double-check if items were actually deleted
      const checkSnapshot = await getDocs(inventoryRef);
      console.log(`After deletion, found ${checkSnapshot.docs.length} items remaining`);
      
      if (checkSnapshot.docs.length > 0) {
        console.log('Items that still exist:', checkSnapshot.docs.map(doc => doc.data().name));
        setToast({ message: `Warning: ${checkSnapshot.docs.length} items could not be deleted`, type: 'error' });
      } else {
        setToast({ message: 'All inventory items have been deleted successfully', type: 'success' });
      }
    } catch (error) {
      console.error('Error deleting inventory items:', error);
      setToast({ message: 'Error deleting inventory items', type: 'error' });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>

      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Add or Update Item</h2>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={handleAddItem}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Add New Item
              </button>
              <button
                type="button"
                onClick={handleUpdateItem}
                className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              >
                Update Existing Item
              </button>
            </div>
          </form>
        </div>

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
                {inventory
                  .filter(item => item.quantity > 0) // Only show items with quantity > 0
                  .map(item => (
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
                max={useItemData.itemId ? inventory.find(i => i.id === useItemData.itemId)?.quantity || 1 : 1}
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

      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Current Inventory</h2>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Filter className="h-5 w-5 text-gray-500 mr-2" />
                <select
                  value={filter}
                  onChange={handleFilterChange}
                  className="rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                >
                  <option value="all">All Items</option>
                  <option value="in-stock">In Stock</option>
                  <option value="low-stock">Low Stock</option>
                  <option value="out-of-stock">Out of Stock</option>
                </select>
              </div>
              
              {userRole === 'admin' && inventory.length > 0 && (
                <button
                  onClick={deleteAllInventory}
                  disabled={isDeleting}
                  className="flex items-center px-3 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  {isDeleting ? 'Deleting...' : 'Delete All'}
                </button>
              )}
            </div>
          </div>
          
          {loading ? (
            <p className="text-gray-500 text-center py-4">Loading inventory...</p>
          ) : filteredInventory.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No items match the selected filter</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Added</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredInventory.map(item => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.quantity}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {item.quantity === 0 ? (
                          <div className="flex items-center text-red-600">
                            <XCircle className="h-4 w-4 mr-1" />
                            <span>Out of Stock</span>
                          </div>
                        ) : lowStockItems.includes(item.id) ? (
                          <div className="flex items-center text-amber-600">
                            <AlertTriangle className="h-4 w-4 mr-1" />
                            <span>Low Stock</span>
                          </div>
                        ) : (
                          <span className="text-green-600">In Stock</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(item.createdAt)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(item.updatedAt)}</td>
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
