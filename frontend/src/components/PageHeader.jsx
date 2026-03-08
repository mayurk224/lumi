export default function PageHeader({ icon, title, subtitle, count, action }) {
  return (
    <div className="bg-dark-200/50 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-primary-500/20 border border-primary-500/30 rounded-2xl flex items-center justify-center text-primary-400 flex-shrink-0">
              {icon}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-bold text-white">
                  {title}
                </h1>
                {count !== undefined && count > 0 && (
                  <span className="bg-primary-500/20 text-primary-300 text-sm font-semibold px-3 py-1 rounded-full border border-primary-500/30">
                    {count}
                  </span>
                )}
              </div>
              <p className="text-gray-400 mt-1 text-sm sm:text-base">
                {subtitle}
              </p>
            </div>
          </div>
          {action && <div className="flex-shrink-0">{action}</div>}
        </div>
      </div>
    </div>
  );
}
