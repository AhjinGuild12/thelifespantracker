import { useMemo } from "react";

export function useLifeCalculations(birthDate: string) {
  return useMemo(() => {
    const totalLifeWeeks = 4160; // 80 years × 52 weeks
    const currentDate = new Date(); // Use actual current date
    
    // Calculate year progress (independent of birth date)
    const currentYear = currentDate.getFullYear();
    const startOfYear = new Date(currentYear, 0, 1);
    const endOfYear = new Date(currentYear, 11, 31);
    const totalDays = Math.floor((endOfYear.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000)) + 1;
    const daysPassed = Math.floor((currentDate.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000)) + 1;
    
    const yearProgress = {
      totalDays,
      daysPassed,
      percentage: Math.min(Math.round((daysPassed / totalDays) * 100), 100)
    };
    
    if (!birthDate) {
      // Return empty state for personal data when no birth date is provided
      return {
        weeksLived: 0,
        weeksRemaining: totalLifeWeeks,
        lifePercentage: 0,
        yearProgress
      };
    }
    
    const birth = new Date(birthDate);
    
    // Validate birth date
    if (isNaN(birth.getTime()) || birth > currentDate) {
      return {
        weeksLived: 0,
        weeksRemaining: totalLifeWeeks,
        lifePercentage: 0,
        yearProgress
      };
    }
    
    // Calculate exact weeks lived from birth date to current date
    const timeDifference = currentDate.getTime() - birth.getTime();
    const daysLived = Math.floor(timeDifference / (24 * 60 * 60 * 1000));
    const weeksLived = Math.floor(daysLived / 7);
    
    const weeksRemaining = Math.max(0, totalLifeWeeks - weeksLived);
    const lifePercentage = weeksLived > 0 ? Math.min(Math.round((weeksLived / totalLifeWeeks) * 100), 100) : 0;
    
    return {
      weeksLived,
      weeksRemaining,
      lifePercentage,
      yearProgress
    };
  }, [birthDate]);
}
