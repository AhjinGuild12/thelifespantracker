import { motion } from "framer-motion";

interface SummaryBannerProps {
  summaries: string[];
}

export default function SummaryBanner({ summaries }: SummaryBannerProps) {
  if (summaries.length === 0) return null;

  return (
    <motion.div
      className="exp-summary"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      {summaries.map((text, i) => (
        <p key={i} className="exp-summary-line">
          {text}
        </p>
      ))}
    </motion.div>
  );
}
