// hooks/useBackgroundScroll.js
import { useEffect } from 'react';

const useBackgroundScroll = (speed = 0.5) => {
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      const backgroundElement = document.querySelector('.smooth-wrapper::before') || 
                               document.querySelector('.smooth-wrapper');
      
      // Move background upward as user scrolls down
      if (backgroundElement) {
        const smoothWrapper = document.querySelector('.smooth-wrapper');
        if (smoothWrapper) {
          smoothWrapper.style.setProperty('--bg-transform', `translateY(${-scrolled * speed}px)`);
        }
      }
    };

    // Add CSS custom property support
    const style = document.createElement('style');
    style.textContent = `
      .smooth-wrapper::before {
        transform: var(--bg-transform, translateY(0));
      }
    `;
    document.head.appendChild(style);

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
    
    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, [speed]);
};

export default useBackgroundScroll;