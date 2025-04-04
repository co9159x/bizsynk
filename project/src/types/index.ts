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
  role: 'owner' | 'staff';
  status: 'in' | 'out';
  lastClockIn?: string;
  lastClockOut?: string;
}

export interface InventoryItem {
  id?: string;
  name: string;
  quantity: number;
  alertLevel: number;
}

export const SERVICES = ['Braiding', 'Haircut', 'Manicure'] as const;
export const PAYMENT_METHODS = ['Cash', 'Card', 'Mobile'] as const;