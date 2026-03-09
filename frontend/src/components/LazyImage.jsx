import { useState, useEffect } from 'react';

const LazyImage = ({ src, alt, className, placeholderColor = 'bg-gray-700' }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);

  useEffect(() => {
    if (!src) return;

    const img = new Image();
    img.src = src;
    
    img.onload = () => {
      setImageSrc(src);
      setIsLoaded(true);
    };

    img.onerror = () => {
      console.error('Failed to load image:', src);
      setIsLoaded(true); // Still mark as loaded to show placeholder
    };
  }, [src]);

  return (
    <div
      className={`relative overflow-hidden ${className} ${placeholderColor}`}
    >
      {!isLoaded && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700" />
      )}
      
      {imageSrc && (
        <img
          src={imageSrc}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          loading="lazy"
        />
      )}
    </div>
  );
};

export default LazyImage;
