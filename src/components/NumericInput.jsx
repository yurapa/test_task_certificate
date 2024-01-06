import { useState } from 'react';

const NumericInput = ({ fieldName, label }) => {
  const [numericValue, setNumericValue] = useState('');
  const [validationError, setValidationError] = useState('');

  const handleNumericInputChange = (event) => {
    const inputValue = event.target.value;

    // Check if the input contains non-numeric characters
    if (!/^\d+$/.test(inputValue)) {
      setValidationError('Please enter only numeric characters.');
    } else {
      setValidationError('');
    }

    setNumericValue(inputValue);
  };

  return (
    <div>
      <label htmlFor={fieldName}>{label}</label>
      <input
        type="text"
        id={fieldName}
        name={fieldName}
        value={numericValue}
        className="control"
        onChange={handleNumericInputChange}
        required
      />
      {validationError && <p style={{ color: 'red' }}>{validationError}</p>}
    </div>
  );
};

export default NumericInput;
