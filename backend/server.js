const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const path = require('path');
const { sequelize, User, Favorite } = require('./models'); // Import your models

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = 'your-secret-key'; // Replace with your own secret key

app.use(cors());
app.use(bodyParser.json());

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, 'client/build')));

// Generate OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000); // Generates a random 6-digit OTP

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Store OTPs in memory (not recommended for production)
let otps = {};

// Route to send OTP
app.post('/api/users/send-otp', (req, res) => {
  const { email } = req.body;
  const otp = generateOTP();
  otps[email] = otp;
  // Send OTP to the user's email address (implement email sending logic here)
  console.log(`OTP sent to ${email}: ${otp}`);
  res.status(200).json({ message: 'OTP sent to your email address' });
});

// Route to verify OTP
app.post('/api/users/verify-otp', async (req, res) => {
  const { email, otp } = req.body;
  if (otps[email] && otps[email] === parseInt(otp)) {
    // OTP is valid, create or update the user in the database
    let user = await User.findOne({ where: { email } });
    if (!user) {
      user = await User.create({ email });
    }
    const token = jwt.sign({ email: user.email, id: user.id }, JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token });
  } else {
    res.status(400).json({ message: 'Invalid OTP' });
  }
});

// Route to register a new user
app.post('/api/users/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const user = await User.create({ username, email, password });
    res.status(201).json({ userId: user.id });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Failed to register user. Please try again.' });
  }
});

// Route to login a user
app.post('/api/users/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email, password } });
    if (user) {
      const token = jwt.sign({ email: user.email, id: user.id }, JWT_SECRET, { expiresIn: '1h' });
      res.status(200).json({ token });
    } else {
      res.status(400).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ message: 'Failed to login. Please try again.' });
  }
});

// Route to get favorites (protected)
app.get('/api/favorites', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const favorites = await Favorite.findAll({ where: { userId } });
    res.status(200).json(favorites);
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({ message: 'Error fetching favorites' });
  }
});

// All other GET requests not handled before will return the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
