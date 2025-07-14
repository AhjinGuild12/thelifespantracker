import { useEffect, useRef } from "react";

interface StatisticsCardsProps {
  calculations: {
    weeksLived: number;
    weeksRemaining: number;
    lifePercentage: number;
    yearProgress: {
      percentage: number;
      daysPassed: number;
      totalDays: number;
    };
  };
}

export default function StatisticsCards({ calculations }: StatisticsCardsProps) {
  const progressLivedRef = useRef<HTMLDivElement>(null);
  const progressRemainingRef = useRef<HTMLDivElement>(null);
  const progressTotalRef = useRef<HTMLDivElement>(null);
  const progress2025Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Animate progress bars
    if (progressLivedRef.current) {
      progressLivedRef.current.style.width = `${calculations.lifePercentage}%`;
    }
    if (progressRemainingRef.current) {
      progressRemainingRef.current.style.width = `${100 - calculations.lifePercentage}%`;
    }
    if (progressTotalRef.current) {
      progressTotalRef.current.style.width = `${calculations.lifePercentage}%`;
    }
    if (progress2025Ref.current) {
      progress2025Ref.current.style.width = `${calculations.yearProgress.percentage}%`;
    }
  }, [calculations]);

  return (
    <section className="stats-section">
      <div className="stats-grid">
        <div className="stats-card">
          <h3 className="stats-title">Weeks Lived</h3>
          <div className="stats-number">{calculations.weeksLived.toLocaleString()}</div>
          <div className="stats-bar">
            <div ref={progressLivedRef} className="stats-progress"></div>
          </div>
          <div className="stats-label">Accomplished ✓</div>
        </div>
        
        <div className="stats-card">
          <h3 className="stats-title">Weeks Remaining</h3>
          <div className="stats-number">{calculations.weeksRemaining.toLocaleString()}</div>
          <div className="stats-bar">
            <div ref={progressRemainingRef} className="stats-progress remaining"></div>
          </div>
          <div className="stats-label">Opportunity ahead</div>
        </div>
        
        <div className="stats-card">
          <h3 className="stats-title">Life Progress</h3>
          <div className="stats-number">{calculations.lifePercentage}%</div>
          <div className="stats-bar">
            <div ref={progressTotalRef} className="stats-progress"></div>
          </div>
          <div className="stats-label">Of your journey</div>
        </div>
        
        <div className="stats-card">
          <h3 className="stats-title">2025 Progress</h3>
          <div className="stats-number">{calculations.yearProgress.percentage}%</div>
          <div className="stats-bar">
            <div ref={progress2025Ref} className="stats-progress"></div>
          </div>
          <div className="stats-label">This year</div>
        </div>
      </div>
    </section>
  );
}
