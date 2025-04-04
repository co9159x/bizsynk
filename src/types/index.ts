export interface ServiceRecord {
  id?: string;
  date: string;
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
}

export interface InventoryItem {
  id?: string;
  name: string;
  quantity: number;
  lastUsed?: string;
  lastUsedBy?: string;
}

export const SERVICES = ['Braiding', 'Haircut', 'Manicure'] as const;
export const PAYMENT_METHODS = ['Cash', 'Card', 'Transfer'] as const;