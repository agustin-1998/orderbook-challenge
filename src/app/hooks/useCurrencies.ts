"use client";

/** For a reason, the exchangeInfo API is too slow and the fetch doesnt return any data so, i resolved it hardcoding the currencies (not the best practice) */

// import { API_BASE_URL } from "../lib/constants";
// import { useState, useEffect } from "react";

// const FETCH_TIMEOUT_MS = 30000; // 30 seconds for slow APIs

// /**
//  * Custom hook for fetching and managing supported currencies from API.
//  *
//  * Features:
//  * - Handles slow API responses with configurable timeout
//  * - Prevents memory leaks on component unmount
//  * - Comprehensive error handling
//  * - Auto-cleanup of resources
//  *
//  * @returns currencies - Array of available currency codes
//  * @returns isLoading - Loading state indicator
//  * @returns error - Error message if fetch fails
//  */
// export function useCurrencies() {
//   const [currencies, setCurrencies] = useState<string[]>([]);
//   const [isLoading, setIsLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     let isMounted = true;
//     const abortController = new AbortController();

//     const fetchCurrencies = async () => {
//       try {
//         setIsLoading(true);
//         setError(null);

//         const timeoutId = setTimeout(() => abortController.abort(), FETCH_TIMEOUT_MS);

//         const response = await fetch(`${API_BASE_URL}`, {
//           signal: abortController.signal,
//         });

//         clearTimeout(timeoutId);

//         if (!response.ok) {
//           throw new Error(`Failed to fetch currencies: ${response.status} ${response.statusText}`);
//         }

//         const data = await response.json();

//         if (isMounted) {
//           setCurrencies(data.currencies || []);
//         }
//       } catch (err) {
//         if (isMounted) {
//           if (err instanceof Error) {
//             if (err.name === "AbortError") {
//               setError("Request timeout: API is taking too long to respond");
//             } else {
//               setError(err.message);
//             }
//           } else {
//             setError("An unexpected error occurred");
//           }
//         }
//       } finally {
//         if (isMounted) {
//           setIsLoading(false);
//         }
//       }
//     };

//     fetchCurrencies();

//     return () => {
//       isMounted = false;
//       abortController.abort();
//     };
//   }, []);

//   return { currencies, isLoading, error };
// }


export function useCurrencies() {
  // Hardcoded list of currencies due to slow API response
  const currencies = [
    "BTCUSDT",
    "ETHUSDT",
    "BNBUSDT",
    "XRPUSDT",
    "ADAUSDT",
    "SOLUSDT",
    "DOGEUSDT",
    "DOTUSDT",
    "MATICUSDT",
    "LTCUSDT",
  ];

  const isLoading = false;
  const error = null;

  return { currencies, isLoading, error };
}