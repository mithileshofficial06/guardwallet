export default function AutopayList({ address }) {
  const autopays = [
    { name: 'Rent', amount: 1200, date: '2026-12-01', status: 'protected', daysUntil: 5 },
    { name: 'Netflix', amount: 15, date: '2026-11-28', status: 'protected', daysUntil: 2 },
    { name: 'Gym Membership', amount: 50, date: '2026-12-10', status: 'upcoming', daysUntil: 14 },
  ];

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b">
        <h3 className="text-lg font-semibold">Your Autopays</h3>
      </div>

      <div className="divide-y">
        {autopays.map((autopay, idx) => (
          <div key={idx} className="p-6 flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">{autopay.name}</h4>
              <p className="text-sm text-gray-500">
                Due in {autopay.daysUntil} days • {autopay.date}
              </p>
            </div>

            <div className="text-right">
              <p className="text-lg font-semibold text-gray-900">${autopay.amount}</p>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  autopay.status === 'protected'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {autopay.status === 'protected' ? '✓ Protected' : 'Upcoming'}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="p-6 border-t">
        <button className="text-indigo-600 font-medium">+ Add New Autopay</button>
      </div>
    </div>
  );
}
