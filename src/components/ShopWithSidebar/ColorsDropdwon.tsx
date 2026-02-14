"use client";
import { useState } from "react";

type ColorsDropdownProps = {
  selectedColors?: string[];
  onSelectionChange?: (colors: string[]) => void;
};

const ColorsDropdwon = ({ selectedColors = [], onSelectionChange }: ColorsDropdownProps) => {
  const [toggleDropdown, setToggleDropdown] = useState(true);

  const colors = [
    { name: "Red", value: "red", hex: "#FF0000" },
    { name: "Blue", value: "blue", hex: "#0000FF" },
    { name: "Yellow", value: "yellow", hex: "#FFFF00" },
    { name: "Orange", value: "orange", hex: "#FFA500" },
    { name: "Purple", value: "purple", hex: "#800080" },
  ];

  const handleToggleColor = (colorValue: string) => {
    if (!onSelectionChange) return;
    
    const newSelection = selectedColors.includes(colorValue)
      ? selectedColors.filter(c => c !== colorValue)
      : [...selectedColors, colorValue];
    
    onSelectionChange(newSelection);
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
        <p className="text-dark">Colors</p>
        <button
          aria-label="button for color dropdown"
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
        className={`flex-wrap gap-2.5 p-6 ${
          toggleDropdown ? "flex" : "hidden"
        }`}
      >
        {colors.map((color) => (
          <button
            key={color.value}
            onClick={(e) => {
              e.preventDefault();
              handleToggleColor(color.value);
            }}
            aria-label={`select ${color.name}`}
            className={`relative w-8 h-8 rounded-full border-2 ${
              selectedColors.includes(color.value)
                ? "border-dark"
                : "border-transparent"
            }`}
            style={{ backgroundColor: color.hex }}
          >
            {selectedColors.includes(color.value) && (
              <svg
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                width="12"
                height="12"
                viewBox="0 0 10 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8.33317 2.5L3.74984 7.08333L1.6665 5"
                  stroke="white"
                  strokeWidth="1.94437"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ColorsDropdwon;
