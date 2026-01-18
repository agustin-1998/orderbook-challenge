"use client";

import OrderBookLayout from "./components/orderbook/OrderBookLayout";
import OrderBookTable from "./components/orderbook/OrderBookTable";
import CurrencySelector from "./components/currencies/CurrencySelector";
import { useState } from "react";

export default function Home() {
  const [selectedCurrency, setSelectedCurrency] = useState<string>("BTCUSDT");

  const handleCurrencyChange = (currency: string) => {
    setSelectedCurrency(currency);
  };

  return (
    <main className="min-h-screen bg-gray-300 flex flex-col px-4 py-8">
      <h1 className="text-2xl md:text-4xl font-bold mb-6 text-center text-indigo-700">
        OrderBook Challenge
      </h1>

      <section className="container w-full mx-auto bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-center w-full">
          <CurrencySelector onCurrencyChange={handleCurrencyChange} />
        </div>

        <OrderBookLayout>
          <OrderBookTable key={selectedCurrency} symbol={selectedCurrency} />
        </OrderBookLayout>
      </section>
    </main>
  );
}
