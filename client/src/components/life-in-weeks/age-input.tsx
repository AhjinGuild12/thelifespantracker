interface AgeInputProps {
  birthDate: string;
  onBirthDateChange: (birthDate: string) => void;
}

export default function AgeInput({ birthDate, onBirthDateChange }: AgeInputProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onBirthDateChange(value);
  };

  // Calculate age for display
  const calculateAge = () => {
    if (!birthDate) return '';
    const birth = new Date(birthDate);
    const today = new Date(); // Use actual current date
    const ageInYears = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      return (ageInYears - 1).toString();
    }
    return ageInYears.toString();
  };

  return (
    <div className="age-input-container">
      <label htmlFor="birthDate" className="age-input-label">Enter your birth date:</label>
      <input
        type="date"
        id="birthDate"
        className="age-input-field"
        value={birthDate}
        onChange={handleInputChange}
        max={new Date().toISOString().split('T')[0]}
      />
      {birthDate && (
        <div className="age-display">
          Age: {calculateAge()} years
        </div>
      )}
    </div>
  );
}
