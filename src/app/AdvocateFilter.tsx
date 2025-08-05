import React from "react";

interface AdvocateFilterProps {
  onFilterChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClick: () => void;
  value: string;
}

export function AdvocateFilter({ onFilterChange, onClick, value }: AdvocateFilterProps) {
  return (
    <div className="flex flex-row gap-2 w-full max-w-2xl mx-auto items-center">
      <input
        id="advocate-search"
        className="flex-1 min-w-[200px] border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        onChange={onFilterChange}
        value={value}
        aria-label="Search advocates"
        placeholder="Search advocates by name, city, specialty..."
      />
      <button
        onClick={onClick}
        className="whitespace-nowrap px-4 py-2 rounded border border-gray-300 bg-gray-100 cursor-pointer"
      >
        Reset Search
      </button>
    </div>
  );
}