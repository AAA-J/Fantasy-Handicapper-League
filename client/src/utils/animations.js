// Animation variants for Framer Motion
export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
};

export const slideInRight = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 }
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 }
};

export const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const bounceIn = {
  initial: { opacity: 0, scale: 0.3 },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 30
    }
  },
  exit: { opacity: 0, scale: 0.3 }
};

export const slideUp = {
  initial: { opacity: 0, y: 50 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 50 }
};

export const rotateIn = {
  initial: { opacity: 0, rotate: -180 },
  animate: { opacity: 1, rotate: 0 },
  exit: { opacity: 0, rotate: 180 }
};

// Transition presets
export const springTransition = {
  type: "spring",
  stiffness: 300,
  damping: 30
};

export const smoothTransition = {
  duration: 0.3,
  ease: "easeInOut"
};

export const quickTransition = {
  duration: 0.2,
  ease: "easeOut"
};

// Hover animations
export const hoverScale = {
  whileHover: { scale: 1.05 },
  whileTap: { scale: 0.95 }
};

export const hoverLift = {
  whileHover: { y: -2 },
  transition: { duration: 0.2 }
};

export const hoverGlow = {
  whileHover: { 
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
    y: -2
  },
  transition: { duration: 0.2 }
};

// Loading animations
export const pulse = {
  animate: {
    opacity: [0.5, 1, 0.5],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

export const spin = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "linear"
    }
  }
};

export const bounce = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 0.6,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// Page transitions
export const pageTransition = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
  transition: { duration: 0.3 }
};

export const modalTransition = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 },
  transition: { type: "spring", duration: 0.3 }
};

// List animations
export const listItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 }
};

export const listContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

// Card animations
export const cardHover = {
  whileHover: {
    y: -4,
    boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
    transition: { duration: 0.2 }
  }
};

export const cardTap = {
  whileTap: { scale: 0.98 }
};

// Button animations
export const buttonHover = {
  whileHover: { 
    scale: 1.02,
    transition: { duration: 0.2 }
  },
  whileTap: { scale: 0.98 }
};

export const buttonPress = {
  whileTap: { scale: 0.95 }
};

// Success animations
export const successBounce = {
  initial: { scale: 0 },
  animate: { 
    scale: [0, 1.2, 1],
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

export const checkmarkDraw = {
  initial: { pathLength: 0 },
  animate: { 
    pathLength: 1,
    transition: {
      duration: 0.5,
      ease: "easeInOut"
    }
  }
};
