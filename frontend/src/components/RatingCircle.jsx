export default function RatingCircle({ rating, size = 60 }) {
  const percentage = (rating / 10) * 100;
  const circumference = 2 * Math.PI * 20;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  let color = "#ef4444"; // red
  if (rating >= 7) {
    color = "#22c55e"; // green
  } else if (rating >= 5) {
    color = "#eab308"; // yellow
  }

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 50 50"
        className="-rotate-90"
      >
        <circle
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke="#1e1b4b"
          strokeWidth="4"
        />
        <circle
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: "stroke-dashoffset 0.5s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span style={{ fontSize: size * 0.24, color, fontWeight: "bold" }}>
          {rating?.toFixed(1)}
        </span>
      </div>
    </div>
  );
}
