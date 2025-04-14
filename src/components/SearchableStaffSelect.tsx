import { useState, useEffect } from 'react';
import { Staff } from '../types';
import { getStaff } from '../lib/firebase/client-services';
import { useAuth } from '../contexts/AuthContext';

interface SearchableStaffSelectProps {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  className?: string;
  disabled?: boolean;
}

export default function SearchableStaffSelect({
  value,
  onChange,
  required = false,
  className = '',
  disabled = false
}: SearchableStaffSelectProps) {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchStaff = async () => {
      const staffData = await getStaff();
      setStaff(staffData);

      // If there's a current user, find their staff record
      if (currentUser) {
        const currentStaffMember = staffData.find(s => s.userId === currentUser.uid);
        if (currentStaffMember) {
          onChange(currentStaffMember.name);
        }
      }
    };
    fetchStaff();
  }, [currentUser, onChange]);

  const filteredStaff = staff.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedStaff = staff.find(member => member.name === value);

  return (
    <div className="relative">
      <div
        className={`w-full p-2 border rounded-md ${disabled ? 'bg-gray-100' : 'cursor-pointer'} ${className}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        {selectedStaff ? selectedStaff.name : 'Select Staff'}
      </div>
      
      {isOpen && !disabled && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
          <input
            type="text"
            className="w-full p-2 border-b focus:outline-none"
            placeholder="Search staff..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="max-h-60 overflow-y-auto">
            <div className="p-2">
              <div className="font-semibold text-gray-500 text-sm mb-1">Barbers</div>
              {filteredStaff
                .filter(member => member.role === 'Barber')
                .map((member) => (
                  <div
                    key={member.id}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      onChange(member.name);
                      setIsOpen(false);
                    }}
                  >
                    {member.name}
                  </div>
                ))}
            </div>
            <div className="p-2">
              <div className="font-semibold text-gray-500 text-sm mb-1">Stylists</div>
              {filteredStaff
                .filter(member => member.role === 'Stylist')
                .map((member) => (
                  <div
                    key={member.id}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      onChange(member.name);
                      setIsOpen(false);
                    }}
                  >
                    {member.name}
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 