import { useState, useEffect } from 'react';
import { WifiOff, Wifi } from 'lucide-react';

const NetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowToast(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!showToast) return null;

  return (
    <div
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ${
        showToast ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
      }`}
    >
      <div
        className={`flex items-center gap-3 px-6 py-3 rounded-lg shadow-lg ${
          isOnline
            ? 'bg-green-600 text-white'
            : 'bg-red-600 text-white'
        }`}
      >
        {isOnline ? (
          <>
            <Wifi className="w-5 h-5" />
            <span className="font-medium">Back Online</span>
          </>
        ) : (
          <>
            <WifiOff className="w-5 h-5" />
            <span className="font-medium">You're Offline</span>
          </>
        )}
      </div>
    </div>
  );
};

export default NetworkStatus;
