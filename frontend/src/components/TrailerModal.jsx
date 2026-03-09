import { useEffect } from "react";
import { FiX, FiAlertCircle } from "react-icons/fi";

export default function TrailerModal({ isOpen, onClose, trailerKey, title }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 sm:p-6"
      onClick={handleBackdropClick}
    >
      <div className="relative w-full max-w-5xl sm:max-w-6xl bg-gray-800 rounded-2xl overflow-hidden shadow-2xl border border-white/10 max-h-[90vh] sm:max-h-none overflow-y-auto">
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-white/10">
          <div>
            <h3 className="text-white font-bold text-base sm:text-lg">{title}</h3>
            <p className="text-gray-400 text-xs sm:text-sm">Official Trailer</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-all"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {trailerKey ? (
          <div className="relative aspect-video w-full bg-black">
            <iframe
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0&modestbranding=1`}
              title={`${title} Trailer`}
              className="absolute inset-0 w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <div className="aspect-video w-full bg-gray-700/50 flex flex-col items-center justify-center gap-4">
            <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center">
              <FiAlertCircle className="w-8 h-8 text-gray-500" />
            </div>
            <div className="text-center">
              <p className="text-white font-semibold mb-1">
                Trailer Unavailable
              </p>
              <p className="text-gray-400 text-sm">
                Trailer for this title is currently unavailable.
              </p>
            </div>
          </div>
        )}

        <div className="px-4 sm:px-6 py-3 bg-gray-700/20 border-t border-white/5">
          <p className="text-gray-500 text-xs text-center">
            Press ESC or click outside to close
          </p>
        </div>
      </div>
    </div>
  );
}
