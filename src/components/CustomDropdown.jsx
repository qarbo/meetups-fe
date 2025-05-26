import React, { useState } from 'react';

export default function CustomDropdown({ options, selected, setSelected, align = 'right' }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        className="bg-white/20 inline-flex justify-center w-full rounded-md border border-white/30 backdrop-blur-md shadow-sm px-4 py-2 text-sm font-medium text-black hover:bg-white/50 focus:outline-none"
        onClick={() => setDropdownOpen(!dropdownOpen)}
      >
        {options.find(opt => opt.value === selected)?.label || "Select..."}
        <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.584l3.71-3.353a.75.75 0 111.02 1.097l-4.25 3.843a.75.75 0 01-1.02 0l-4.25-3.843a.75.75 0 01.02-1.097z" clipRule="evenodd" />
        </svg>
      </button>
      {dropdownOpen && (
        <div className={`absolute mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 ${
          align === 'left' ? 'origin-top-left left-0' :
          align === 'center' ? 'origin-top-center left-1/2 transform -translate-x-1/2' :
          'origin-top-right right-0'
        }`}>
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            {options.map(option => (
              <button
                key={option.value}
                onClick={() => {
                  setSelected(option.value);
                  setDropdownOpen(false);
                }}
                className={`${
                  selected === option.value ? "bg-gray-200 text-black" : "text-gray-700"
                } flex w-full items-center px-4 py-2 text-sm`}
                role="menuitem"
              >
                {option.label}
                {option.description && (
                  <span className="ml-2 text-xs text-gray-500">{option.description}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}