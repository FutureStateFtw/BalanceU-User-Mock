export default function LoadingDeposit() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-600 to-blue-300 text-white p-6 animate-pulse">
      <div className="absolute top-4 left-16">
        <div className="h-10 w-36 bg-white/30 rounded" />
      </div>
      <h1 className="text-3xl font-bold mb-6 mt-24">Deposit Funds</h1>
      <div className="space-y-4 max-w-md">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-16 bg-white/20 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
