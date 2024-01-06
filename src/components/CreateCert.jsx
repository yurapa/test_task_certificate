import { useState } from 'react';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';

import DateInput from './DateInput.jsx';
import NumericInput from './NumericInput.jsx';
import { apiUrl, apiKey } from '../utils/utils.js';

const CreateCert = () => {
  const [tooltipVisible, setTooltipVisible] = useState(false);

  const [formData, setFormData] = useState({
    address_to: 'Embassy of Earth',
    purpose: 'Visa2',
    issued_on: '1/11/2024',
    employee_id: '13112',
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch(`${apiUrl}request-certificate?subscription-key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return response.json();
      })
      .then((data) => {
        console.log('Form data submitted successfully:', data.response, data.response === 'OK');

        if (data && data.response === 'Ok') {
          console.log('response is ok');
        }

        setTooltipVisible(true);

        setFormData({
          address_to: '',
          purpose: '',
          issued_on: '',
          employee_id: '',
        });

        setTimeout(() => {
          setTooltipVisible(false);
        }, 3000);
      })
      .catch((error) => {
        console.error('Error submitting form data:', error);
      });
  };

  return (
    <>
      {tooltipVisible && (
        <Stack sx={{ position: 'absolute', bottom: '1rem', right: '1rem' }} spacing={2}>
          <Alert severity="success" variant="outlined">
            <strong>Success:</strong> Form data submitted successfully.
          </Alert>
        </Stack>
      )}

      <form onSubmit={handleSubmit}>
        <label htmlFor="address_to">Address to:</label>
        <textarea id="address_to" name="address_to" rows="4" className="control" required />

        <label htmlFor="purpose">Purpose: </label>
        <textarea name="purpose" className="control" rows="4" required></textarea>

        <DateInput fieldName="issued_on" label="Issued on" isFutureOnly />

        <NumericInput label="Employee ID" fieldName="employee_id" />

        <br />

        <Button type="submit" color="secondary" size="large" variant="contained" endIcon={<SendIcon />}>
          Submit
        </Button>
      </form>
    </>
  );
};

export default CreateCert;
