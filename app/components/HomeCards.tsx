import React from "react";
import { motion } from "framer-motion";

interface CardProps {
  id: number;
  imgUrl: string;
  subheading: string;
  heading: string;
  customContent?: {
    heading: string;
    description: string;
    buttonLabel: string;
    buttonLink: string;
  };
}

const HomeCards: React.FC<CardProps> = ({ cards }) => {
  const cardVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0, transition: { duration: 0.3 } },
    hover: { scale: 1.05, transition: { duration: 0.2, ease: "easeInOut" } },
  };

  return (
    
    <div className="p-8">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 px-4 pb-24 pt-12 md:grid-cols-12">
            <h2 className="col-span-1 text-3xl font-bold md:col-span-4">
              SERVICES
            </h2>
            <div className="col-span-1 md:col-span-8">
              <p className="mb-4 text-xl text-zinc-400 font-light md:text-2xl">
                At Artcadia, we offer more than just art. We aim to make your space feel like home, with our expertise, we help you plan and organize your space to make it fit for you.
              </p>
        
            </div>
     </div>
     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">    
      {cards.map((card) => (
        <motion.div
          key={card.id}
          variants={cardVariants}
          initial="initial"
          animate="animate"
          whileHover="hover"
          className="w-full rounded-lg overflow-hidden shadow-md bg-zinc-900 text-zinc-100 cursor-pointer"
          onClick={() => window.location.href = card.customContent?.buttonLink || ''}
        >
          <img src={card.imgUrl} alt={card.heading} className="w-full h-48 object-cover" />
          <div className="p-4">
            <p className="text-zinc-500 text-sm mb-2">{card.subheading}</p>
            <h3 className="text-lg font-semibold mb-2">{card.heading}</h3>
            {card.customContent && (
              <p className="text-zinc-500 mb-4">{card.customContent.description}</p>
            )}
          </div>
        </motion.div>
      ))}
    </div>
    </div>
  );
};

export default HomeCards;