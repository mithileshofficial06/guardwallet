interface DailyBudgetProps {
  budget: number;
  spent: number;
  remaining: number;
}

export default function DailyBudget({ budget, spent, remaining }: DailyBudgetProps) {
  const percentage = (spent / budget) * 100;

  return (
    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow-lg p-6 text-white">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold mb-1">Today's Budget</h3>
          <p className="text-3xl font-bold">${budget}</p>
        </div>
        <div className="text-right">
          <p className="text-sm opacity-90">Spent Today</p>
          <p className="text-2xl font-semibold">${spent}</p>
        </div>
      </div>

      <div className="mb-2">
        <div className="bg-white bg-opacity-20 rounded-full h-3 overflow-hidden">
          <div
            className="bg-white h-full transition-all"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      <p className="text-sm opacity-90">
        ${remaining} remaining • {percentage.toFixed(0)}% used
      </p>

      {percentage > 80 && (
        <div className="mt-4 bg-yellow-500 bg-opacity-20 border border-yellow-300 rounded p-3">
          <p className="text-sm font-medium">
            ⚠️ You've used {percentage.toFixed(0)}% of today's budget. Consider postponing non-essential purchases.
          </p>
        </div>
      )}
    </div>
  );
}
