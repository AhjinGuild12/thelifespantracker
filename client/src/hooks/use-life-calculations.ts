import { useMemo } from "react";

export function useLifeCalculations(age: number) {
  return useMemo(() => {
    const totalLifeWeeks = 4160; // 80 years × 52 weeks
    const weeksPerYear = 52;
    const currentDate = new Date('2025-07-14');
    
    // Calculate weeks lived
    const weeksLived = age > 0 ? Math.floor(age * weeksPerYear) : 0;
    const weeksRemaining = Math.max(0, totalLifeWeeks - weeksLived);
    const lifePercentage = weeksLived > 0 ? Math.min(Math.round((weeksLived / totalLifeWeeks) * 100), 100) : 0;
    
    // Calculate 2025 progress
    const startOfYear = new Date(2025, 0, 1);
    const totalDays = 365; // 2025 is not a leap year
    const daysPassed = Math.floor((currentDate.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000)) + 1;
    const yearProgress = {
      totalDays,
      daysPassed,
      percentage: Math.min(Math.round((daysPassed / totalDays) * 100), 100)
    };
    
    return {
      weeksLived,
      weeksRemaining,
      lifePercentage,
      yearProgress
    };
  }, [age]);
}
