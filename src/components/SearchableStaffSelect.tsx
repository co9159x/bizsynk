import { useState, useEffect } from 'react';
import { Staff } from '../types';
import { getStaff } from '../lib/firebase/client-services';

interface SearchableStaffSelectProps {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  className?: string;
}

export default function SearchableStaffSelect({
  value,
  onChange,
  required = false,
  className = ''
}: SearchableStaffSelectProps) {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchStaff = async () => {
      const staffData = await getStaff();
      setStaff(staffData);
    };
    fetchStaff();
  }, []);

  const filteredStaff = staff.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedStaff = staff.find(member => member.name === value);

  return (
    <div className="relative">
      <div
        className={`w-full p-2 border rounded-md cursor-pointer ${className}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedStaff ? selectedStaff.name : 'Select Staff'}
      </div>
      
      {isOpen && (
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