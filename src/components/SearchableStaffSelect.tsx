import { useState, useEffect } from 'react';
import { Staff } from '../types';
import { getStaff } from '../lib/firebase/client-services';
import { capitalizeWords } from '../utils/format';

interface SearchableStaffSelectProps {
  onChange: (staffId: string, staffName: string) => void;
  label?: string;
  required?: boolean;
}

export default function SearchableStaffSelect({ onChange, label = 'Staff', required = false }: SearchableStaffSelectProps) {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStaffName, setSelectedStaffName] = useState('');

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const staffData = await getStaff();
        setStaff(staffData);
      } catch (error) {
        console.error('Error fetching staff:', error);
      }
    };
    fetchStaff();
  }, []);

  const filteredStaff = staff.filter(member => {
    const fullName = `${capitalizeWords(member.firstName)} ${capitalizeWords(member.lastName)}`;
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
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
          value={selectedStaffName || searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setSelectedStaffName('');
            setIsOpen(true);
          }}
          placeholder="Search staff..."
          required={required}
          readOnly
        />
        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
            {filteredStaff.map((staffMember) => (
              <div
                key={staffMember.id}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  if (staffMember.id) {
                    const fullName = `${capitalizeWords(staffMember.firstName)} ${capitalizeWords(staffMember.lastName)}`;
                    onChange(staffMember.id, fullName);
                    setSelectedStaffName(fullName);
                    setSearchTerm('');
                    setIsOpen(false);
                  }
                }}
              >
                {capitalizeWords(staffMember.firstName)} {capitalizeWords(staffMember.lastName)}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 