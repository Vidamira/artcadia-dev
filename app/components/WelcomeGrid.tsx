import React from 'react';
import { motion } from 'framer-motion';
import BubbleFont from './animations/BubbleFont';

function WelcomeGrid() {
  return (
    <section className="bg-zinc-950 text-zinc-100  px-4 mx-8">
      <motion.div
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.7 }}
          className='relative flex justify-between w-full items-center'
        >
          <div className="container mx-auto py-12 grid grid-cols-1 md:grid-cols-2 gap-1.5">
            <p className="text-lg max-w-300 order-1 md:text-right md:order-2">Artcadia Gallery offers a curated selection of contemporary art, helping you find the perfect piece for your space.</p>
            <div className='overflow-hidden py-4'>
             <BubbleFont />
            </div>
          </div>
        </motion.div>
      
    </section>
  );
}

export default WelcomeGrid;
