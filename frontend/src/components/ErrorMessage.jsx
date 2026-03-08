import React from "react";
import { FiAlertCircle, FiRefreshCw } from "react-icons/fi";

const ErrorMessage = ({ message = "Something went wrong", onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
        <FiAlertCircle className="w-8 h-8 text-red-400" />
      </div>
      <h3 className="text-white text-lg font-semibold mb-2">Oops!</h3>
      <p className="text-gray-400 text-center max-w-md mb-6">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-xl font-medium transition-all"
        >
          <FiRefreshCw className="w-4 h-4" />
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
