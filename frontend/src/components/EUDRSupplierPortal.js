import React, { useState } from 'react';
import axios from 'axios';
import { 
  Card, 
  CardContent, 
  Typography, 
  TextField, 
  Button, 
  Box,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';

const API_URL = 'http://localhost:8080'; // Update this when deploying

const EUDRSupplierPortal = () => {
  const [view, setView] = useState('auth');
  const [authMode, setAuthMode] = useState('login');
  const [authData, setAuthData] = useState({ email: '', password: '' });
  const [formData, setFormData] = useState({
    purchaseOrderNumber: '',
    purchaseOrderLineNumber: '',
    geoJsonFiles: [],
  });
  const [submitStatus, setSubmitStatus] = useState('');
  const [token, setToken] = useState('');
  const [uploadStatus, setUploadStatus] = useState('');
  
  const handleAuthInputChange = (e) => {
    const { name, value } = e.target;
    setAuthData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    console.log('Files selected:', files.map(f => f.name));
    setFormData((prevData) => ({
      ...prevData,
      geoJsonFiles: [...prevData.geoJsonFiles, ...files],
    }));
    setUploadStatus(`${files.length} file(s) uploaded successfully`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus('Submitting...');
    console.log('Submitting form data:', formData);

    const formDataToSend = new FormData();
    formDataToSend.append('purchaseOrderNumber', formData.purchaseOrderNumber);
    formDataToSend.append('purchaseOrderLineNumber', formData.purchaseOrderLineNumber);
    formData.geoJsonFiles.forEach((file) => {
      formDataToSend.append('geoJsonFiles', file);
    });

    try {
      console.log('Sending request to server...');
      const response = await axios.post(`${API_URL}/submit`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Server response:', response.data);
      setSubmitStatus('Data submitted successfully');
    } catch (error) {
      console.error('Error submitting data:', error.response?.data || error.message);
      setSubmitStatus(`Error: ${error.response?.data?.error || 'Submission failed'}`);
    }
  };

  const handleAuth = async () => {
    try {
      console.log(`Attempting ${authMode}...`);
      const response = await axios.post(`${API_URL}/${authMode}`, authData);
      console.log(`${authMode} response:`, response.data);
      if (authMode === 'register') {
        setSubmitStatus('Registration successful. Please login.');
        setAuthMode('login');
      } else {
        setToken(response.data.token);
        setView('form');
        setSubmitStatus('Logged in successfully');
      }
    } catch (error) {
      console.error(`${authMode} error:`, error.response?.data || error.message);
      setSubmitStatus(`${authMode === 'register' ? 'Registration' : 'Login'} failed: ${error.response?.data?.error || 'Unknown error'}`);
    }
  };

  const renderAuthView = () => (
    <Box>
      <Typography variant="h5" component="div" gutterBottom>
        {authMode === 'register' ? 'Register' : 'Login'}
      </Typography>
      <TextField
        fullWidth
        margin="normal"
        label="Email"
        name="email"
        type="email"
        value={authData.email}
        onChange={handleAuthInputChange}
      />
      <TextField
        fullWidth
        margin="normal"
        label="Password"
        name="password"
        type="password"
        value={authData.password}
        onChange={handleAuthInputChange}
      />
      <Button onClick={handleAuth} variant="contained" sx={{ mt: 2 }}>
        {authMode === 'register' ? 'Register' : 'Login'}
      </Button>
      <Button 
        onClick={() => setAuthMode(authMode === 'register' ? 'login' : 'register')} 
        variant="text" 
        sx={{ mt: 2, ml: 2 }}
      >
        {authMode === 'register' ? 'Switch to Login' : 'Switch to Register'}
      </Button>
    </Box>
  );

  const renderFormView = () => (
    <Box component="form" onSubmit={handleSubmit} sx={{ '& > :not(style)': { m: 1 } }}>
      <Typography variant="body1" gutterBottom>
        Logged in as: {authData.email}
      </Typography>
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
      {uploadStatus && (
        <Typography variant="body2" sx={{ mt: 1 }}>
          {uploadStatus}
        </Typography>
      )}
      <List>
        {formData.geoJsonFiles.map((file, index) => (
          <ListItem key={index}>
            <ListItemText primary={file.name} />
          </ListItem>
        ))}
      </List>
      <Button type="submit" variant="contained" color="primary">
        Submit
      </Button>
    </Box>
  );

  return (
    <Card sx={{ maxWidth: 400, margin: 'auto', mt: 4 }}>
      <CardContent>
        {view === 'auth' ? renderAuthView() : renderFormView()}
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