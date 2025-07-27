'use client'

/**
 * Enhanced Animation Configuration System
 * Task 19.1: Refined timing and easing for all animations
 */

// Custom easing curves for different animation types
export const EASING_CURVES = {
  // Entrance animations - welcoming and smooth
  entrance: {
    gentle: 'power1.out',
    smooth: 'power2.out', 
    dramatic: 'power3.out',
    elastic: 'elastic.out(1, 0.5)',
    back: 'back.out(1.7)',
    bounce: 'bounce.out'
  },
  
  // Exit animations - quick and decisive
  exit: {
    quick: 'power2.in',
    smooth: 'power2.inOut',
    dramatic: 'power3.in',
    snap: 'power4.in'
  },
  
  // Micro-interactions - responsive and snappy
  micro: {
    hover: 'power2.out',
    click: 'back.out(1.7)',
    focus: 'power1.out',
    pulse: 'sine.inOut'
  },
  
  // Transitions - seamless flow
  transition: {
    seamless: 'power2.inOut',
    fluid: 'power1.inOut',
    cinematic: 'power3.inOut',
    organic: 'sine.inOut'
  }
}

// Refined timing configurations
export const TIMING_CONFIG = {
  // Section transitions - optimized for flow
  sections: {
    hero: {
      enter: { duration: 1.8, delay: 0 },
      exit: { duration: 1.2, delay: 0 },
      letterStagger: 0.08,
      wordStagger: 0.15
    },
    about: {
      enter: { duration: 1.4, delay: 0.1 },
      exit: { duration: 0.9, delay: 0 },
      elementStagger: 0.12,
      metricStagger: 0.2
    },
    features: {
      enter: { duration: 1.6, delay: 0.15 },
      exit: { duration: 1.0, delay: 0 },
      cardStagger: 0.15,
      iconDelay: 0.3
    },
    results: {
      enter: { duration: 2.0, delay: 0.2 },
      exit: { duration: 1.1, delay: 0 },
      counterStagger: 0.25,
      counterDuration: 2.5
    },
    testimonials: {
      enter: { duration: 1.3, delay: 0.1 },
      exit: { duration: 0.8, delay: 0 },
      cardStagger: 0.18,
      rotationInterval: 4000
    },
    pricing: {
      enter: { duration: 1.5, delay: 0.12 },
      exit: { duration: 0.9, delay: 0 },
      cardStagger: 0.1,
      highlightDelay: 0.5
    },
    faq: {
      enter: { duration: 1.2, delay: 0.08 },
      exit: { duration: 0.7, delay: 0 },
      itemStagger: 0.1,
      accordionSpeed: 0.4
    },
    cta: {
      enter: { duration: 2.2, delay: 0.25 },
      exit: { duration: 1.0, delay: 0 },
      buttonPulse: 2.0,
      trustStagger: 0.15
    }
  },
  
  // Micro-interactions - snappy and responsive
  microInteractions: {
    hover: { duration: 0.3, ease: EASING_CURVES.micro.hover },
    click: { duration: 0.15, ease: EASING_CURVES.micro.click },
    focus: { duration: 0.2, ease: EASING_CURVES.micro.focus },
    loading: { duration: 1.5, ease: EASING_CURVES.micro.pulse }
  },
  
  // Background elements - subtle and continuous
  background: {
    gradientTransition: { duration: 2.5, ease: EASING_CURVES.transition.organic },
    particleFloat: { duration: 8.0, ease: 'none' },
    particleSpawn: { duration: 0.8, ease: EASING_CURVES.entrance.gentle }
  }
}

// Enhanced animation properties with refined values
export const ANIMATION_PROPERTIES = {
  hero: {
    enter: {
      opacity: 1,
      scale: 1,
      y: 0,
      rotationX: 0,
      filter: 'blur(0px)'
    },
    exit: {
      opacity: 0,
      scale: 1.1,
      y: -80,
      rotationX: -15,
      filter: 'blur(8px)'
    },
    letterAnimation: {
      from: { opacity: 0, y: 100, rotationX: -90, scale: 0.5 },
      to: { opacity: 1, y: 0, rotationX: 0, scale: 1 }
    }
  },
  
  about: {
    enter: {
      opacity: 1,
      scale: 1,
      y: 0,
      rotationY: 0,
      filter: 'blur(0px)'
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: -40,
      rotationY: 5,
      filter: 'blur(4px)'
    },
    metrics: {
      from: { opacity: 0, scale: 0.3, rotationZ: 180 },
      to: { opacity: 1, scale: 1, rotationZ: 0 }
    }
  },
  
  features: {
    enter: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotationY: 0,
      filter: 'blur(0px)'
    },
    exit: {
      opacity: 0,
      y: -50,
      scale: 0.9,
      rotationY: -10,
      filter: 'blur(6px)'
    },
    cards: {
      from: { opacity: 0, y: 120, scale: 0.8, rotationX: 45 },
      to: { opacity: 1, y: 0, scale: 1, rotationX: 0 },
      hover: { y: -12, scale: 1.03, rotationX: -2 }
    }
  },
  
  results: {
    enter: {
      opacity: 1,
      scale: 1,
      rotationX: 0,
      y: 0,
      filter: 'blur(0px)'
    },
    exit: {
      opacity: 0,
      scale: 1.15,
      rotationX: 20,
      y: -60,
      filter: 'blur(10px)'
    },
    counters: {
      from: { opacity: 0, scale: 0.2, rotationZ: -180 },
      to: { opacity: 1, scale: 1, rotationZ: 0 }
    }
  },
  
  testimonials: {
    enter: {
      opacity: 1,
      x: 0,
      rotationY: 0,
      scale: 1,
      filter: 'blur(0px)'
    },
    exit: {
      opacity: 0,
      x: -100,
      rotationY: -20,
      scale: 0.9,
      filter: 'blur(5px)'
    },
    cards: {
      from: { opacity: 0, x: 150, rotationY: 30, scale: 0.8 },
      to: { opacity: 1, x: 0, rotationY: 0, scale: 1 }
    }
  },
  
  pricing: {
    enter: {
      opacity: 1,
      y: 0,
      rotationX: 0,
      scale: 1,
      filter: 'blur(0px)'
    },
    exit: {
      opacity: 0,
      y: 80,
      rotationX: 15,
      scale: 0.85,
      filter: 'blur(6px)'
    },
    cards: {
      from: { opacity: 0, y: 100, rotationX: 90, scale: 0.7 },
      to: { opacity: 1, y: 0, rotationX: 0, scale: 1 },
      highlight: { scale: 1.05, y: -8, rotationX: -3 }
    }
  },
  
  faq: {
    enter: {
      opacity: 1,
      scaleY: 1,
      y: 0,
      filter: 'blur(0px)'
    },
    exit: {
      opacity: 0,
      scaleY: 0.3,
      y: -30,
      filter: 'blur(4px)'
    },
    items: {
      from: { opacity: 0, height: 0, y: -20 },
      to: { opacity: 1, height: 'auto', y: 0 }
    }
  },
  
  cta: {
    enter: {
      opacity: 1,
      scale: 1,
      rotationZ: 0,
      y: 0,
      filter: 'blur(0px)'
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      rotationZ: 5,
      y: 50,
      filter: 'blur(8px)'
    },
    button: {
      pulse: { scale: 1.05, boxShadow: '0 0 30px rgba(59, 130, 246, 0.6)' },
      click: { scale: 0.95, rotationZ: 1 }
    }
  }
}

// Micro-interaction configurations
export const MICRO_INTERACTIONS = {
  buttons: {
    primary: {
      idle: { scale: 1, rotationZ: 0, boxShadow: '0 4px 20px rgba(59, 130, 246, 0.3)' },
      hover: { scale: 1.05, rotationZ: -1, boxShadow: '0 8px 30px rgba(59, 130, 246, 0.5)' },
      active: { scale: 0.98, rotationZ: 0.5, boxShadow: '0 2px 10px rgba(59, 130, 246, 0.7)' },
      focus: { boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.3)' }
    },
    secondary: {
      idle: { scale: 1, opacity: 0.8 },
      hover: { scale: 1.02, opacity: 1 },
      active: { scale: 0.98, opacity: 0.9 }
    }
  },
  
  cards: {
    feature: {
      idle: { y: 0, scale: 1, rotationX: 0, boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)' },
      hover: { y: -12, scale: 1.03, rotationX: -2, boxShadow: '0 20px 40px rgba(59, 130, 246, 0.2)' },
      focus: { boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.5)' }
    },
    testimonial: {
      idle: { scale: 1, rotationY: 0 },
      hover: { scale: 1.02, rotationY: -1 },
      active: { scale: 0.98, rotationY: 1 }
    },
    pricing: {
      idle: { y: 0, scale: 1, rotationX: 0 },
      hover: { y: -8, scale: 1.02, rotationX: -1 },
      highlight: { y: -12, scale: 1.05, rotationX: -2, boxShadow: '0 25px 50px rgba(139, 92, 246, 0.3)' }
    }
  },
  
  navigation: {
    indicator: {
      idle: { scale: 1, opacity: 0.5 },
      active: { scale: 1.3, opacity: 1 },
      hover: { scale: 1.1, opacity: 0.8 }
    },
    dot: {
      idle: { scale: 1, backgroundColor: 'rgba(255, 255, 255, 0.3)' },
      active: { scale: 1.5, backgroundColor: 'rgba(59, 130, 246, 1)' },
      hover: { scale: 1.2, backgroundColor: 'rgba(255, 255, 255, 0.6)' }
    }
  },
  
  text: {
    title: {
      focus: { textShadow: '0 0 20px rgba(59, 130, 246, 0.5)' },
      hover: { textShadow: '0 0 10px rgba(255, 255, 255, 0.3)' }
    },
    link: {
      idle: { color: 'rgb(147, 197, 253)', textDecoration: 'none' },
      hover: { color: 'rgb(255, 255, 255)', textDecoration: 'underline' },
      active: { color: 'rgb(59, 130, 246)' }
    }
  }
}

// Performance-aware animation settings
export const PERFORMANCE_SETTINGS = {
  high: {
    enableParticles: true,
    enableBlur: true,
    enableShadows: true,
    staggerAmount: 1.0,
    animationQuality: 'high'
  },
  medium: {
    enableParticles: true,
    enableBlur: false,
    enableShadows: true,
    staggerAmount: 0.7,
    animationQuality: 'medium'
  },
  low: {
    enableParticles: false,
    enableBlur: false,
    enableShadows: false,
    staggerAmount: 0.3,
    animationQuality: 'low'
  }
}

// Transition refinements between sections
export const SECTION_TRANSITIONS = {
  // Seamless flow between adjacent sections
  'hero-to-about': {
    overlap: 0.3,
    ease: EASING_CURVES.transition.cinematic,
    duration: 1.5,
    properties: {
      hero: { opacity: 0, scale: 1.2, y: -100, filter: 'blur(8px)' },
      about: { opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }
    }
  },
  
  'about-to-features': {
    overlap: 0.25,
    ease: EASING_CURVES.transition.fluid,
    duration: 1.3,
    properties: {
      about: { opacity: 0, scale: 0.9, y: -50, rotationY: 10 },
      features: { opacity: 1, scale: 1, y: 0, rotationY: 0 }
    }
  },
  
  'features-to-results': {
    overlap: 0.4,
    ease: EASING_CURVES.transition.dramatic,
    duration: 1.8,
    properties: {
      features: { opacity: 0, scale: 0.8, y: -80, rotationX: 15 },
      results: { opacity: 1, scale: 1, y: 0, rotationX: 0 }
    }
  },
  
  'results-to-testimonials': {
    overlap: 0.2,
    ease: EASING_CURVES.transition.seamless,
    duration: 1.2,
    properties: {
      results: { opacity: 0, scale: 1.1, x: -100, rotationY: -20 },
      testimonials: { opacity: 1, scale: 1, x: 0, rotationY: 0 }
    }
  },
  
  'testimonials-to-pricing': {
    overlap: 0.3,
    ease: EASING_CURVES.transition.cinematic,
    duration: 1.6,
    properties: {
      testimonials: { opacity: 0, scale: 0.9, x: -150, rotationY: -30 },
      pricing: { opacity: 1, scale: 1, x: 0, rotationY: 0 }
    }
  },
  
  'pricing-to-faq': {
    overlap: 0.2,
    ease: EASING_CURVES.transition.fluid,
    duration: 1.1,
    properties: {
      pricing: { opacity: 0, scale: 0.85, y: 100, rotationX: 20 },
      faq: { opacity: 1, scale: 1, y: 0, rotationX: 0 }
    }
  },
  
  'faq-to-cta': {
    overlap: 0.4,
    ease: EASING_CURVES.transition.dramatic,
    duration: 2.0,
    properties: {
      faq: { opacity: 0, scaleY: 0.2, y: -50 },
      cta: { opacity: 1, scale: 1, y: 0, rotationZ: 0 }
    }
  }
}