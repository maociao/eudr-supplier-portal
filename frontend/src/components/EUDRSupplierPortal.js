import React, { useState } from 'react';
import axios from 'axios';
import { 
  Card, 
  CardContent, 
  Typography, 
  TextField, 
  Button, 
  Box,
  Modal,
  Stack 
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
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [registerData, setRegisterData] = useState({ username: '', password: '' });
  
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
      setSubmitStatus(`Error: ${error.response && error.response.data && error.response.data.error ? error.response.data.error : 'Submission failed'}`);
    }
  };

  const handleRegisterOpen = () => setIsRegisterModalOpen(true);
  const handleRegisterClose = () => setIsRegisterModalOpen(false);

  const handleRegisterInputChange = (e) => {
    const { name, value } = e.target;
    setRegisterData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleRegister = async () => {
    try {
      const response = await axios.post(`${API_URL}/register`, registerData);
      setSubmitStatus('Registration successful. Please login.');
      handleRegisterClose();
    } catch (error) {
      setSubmitStatus(`Registration failed: ${error.response?.data?.error || 'Unknown error'}`);
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${API_URL}/login`, {
        username: registerData.username,
        password: registerData.password,
      });
      setToken(response.data.token);
      setSubmitStatus('Logged in successfully');
    } catch (error) {
      setSubmitStatus('Login failed');
    }
  };

  return (
    <Card sx={{ maxWidth: 400, margin: 'auto', mt: 4 }}>
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom>
          Supplier Data Submission
        </Typography>
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <Button onClick={handleRegisterOpen} variant="outlined">
            Register
          </Button>
          <Button onClick={handleLogin} variant="contained">
            Login
          </Button>
        </Stack>
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

      <Modal
        open={isRegisterModalOpen}
        onClose={handleRegisterClose}
        aria-labelledby="register-modal-title"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 300,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
        }}>
          <Typography id="register-modal-title" variant="h6" component="h2" gutterBottom>
            Register New User
          </Typography>
          <TextField
            fullWidth
            margin="normal"
            label="Username"
            name="username"
            value={registerData.username}
            onChange={handleRegisterInputChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Password"
            name="password"
            type="password"
            value={registerData.password}
            onChange={handleRegisterInputChange}
          />
          <Button onClick={handleRegister} variant="contained" sx={{ mt: 2 }}>
            Register
          </Button>
        </Box>
      </Modal>
    </Card>
  );
};

export default EUDRSupplierPortal;