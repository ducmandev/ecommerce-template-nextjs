"use client";

import { useState } from "react";
import { useGetBrandsQuery } from "@/redux/services/brandsApi";

type BrandItemProps = {
  brand: {
    name: string;
    products: number;
    slug: string;
  };
  selected: boolean;
  onToggle: () => void;
};

const BrandItem = ({ brand, selected, onToggle }: BrandItemProps) => {
  return (
    <button
      type="button"
      className={`${
        selected && "text-blue"
      } group flex items-center justify-between ease-out duration-200 hover:text-blue`}
      onClick={onToggle}
    >
      <div className="flex items-center gap-2">
        <div
          className={`cursor-pointer flex items-center justify-center rounded w-4 h-4 border ${
            selected ? "border-blue bg-blue" : "bg-white border-gray-3"
          }`}
        >
          <svg
            className={selected ? "block" : "hidden"}
            width="10"
            height="10"
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
        </div>

        <span>{brand.name}</span>
      </div>

      <span
        className={`${
          selected ? "text-white bg-blue" : "bg-gray-2"
        } inline-flex rounded-[30px] text-custom-xs px-2 ease-out duration-200 group-hover:text-white group-hover:bg-blue`}
      >
        {brand.products}
      </span>
    </button>
  );
};

type BrandDropdownProps = {
  selectedBrands?: string[];
  onSelectionChange?: (brands: string[]) => void;
};

const BrandDropdown = ({
  selectedBrands = [],
  onSelectionChange,
}: BrandDropdownProps) => {
  const [toggleDropdown, setToggleDropdown] = useState(true);
  const { data, isLoading, isError } = useGetBrandsQuery();

  const brands =
    data?.brands.map((brand) => ({
      name: brand.name,
      products: brand.productCount,
      slug: brand.slug,
    })) || [];

  const handleToggleBrand = (slug: string) => {
    if (!onSelectionChange) return;

    const newSelection = selectedBrands.includes(slug)
      ? selectedBrands.filter((s) => s !== slug)
      : [...selectedBrands, slug];

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
        <p className="text-dark">Brand</p>
        <button
          aria-label="button for brand dropdown"
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

      <div
        className={`flex-col gap-3 py-6 pl-6 pr-5.5 ${
          toggleDropdown ? "flex" : "hidden"
        }`}
      >
        {isLoading && (
          <div className="text-center text-dark-4 text-sm">Loading brands...</div>
        )}

        {isError && (
          <div className="text-center text-red text-sm">Failed to load brands</div>
        )}

        {!isLoading &&
          !isError &&
          brands.map((brand, key) => (
            <BrandItem
              key={key}
              brand={brand}
              selected={selectedBrands.includes(brand.slug)}
              onToggle={() => handleToggleBrand(brand.slug)}
            />
          ))}
      </div>
    </div>
  );
};

export default BrandDropdown;
