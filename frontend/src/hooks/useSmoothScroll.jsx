import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import ScrollSmoother from 'gsap/ScrollSmoother';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollSmoother, ScrollTrigger);

const useSmoothScroll = () => {
  useGSAP(() => {

    const smoother = ScrollSmoother.create({
      wrapper: '.smooth-wrapper',
      content: '.smooth-content',
      smooth: 1.5,
      effects: true,
      smoothTouch: 0.1,
    });

    gsap.to(document.body, {
      backgroundSize: '180% 180%',
      ease: 'none',
      scrollTrigger: {
        trigger: '.smooth-content',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.3,
        onUpdate: (self) => {
          const progress = self.progress;
          const startSize = 100;
          const endSize = 180;
          const easedProgress = Math.pow(progress, 0.7);
          const currentSize =
            startSize + (endSize - startSize) * easedProgress;
          document.body.style.backgroundSize = `${currentSize}% ${currentSize}%`;
        },
      },
    });

    ScrollTrigger.refresh();

    return () => {
      smoother?.kill();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);
};

export default useSmoothScroll;