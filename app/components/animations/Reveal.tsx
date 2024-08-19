import React, { useRef, useEffect } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';

function Reveal({ children }) {
  const ref = useRef(null);
  const controls = useAnimation();
  const isInView = useInView(ref, { once: true });

  const variants = {
    initial: { opacity: 0, y: 70 },
    animate: { opacity: 1, y: 0 },
  };

  useEffect(() => {
    if (isInView) {
      controls.start('animate');
    }
  }, [isInView, controls]);

  return (
    <motion.div
      ref={ref}
      initial="initial"
      animate={controls}
      variants={variants}
      transition={{ duration: 0.5, delay: 0.1, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  );
}

export default Reveal;