
import { OrderBookItemProps } from "@/app/types/orderbook.types";
import { formatPrice, formatQuantity } from "@/app/lib/orderBookUtils";
import React from "react";

const OrderBookItem: React.FC<OrderBookItemProps> = React.memo(
  ({ price, quantity, total, percentage, type }) => {
    const formattedPrice = formatPrice(price, 2);
    const formattedQuantity = formatQuantity(quantity, 5);
    const formattedTotal = formatQuantity(total, 5);

    const bgColor = type === "bid" ? "bg-green-500/20" : "bg-red-500/20";
    const textColor = type === "bid" ? "text-green-700" : "text-red-700";

    return (
      <div className="relative">
        {/* Depth Bar */}
        <div
          className={`absolute inset-y-0 ${
            type === "bid" ? "right-0" : "left-0"
          } ${bgColor} transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />

        {/* Content */}
        <div
          className={`relative grid grid-cols-3 gap-2 text-sm py-1 px-2 rounded transition-colors hover:bg-gray-100 ${textColor}`}
        >
          <div className="font-medium">{formattedPrice}</div>
          <div className="text-right">{formattedQuantity}</div>
          <div className="text-right text-xs text-gray-500">{formattedTotal}</div>
        </div>
      </div>
    );
  },
  (prev, next) =>
    prev.price === next.price &&
    prev.quantity === next.quantity &&
    prev.total === next.total &&
    prev.percentage === next.percentage &&
    prev.type === next.type
);

OrderBookItem.displayName = "OrderBookItem";

export default OrderBookItem;