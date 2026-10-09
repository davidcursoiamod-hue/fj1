import type { Transition } from 'framer-motion';

export const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const springEnter: Transition = {
  type: 'spring',
  stiffness: 380,
  damping: 32,
};

export const springSoft: Transition = {
  type: 'spring',
  stiffness: 260,
  damping: 28,
};

export const pageTransition: Transition = {
  type: 'spring',
  stiffness: 300,
  damping: 30,
};

export const fadeOnly: Transition = {
  duration: 0.12,
  ease: 'easeOut',
};

export function getEnterTransition(): Transition {
  return prefersReducedMotion() ? fadeOnly : springEnter;
}

export function getPageTransition(): Transition {
  return prefersReducedMotion() ? fadeOnly : pageTransition;
}

export const staggerConfig = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: prefersReducedMotion() ? 0 : 0.04,
    },
  },
};

export const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  show: {
    opacity: 1,
    y: 0,
    transition: prefersReducedMotion() ? fadeOnly : springEnter,
  },
};

export const sharedAxisVariants = {
  initial: { opacity: 0, x: prefersReducedMotion() ? 0 : 24 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: prefersReducedMotion() ? 0 : -24 },
};

export const verticalAxisVariants = {
  initial: { opacity: 0, y: prefersReducedMotion() ? 0 : 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: prefersReducedMotion() ? 0 : -20 },
};
