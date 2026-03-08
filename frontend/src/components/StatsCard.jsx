export default function StatsCard({ icon, label, value, color }) {
  const colorClasses = {
    primary: "bg-primary-500/20 border-primary-500/30 text-primary-400",
    green: "bg-green-500/20 border-green-500/30 text-green-400",
    yellow: "bg-yellow-500/20 border-yellow-500/30 text-yellow-400",
    red: "bg-red-500/20 border-red-500/30 text-red-400",
    blue: "bg-blue-500/20 border-blue-500/30 text-blue-400",
    purple: "bg-purple-500/20 border-purple-500/30 text-purple-400",
  };

  const selectedColorClass = colorClasses[color] || colorClasses.primary;

  return (
    <div className="bg-dark-200/80 border border-white/5 rounded-2xl p-5 flex items-center gap-4">
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${selectedColorClass}`}
      >
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-white">{value}</p>
        <p className="text-gray-400 text-sm">{label}</p>
      </div>
    </div>
  );
}
