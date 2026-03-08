const TabBar = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div
      className="flex items-center gap-1 overflow-x-auto scrollbar-hide px-4 sm:px-8 pb-2"
      style={{ scrollbarWidth: "none" }}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
            activeTab === tab.id
              ? "bg-primary-500 text-white shadow-lg shadow-primary-500/25"
              : "bg-dark-300/40 text-gray-400 hover:text-white hover:bg-dark-300/70 border border-white/5"
          }`}
        >
          {tab.label}
          {tab.count !== undefined && tab.count > 0 && (
            <span
              className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                activeTab === tab.id
                  ? "bg-white/20 text-white"
                  : "bg-dark-300 text-gray-400"
              }`}
            >
              {tab.count > 999 ? "999+" : tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
};

export default TabBar;
