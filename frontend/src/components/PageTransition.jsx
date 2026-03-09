import { useState, useEffect } from 'react';

const PageTransition = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger fade-in animation after mount
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`transition-opacity duration-300 ease-out ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {children}
    </div>
  );
};

export default PageTransition;
