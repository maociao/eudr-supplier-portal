const express = require('express');
const multer = require('multer');
const helmet = require('helmet');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const app = express();
const upload = multer({ dest: 'uploads/' });

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// In-memory user storage (replace with a database in production)
const users = [];

// In-memory session storage (replace with Redis or similar in production)
const sessions = {};

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
  const { username, password } = req.body;
  if (users.find(u => u.username === username)) {
    return res.status(400).json({ error: 'Username already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = { id: uuidv4(), username, password: hashedPassword };
  users.push(user);

  res.status(201).json({ message: 'User created successfully' });
});

// User login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

// File upload and data submission
app.post('/submit', authenticate, upload.array('geoJsonFiles'), (req, res) => {
  const { purchaseOrderNumber, purchaseOrderLineNumber } = req.body;
  const files = req.files;

  // Validate input
  if (!purchaseOrderNumber || !purchaseOrderLineNumber || !files) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Validate GeoJSON files
  const invalidFiles = files.filter(file => !isValidGeoJson(file));
  if (invalidFiles.length > 0) {
    return res.status(400).json({ error: 'Invalid GeoJSON file(s)' });
  }

  // Mock API call
  mockApiCall(purchaseOrderNumber, purchaseOrderLineNumber, files)
    .then(() => res.json({ message: 'Data submitted successfully' }))
    .catch(error => res.status(500).json({ error: 'API submission failed' }));
});

// GeoJSON validation (basic check, expand as needed)
function isValidGeoJson(file) {
  try {
    const content = JSON.parse(file.buffer.toString());
    return content.type === 'FeatureCollection' && Array.isArray(content.features);
  } catch {
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
