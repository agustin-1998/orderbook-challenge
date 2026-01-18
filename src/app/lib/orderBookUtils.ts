import { OrderBookLevel } from "../types/orderbook.types";

/**
 * Calculates cumulative totals and percentages for order book levels
 */
export function calculateTotalsAndPercentages(
  levels: OrderBookLevel[]
): OrderBookLevel[] {
  let runningTotal = 0;
  
    // Calculate cumulative totals
  const withTotals = levels.map((level) => {
    const quantity = parseFloat(level.quantity);
    runningTotal += quantity;
    return { ...level, total: runningTotal };
  });

    // Calculate percentages based on the max total
  const maxTotal = runningTotal;
  return withTotals.map((level) => ({
    ...level,
    percentage: maxTotal > 0 ? (level.total / maxTotal) * 100 : 0,
  }));
}

/**
 * Calculates the spread between the best bid and ask prices
 */
export function calculateSpread(
  bids: OrderBookLevel[],
  asks: OrderBookLevel[]
): number | null {
  if (bids.length === 0 || asks.length === 0) return null;
  const bestBid = parseFloat(bids[0].price);
  const bestAsk = parseFloat(asks[0].price);
  return bestAsk - bestBid;
}

/**
   * Calculates the mid price (midpoint) between the best bid and ask
 */
export function calculateMidPrice(
  bids: OrderBookLevel[],
  asks: OrderBookLevel[]
): number | null {
  if (bids.length === 0 || asks.length === 0) return null;
  const bestBid = parseFloat(bids[0].price);
  const bestAsk = parseFloat(asks[0].price);
  return (bestBid + bestAsk) / 2;
}

/**
   * Calculates the total volume of a set of levels
 */
export function calculateTotalVolume(levels: OrderBookLevel[]): number {
  return levels.reduce((sum, level) => sum + parseFloat(level.quantity), 0);
}

/**
   * Calculates the buy/sell pressure percentages
 */
export function calculateBuySellPressure(
  bids: OrderBookLevel[],
  asks: OrderBookLevel[]
): { bidsPercentage: number; asksPercentage: number } {
  const totalBidsVolume = calculateTotalVolume(bids);
  const totalAsksVolume = calculateTotalVolume(asks);
  const totalVolume = totalBidsVolume + totalAsksVolume;

  if (totalVolume === 0) {
    return { bidsPercentage: 50, asksPercentage: 50 };
  }

  return {
    bidsPercentage: (totalBidsVolume / totalVolume) * 100,
    asksPercentage: (totalAsksVolume / totalVolume) * 100,
  };
}

/**
   * Formats a price number with the specified precision
   * Format: 90,000.01 (commas for thousands, dot for decimals)
 */
export function formatPrice(price: string | number, decimals: number = 2): string {
  const numPrice = parseFloat(price.toString());
  
  return numPrice.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
   * Formats a quantity with the specified precision
   * Format: 1,234.56789 (commas for thousands, dot for decimals)
 */
export function formatQuantity(quantity: string | number, decimals: number = 5): string {
  const numQuantity = parseFloat(quantity.toString());
  
  return numQuantity.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}