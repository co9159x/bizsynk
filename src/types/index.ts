import { Timestamp } from 'firebase/firestore';

export interface ServiceRecord {
  id?: string;
  date: string;
  time?: string;
  staff: string;
  staffId: string;
  clientName: string;
  services: { name: string; price: number }[];
  totalPrice: number;
  discountAmount?: number;
  paymentMethod: string;
  createdAt?: string;
}

export interface Staff {
  id?: string;
  name: string;
  firstName: string;
  lastName: string;
  role: 'Cashier' | 'Supervisor' | 'Manager';
  email: string | null;
  phone: string | null;
  status: 'in' | 'out';
  lastClockIn: string | null;
  lastClockOut: string | null;
  category?: string;
  userId?: string;
  createdAt?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  unit?: string;
  category?: string;
  minimumQuantity?: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  updatedBy: string;
}

export interface Location {
  id?: string;
  name: string;
  latitude: number;
  longitude: number;
  maxDistance: number; // in meters
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AttendanceRecord {
  id?: string;
  staffId: string;
  staffName: string;
  date: string;
  timeIn: string | null;
  timeOut: string | null;
  status: 'present' | 'late' | 'absent';
  locationId?: string; // Reference to the location used for clock-in
  locationName?: string; // Name of the location for easy reference
  createdAt?: string;
}

export interface Service {
  id?: string;
  name: string;
  price: number;
  duration: number;
  category: string;
  description?: string;
  createdAt?: string;
}

export interface Client {
  id?: string;
  name: string;
  phone: string;
  email: string;
  notes?: string;
  createdAt?: string;
}