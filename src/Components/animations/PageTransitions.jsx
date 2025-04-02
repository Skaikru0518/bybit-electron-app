import { motion } from 'framer-motion';

const PageTransitions = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }} // Fentről indul
      animate={{ opacity: 1, y: 0 }} // Középre érkezik
      exit={{ opacity: 0, y: 50 }} // Lefelé tűnik el
      transition={{
        duration: 0.3, // Az animáció hossza
        ease: 'easeOut', // Az animáció típusa
        type: 'tween', // Az animáció stílusa
      }}
      className="relative overflow-hidden"
    >
      {/* Háttér réteg */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#130f40] to-black -z-10"></div>

      {/* Tartalom */}
      {children}
    </motion.div>
  );
};

export default PageTransitions;
