import React, { useState } from 'react';
import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';

const DateInput = ({ isFutureOnly, fieldName, label }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [validationError, setValidationError] = useState('');

  const handleDateChange = (date) => {
    setSelectedDate(date);

    // Validate for future dates
    if (isFutureOnly && date && new Date(date) <= new Date()) {
      setValidationError('Please select a future date.');
    } else {
      setValidationError('');
    }
  };

  return (
    <div>
      <label htmlFor={fieldName}>{label}</label>
      <DatePicker id={fieldName} selected={selectedDate} onChange={handleDateChange} dateFormat="dd/MM/yyyy" required />
      {validationError && <p style={{ color: 'red' }}>{validationError}</p>}
    </div>
  );
};

export default DateInput;
