import { motion } from 'framer-motion';
import { FiArrowLeft } from 'react-icons/fi';

const BackArrow = () => {
  const handleClick = () => {
    // Implement logic to navigate back (e.g., using history API)
    window.history.back();
  };

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      className="relative p-2 rounded-full bg-zinc-100 hover:shadow-md z-50 mb-2"
      onClick={handleClick}
    >
      <FiArrowLeft size={30} color="currentColor" />
    </motion.button>
  );
};

export default BackArrow;