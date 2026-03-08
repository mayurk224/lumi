import React from "react";

const EmptyState = ({ icon, title, subtitle, actionLabel, onAction }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="w-20 h-20 bg-dark-300/50 rounded-full flex items-center justify-center mb-6 text-gray-500">
        {icon}
      </div>
      <h3 className="text-white text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-400 max-w-sm mb-8">{subtitle}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-3 rounded-xl font-semibold transition-all hover:scale-105"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
