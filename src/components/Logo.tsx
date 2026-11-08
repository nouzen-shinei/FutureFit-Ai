import { motion } from 'framer-motion';
import logo from '../assets/logo.png';

export function Logo() {
  return (
    <motion.div
      initial={{ scale: 0.9 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.1 }}
      className="relative"
    >
      <img src={logo} alt="FutureFit AI logo" width="32" height="32" />
    </motion.div>
  );
}
