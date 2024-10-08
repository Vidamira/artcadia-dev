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

const HomeCards: React.FC<CardProps> = ({ id, imgUrl, subheading, heading, customContent }) => {
  const cardVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0, transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      key={id}
      className="w-full rounded-lg overflow-hidden shadow-md bg-white md:w-1/3"
    >
      <img src={imgUrl} alt={heading} className="w-full h-48 object-cover" />
      <div className="p-4">
        <p className="text-gray-500 text-sm mb-2">{subheading}</p>
        <h3 className="text-lg font-semibold mb-2">{heading}</h3>
        {customContent && (
          <>
            <p className="text-gray-700 mb-4">{customContent.description}</p>
            <a
              href={customContent.buttonLink}
              className="inline-block px-4 py-2 text-sm font-medium text-center text-white bg-blue-500 hover:bg-blue-700 rounded-md shadow-sm"
            >
              {customContent.buttonLabel}
            </a>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default HomeCards;