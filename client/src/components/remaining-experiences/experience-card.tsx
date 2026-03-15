import { motion } from "framer-motion";
import type { ExperienceResult } from "@/types/experiences";
import ExperienceDotGrid from "./experience-dot-grid";

interface ExperienceCardProps {
  result: ExperienceResult;
  index: number;
}

export default function ExperienceCard({ result, index }: ExperienceCardProps) {
  return (
    <motion.div
      className="exp-card"
      style={{ borderLeftColor: result.personColor }}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <div className="exp-card-header">
        <span
          className="exp-card-big-number"
          style={{ color: result.personColor }}
        >
          {result.remaining}
        </span>
        <div className="exp-card-meta">
          <span className="exp-card-experience">{result.experienceName}</span>
          <span className="exp-card-person">with {result.personName}</span>
        </div>
      </div>

      <ExperienceDotGrid
        remaining={result.remaining}
        elapsed={result.elapsed}
        color={result.personColor}
      />
    </motion.div>
  );
}
