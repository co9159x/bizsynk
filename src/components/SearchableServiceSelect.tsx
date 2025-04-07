import { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { getServices } from '../lib/firebase/client-services';

interface Service {
  name: string;
  category: string;
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
  const filteredServices = services.reduce((acc, category) => {
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
  }, [] as ServiceCategory[]);

  const selectedService = services
    .flatMap(category => category.services)
    .find(service => service.name === value);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (!isOpen) {
      setIsOpen(true);
    }
  };

  const handleServiceSelect = (serviceName: string) => {
    onChange(serviceName);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className={`w-full p-2 border rounded-md cursor-pointer ${className}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedService ? selectedService.name : 'Select Service'}
      </div>
      
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
          <div className="p-2 border-b">
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                className="w-full p-2 pl-8 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Search services..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>
          <div className="max-h-60 overflow-y-auto">
            {filteredServices.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No services found matching "{searchTerm}"
              </div>
            ) : (
              filteredServices.map((category) => (
                <div key={category.category} className="border-b last:border-b-0">
                  <div className="p-2 bg-gray-50 font-semibold text-sm text-gray-700">
                    {category.category}
                  </div>
                  {category.services.map((service) => (
                    <div
                      key={service.name}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleServiceSelect(service.name)}
                    >
                      <div className="font-medium">{service.name}</div>
                    </div>
                  ))}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
} 