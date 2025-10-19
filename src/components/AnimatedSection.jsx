// src/components/AnimatedSection.jsx
import { useRef } from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation'; // Make sure the hook path is correct

// Reusable component to apply scroll animation
export default function AnimatedSection({
  children,
  direction = 'bottom', // 'bottom', 'left', 'right'
  delay = 0, // Delay in milliseconds
  className = '', // Allow passing additional Tailwind classes
  tag = 'div', // Allow using different HTML tags like 'section', 'article', etc.
  animationOptions = { threshold: 0.1, triggerOnce: true } // Observer options
}) {
  const [elementRef, isVisible] = useScrollAnimation(animationOptions);
  const Tag = tag; // Use the tag prop to determine the element type

  const getAnimationClass = (isVisible, direction) => {
    let translateClass = 'translate-y-5'; // Default slide from bottom
    if (direction === 'left') translateClass = '-translate-x-10';
    if (direction === 'right') translateClass = 'translate-x-10';

    // Base transition classes + conditional visibility/transform classes
    return `transition-all duration-700 ease-out ${
      isVisible ? 'opacity-100 translate-x-0 translate-y-0' : `opacity-0 ${translateClass}`
    }`;
  };

  return (
    <Tag
      ref={elementRef}
      className={`${getAnimationClass(isVisible, direction)} ${className}`} // Combine animation classes with passed classes
      style={{ transitionDelay: `${delay}ms` }} // Apply delay
    >
      {children}
    </Tag>
  );
}