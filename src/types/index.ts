export interface ServiceRecord {
  id?: string;
  date: string;
  staff: string;
  clientName: string;
  services: { name: string; price: number }[];
  totalPrice: number;
  paymentMethod: string;
  createdAt?: string;
}

export interface Staff {
  id?: string;
  name: string;
  firstName: string;
  lastName: string;
  role: 'Barber' | 'Stylist' | 'Nail Technician' | 'Makeup Artist' | 'Receptionist' | 'Manager';
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
  id?: string;
  name: string;
  quantity: number;
  lastUsed: string | null;
  category: string;
  minimumQuantity: number;
  createdAt?: string;
}

export interface AttendanceRecord {
  id?: string;
  staffId: string;
  staffName: string;
  date: string;
  timeIn: string | null;
  timeOut: string | null;
  status: 'present' | 'late' | 'absent';
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