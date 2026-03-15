import { motion } from "framer-motion";

interface ExperienceDotGridProps {
  remaining: number;
  elapsed: number;
  color: string;
}

const DOT_THRESHOLD = 100;

export default function ExperienceDotGrid({
  remaining,
  elapsed,
  color,
}: ExperienceDotGridProps) {
  const total = remaining + elapsed;

  if (total === 0) return null;

  // Condensed progress bar for high-frequency experiences
  if (total > DOT_THRESHOLD) {
    const elapsedPercent = Math.round((elapsed / total) * 100);
    const remainingPercent = 100 - elapsedPercent;

    return (
      <div className="exp-grid-bar">
        <div className="exp-grid-bar-track">
          <div
            className="exp-grid-bar-elapsed"
            style={{ width: `${elapsedPercent}%` }}
          />
          <div
            className="exp-grid-bar-remaining"
            style={{ width: `${remainingPercent}%`, backgroundColor: color }}
          />
        </div>
        <div className="exp-grid-bar-labels">
          <span className="exp-grid-bar-label">{elapsed} past</span>
          <span className="exp-grid-bar-label exp-grid-bar-label--remaining">
            {remaining} left
          </span>
        </div>
      </div>
    );
  }

  // Dot grid for countable experiences
  return (
    <div className="exp-dot-grid">
      {Array.from({ length: elapsed }).map((_, i) => (
        <div key={`e-${i}`} className="exp-dot exp-dot--elapsed" />
      ))}

      {remaining > 0 && (
        <motion.div
          className="exp-dot exp-dot--current"
          style={{ backgroundColor: color }}
          animate={{ scale: [1, 1.3, 1] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}

      {Array.from({ length: Math.max(0, remaining - 1) }).map((_, i) => (
        <div
          key={`r-${i}`}
          className="exp-dot exp-dot--remaining"
          style={{ borderColor: color }}
        />
      ))}
    </div>
  );
}
