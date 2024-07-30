import React, { useState } from 'react';

interface DropdownProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

const Dropdown: React.FC<DropdownProps> = ({ options, value, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <input
        type="text"
        className="w-full text-lg border p-2 rounded border-t-0 border-l-0 border-r-0 outline-none border-b-2 border-gray-300"
        value={value}
        onClick={() => setIsOpen(!isOpen)}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          onChange(e.target.value);
        }}
        placeholder={placeholder}
      />
      {isOpen && (
        <div className="absolute bg-white border border-gray-300 rounded mt-1 w-full max-h-64 overflow-auto">
          {filteredOptions.map((option, index) => (
            <div
              key={index}
              className="p-2 hover:bg-gray-200 cursor-pointer"
              onClick={() => handleSelect(option)}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
