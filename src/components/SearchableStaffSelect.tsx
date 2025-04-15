import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Staff } from '../types';

// Helper function to capitalize first letter of each word
const capitalizeWords = (str: string): string => {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

interface SearchableStaffSelectProps {
  onChange: (value: string) => void;
  label?: string;
}

export default function SearchableStaffSelect({ onChange, label = 'Staff' }: SearchableStaffSelectProps) {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    async function fetchStaff() {
      const staffCollection = collection(db, 'staff');
      const staffSnapshot = await getDocs(staffCollection);
      const staffList = staffSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Staff));
      setStaff(staffList);
    }
    fetchStaff();
  }, []);

  const filteredStaff = staff.filter(staffMember => {
    const firstName = staffMember.firstName || '';
    const lastName = staffMember.lastName || '';
    const fullName = `${capitalizeWords(firstName)} ${capitalizeWords(lastName)}`;
    return fullName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div
        className="relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        <input
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          placeholder="Search staff..."
        />
        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
            {filteredStaff.map((staffMember) => (
              <div
                key={staffMember.id}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  if (staffMember.id) {
                    onChange(staffMember.id);
                  }
                  const firstName = staffMember.firstName || '';
                  const lastName = staffMember.lastName || '';
                  setSearchTerm(`${capitalizeWords(firstName)} ${capitalizeWords(lastName)}`);
                  setIsOpen(false);
                }}
              >
                {capitalizeWords(staffMember.firstName || '')} {capitalizeWords(staffMember.lastName || '')}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 