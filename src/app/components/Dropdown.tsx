"use client";

import React, { useState, useRef, useEffect } from "react";
import { DropdownProps } from "../types/components.types";

export const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  children,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className={`relative inline-block ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-indigo-700 text-white rounded-lg hover:bg-indigo-600 transition-colors"
      >
        {trigger}
        <svg
          className={`w-4 h-4 transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      <div
        className={`absolute left-0 mt-2 w-48 bg-indigo-700 rounded-lg shadow-lg overflow-hidden transition-all duration-300 origin-top ${
          isOpen
            ? "opacity-100 scale-y-100"
            : "opacity-0 scale-y-0 pointer-events-none"
        }`}
      >
        <div className="py-1 uppercase">{children}</div>
      </div>
    </div>
  );
};

export const DropdownItem: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
}> = ({ children, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-full text-left px-4 py-2 text-white hover:bg-indigo-600 hover:cursor-pointer transition-colors uppercase"
    >
      {children}
    </button>
  );
};
