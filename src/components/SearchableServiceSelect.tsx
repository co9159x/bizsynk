import { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { getServices } from '../lib/firebase/client-services';

interface Service {
  name: string;
  price: number;
}

interface ServiceCategory {
  category: string;
  services: Service[];
}

interface SearchableServiceSelectProps {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  className?: string;
}

export default function SearchableServiceSelect({
  value,
  onChange,
  required = false,
  className = ''
}: SearchableServiceSelectProps) {
  const [services, setServices] = useState<ServiceCategory[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchServices = async () => {
      const servicesData = await getServices();
      setServices(servicesData);
    };
    fetchServices();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Focus input when dropdown opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Filter services based on search term
  const filteredServices = services.reduce<ServiceCategory[]>((acc, category) => {
    const matchingServices = category.services.filter(service => {
      const searchLower = searchTerm.toLowerCase();
      return (
        service.name.toLowerCase().includes(searchLower) ||
        category.category.toLowerCase().includes(searchLower)
      );
    });

    if (matchingServices.length > 0) {
      acc.push({
        category: category.category,
        services: matchingServices
      });
    }

    return acc;
  }, []);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div
        className="w-full p-2 border rounded-md cursor-pointer flex items-center justify-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        {value || 'Select Service'}
      </div>
      
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
          <div className="p-2">
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 pl-8 border rounded-md"
              />
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            </div>
          </div>
          
          <div className="max-h-60 overflow-y-auto">
            {filteredServices.map((category) => (
              <div key={category.category} className="p-2">
                <div className="font-medium text-gray-700">{category.category}</div>
                {category.services.map((service) => (
                  <div
                    key={service.name}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      onChange(service.name);
                      setIsOpen(false);
                    }}
                  >
                    {service.name}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 