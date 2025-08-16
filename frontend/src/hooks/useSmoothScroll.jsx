import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import ScrollSmoother from 'gsap/ScrollSmoother';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollSmoother, ScrollTrigger);

const useSmoothScroll = () => {
  useGSAP(() => {
    // Device detection for performance optimization
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isLowEndDevice = navigator.hardwareConcurrency <= 4 || navigator.deviceMemory <= 4;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Performance-optimized settings
    const getOptimalSettings = () => {
      if (prefersReducedMotion) {
        return {
          smooth: 0,
          effects: false,
          smoothTouch: false
        };
      }
      
      if (isMobile || isLowEndDevice) {
        return {
          smooth: 1.0,
          effects: true,
          smoothTouch: 0.05,
          normalizeScroll: true
        };
      }
      
      return {
        smooth: 1.2,
        effects: true,
        smoothTouch: 0.08,
        normalizeScroll: true
      };
    };

    const settings = getOptimalSettings();

    // Kill any existing ScrollTriggers and ScrollSmoother instances
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    ScrollSmoother.get()?.kill();

    // Create optimized ScrollSmoother instance
    const smoother = ScrollSmoother.create({
      wrapper: '.smooth-wrapper',
      content: '.smooth-content',
      smooth: settings.smooth,
      effects: settings.effects,
      smoothTouch: settings.smoothTouch,
      normalizeScroll: settings.normalizeScroll,
      ignoreMobileResize: true,
      ease: 'power2.out'
    });

    // Enhanced background animation with better performance
    gsap.to(document.body, {
      backgroundSize: '180% 180%',
      ease: 'none',
      scrollTrigger: {
        trigger: '.smooth-content',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.3,
        invalidateOnRefresh: true,
        
        onUpdate: (self) => {
          const progress = self.progress;
          const startSize = 100;
          const endSize = 180;
          const easedProgress = gsap.utils.interpolate(0, 1, progress, 'power2.out');
          const currentSize = startSize + (endSize - startSize) * easedProgress;
          
          document.body.style.backgroundSize = `${currentSize}% ${currentSize}%`;
        },
      },
    });

    // Debounced resize handler for better performance
    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        smoother.refresh();
        ScrollTrigger.refresh();
      }, 150);
    };

    window.addEventListener('resize', handleResize, { passive: true });

    ScrollTrigger.refresh();

    return () => {
      clearTimeout(resizeTimeout);
      window.removeEventListener('resize', handleResize);
      smoother?.kill();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);
};

export default useSmoothScroll;