// components/CustomCursor.jsx
import React from 'react';
import useCustomCursor from '../../hooks/useCustomCursor';

const CustomCursor = () => {
  const { cursorRef } = useCustomCursor();

  const cursorStyles = {
    position: 'fixed',
    left: 0,
    top: 0,
    width: '20px',
    height: '20px',
    backgroundColor: '#ffffff',
    borderRadius: '50%',
    pointerEvents: 'none',
    zIndex: 9999,
    mixBlendMode: 'difference',
    opacity: 1,
    // Performance optimizations
    willChange: 'transform, opacity',
    backfaceVisibility: 'hidden',
  };

  // Internal CSS styles
  const internalStyles = `
    /* Hide default cursor for desktop */
    @media (hover: hover) and (pointer: fine) {
      * {
        cursor: none !important;
      }
      
      /* Override for text inputs and textareas */
      input[type="text"],
      input[type="email"],
      input[type="password"],
      textarea {
        cursor: text !important;
      }
    }

    /* Mobile devices - show default cursor */
    @media (hover: none) and (pointer: coarse) {
      * {
        cursor: auto !important;
      }
    }
  `;

  return (
    <>
      <style>{internalStyles}</style>
      <div ref={cursorRef} style={cursorStyles} />
    </>
  );
};

export default CustomCursor;