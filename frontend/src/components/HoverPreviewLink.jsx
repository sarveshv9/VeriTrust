import React, { useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

const HoverPreviewLink = ({ 
  children, 
  href, 
  previewImage, 
  previewVideo,
  className = '',
  ...props 
}) => {
  const linkRef = useRef(null);
  const previewRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  useGSAP(() => {
    const link = linkRef.current;
    const preview = previewRef.current;
    
    if (!link || !preview) return;

    const handleMouseEnter = () => {
      setIsHovered(true);
      
      gsap.to(preview, {
        opacity: 1,
        scale: 1,
        duration: 0.4,
        ease: "power2.out"
      });
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
      
      gsap.to(preview, {
        opacity: 0,
        scale: 0.8,
        duration: 0.3,
        ease: "power2.in"
      });
    };

    link.addEventListener('mouseenter', handleMouseEnter);
    link.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      link.removeEventListener('mouseenter', handleMouseEnter);
      link.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div className="hover-preview-container">
      <a 
        ref={linkRef}
        href={href}
        className={`hover-preview-link ${className}`}
        {...props}
      >
        {children}
      </a>
      
      <div ref={previewRef} className="hover-preview">
        {previewVideo ? (
          <video 
            src={previewVideo} 
            autoPlay 
            muted 
            loop 
            playsInline
            className="preview-media"
          />
        ) : previewImage ? (
          <img 
            src={previewImage} 
            alt="Preview" 
            className="preview-media"
          />
        ) : null}
      </div>
    </div>
  );
};

export default HoverPreviewLink;
