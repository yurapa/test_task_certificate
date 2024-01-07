import React, { useState } from 'react';
import { apiUrl, apiKey } from '../utils/utils';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';

const API_ENDPOINT = `${apiUrl}request-certificate?subscription-key=${apiKey}`;

const RequestForm = () => {
  const [formData, setFormData] = useState({
    address_to: '',
    purpose: '',
    issued_on: '',
    employee_id: '',
  });

  const [errors, setErrors] = useState({});
  const [confirmation, setConfirmation] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      submitForm();
    } else {
      console.log('Form validation failed. Please check the fields.');
    }
  };

  const validateField = (fieldName, value) => {
    let error = '';

    switch (fieldName) {
      case 'address_to':
        error = value.trim() ? '' : 'Address to is required.';
        break;
      case 'purpose':
        error = value.length >= 50 ? '' : 'Purpose must be at least 50 characters.';
        break;
      case 'issued_on':
        error = value
          ? new Date(value) > new Date()
            ? ''
            : 'Issued on must be a future date.'
          : 'Issued on is required.';
        break;
      case 'employee_id':
        error = /^\d+$/.test(value) ? '' : 'Employee ID must contain only numeric characters.';
        break;
      default:
        break;
    }

    setErrors((prevErrors) => ({ ...prevErrors, [fieldName]: error }));
  };

  const validateForm = () => {
    let isValid = true;

    Object.keys(formData).forEach((fieldName) => {
      validateField(fieldName, formData[fieldName]);

      // Update isValid based on the current field's validity
      isValid = isValid && errors[fieldName] === '';
    });

    return isValid;
  };

  const submitForm = async () => {
    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const responseData = await response.json();

        // "responce" => "response"
        if (responseData && responseData.responce === 'Ok') {
          setConfirmation(true);

          setFormData({
            address_to: '',
            purpose: '',
            issued_on: '',
            employee_id: '',
          });

          setErrors({});

          setTimeout(() => {
            setConfirmation(false);
          }, 3000);
        } else {
          console.error('Unexpected response format:', responseData);
        }
      } else {
        const errorData = await response.json();
        console.error('Error:', errorData);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      {confirmation && (
        <Stack sx={{ position: 'absolute', top: '1rem', right: '1rem' }} spacing={2}>
          <Alert severity="success" variant="outlined">
            <strong>Success:</strong> Request submitted successfully!
          </Alert>
        </Stack>
      )}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Address to:</label>
          <textarea
            name="address_to"
            value={formData.address_to}
            className="control"
            rows="4"
            onChange={handleChange}
          />
          {errors.address_to && <p style={{ color: 'red' }}>{errors.address_to}</p>}
        </div>

        <div>
          <label>Purpose:</label>
          <textarea name="purpose" value={formData.purpose} className="control" rows="4" onChange={handleChange} />
          {errors.purpose && <p style={{ color: 'red' }}>{errors.purpose}</p>}
        </div>

        <div>
          <label>Issued on:</label>
          <input type="date" name="issued_on" value={formData.issued_on} className="control" onChange={handleChange} />
          {errors.issued_on && <p style={{ color: 'red' }}>{errors.issued_on}</p>}
        </div>

        <div>
          <label>Employee ID:</label>
          <input
            type="text"
            name="employee_id"
            value={formData.employee_id}
            className="control"
            onChange={handleChange}
          />
          {errors.employee_id && <p style={{ color: 'red' }}>{errors.employee_id}</p>}
        </div>

        <br />

        <Button type="submit" color="secondary" size="large" variant="contained" endIcon={<SendIcon />}>
          Submit
        </Button>
      </form>
    </div>
  );
};

export default RequestForm;
