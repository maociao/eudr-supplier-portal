const express = require('express');
const multer = require('multer');
const helmet = require('helmet');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

const app = express();
const upload = multer({ dest: 'uploads/' });

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// In-memory user storage (replace with a database in production)
const users = [];

// JWT secret (use a strong, environment-specific secret in production)
const JWT_SECRET = 'your-secret-key';

// Authentication middleware
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// User registration
app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  
  // Check if user already exists
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ error: 'Email already exists' });
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create new user
    const newUser = { id: uuidv4(), email, password: hashedPassword };
    users.push(newUser);

    console.log(`User registered: ${email}`);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Error registering user' });
  }
});

// User login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);

  if (!user) {
    console.log(`Login attempt failed: User not found (${email})`);
    return res.status(400).json({ error: 'User not found' });
  }

  try {
    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
      console.log(`User logged in: ${email}`);
      res.json({ token });
    } else {
      console.log(`Login attempt failed: Invalid password (${email})`);
      res.status(400).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Error logging in' });
  }
});

// File upload and data submission
app.post('/submit', authenticate, upload.array('geoJsonFiles'), (req, res) => {
  console.log('Received submission request');
  const { purchaseOrderNumber, purchaseOrderLineNumber } = req.body;
  const files = req.files;

  console.log(`PO Number: ${purchaseOrderNumber}, PO Line Number: ${purchaseOrderLineNumber}`);
  console.log(`Number of files received: ${files.length}`);

  // Validate input
  if (!purchaseOrderNumber || !purchaseOrderLineNumber || !files) {
    console.log('Missing required fields');
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Validate GeoJSON files
  const invalidFiles = files.filter(file => !isValidGeoJson(file));
  if (invalidFiles.length > 0) {
    console.log(`Invalid GeoJSON files: ${invalidFiles.map(f => f.originalname).join(', ')}`);
    return res.status(400).json({ error: 'Invalid GeoJSON file(s)' });
  }

  // Mock API call
  mockApiCall(purchaseOrderNumber, purchaseOrderLineNumber, files)
    .then(() => {
      console.log('Data submitted successfully');
      res.json({ message: 'Data submitted successfully' });
    })
    .catch(error => {
      console.error('API submission failed:', error);
      res.status(500).json({ error: 'API submission failed' });
    });
});

// GeoJSON validation (basic check, expand as needed)
function isValidGeoJson(file) {
  try {
    console.log(`Validating file: ${file.originalname}`);
    const content = fs.readFileSync(file.path, 'utf8');
    const parsedContent = JSON.parse(content);
    
    // Log the parsed content for debugging
    console.log('Parsed content:', JSON.stringify(parsedContent, null, 2));
    
    const isValid = parsedContent.type === 'FeatureCollection' && Array.isArray(parsedContent.features);
    console.log(`File ${file.originalname} is ${isValid ? 'valid' : 'invalid'} GeoJSON`);
    return isValid;
  } catch (error) {
    console.error(`Error validating file ${file.originalname}:`, error);
    return false;
  }
}

// Mock API call
function mockApiCall(poNumber, poLineNumber, files) {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Submitted: PO ${poNumber}, Line ${poLineNumber}, Files: ${files.length}`);
      resolve();
    }, 1000);
  });
}

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});