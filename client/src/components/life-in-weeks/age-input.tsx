interface AgeInputProps {
  age: number;
  onAgeChange: (age: number) => void;
}

export default function AgeInput({ age, onAgeChange }: AgeInputProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numAge = parseFloat(value);
    
    if (value === '' || isNaN(numAge) || numAge < 0 || numAge > 120) {
      onAgeChange(0);
    } else {
      onAgeChange(numAge);
    }
  };

  return (
    <div className="age-input-container">
      <label htmlFor="age" className="age-input-label">Enter your age:</label>
      <input
        type="number"
        id="age"
        className="age-input-field"
        placeholder="25"
        min="0"
        max="120"
        value={age || ''}
        onChange={handleInputChange}
      />
    </div>
  );
}
