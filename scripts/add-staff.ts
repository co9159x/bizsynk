import { addMultipleStaff, clearStaffCollection } from '../src/lib/firebase/services.js';

const cashiers = [
  "John Smith",
  "Jane Doe",
  "Michael Johnson",
  "Sarah Williams"
];

const supervisors = [
  "Robert Brown",
  "Emily Davis",
  "David Wilson"
];

const managers = [
  "Jennifer Taylor",
  "James Anderson"
];

const staffData = [
  ...cashiers.map(name => ({
    name,
    role: "Cashier" as const,
    email: null,
    phone: null,
    status: "out" as const,
    lastClockIn: null,
    lastClockOut: null,
    category: "Cashiers"
  })),
  ...supervisors.map(name => ({
    name,
    role: "Supervisor" as const,
    email: null,
    phone: null,
    status: "out" as const,
    lastClockIn: null,
    lastClockOut: null,
    category: "Supervisors"
  })),
  ...managers.map(name => ({
    name,
    role: "Manager" as const,
    email: null,
    phone: null,
    status: "out" as const,
    lastClockIn: null,
    lastClockOut: null,
    category: "Managers"
  }))
];

async function main() {
  try {
    console.log('Starting staff data addition...');
    
    // Clear existing staff
    await clearStaffCollection();
    
    // Add new staff
    await addMultipleStaff(staffData);
    console.log('Staff data added successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error adding staff data:', error);
    process.exit(1);
  }
}

main(); 