import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const BlurText = ({
  text = '',
  delay = 50,
  className = '',
  animateBy = 'words',
  direction = 'top',
}) => {
  const elements = animateBy === 'words' ? text.split(' ') : text.split('');
  const containerRef = useRef(null);
  const elementsRef = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          gsap.fromTo(
            elementsRef.current,
            {
              filter: 'blur(10px)',
              opacity: 0,
              y: direction === 'top' ? -20 : 20,
            },
            {
              filter: 'blur(0px)',
              opacity: 1,
              y: 0,
              duration: 0.8,
              stagger: delay / 1000,
              ease: 'power2.out',
            }
          );
          observer.unobserve(containerRef.current);
        }
      },
      { threshold: 0.1 }
    );
    
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    
    return () => observer.disconnect();
  }, [delay, direction]);

  return (
    <p ref={containerRef} className={className} style={{ display: 'flex', flexWrap: 'wrap' }}>
      {elements.map((segment, index) => (
        <span
          key={index}
          ref={(el) => (elementsRef.current[index] = el)}
          className="inline-block will-change-[transform,filter,opacity]"
          style={{ filter: 'blur(10px)', opacity: 0 }}
        >
          {segment === ' ' ? '\u00A0' : segment}
          {animateBy === 'words' && index < elements.length - 1 && '\u00A0'}
        </span>
      ))}
    </p>
  );
};

export default BlurText;
