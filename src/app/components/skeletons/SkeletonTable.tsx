export default function SkeletonTable() {
  const skeletonRows = Array.from({ length: 10 });

  const SkeletonRow = () => (
    <div className="relative">
      <div className="relative grid grid-cols-3 gap-2 text-sm py-1 px-2 rounded animate-pulse">
        <div className="h-4 bg-gray-400 rounded w-3/4" />
        <div className="h-4 bg-gray-400 rounded w-2/3 ml-auto" />
        <div className="h-3 bg-gray-100 rounded w-1/2 ml-auto" />
      </div>
    </div>
  );

  return (
    <div className="p-4 w-full">
      {/* Estado de conexión skeleton */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gray-300 animate-pulse" />
          <span className="h-4 w-16 bg-gray-400 rounded animate-pulse" />
        </div>
        <span className="h-4 w-20 bg-gray-400 rounded animate-pulse" />
      </div>

      {/* Precio skeleton */}
      <div className="mb-4 text-center">
        <div className="mx-auto h-8 w-32 bg-gray-400 rounded animate-pulse" />
        <div className="mx-auto mt-2 h-4 w-20 bg-gray-100 rounded animate-pulse" />
      </div>

      {/* Order Book Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Asks (Sell Orders) - Red */}
        <div className="order-2 md:order-1">
          <div className="bg-red-50 rounded-lg p-4">
            <h3 className="text-lg font-bold text-red-700 mb-3 text-center">
              Asks (Sell)
            </h3>
            <div className="space-y-1">
              <div className="grid grid-cols-3 gap-2 text-xs font-semibold text-gray-400 pb-2 border-b">
                <div>Price</div>
                <div className="text-right">Amount</div>
                <div className="text-right">Total</div>
              </div>
              {skeletonRows.map((_, i) => (
                <SkeletonRow key={"ask-" + i} />
              ))}
            </div>
          </div>
        </div>
        {/* Bids (Buy Orders) - Green */}
        <div className="order-1 md:order-2">
          <div className="bg-green-50 rounded-lg p-4">
            <h3 className="text-lg font-bold text-green-700 mb-3 text-center">
              Bids (Buy)
            </h3>
            <div className="space-y-1">
              <div className="grid grid-cols-3 gap-2 text-xs font-semibold text-gray-400 pb-2 border-b">
                <div>Price</div>
                <div className="text-right">Amount</div>
                <div className="text-right">Total</div>
              </div>
              {skeletonRows.map((_, i) => (
                <SkeletonRow key={"bid-" + i} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Buy/Sell Pressure Bar Skeleton */}
      <div className="mt-6 bg-gray-100 rounded-lg p-4">
        <div className="flex items-center justify-between text-sm font-semibold mb-2">
          <span className="h-4 w-16 bg-gray-400 rounded animate-pulse" />
          <span className="h-4 w-16 bg-gray-400 rounded animate-pulse" />
        </div>
        <div className="h-3 bg-gray-400 rounded-full overflow-hidden flex">
          <div className="bg-green-400 animate-pulse" style={{ width: '50%' }} />
          <div className="bg-red-400 animate-pulse" style={{ width: '50%' }} />
        </div>
      </div>
    </div>
  );
}
