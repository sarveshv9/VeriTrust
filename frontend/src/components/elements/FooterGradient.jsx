import { motion } from "framer-motion";
import React, { useEffect, useRef } from "react";

// Style objects are now defined directly inside the component file
const styles = {
  container: {
    position: 'relative',
    isolation: 'isolate', // Creates a new stacking context for z-index
    minHeight: '100vh', // Ensure container has height
  },
  background: {
    position: 'absolute', // Changed from fixed to absolute
    top: 0,
    left: 0,
    width: '100%',
    height: '100%', // Cover the container, not viewport
    zIndex: -1, // Sits behind all other content
  },
  gradientElement: {
    position: 'absolute',
    inset: 0,
  },
  grainOverlay: {
    position: 'absolute',
    inset: 0,
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 600 600' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.5' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
    opacity: 0.025,
    pointerEvents: 'none', // Allows mouse clicks to pass through
  },
  contentOnTop: {
    position: 'relative',
    zIndex: 1,
  },
};

const FooterGradient = ({ children }) => {
  // Style constants to match the desired look
  const startingGap = 120; // Increased from 80 to make gradient wider
  const Breathing = true;
  const gradientColors = ["#273a5f", "#562a4a", "#0A0A0A"];
  const gradientStops = [0, 35, 70]; // Spread out the stops more for larger coverage
  const animationSpeed = 0.01;
  const breathingRange = 3; // Slightly increased breathing range
  const topOffset = 0;

  const containerRef = useRef(null);

  useEffect(() => {
    let animationFrame;
    let width = startingGap;
    let directionWidth = 1;

    const animateGradient = () => {
      if (width >= startingGap + breathingRange) directionWidth = -1;
      if (width <= startingGap - breathingRange) directionWidth = 1;

      if (!Breathing) directionWidth = 0;
      width += directionWidth * animationSpeed;

      const gradientStopsString = gradientStops
        .map((stop, index) => `${gradientColors[index]} ${stop}%`)
        .join(", ");

      // Changed to position gradient at bottom with bigger size
      const gradient = `radial-gradient(${width}% 100% at 50% 100%, ${gradientStopsString})`;

      if (containerRef.current) {
        containerRef.current.style.background = gradient;
      }

      animationFrame = requestAnimationFrame(animateGradient);
    };

    animationFrame = requestAnimationFrame(animateGradient);

    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return (
    <div style={styles.container}>
      <motion.div
        key="animated-gradient-background"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 2, ease: "easeOut" } }}
        style={styles.background}
      >
        <div
          ref={containerRef}
          style={styles.gradientElement}
        />
        <div style={styles.grainOverlay} />
      </motion.div>
      <div style={styles.contentOnTop}>
        {children}
      </div>
    </div>
  );
};

export default FooterGradient;