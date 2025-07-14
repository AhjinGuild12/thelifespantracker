import { useMemo } from "react";

export function useLifeCalculations(birthDate: string) {
  return useMemo(() => {
    const totalLifeWeeks = 4160; // 80 years × 52 weeks
    const currentDate = new Date('2025-07-14');
    
    if (!birthDate) {
      // Return empty state when no birth date is provided
      return {
        weeksLived: 0,
        weeksRemaining: totalLifeWeeks,
        lifePercentage: 0,
        yearProgress: {
          totalDays: 365,
          daysPassed: Math.floor((currentDate.getTime() - new Date(2025, 0, 1).getTime()) / (24 * 60 * 60 * 1000)) + 1,
          percentage: Math.min(Math.round(((Math.floor((currentDate.getTime() - new Date(2025, 0, 1).getTime()) / (24 * 60 * 60 * 1000)) + 1) / 365) * 100), 100)
        }
      };
    }
    
    const birth = new Date(birthDate);
    
    // Validate birth date
    if (isNaN(birth.getTime()) || birth > currentDate) {
      return {
        weeksLived: 0,
        weeksRemaining: totalLifeWeeks,
        lifePercentage: 0,
        yearProgress: {
          totalDays: 365,
          daysPassed: Math.floor((currentDate.getTime() - new Date(2025, 0, 1).getTime()) / (24 * 60 * 60 * 1000)) + 1,
          percentage: Math.min(Math.round(((Math.floor((currentDate.getTime() - new Date(2025, 0, 1).getTime()) / (24 * 60 * 60 * 1000)) + 1) / 365) * 100), 100)
        }
      };
    }
    
    // Calculate exact weeks lived from birth date to current date
    const timeDifference = currentDate.getTime() - birth.getTime();
    const daysLived = Math.floor(timeDifference / (24 * 60 * 60 * 1000));
    const weeksLived = Math.floor(daysLived / 7);
    
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
  }, [birthDate]);
}
