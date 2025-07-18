import { useEffect, useRef, useState } from "react";

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
  birthDate: string;
}

type LifeDisplayMode = 'percentage' | 'weeks' | 'months' | 'years' | 'days' | 'minutes';
type YearDisplayMode = 'percentage' | 'weeks' | 'months' | 'days' | 'hours' | 'minutes';

export default function StatisticsCards({ calculations, birthDate }: StatisticsCardsProps) {
  const progressLivedRef = useRef<HTMLDivElement>(null);
  const progressRemainingRef = useRef<HTMLDivElement>(null);
  const progressTotalRef = useRef<HTMLDivElement>(null);
  const progress2025Ref = useRef<HTMLDivElement>(null);

  const [lifeDisplayMode, setLifeDisplayMode] = useState<LifeDisplayMode>('percentage');
  const [yearDisplayMode, setYearDisplayMode] = useState<YearDisplayMode>('percentage');
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute for real-time countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  // Calculate different time units for life progress with precise real-time values
  const getLifeDisplayValue = () => {
    const { weeksRemaining, lifePercentage } = calculations;
    
    // Calculate precise remaining time based on exact birth date and current time
    const birth = new Date(birthDate || '');
    const endOfLife = new Date(birth.getTime() + (80 * 365.25 * 24 * 60 * 60 * 1000)); // 80 years from birth
    const timeRemaining = endOfLife.getTime() - currentTime.getTime();
    
    if (timeRemaining <= 0 || !birthDate) {
      // Fallback to week-based calculations
      switch (lifeDisplayMode) {
        case 'percentage':
          return { value: `${lifePercentage}%`, label: 'Of your journey' };
        case 'weeks':
          return { value: weeksRemaining.toLocaleString(), label: 'Weeks remaining' };
        case 'months':
          return { value: Math.round(weeksRemaining / 4.35).toLocaleString(), label: 'Months remaining' };
        case 'years':
          return { value: Math.round(weeksRemaining / 52).toLocaleString(), label: 'Years remaining' };
        case 'days':
          return { value: (weeksRemaining * 7).toLocaleString(), label: 'Days remaining' };
        case 'minutes':
          return { value: (weeksRemaining * 7 * 24 * 60).toLocaleString(), label: 'Minutes remaining' };
        default:
          return { value: `${lifePercentage}%`, label: 'Of your journey' };
      }
    }
    
    // Real-time precise calculations
    const minutesRemaining = Math.floor(timeRemaining / (60 * 1000));
    const hoursRemaining = Math.floor(timeRemaining / (60 * 60 * 1000));
    const daysRemaining = Math.floor(timeRemaining / (24 * 60 * 60 * 1000));
    const monthsRemaining = Math.floor(daysRemaining / 30.44);
    const yearsRemaining = Math.floor(daysRemaining / 365.25);
    
    switch (lifeDisplayMode) {
      case 'percentage':
        return { value: `${lifePercentage}%`, label: 'Of your journey' };
      case 'weeks':
        return { value: Math.floor(daysRemaining / 7).toLocaleString(), label: 'Weeks remaining' };
      case 'months':
        return { value: monthsRemaining.toLocaleString(), label: 'Months remaining' };
      case 'years':
        return { value: yearsRemaining.toLocaleString(), label: 'Years remaining' };
      case 'days':
        return { value: daysRemaining.toLocaleString(), label: 'Days remaining' };
      case 'minutes':
        return { value: minutesRemaining.toLocaleString(), label: 'Minutes remaining' };
      default:
        return { value: `${lifePercentage}%`, label: 'Of your journey' };
    }
  };

  // Calculate different time units for year progress with real-time precision
  const getYearDisplayValue = () => {
    const { percentage } = calculations.yearProgress;
    const currentYear = currentTime.getFullYear();
    const endOfYear = new Date(currentYear, 11, 31, 23, 59, 59, 999);
    const timeRemainingInYear = endOfYear.getTime() - currentTime.getTime();
    
    if (timeRemainingInYear <= 0) {
      return { value: '0', label: 'Year complete' };
    }
    
    const minutesRemainingInYear = Math.floor(timeRemainingInYear / (60 * 1000));
    const hoursRemainingInYear = Math.floor(timeRemainingInYear / (60 * 60 * 1000));
    const daysRemainingInYear = Math.floor(timeRemainingInYear / (24 * 60 * 60 * 1000));
    const weeksRemainingInYear = Math.ceil(daysRemainingInYear / 7);
    const monthsRemainingInYear = Math.ceil(daysRemainingInYear / 30.44);
    
    switch (yearDisplayMode) {
      case 'percentage':
        return { value: `${percentage}%`, label: 'This year' };
      case 'weeks':
        return { value: weeksRemainingInYear.toLocaleString(), label: 'Weeks left in year' };
      case 'months':
        return { value: monthsRemainingInYear.toLocaleString(), label: 'Months left in year' };
      case 'days':
        return { value: daysRemainingInYear.toLocaleString(), label: 'Days left in year' };
      case 'hours':
        return { value: hoursRemainingInYear.toLocaleString(), label: 'Hours left in year' };
      case 'minutes':
        return { value: minutesRemainingInYear.toLocaleString(), label: 'Minutes left in year' };
      default:
        return { value: `${percentage}%`, label: 'This year' };
    }
  };

  // Cycle through display modes
  const cycleLifeDisplayMode = () => {
    const modes: LifeDisplayMode[] = ['percentage', 'weeks', 'months', 'years', 'days', 'minutes'];
    const currentIndex = modes.indexOf(lifeDisplayMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setLifeDisplayMode(modes[nextIndex]);
  };

  const cycleYearDisplayMode = () => {
    const modes: YearDisplayMode[] = ['percentage', 'weeks', 'months', 'days', 'hours', 'minutes'];
    const currentIndex = modes.indexOf(yearDisplayMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setYearDisplayMode(modes[nextIndex]);
  };

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
        
        <div className="stats-card clickable" onClick={cycleLifeDisplayMode}>
          <h3 className="stats-title">Life Progress</h3>
          <div className="stats-number">{getLifeDisplayValue().value}</div>
          <div className="stats-bar">
            <div ref={progressTotalRef} className="stats-progress"></div>
          </div>
          <div className="stats-label">{getLifeDisplayValue().label}</div>
        </div>
        
        <div className="stats-card clickable" onClick={cycleYearDisplayMode}>
          <h3 className="stats-title">{new Date().getFullYear()} Progress</h3>
          <div className="stats-number">{getYearDisplayValue().value}</div>
          <div className="stats-bar">
            <div ref={progress2025Ref} className="stats-progress"></div>
          </div>
          <div className="stats-label">{getYearDisplayValue().label}</div>
        </div>
      </div>
    </section>
  );
}
