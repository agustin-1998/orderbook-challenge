import { BinanceOrderBookMessage } from "./../types/orderbook.types";
import { useWebSocket } from "../hooks/useWebSockets";
import { OrderBookLevel } from "../types/orderbook.types";
import { WS_BASE_URL } from "../lib/constants";
import { useMemo, useState } from "react";
import { calculateMidPrice, calculateSpread, calculateTotalsAndPercentages } from "../lib/orderBookUtils";

export function useOrderBook(symbol: string) {
  const [bids, setBids] = useState<OrderBookLevel[]>([]);
  const [asks, setAsks] = useState<OrderBookLevel[]>([]);
  const wsUrl = `${WS_BASE_URL}${symbol.toLowerCase()}@depth10@100ms`;

  const { isConnected, error, reconnectAttempts, disconnect, sendMessage, isLoading } =
    useWebSocket({
      url: wsUrl,
      onMessage: (data: unknown) => {
        const orderBookData = data as BinanceOrderBookMessage;

        if (orderBookData.bids && orderBookData.asks) {
          const formattedBids: OrderBookLevel[] = orderBookData.bids.map(
            (bid: [string, string]) => ({
              price: bid[0],
              quantity: bid[1],
            }),
          );
          const formattedAsks: OrderBookLevel[] = orderBookData.asks.map(
            (ask: [string, string]) => ({
              price: ask[0],
              quantity: ask[1],
            }),
          );

          const isSame = (a: OrderBookLevel[], b: OrderBookLevel[]) =>
            a.length === b.length && a.every((v, i) => v.price === b[i].price && v.quantity === b[i].quantity);

          setBids((prev) => (isSame(prev, formattedBids) ? prev : formattedBids));
          setAsks((prev) => (isSame(prev, formattedAsks) ? prev : formattedAsks));
        }
      },
      onError: (err) => {
        console.error("💥 WebSocket Error:", err);
        return err;
      },
    });

  // Calcular totales y porcentajes usando utilidades
  const bidsWithTotals = useMemo(
    () => calculateTotalsAndPercentages(bids),
    [bids]
  );

  const asksWithTotals = useMemo(
    () => calculateTotalsAndPercentages(asks),
    [asks]
  );

  // Calcular spread y precio medio
  const spread = useMemo(
    () => calculateSpread(bids, asks),
    [bids, asks]
  );

  const midPrice = useMemo(
    () => calculateMidPrice(bids, asks),
    [bids, asks]
  );

  return {
    bids: bidsWithTotals,
    asks: asksWithTotals,
    spread,
    midPrice,
    isConnected,
    error,
    reconnectAttempts,
    disconnect,
    sendMessage,
    isLoading,
  };
}