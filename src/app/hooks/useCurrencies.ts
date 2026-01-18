"use client";

import { API_BASE_URL } from "../lib/constants";
import { useRef, useReducer, useCallback, useEffect } from "react";
import { SymbolInfo } from "../types/currencies.types";

const FETCH_TIMEOUT_MS = 15000;

/**
 * Custom hook for fetching and managing supported currencies from API.
 *
 * Features:
 * - Handles slow API responses with configurable timeout
 * - Prevents memory leaks on component unmount
 * - Comprehensive error handling
 * - Auto-cleanup of resources
 *
 * @returns currencies - Array of available currency codes
 * @returns isLoading - Loading state indicator
 * @returns error - Error message if fetch fails
 */

export function useCurrencies() {
  type State = {
    currencies: string[];
    isLoading: boolean;
    error: string | null;
  };
  type Action =
    | { type: "FETCH_START" }
    | { type: "FETCH_SUCCESS"; payload: string[] }
    | { type: "FETCH_ERROR"; payload: string };

  const initialState: State = {
    currencies: [],
    isLoading: true,
    error: null,
  };

  function reducer(state: State, action: Action): State {
    switch (action.type) {
      case "FETCH_START":
        return { ...state, isLoading: true, error: null };
      case "FETCH_SUCCESS":
        return {
          ...state,
          isLoading: false,
          currencies: action.payload,
          error: null,
        };
      case "FETCH_ERROR":
        return { ...state, isLoading: false, error: action.payload };
      default:
        return state;
    }
  }

  const [{ currencies, isLoading, error }, dispatch] = useReducer(
    reducer,
    initialState,
  );
  const abortControllerRef = useRef<AbortController | null>(null);
  const mountedRef = useRef(true);

  const fetchCurrencies = useCallback(async () => {
    if (abortControllerRef.current) abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();
    dispatch({ type: "FETCH_START" });
    let timeoutId: NodeJS.Timeout | null = null;
    try {
      timeoutId = setTimeout(
        () => abortControllerRef.current?.abort(),
        FETCH_TIMEOUT_MS,
      );
      const response = await fetch(`${API_BASE_URL}`, {
        signal: abortControllerRef.current.signal,
        cache: "force-cache",
      });
      if (!response.ok) {
        throw new Error(
          `Failed to fetch currencies: ${response.status} ${response.statusText}`,
        );
      }
      const data = await response.json();
      const filteredSymbols = Array.isArray(data.symbols)
        ? (data.symbols as SymbolInfo[])
            .filter(
              (symbol) =>
                symbol.status === "TRADING" && symbol.symbol.endsWith("USDT"),
            )
            .slice(0, 10)
            .map((symbol) => symbol.symbol)
        : [];
      if (mountedRef.current) {
        dispatch({ type: "FETCH_SUCCESS", payload: filteredSymbols });
      }
    } catch (err: unknown) {
      if (!mountedRef.current) return;
      if (err instanceof Error) {
        if (err.name === "AbortError") {
          dispatch({
            type: "FETCH_ERROR",
            payload: "Request timeout: API is taking too long to respond",
          });
        } else if (err.message) {
          dispatch({ type: "FETCH_ERROR", payload: err.message });
        } else {
          dispatch({ type: "FETCH_ERROR", payload: "Unknown error" });
        }
      } else {
        dispatch({ type: "FETCH_ERROR", payload: "Unknown error" });
      }
    } finally {
      if (timeoutId) clearTimeout(timeoutId);
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    fetchCurrencies();
    return () => {
      mountedRef.current = false;
      abortControllerRef.current?.abort();
    };
  }, [fetchCurrencies]);

  return { currencies, isLoading, error };
}
