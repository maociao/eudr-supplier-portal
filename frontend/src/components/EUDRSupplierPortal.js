import React, { useState } from 'react';
import axios from 'axios';
import { 
  Card, 
  CardContent, 
  Typography, 
  TextField, 
  Button, 
  Box 
} from '@mui/material';

const API_URL = 'http://localhost:8080'; // Update this when deploying

const EUDRSupplierPortal = () => {
  const [formData, setFormData] = useState({
    purchaseOrderNumber: '',
    purchaseOrderLineNumber: '',
    geoJsonFiles: [],
  });
  const [submitStatus, setSubmitStatus] = useState('');
  const [token, setToken] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      geoJsonFiles: [...e.target.files],
    }));
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${API_URL}/login`, {
        username: 'testuser', // Replace with actual login form
        password: 'testpassword',
      });
      setToken(response.data.token);
      setSubmitStatus('Logged in successfully');
    } catch (error) {
      setSubmitStatus('Login failed');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setSubmitStatus('Please log in first');
      return;
    }

    setSubmitStatus('Submitting...');

    const formDataToSend = new FormData();
    formDataToSend.append('purchaseOrderNumber', formData.purchaseOrderNumber);
    formDataToSend.append('purchaseOrderLineNumber', formData.purchaseOrderLineNumber);
    formData.geoJsonFiles.forEach((file) => {
      formDataToSend.append('geoJsonFiles', file);
    });

    try {
      const response = await axios.post(`${API_URL}/submit`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      setSubmitStatus('Data submitted successfully');
    } catch (error) {
      setSubmitStatus(`Error: ${error.response?.data?.error || 'Submission failed'}`);
    }
  };

  return (
    <Card sx={{ maxWidth: 400, margin: 'auto', mt: 4 }}>
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom>
          Supplier Data Submission
        </Typography>
        <Button onClick={handleLogin} variant="contained" sx={{ mb: 2 }}>
          Login
        </Button>
        <Box component="form" onSubmit={handleSubmit} sx={{ '& > :not(style)': { m: 1 } }}>
          <TextField
            fullWidth
            label="Purchase Order Number"
            name="purchaseOrderNumber"
            value={formData.purchaseOrderNumber}
            onChange={handleInputChange}
            required
          />
          <TextField
            fullWidth
            label="Purchase Order Line Number"
            name="purchaseOrderLineNumber"
            value={formData.purchaseOrderLineNumber}
            onChange={handleInputChange}
            required
          />
          <input
            accept=".json,.geojson"
            style={{ display: 'none' }}
            id="raised-button-file"
            multiple
            type="file"
            onChange={handleFileChange}
          />
          <label htmlFor="raised-button-file">
            <Button variant="contained" component="span">
              Upload GeoJSON Files
            </Button>
          </label>
          <Button type="submit" variant="contained" color="primary">
            Submit
          </Button>
        </Box>
        {submitStatus && (
          <Typography variant="body2" sx={{ mt: 2 }}>
            {submitStatus}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default EUDRSupplierPortal;