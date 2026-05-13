export default function StatsSummary({ stats }) {
  const { totalAmount, completionRate, monthlyAmounts } = stats;
  const maxVal = Math.max(...monthlyAmounts);

  const circumference = 2 * Math.PI * 30;
  const strokeDashoffset = circumference * (1 - completionRate / 100);

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-5 flex items-center justify-between">
      <div className="flex-1">
        <p className="text-xs text-gray-500 mb-1">TOTAL CLAIMS PAID</p>
        <p className="text-2xl font-bold text-blue-600">
          {totalAmount.toLocaleString()}원
        </p>
        <div className="flex items-end gap-1 mt-3 h-10">
          {monthlyAmounts.map((val, i) => (
            <div
              key={i}
              className="flex-1 bg-blue-300 rounded-sm opacity-70"
              style={{ height: `${(val / maxVal) * 100}%` }}
            />
          ))}
        </div>
      </div>
      <div className="ml-4">
        <svg width="80" height="80" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="30" fill="none" stroke="#e2e8f0" strokeWidth="8" />
          <circle
            cx="40" cy="40" r="30"
            fill="none"
            stroke="#4F6EF7"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            transform="rotate(-90 40 40)"
          />
          <text x="40" y="44" textAnchor="middle" fill="#4F6EF7" fontSize="14">
            {completionRate}%
          </text>
        </svg>
      </div>
    </div>
  );
}
