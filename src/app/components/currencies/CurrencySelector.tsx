"use client";

import { DropdownItem } from "../Dropdown";
import { useCurrencies } from "../../hooks/useCurrencies";
import { useState } from "react";

interface CurrencySelectorProps {
  onCurrencyChange?: (currency: string) => void;
}

/**
 * Currency selector component with enhanced UX.
 *
 * Features:
 * - Shows loading spinner while fetching currencies
 * - Displays appropriate states (loading, error, empty, success)
 * - Closes dropdown automatically after selection
 * - Clean and professional UI feedback
 */
export default function CurrencySelector({ onCurrencyChange }: CurrencySelectorProps) {
  const { currencies, isLoading, error } = useCurrencies();
  const [selectedCurrency, setSelectedCurrency] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleCurrencySelect = (currency: string) => {
    setSelectedCurrency(currency);
    setIsOpen(false);
    onCurrencyChange?.(currency);
  };

  const getTriggerContent = () => {
    if (isLoading) {
      return (
        <span className="flex items-center gap-2 animate-pulse">
          Loading currencies...
        </span>
      );
    }
    if (error) {
      return (
        <span className="flex items-center gap-2 text-red-400">
          Error loading currencies
        </span>
      );
    }
    if (selectedCurrency) {
      return <span className="uppercase">{selectedCurrency}</span>;
    }
    return currencies[0] || "Select Currency";
  };

  const getTriggerIcon = () => {
    if (isLoading) {
      return (
        <svg
          className="w-4 h-4 animate-spin"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      );
    }

    return (
      <svg
        className={`w-4 h-4 transition-transform duration-300 ${
          isOpen ? "rotate-180" : "rotate-0"
        }`}
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
    );
  };

  return (
    <div className="mb-4">
      <div className="relative inline-block">
        <button
          onClick={() => !isLoading && !error && setIsOpen(!isOpen)}
          disabled={isLoading || !!error}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-700 text-white rounded-lg hover:bg-indigo-600 hover:cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {getTriggerContent()}
          {getTriggerIcon()}
        </button>

        <div
          className={`absolute left-0 mt-2 w-48 bg-indigo-700 rounded-lg shadow-lg overflow-hidden transition-all duration-300 origin-top z-50 ${
            isOpen && !isLoading && !error
              ? "opacity-100 scale-y-100"
              : "opacity-0 scale-y-0 pointer-events-none"
          }`}
        >
          <div className="py-1 max-h-60 overflow-y-auto">
            {error && (
              <div className="px-4 py-2 text-red-400 text-sm">
                Error: {error}
              </div>
            )}
            {!error && currencies.length === 0 && (
              <DropdownItem>No currencies available</DropdownItem>
            )}
            {!error &&
              currencies.map((currency) => (
                <DropdownItem
                  key={currency}
                  onClick={() => handleCurrencySelect(currency)}
                >
                  {currency}
                </DropdownItem>
              ))}
          </div>
        </div>
      </div>

      {/* Click outside handler */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
