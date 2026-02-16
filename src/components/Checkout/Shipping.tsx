"use client";

import React, { useState, useEffect } from "react";

export type ShippingFormData = {
  shipFirstName: string;
  shipLastName: string;
  shipCompanyName: string;
  shipAddress: string;
  shipAddressTwo: string;
  shipTown: string;
  shipPhone: string;
  shipEmail: string;
};

type ShippingProps = {
  formData: Record<string, string>;
  formErrors: { [key: string]: string };
  showErrors: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  forceExpand?: boolean;
};

const Shipping = ({ formData, formErrors, showErrors, onInputChange, forceExpand }: ShippingProps) => {
  const [dropdown, setDropdown] = useState(false);

  useEffect(() => {
    if (forceExpand) setDropdown(true);
  }, [forceExpand]);

  const inputClass = (field: string) =>
    `rounded-md border ${
      showErrors && formErrors[field] ? "border-red" : "border-gray-3"
    } bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 ${
      showErrors && formErrors[field] ? "focus:ring-red/20" : "focus:ring-blue/20"
    }`;

  return (
    <div className="bg-white shadow-1 rounded-[10px] mt-7.5">
      <div
        onClick={() => setDropdown(!dropdown)}
        className="cursor-pointer flex items-center gap-2.5 font-medium text-lg text-dark py-5 px-5.5"
      >
        Ship to a different address?
        <svg
          className={`fill-current ease-out duration-200 ${
            dropdown ? "rotate-180" : ""
          }`}
          width="22"
          height="22"
          viewBox="0 0 22 22"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M4.06103 7.80259C4.30813 7.51431 4.74215 7.48092 5.03044 7.72802L10.9997 12.8445L16.9689 7.72802C17.2572 7.48092 17.6912 7.51431 17.9383 7.80259C18.1854 8.09088 18.1521 8.5249 17.8638 8.772L11.4471 14.272C11.1896 14.4927 10.8097 14.4927 10.5523 14.272L4.1356 8.772C3.84731 8.5249 3.81393 8.09088 4.06103 7.80259Z"
            fill=""
          />
        </svg>
      </div>

      {dropdown && (
        <div className="px-5.5 pb-5.5 pt-0 border-t border-gray-3">
          <div className="flex flex-col lg:flex-row gap-5 sm:gap-8 mb-5 pt-5">
            <div className="w-full">
              <label htmlFor="shipFirstName" className="block mb-2.5">
                First Name <span className="text-red">*</span>
              </label>
              <input
                type="text"
                name="shipFirstName"
                id="shipFirstName"
                value={formData.shipFirstName ?? ""}
                onChange={onInputChange}
                placeholder="John"
                className={inputClass("shipFirstName")}
              />
              {showErrors && formErrors.shipFirstName && (
                <p className="text-red text-sm mt-1">{formErrors.shipFirstName}</p>
              )}
            </div>
            <div className="w-full">
              <label htmlFor="shipLastName" className="block mb-2.5">
                Last Name <span className="text-red">*</span>
              </label>
              <input
                type="text"
                name="shipLastName"
                id="shipLastName"
                value={formData.shipLastName ?? ""}
                onChange={onInputChange}
                placeholder="Doe"
                className={inputClass("shipLastName")}
              />
              {showErrors && formErrors.shipLastName && (
                <p className="text-red text-sm mt-1">{formErrors.shipLastName}</p>
              )}
            </div>
          </div>

          <div className="mb-5">
            <label htmlFor="shipCompanyName" className="block mb-2.5">
              Company Name
            </label>
            <input
              type="text"
              name="shipCompanyName"
              id="shipCompanyName"
              value={formData.shipCompanyName ?? ""}
              onChange={onInputChange}
              placeholder="Optional"
              className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
            />
          </div>

          <div className="mb-5">
            <label htmlFor="shipAddress" className="block mb-2.5">
              Street Address <span className="text-red">*</span>
            </label>
            <input
              type="text"
              name="shipAddress"
              id="shipAddress"
              value={formData.shipAddress ?? ""}
              onChange={onInputChange}
              placeholder="House number and street name"
              className={inputClass("shipAddress")}
            />
            {showErrors && formErrors.shipAddress && (
              <p className="text-red text-sm mt-1">{formErrors.shipAddress}</p>
            )}
            <div className="mt-5">
              <input
                type="text"
                name="shipAddressTwo"
                id="shipAddressTwo"
                value={formData.shipAddressTwo ?? ""}
                onChange={onInputChange}
                placeholder="Apartment, suite, unit, etc. (optional)"
                className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
              />
            </div>
          </div>

          <div className="mb-5">
            <label htmlFor="shipTown" className="block mb-2.5">
              Town / City <span className="text-red">*</span>
            </label>
            <input
              type="text"
              name="shipTown"
              id="shipTown"
              value={formData.shipTown ?? ""}
              onChange={onInputChange}
              placeholder="Town or city"
              className={inputClass("shipTown")}
            />
            {showErrors && formErrors.shipTown && (
              <p className="text-red text-sm mt-1">{formErrors.shipTown}</p>
            )}
          </div>

          <div className="mb-5">
            <label htmlFor="shipPhone" className="block mb-2.5">
              Phone <span className="text-red">*</span>
            </label>
            <input
              type="text"
              name="shipPhone"
              id="shipPhone"
              value={formData.shipPhone ?? ""}
              onChange={onInputChange}
              placeholder="+1 234 567 8900"
              className={inputClass("shipPhone")}
            />
            {showErrors && formErrors.shipPhone && (
              <p className="text-red text-sm mt-1">{formErrors.shipPhone}</p>
            )}
          </div>

          <div className="mb-0">
            <label htmlFor="shipEmail" className="block mb-2.5">
              Email Address <span className="text-red">*</span>
            </label>
            <input
              type="email"
              name="shipEmail"
              id="shipEmail"
              value={formData.shipEmail ?? ""}
              onChange={onInputChange}
              placeholder="example@email.com"
              className={inputClass("shipEmail")}
            />
            {showErrors && formErrors.shipEmail && (
              <p className="text-red text-sm mt-1">{formErrors.shipEmail}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Shipping;
