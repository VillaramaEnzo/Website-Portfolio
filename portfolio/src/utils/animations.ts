/**
 * Centralized Animation Configurations
 * 
 * This file contains all reusable animation configurations organized by type.
 * Import specific animations as needed to maintain consistency across the project.
 */

import { Variants, Transition } from 'motion/react'

// ============================================================================
// EASING FUNCTIONS
// ============================================================================

export const easings = {
  // Standard Material Design easing
  standard: [0.4, 0, 0.2, 1] as [number, number, number, number],
  
  // Smooth, elegant easing (used in drawer, landonorris.com style)
  smooth: [0.16, 1, 0.3, 1] as [number, number, number, number],
  
  // Elastic easing for playful animations
  elastic: [0.22, 1, 0.36, 1] as [number, number, number, number],
  
  // Decelerate (ease-out)
  decelerate: [0, 0, 0.2, 1] as [number, number, number, number],
  
  // Accelerate (ease-in)
  accelerate: [0.4, 0, 1, 1] as [number, number, number, number],
  
  // Sharp (ease-in-out)
  sharp: [0.4, 0, 0.6, 1] as [number, number, number, number],
} as const

// ============================================================================
// TRANSITION CONFIGURATIONS
// ============================================================================

export const transitions = {
  // Fast transitions (0.3s)
  fast: {
    duration: 0.3,
    ease: 'easeInOut' as const,
  },
  
  // Standard transitions (0.5s)
  standard: {
    duration: 0.5,
    ease: easings.standard,
  },
  
  // Smooth transitions (0.6-0.7s) - for drawer, major UI changes
  smooth: {
    duration: 0.7,
    ease: easings.smooth,
  },
  
  // Medium transitions (0.4s)
  medium: {
    duration: 0.4,
    ease: easings.smooth,
  },
  
  // Slow transitions (1s+)
  slow: {
    duration: 1,
    ease: easings.smooth,
  },
  
  // Page transitions
  page: {
    duration: 0.3,
    ease: 'easeInOut' as const,
  },
  
  // Text fade in
  textFade: {
    duration: 0.5,
    ease: easings.decelerate,
  },
  
  // Button hover
  buttonHover: {
    duration: 0.3,
    ease: easings.elastic,
  },
  
  // Scale animations
  scale: {
    duration: 0.5,
    ease: easings.elastic,
  },
} as const

// ============================================================================
// FADE ANIMATIONS
// ============================================================================

export const fade = {
  // Simple fade in/out
  variants: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  } as Variants,
  
  // Fade with transition
  transition: transitions.standard,
  
  // Fade in from bottom
  fadeUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
    transition: transitions.textFade,
  },
  
  // Fade in from top
  fadeDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: transitions.textFade,
  },
  
  // Container fade (for preloader, overlays)
  container: {
    visible: {
      opacity: 1,
      transition: transitions.standard,
    },
    hidden: {
      opacity: 0,
      transition: transitions.standard,
    },
  } as Variants,
} as const

// ============================================================================
// SLIDE ANIMATIONS
// ============================================================================

export const slide = {
  // Slide in from right (drawer)
  fromRight: {
    initial: { x: '100%' },
    animate: { x: 0 },
    exit: { x: '100%' },
    transition: transitions.smooth,
  },
  
  // Slide in from left
  fromLeft: {
    initial: { x: '-100%' },
    animate: { x: 0 },
    exit: { x: '-100%' },
    transition: transitions.smooth,
  },
  
  // Slide in from bottom
  fromBottom: {
    initial: { y: '100%' },
    animate: { y: 0 },
    exit: { y: '100%' },
    transition: transitions.smooth,
  },
  
  // Slide in from top
  fromTop: {
    initial: { y: '-100%' },
    animate: { y: 0 },
    exit: { y: '-100%' },
    transition: transitions.smooth,
  },
  
  // Horizontal slide (for text transitions)
  horizontal: (direction: 'left' | 'right' = 'right') => ({
    initial: { opacity: 0, x: direction === 'right' ? 20 : -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: direction === 'right' ? -20 : 20 },
    transition: transitions.fast,
  }),
  
  // Staggered horizontal slide (for lists)
  staggeredHorizontal: (index: number, baseDelay: number = 0.3, stagger: number = 0.05) => ({
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
    transition: {
      delay: baseDelay + index * stagger,
      duration: 0.4,
      ease: easings.smooth,
    },
  }),
} as const

// ============================================================================
// SCALE ANIMATIONS
// ============================================================================

export const scale = {
  // Simple scale
  variants: {
    hidden: { scale: 0 },
    visible: { scale: 1 },
  } as Variants,
  
  // Scale with bounce
  bounce: {
    scale: [1, 1.05, 1] as [number, number, number],
    transition: transitions.scale,
  },
  
  // Button hover scale
  buttonHover: {
    scale: 1.05,
    transition: transitions.buttonHover,
  },
  
  // Button tap scale
  buttonTap: {
    scale: 0.95,
    transition: transitions.fast,
  },
} as const

// ============================================================================
// COMBINED ANIMATIONS
// ============================================================================

export const combined = {
  // Fade + Slide Up (common for text)
  fadeSlideUp: {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 30 },
    transition: {
      delay: 0.2,
      ...transitions.textFade,
    },
  },
  
  // Fade + Slide Horizontal (for drawer content)
  fadeSlideHorizontal: (index: number = 0) => ({
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
    transition: {
      delay: 0.3 + index * 0.05,
      duration: 0.4,
      ease: easings.smooth,
    },
  }),
  
  // Fade + Scale (for modals, popups)
  fadeScale: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    transition: transitions.standard,
  },
} as const

// ============================================================================
// SPECIFIC COMPONENT ANIMATIONS
// ============================================================================

export const components = {
  // Drawer animations
  drawer: {
    panel: slide.fromRight,
    content: combined.fadeSlideUp,
    link: (index: number) => slide.staggeredHorizontal(index, 0.3, 0.05),
    navLink: (index: number) => slide.staggeredHorizontal(index, 0.25, 0.03),
  },
  
  // Preloader animations
  preloader: {
    container: fade.container,
    text: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: transitions.textFade,
    },
    dots: {
      opacity: [0, 1] as number[],
      transition: {
        duration: 0.5,
        repeat: Infinity,
        repeatType: "reverse" as const,
      },
    },
  },
  
  // Landing text animations
  landingText: {
    audienceButtons: {
      initial: { opacity: 0, y: -20 },
      animate: { opacity: 1, y: 0 },
      transition: transitions.standard,
    },
    text: (direction: 'left' | 'right' = 'right') => slide.horizontal(direction),
    textFade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: transitions.fast,
    },
    buttonActive: scale.bounce,
    buttonHover: scale.buttonHover,
    buttonTap: scale.buttonTap,
  },
  
  // Navigation animations
  nav: {
    fade: {
      duration: 0.3,
      ease: easings.standard,
    },
    activeLinkTransition: { type: 'spring', stiffness: 500, damping: 30 },
  },
  
  // Hamburger menu animations
  hamburger: {
    lineTransition: {
      duration: 0.3,
      ease: easings.elastic,
    },
  },
  
  // Page transitions
  page: {
    transition: transitions.page,
  },
} as const

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Create a staggered animation delay
 */
export const createStaggerDelay = (index: number, baseDelay: number = 0, stagger: number = 0.1): number => {
  return baseDelay + index * stagger
}

/**
 * Create a transition with custom duration and easing
 */
export const createTransition = (duration: number, ease: [number, number, number, number] | string): Transition => {
  return {
    duration,
    ease: typeof ease === 'string' ? easings[ease as keyof typeof easings] : ease,
  }
}

/**
 * Create fade variants with custom transition
 */
export const createFadeVariants = (transition: Transition = transitions.standard): Variants => {
  return {
    hidden: { opacity: 0, transition },
    visible: { opacity: 1, transition },
  }
}

