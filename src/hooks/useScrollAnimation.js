// src/hooks/useScrollAnimation.js
import { useState, useEffect, useRef } from 'react';

export function useScrollAnimation(options = { threshold: 0.1, triggerOnce: true }) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Optionally disconnect observer if triggerOnce is true
          if (options.triggerOnce && elementRef.current) {
            observer.unobserve(elementRef.current);
          }
        } else if (!options.triggerOnce) {
          // Optional: Reset animation if it should trigger every time
           // setIsVisible(false);
        }
      });
    }, options);

    const currentElement = elementRef.current;
    if (currentElement) {
      observer.observe(currentElement);
    }

    // Cleanup observer on component unmount
    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [options]); // Re-run effect if options change

  return [elementRef, isVisible];
}