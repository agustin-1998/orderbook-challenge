// Container Component

export default function OrderBookLayout({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <>
      <section className="w-full mt-6 border py-3 px-2 border-gray-300 rounded-lg overflow-hidden shadow-lg">
        {children}
      </section>
    </>
  );
}
