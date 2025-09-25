import React, { useEffect, useRef } from "react";

// Style objects - simplified for better performance
const styles = {
  container: {
    position: 'relative',
    isolation: 'isolate',
    minHeight: '100vh',
    backgroundColor: '#0A0A0A',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: -1,
  },
  gradientElement: {
    position: 'absolute',
    inset: 0,
  },
  contentOnTop: {
    position: 'relative',
    zIndex: 1,
  },
};

const FooterGradient = ({ children }) => {
  // Style constants - static gradient, no animation
  const gradientColors = ["#273a5f", "#562a4a", "#000000"];
  const gradientStops = [0, 35, 70];

  const containerRef = useRef(null);

  useEffect(() => {
    // Set static gradient once on mount
    const gradientStopsString = gradientStops
      .map((stop, index) => `${gradientColors[index]} ${stop}%`)
      .join(", ");

    const gradient = `radial-gradient(120% 100% at 50% 100%, ${gradientStopsString})`;

    if (containerRef.current) {
      containerRef.current.style.background = gradient;
      // Debug: also set a fallback background
      console.log("Gradient applied:", gradient);
    }
  }, []); // Empty dependency array - runs once on mount

  return (
    <div style={styles.container}>
      <div style={styles.background}>
        <div
          ref={containerRef}
          style={styles.gradientElement}
        />
        {/* Removed grain overlay - can cause performance issues */}
      </div>
      <div style={styles.contentOnTop}>
        {children}
      </div>
    </div>
  );
};

export default FooterGradient;