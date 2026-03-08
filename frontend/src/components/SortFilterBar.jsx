import { FiGrid, FiList } from "react-icons/fi";

export default function SortFilterBar({
  sortOptions,
  activeSort,
  onSortChange,
  viewMode,
  onViewModeChange,
  showViewToggle = true,
  resultCount,
  label = "items",
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 sm:px-8 py-4 border-b border-white/5">
      <p className="text-gray-400 text-sm">
        <span className="text-white font-semibold">{resultCount}</span> {label}
      </p>

      <div className="flex items-center gap-3">
        <select
          value={activeSort}
          onChange={(e) => onSortChange(e.target.value)}
          className="bg-dark-300/50 border border-white/10 text-gray-300 text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-primary-500 cursor-pointer"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-dark-200">
              {opt.label}
            </option>
          ))}
        </select>

        {showViewToggle && (
          <div className="flex items-center bg-dark-300/50 border border-white/10 rounded-xl p-1">
            <button
              onClick={() => onViewModeChange("grid")}
              className={`p-1.5 rounded-lg transition-all
                ${viewMode === "grid" ? "bg-primary-500 text-white" : "text-gray-400 hover:text-white"}`}
            >
              <FiGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onViewModeChange("list")}
              className={`p-1.5 rounded-lg transition-all
                ${viewMode === "list" ? "bg-primary-500 text-white" : "text-gray-400 hover:text-white"}`}
            >
              <FiList className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
