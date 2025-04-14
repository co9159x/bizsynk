export interface ServiceRecord {
  id?: string;
  date: string;
  time: string;
  staff: string;
  clientName: string;
  service: string;
  price: number;
  paymentMethod: string;
}

export interface Staff {
  id?: string;
  name: string;
  role: 'Barber' | 'Stylist';
  email: string | null;
  phone: string | null;
  status: 'in' | 'out';
  lastClockIn: string | null;
  lastClockOut: string | null;
  category?: string;
  userId?: string;
}

export interface InventoryItem {
  id?: string;
  name: string;
  quantity: number;
  lastUsed?: string;
  lastUsedBy?: string;
  createdAt?: string;
}

export interface AttendanceRecord {
  id?: string;
  staffId: string;
  staffName: string;
  date: string;
  timeIn: string | null;
  timeOut: string | null;
  status: 'present' | 'absent' | 'late';
  notes?: string;
}