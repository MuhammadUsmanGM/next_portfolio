import { useEffect } from 'react';

const ScrollAnimations = () => {
  useEffect(() => {
    // Check if user prefers reduced motion
    const motionReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (motionReduced) return; // Skip animations if user prefers reduced motion
    
    // Define animation classes
    const animationElements = document.querySelectorAll('[data-animate]');
    
    // Setup intersection observer for all animated elements
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: [0.1, 0.2, 0.4, 0.6] // Multiple thresholds for progressive effects
    };
    
    // Animation functions
    const animateElement = (el, direction = 'up') => {
      if (el.classList.contains('animated')) return;
      
      const animationType = el.getAttribute('data-animation') || 'fadeIn';
      const animationDelay = parseInt(el.getAttribute('data-delay')) || 0;
      const animationDuration = parseInt(el.getAttribute('data-duration')) || 600;
      
      // Apply base animation classes
      el.style.transition = `transform ${animationDuration}ms cubic-bezier(0.23, 1, 0.32, 1), opacity ${animationDuration}ms ease, filter ${animationDuration}ms ease`;
      
      // Set initial state based on animation type
      switch(animationType) {
        case 'slideInUp':
          el.style.transform = 'translateY(50px)';
          el.style.opacity = '0';
          break;
        case 'slideInDown':
          el.style.transform = 'translateY(-50px)';
          el.style.opacity = '0';
          break;
        case 'slideInLeft':
          el.style.transform = 'translateX(50px)';
          el.style.opacity = '0';
          break;
        case 'slideInRight':
          el.style.transform = 'translateX(-50px)';
          el.style.opacity = '0';
          break;
        case 'zoomIn':
          el.style.transform = 'scale(0.8)';
          el.style.opacity = '0';
          break;
        case 'flipIn':
          el.style.transform = 'rotateY(90deg)';
          el.style.opacity = '0';
          break;
        case 'fadeIn':
        default:
          el.style.opacity = '0';
          break;
      }
      
      // Trigger reflow to ensure styles are applied
      void el.offsetWidth;
      
      // Apply animation after delay
      setTimeout(() => {
        el.style.transform = 'translateY(0) scale(1) rotateY(0)';
        el.style.opacity = '1';
        el.classList.add('animated');
      }, animationDelay);
    };
    
    // Parallax effect for specific elements
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      
      parallaxElements.forEach(el => {
        const speed = parseFloat(el.getAttribute('data-parallax')) || 0.5;
        const offset = scrollPosition * speed;
        el.style.transform = `translateY(${offset}px)`;
      });
    };
    
    // Progressive animation for elements that stay in view
    const progressiveElements = document.querySelectorAll('[data-progressive]');
    
    const progressiveObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const element = entry.target;
        const isIntersecting = entry.isIntersecting;
        
        if (isIntersecting) {
          const ratio = entry.intersectionRatio;
          
          // Apply progressive animation based on how much of the element is visible
          element.style.opacity = ratio;
          
          // Scale effect based on intersection ratio
          const scaleValue = 0.8 + (ratio * 0.2);
          element.style.transform = `scale(${scaleValue})`;
        }
      });
    }, { threshold: [0, 0.25, 0.5, 0.75, 1] });
    
    const observerCallback = (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Determine animation based on element position relative to viewport
          const rect = entry.boundingClientRect;
          const viewportHeight = window.innerHeight;
          
          let direction;
          if (rect.top < viewportHeight * 0.5) {
            direction = 'fromBottom'; // Coming from bottom, animating up
          } else {
            direction = 'fromTop'; // Coming from top, animating down
          }
          
          animateElement(entry.target, direction);
          // Stop observing after animation is triggered
          observer.unobserve(entry.target);
        }
      });
    };
    
    const mainObserver = new IntersectionObserver(observerCallback, observerOptions);
    
    // Setup progressive observer for specific elements
    progressiveElements.forEach(el => {
      progressiveObserver.observe(el);
    });
    
    // Observe all elements with data-animate attribute
    animationElements.forEach(el => {
      mainObserver.observe(el);
    });
    
    // Add scroll listener for parallax effects
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial call for parallax
    handleScroll();
    
    // Cleanup on unmount
    return () => {
      mainObserver.disconnect();
      progressiveObserver.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  return null; // This component doesn't render anything
};

export default ScrollAnimations;