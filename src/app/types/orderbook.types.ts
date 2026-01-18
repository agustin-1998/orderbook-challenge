// TypeScript interfaces

export interface OrderBookLevel {
  price: string;
  quantity: string;
  total?: number;
  percentage?: number;
}

export interface OrderBookData {
  bids: OrderBookLevel[];
  asks: OrderBookLevel[];
  lastUpdateId: number;
}

export interface OrderBookTableProps {
  symbol: string;
}

export interface OrderBookItemProps {
  price: string;
  quantity: string;
  type: "bid" | "ask";
  total: string | number;
  percentage: number;
}

export interface BinanceOrderBookMessage {
  bids: [string, string][];
  asks: [string, string][];
}
