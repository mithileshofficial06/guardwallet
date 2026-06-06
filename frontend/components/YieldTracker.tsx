export default function YieldTracker() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Yield Earnings</h3>
      
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-600">This Month</p>
          <p className="text-3xl font-bold text-green-600">$47.50</p>
          <p className="text-sm text-gray-500">+4.2% APY</p>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Protected Balance</p>
          <p className="text-2xl font-bold text-gray-900">$1,250</p>
          <p className="text-xs text-gray-600 mt-1">Earning via Aave Protocol</p>
        </div>

        <div className="pt-4 border-t">
          <p className="text-sm text-gray-600 mb-2">Total Lifetime Earnings</p>
          <p className="text-xl font-semibold text-gray-900">$342.80</p>
        </div>
      </div>
    </div>
  );
}
