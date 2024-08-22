import React from 'react';
import { motion } from 'framer-motion';

const DURATION = 0.25;
const STAGGER = 0.025;

const FlipLink = ({ href, children }) => {
  return (
    <motion.a
      href={href}
      className="relative block overflow-hidden whitespace-nowrap text-zinc-800 mb-10 text-4xl font-black uppercase sm:text-4xl md:text-5xl lg:text-6xl"
      style={{ lineHeight: 0.9 }}
      initial="initial"
      whileHover="hovered"
    >
      <div>
        {children.split('').map((l, i) => (
          <motion.span
            key={i}
            variants={{
              initial: { y: 0 },
              hovered: { y: '-100%' },
            }}
            transition={{ duration: DURATION, ease: 'easeInOut', delay: STAGGER * i }}
            className="inline-block"
          >
            {l}
          </motion.span>
        ))}
      </div>
      <div className="absolute inset-0">
        {children.split('').map((l, i) => (
          <motion.span
            key={i}
            variants={{
              initial: { y: '100%' },
              hovered: { y: 0 },
            }}
            transition={{ duration: DURATION, ease: 'easeInOut', delay: STAGGER * i }}
            className="inline-block"
          >
            {l}
          </motion.span>
        ))}
      </div>
    </motion.a>
  );
};

export default FlipLink;