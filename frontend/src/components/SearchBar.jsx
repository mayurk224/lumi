import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import useDebounce from "../hooks/useDebounce";
import { FiSearch, FiX, FiLoader } from "react-icons/fi";

const SearchBar = ({ onSearch, isLoading, initialValue = "" }) => {
  const [inputValue, setInputValue] = useState(initialValue);
  const inputRef = useRef(null);
  const debouncedValue = useDebounce(inputValue, 500);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (debouncedValue.trim().length >= 2) {
      onSearch(debouncedValue.trim());
    } else if (debouncedValue.trim().length === 0) {
      onSearch("");
    }
  }, [debouncedValue, onSearch]);

  const handleClear = () => {
    setInputValue("");
    onSearch("");
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      handleClear();
    }
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      <div
        className={`flex items-center gap-3 bg-dark-200 border rounded-2xl px-5 py-4 transition-all duration-200 ${inputValue ? "border-primary-500 shadow-lg shadow-primary-500/10" : "border-white/10 hover:border-white/20"}`}
      >
        {isLoading ? (
          <FiLoader className="w-5 h-5 text-primary-400 animate-spin shrink-0" />
        ) : (
          <FiSearch className="w-5 h-5 text-gray-400 shrink-0" />
        )}

        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search movies, TV shows, people..."
          className="flex-1 bg-transparent text-white placeholder-gray-500 text-lg focus:outline-none"
          autoComplete="off"
          spellCheck="false"
        />

        {inputValue && (
          <button
            onClick={handleClear}
            className="shrink-0 p-1 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-all"
          >
            <FiX className="w-4 h-4" />
          </button>
        )}
      </div>

      {!inputValue && (
        <p className="text-gray-600 text-sm text-center mt-3">
          Type at least 2 characters to search
        </p>
      )}
    </div>
  );
};

export default SearchBar;
