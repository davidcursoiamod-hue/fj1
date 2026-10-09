import { useState, useEffect, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { getPageTransition } from '@/lib/motion';

interface PageTransitionProps {
  children: ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const location = useLocation();
  const [isReduced, setIsReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = () => setIsReduced(mq.matches);
    handler();
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const variants = {
    initial: { opacity: 0, x: isReduced ? 0 : 24 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: isReduced ? 0 : -24 },
  };

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={getPageTransition()}
        className="min-h-0 flex-1"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
