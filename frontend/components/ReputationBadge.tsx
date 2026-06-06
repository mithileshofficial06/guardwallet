interface ReputationBadgeProps {
  cycles: number;
}

export default function ReputationBadge({ cycles }: ReputationBadgeProps) {
  const getBadge = (cycles: number) => {
    if (cycles >= 12) return { name: 'Gold', color: 'yellow', emoji: '🏆' };
    if (cycles >= 6) return { name: 'Silver', color: 'gray', emoji: '🥈' };
    return { name: 'Bronze', color: 'orange', emoji: '🥉' };
  };

  const badge = getBadge(cycles);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Your Reputation</h3>
      
      <div className="text-center">
        <div className="text-6xl mb-3">{badge.emoji}</div>
        <p className="text-2xl font-bold text-gray-900 mb-1">{badge.name} Badge</p>
        <p className="text-sm text-gray-600 mb-4">{cycles} successful cycles</p>
        
        <div className="bg-gray-100 rounded-full h-2 mb-2">
          <div
            className="bg-indigo-600 h-2 rounded-full"
            style={{ width: `${(cycles / 12) * 100}%` }}
          />
        </div>
        <p className="text-xs text-gray-600">{12 - cycles} more for Gold</p>
      </div>

      {badge.name === 'Gold' && (
        <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded p-3">
          <p className="text-sm font-medium text-yellow-900">
            🎉 You've unlocked undercollateralized loans!
          </p>
        </div>
      )}
    </div>
  );
}
