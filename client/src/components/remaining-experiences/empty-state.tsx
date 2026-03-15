import { motion } from "framer-motion";
import { Heart } from "lucide-react";

interface EmptyStateProps {
  onAddPerson: () => void;
}

export default function EmptyState({ onAddPerson }: EmptyStateProps) {
  return (
    <motion.div
      className="exp-empty"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="exp-empty-icon">
        <Heart size={40} strokeWidth={1.5} />
      </div>
      <h2 className="exp-empty-title">
        How many moments do you have left?
      </h2>
      <p className="exp-empty-text">
        Add someone you love to see how many moments you have left together.
        Each one is countable. Each one matters.
      </p>
      <button className="exp-empty-btn" onClick={onAddPerson}>
        Add Someone You Love
      </button>
    </motion.div>
  );
}
