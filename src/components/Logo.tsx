import { motion } from 'framer-motion';
import logo from './public/Blue and Purple Professional Gradient Modern Tech Company Logo_20250404_170423_0000.png'; // Update this path to your PNG logo

export function Logo() {
  return (
    <motion.div
      initial={{ scale: 0.9 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.1 }}
      className="relative"
    >
      <img
        src={logo}
        alt="App Logo"
        width="32"
        height="32"
        className="text-blue-400"
      />
    </motion.div>
  );
}