"use client";

import { useOrderBook } from "../../hooks/useOrderBook";
import OrderBookItem from "./OrderBookItem";
import { OrderBookTableProps } from "@/app/types/orderbook.types";
import { useState, useEffect, useMemo, useCallback } from "react";
import { calculateBuySellPressure, formatPrice } from "@/app/lib/orderBookUtils";
import SkeletonTable from "../skeletons/SkeletonTable";

export default function OrderBookTable({ symbol }: OrderBookTableProps) {
  const { bids, asks, spread, midPrice, isConnected, error, isLoading } = useOrderBook(symbol);

  const [previousPrice, setPreviousPrice] = useState<number | null>(null);

  const priceChange = useMemo(() => {
    if (midPrice === null || previousPrice === null) {
      return null;
    }
    
    if (midPrice > previousPrice) {
      return "up" as const;
    } else if (midPrice < previousPrice) {
      return "down" as const;
    }
    
    return null;
  }, [midPrice, previousPrice]);

  useEffect(() => {
    if (midPrice === null) return;

    const timer = setTimeout(() => {
      setPreviousPrice(midPrice);
    }, 500);

    return () => clearTimeout(timer);
  }, [midPrice]);

  const { bidsPercentage, asksPercentage } = useMemo(
    () => calculateBuySellPressure(bids, asks),
    [bids, asks]
  );

  const formattedMidPrice = useMemo(
    () => (midPrice !== null ? formatPrice(midPrice, 2) : null),
    [midPrice]
  );

  const formattedSpread = useMemo(
    () => (spread !== null ? formatPrice(spread, 2) : null),
    [spread]
  );

  useEffect(() => {
    const price = formattedMidPrice !== null ? `$${formattedMidPrice}` : "Loading...";
    const tokenSymbol = symbol.toUpperCase();
    document.title = `${price} | ${tokenSymbol} | Orderbook Challenge`;
  }, [formattedMidPrice, symbol]);

  const displayedAsks = useMemo(() => asks.slice(0, 10).reverse(), [asks]);
  const displayedBids = useMemo(() => bids.slice(0, 10), [bids]);

  const renderOrderBookItem = useCallback(
    (item: typeof bids[0], index: number, type: "bid" | "ask") => (
      <OrderBookItem
        key={`${type}-${item.price}`}
        price={item.price}
        quantity={item.quantity}
        total={item.total || 0}
        percentage={item.percentage || 0}
        type={type}
      />
    ),
    []
  );

  return (
    <div className="relative" style={{ minHeight: 600 }}>
      <div
        className={`absolute inset-0 w-full h-full transition-opacity duration-500 ${isLoading ? 'opacity-100 pointer-events-auto z-10' : 'opacity-0 pointer-events-none z-0'}`}
        aria-hidden={!isLoading}
      >
        <SkeletonTable />
      </div>
      <div
        className={`transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        aria-hidden={isLoading}
      >
        <div className="p-4 w-full">
          {/* Connection Status */}
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  isConnected ? "bg-green-500" : "bg-red-500"
                }`}
              />
              <span className="text-sm text-gray-600">
                {isConnected ? "Connected" : "Disconnected"}
              </span>
            </div>
            <span className="text-sm font-semibold text-gray-700">
              {symbol.toUpperCase()}
            </span>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
              Error: {error}
            </div>
          )}

          {/* Current Price */}
          <div className="min-h-20">
          {formattedMidPrice !== null && (
            <div className="text-center min-h-20">
              <div
                className={`text-3xl font-bold transition-colors duration-300 ${
                  priceChange === "up"
                    ? "text-green-600"
                    : priceChange === "down"
                    ? "text-red-600"
                    : "text-gray-800"
                }`}
              >
                ${formattedMidPrice}
              </div>
              {formattedSpread !== null && (
                <div className="text-sm text-gray-500 mt-1">
                  Spread: ${formattedSpread}
                </div>
              )}
            </div>
          )}
          </div>

          {/* Order Book Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Asks (Sell Orders) - Red */}
            <div className="order-2 md:order-1">
              <div className="bg-red-50 rounded-lg p-4 min-h-85">
                <h3 className="text-lg font-bold text-red-700 mb-3 text-center">
                  Asks (Sell)
                </h3>
                <div className="space-y-1">
                  <div className="grid grid-cols-3 gap-2 text-xs font-semibold text-gray-600 pb-2 border-b">
                    <div>Price</div>
                    <div className="text-right">Amount</div>
                    <div className="text-right">Total</div>
                  </div>
                  {displayedAsks.map((ask, index) => 
                    renderOrderBookItem(ask, index, "ask")
                  )}
                  {asks.length === 0 && isConnected && (
                    <div className="text-center text-gray-400 py-4">
                      Waiting for data...
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bids (Buy Orders) - Green */}
            <div className="order-1 md:order-2">
              <div className="bg-green-50 rounded-lg p-4 min-h-85">
                <h3 className="text-lg font-bold text-green-700 mb-3 text-center">
                  Bids (Buy)
                </h3>
                <div className="space-y-1">
                  <div className="grid grid-cols-3 gap-2 text-xs font-semibold text-gray-600 pb-2 border-b">
                    <div>Price</div>
                    <div className="text-right">Amount</div>
                    <div className="text-right">Total</div>
                  </div>
                  {displayedBids.map((bid, index) => 
                    renderOrderBookItem(bid, index, "bid")
                  )}
                  {bids.length === 0 && isConnected && (
                    <div className="text-center text-gray-400 py-4">
                      Waiting for data...
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Buy/Sell Pressure Bar */}
          <div className="mt-6 bg-gray-100 rounded-lg p-4">
            <div className="flex items-center justify-between text-sm font-semibold mb-2">
              <span className="text-green-700">{bidsPercentage.toFixed(1)}% Buy</span>
              <span className="text-red-700">{asksPercentage.toFixed(1)}% Sell</span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden flex">
              <div
                className="bg-green-500 transition-all duration-500"
                style={{ width: `${bidsPercentage}%` }}
              />
              <div
                className="bg-red-500 transition-all duration-500"
                style={{ width: `${asksPercentage}%` }}
              />
            </div>
          </div>
        </div>
        {/* ...existing code... */}
      </div>
    </div>
  );

  return (
    <div className="p-4 w-full">
      {/* Connection Status */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={`w-3 h-3 rounded-full ${
              isConnected ? "bg-green-500" : "bg-red-500"
            }`}
          />
          <span className="text-sm text-gray-600">
            {isConnected ? "Connected" : "Disconnected"}
          </span>
        </div>
        <span className="text-sm font-semibold text-gray-700">
          {symbol.toUpperCase()}
        </span>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
          Error: {error}
        </div>
      )}

      {/* Current Price */}
      {formattedMidPrice !== null && (
        <div className="mb-4 text-center">
          <div
            className={`text-3xl font-bold transition-colors duration-300 ${
              priceChange === "up"
                ? "text-green-600"
                : priceChange === "down"
                ? "text-red-600"
                : "text-gray-800"
            }`}
          >
            ${formattedMidPrice}
          </div>
          {formattedSpread !== null && (
            <div className="text-sm text-gray-500 mt-1">
              Spread: ${formattedSpread}
            </div>
          )}
        </div>
      )}


      {/* Order Book Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Asks (Sell Orders) - Red */}
        <div className="order-2 md:order-1">
          <div className="bg-red-50 rounded-lg p-4 min-h-85">
            <h3 className="text-lg font-bold text-red-700 mb-3 text-center">
              Asks (Sell)
            </h3>
            <div className="space-y-1">
              <div className="grid grid-cols-3 gap-2 text-xs font-semibold text-gray-600 pb-2 border-b">
                <div>Price</div>
                <div className="text-right">Amount</div>
                <div className="text-right">Total</div>
              </div>
              {displayedAsks.map((ask, index) => 
                renderOrderBookItem(ask, index, "ask")
              )}
              {asks.length === 0 && isConnected && (
                <div className="text-center text-gray-400 py-4">
                  Waiting for data...
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bids (Buy Orders) - Green */}
        <div className="order-1 md:order-2">
          <div className="bg-green-50 rounded-lg p-4 min-h-85">
            <h3 className="text-lg font-bold text-green-700 mb-3 text-center">
              Bids (Buy)
            </h3>
            <div className="space-y-1">
              <div className="grid grid-cols-3 gap-2 text-xs font-semibold text-gray-600 pb-2 border-b">
                <div>Price</div>
                <div className="text-right">Amount</div>
                <div className="text-right">Total</div>
              </div>
              {displayedBids.map((bid, index) => 
                renderOrderBookItem(bid, index, "bid")
              )}
              {bids.length === 0 && isConnected && (
                <div className="text-center text-gray-400 py-4">
                  Waiting for data...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Buy/Sell Pressure Bar */}
      <div className="mt-6 bg-gray-100 rounded-lg p-4">
        <div className="flex items-center justify-between text-sm font-semibold mb-2">
          <span className="text-green-700">{bidsPercentage.toFixed(1)}% Buy</span>
          <span className="text-red-700">{asksPercentage.toFixed(1)}% Sell</span>
        </div>
        <div className="h-3 bg-gray-200 rounded-full overflow-hidden flex">
          <div
            className="bg-green-500 transition-all duration-500"
            style={{ width: `${bidsPercentage}%` }}
          />
          <div
            className="bg-red-500 transition-all duration-500"
            style={{ width: `${asksPercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}