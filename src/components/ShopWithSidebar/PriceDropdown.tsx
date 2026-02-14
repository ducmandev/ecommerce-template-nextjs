"use client";
import { useState } from "react";

type PriceDropdownProps = {
  priceRange?: { min?: number; max?: number };
  onPriceChange?: (range: { min?: number; max?: number }) => void;
};

const PriceDropdown = ({ priceRange = {}, onPriceChange }: PriceDropdownProps) => {
  const [toggleDropdown, setToggleDropdown] = useState(true);
  const [minPrice, setMinPrice] = useState(priceRange.min?.toString() || "");
  const [maxPrice, setMaxPrice] = useState(priceRange.max?.toString() || "");

  const handleApply = () => {
    if (!onPriceChange) return;
    
    onPriceChange({
      min: minPrice ? parseFloat(minPrice) : undefined,
      max: maxPrice ? parseFloat(maxPrice) : undefined,
    });
  };

  return (
    <div className="bg-white shadow-1 rounded-lg">
      <div
        onClick={(e) => {
          e.preventDefault();
          setToggleDropdown(!toggleDropdown);
        }}
        className={`cursor-pointer flex items-center justify-between py-3 pl-6 pr-5.5 ${
          toggleDropdown && "shadow-filter"
        }`}
      >
        <p className="text-dark">Price</p>
        <button
          aria-label="button for price dropdown"
          className={`text-dark ease-out duration-200 ${
            toggleDropdown && "rotate-180"
          }`}
        >
          <svg
            className="fill-current"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M4.43057 8.51192C4.70014 8.19743 5.17361 8.161 5.48811 8.43057L12 14.0122L18.5119 8.43057C18.8264 8.16101 19.2999 8.19743 19.5695 8.51192C19.839 8.82642 19.8026 9.29989 19.4881 9.56946L12.4881 15.5695C12.2072 15.8102 11.7928 15.8102 11.5119 15.5695L4.51192 9.56946C4.19743 9.29989 4.161 8.82641 4.43057 8.51192Z"
              fill=""
            />
          </svg>
        </button>
      </div>

      {/* dropdown menu */}
      <div
        className={`flex-col gap-4 py-6 pl-6 pr-5.5 ${
          toggleDropdown ? "flex" : "hidden"
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-full px-3 py-2 border border-gray-3 rounded-md focus:border-blue focus:outline-none"
            />
          </div>
          <span className="text-dark-4">-</span>
          <div className="flex-1">
            <input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full px-3 py-2 border border-gray-3 rounded-md focus:border-blue focus:outline-none"
            />
          </div>
        </div>
        <button
          onClick={handleApply}
          className="w-full px-4 py-2 bg-blue text-white rounded-md hover:bg-opacity-90 transition-all"
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export default PriceDropdown;
