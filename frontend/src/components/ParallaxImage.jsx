import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const ParallaxImage = ({ 
  src, 
  alt, 
  className = '', 
  speed = 0.5,
  direction = 'vertical', // 'vertical', 'horizontal', 'scale'
  ...props 
}) => {
  const imageRef = useRef(null);

  useGSAP(() => {
    const image = imageRef.current;
    if (!image) return;

    let animation;
    
    if (direction === 'vertical') {
      animation = gsap.to(image, {
        y: `${speed * 100}%`,
        ease: "none",
        scrollTrigger: {
          trigger: image,
          start: "top bottom",
          end: "bottom top",
          scrub: 1
        }
      });
    } else if (direction === 'horizontal') {
      animation = gsap.to(image, {
        x: `${speed * 100}%`,
        ease: "none",
        scrollTrigger: {
          trigger: image,
          start: "top bottom",
          end: "bottom top",
          scrub: 1
        }
      });
    } else if (direction === 'scale') {
      animation = gsap.to(image, {
        scale: 1 + speed,
        ease: "none",
        scrollTrigger: {
          trigger: image,
          start: "top bottom",
          end: "bottom top",
          scrub: 1
        }
      });
    }

    return () => {
      if (animation) animation.kill();
    };
  }, [speed, direction]);

  return (
    <div className={`parallax-image-container ${className}`}>
      <img 
        ref={imageRef}
        src={src} 
        alt={alt} 
        className="parallax-image"
        {...props}
      />
    </div>
  );
};

export default ParallaxImage;
