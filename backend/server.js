const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import models
const Flat = require('./models/Flat');
const Payment = require('./models/Payment');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/maintenance_system', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Routes

// Get all flats
app.get('/api/flats', async (req, res) => {
  try {
    const flats = await Flat.find().sort({ flatNumber: 1 });
    res.json(flats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new flat
app.post('/api/flats', async (req, res) => {
  try {
    const flat = new Flat(req.body);
    const savedFlat = await flat.save();
    res.status(201).json(savedFlat);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get flat by number
app.get('/api/flats/:flatNumber', async (req, res) => {
  try {
    const flat = await Flat.findOne({ flatNumber: req.params.flatNumber });
    if (!flat) {
      return res.status(404).json({ message: 'Flat not found' });
    }
    res.json(flat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all payments
app.get('/api/payments', async (req, res) => {
  try {
    const { flatNumber, month, year } = req.query;
    const filter = {};
    
    if (flatNumber) filter.flatNumber = flatNumber;
    if (month) filter.month = month;
    if (year) filter.year = parseInt(year);
    
    const payments = await Payment.find(filter).sort({ paidOn: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new payment
app.post('/api/payments', async (req, res) => {
  try {
    // Check if flat exists
    const flatExists = await Flat.findOne({ flatNumber: req.body.flatNumber });
    if (!flatExists) {
      return res.status(400).json({ message: 'Flat does not exist' });
    }

    const payment = new Payment(req.body);
    const savedPayment = await payment.save();
    res.status(201).json(savedPayment);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: 'Payment already exists for this flat, month, and year' });
    } else {
      res.status(400).json({ message: error.message });
    }
  }
});

// Get payments by flat number
app.get('/api/payments/flat/:flatNumber', async (req, res) => {
  try {
    const payments = await Payment.find({ flatNumber: req.params.flatNumber }).sort({ year: -1, month: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete payment
app.delete('/api/payments/:id', async (req, res) => {
  try {
    const payment = await Payment.findByIdAndDelete(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    res.json({ message: 'Payment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin login (simple implementation)
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  
  // In production, use proper authentication with hashed passwords
  if (username === 'admin' && password === 'admin') {
    res.json({ 
      success: true, 
      message: 'Login successful',
      token: 'dummy-jwt-token' // In production, use proper JWT
    });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// Seed data endpoint (for development)
app.post('/api/seed', async (req, res) => {
  try {
    // Clear existing data
    await Flat.deleteMany({});
    await Payment.deleteMany({});

    // Insert sample flats
    const flats = [
      { flatNumber: '101', ownerName: 'Mr. Rajesh Kumar', contact: '9876543210' },
      { flatNumber: '102', ownerName: 'Mrs. Priya Sharma', contact: '9876543211' },
      { flatNumber: '103', ownerName: 'Mr. Amit Singh', contact: '9876543212' },
      { flatNumber: '201', ownerName: 'Dr. Sunita Gupta', contact: '9876543213' },
      { flatNumber: '202', ownerName: 'Mr. Vikash Jain', contact: '9876543214' },
      { flatNumber: '203', ownerName: 'Mrs. Meera Patel', contact: '9876543215' },
      { flatNumber: '301', ownerName: 'Mr. Arjun Reddy', contact: '9876543216' },
      { flatNumber: '302', ownerName: 'Mrs. Kavita Nair', contact: '9876543217' },
    ];

    await Flat.insertMany(flats);

    // Insert sample payments
    const payments = [
      { flatNumber: '101', month: 'January', year: 2024, amount: 1500, paidOn: new Date('2024-01-05'), paymentMode: 'UPI' },
      { flatNumber: '101', month: 'February', year: 2024, amount: 1500, paidOn: new Date('2024-02-03'), paymentMode: 'Cash' },
      { flatNumber: '102', month: 'January', year: 2024, amount: 1500, paidOn: new Date('2024-01-10'), paymentMode: 'Bank Transfer' },
      { flatNumber: '102', month: 'March', year: 2024, amount: 1500, paidOn: new Date('2024-03-15'), paymentMode: 'UPI' },
      { flatNumber: '201', month: 'January', year: 2024, amount: 1500, paidOn: new Date('2024-01-08'), paymentMode: 'Cash' },
      { flatNumber: '203', month: 'February', year: 2024, amount: 1500, paidOn: new Date('2024-02-20'), paymentMode: 'UPI' },
      { flatNumber: '301', month: 'January', year: 2024, amount: 1500, paidOn: new Date('2024-01-12'), paymentMode: 'Bank Transfer' },
      { flatNumber: '302', month: 'March', year: 2024, amount: 1500, paidOn: new Date('2024-03-25'), paymentMode: 'Cash' },
    ];

    await Payment.insertMany(payments);

    res.json({ message: 'Database seeded successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});