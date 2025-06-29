# 🗄️ Complete Database Schema & Setup Guide

## 📋 Table of Contents
- [Database Overview](#database-overview)
- [Schema Design](#schema-design)
- [Collections Structure](#collections-structure)
- [Relationships & Constraints](#relationships--constraints)
- [Setup Instructions](#setup-instructions)
- [Sample Data](#sample-data)
- [API Integration](#api-integration)
- [Query Examples](#query-examples)
- [Performance Optimization](#performance-optimization)
- [Migration Guide](#migration-guide)

---

## 🎯 Database Overview

### Technology Stack
- **Database**: MongoDB (NoSQL Document Database)
- **ODM**: Mongoose (Object Document Mapping)
- **Connection**: MongoDB Atlas (Cloud) or Local MongoDB
- **Environment**: Node.js with Express.js

### Database Name
```
maintenance_system
```

### Key Features
- ✅ **Flexible Schema**: Easy to extend and modify
- ✅ **Data Integrity**: Proper validation and constraints
- ✅ **Performance Optimized**: Strategic indexing
- ✅ **Scalable Design**: Supports growth and expansion
- ✅ **Referential Integrity**: Proper relationships between collections

---

## 🏗️ Schema Design

### Design Principles
1. **Normalization**: Separate concerns (flats vs payments)
2. **Validation**: Strong data validation at schema level
3. **Indexing**: Optimized for common query patterns
4. **Flexibility**: Easy to add new fields and features
5. **Performance**: Efficient queries and aggregations

### Entity Relationship Diagram
```
┌─────────────────┐         ┌─────────────────────┐
│     FLATS       │         │      PAYMENTS       │
├─────────────────┤         ├─────────────────────┤
│ _id (ObjectId)  │         │ _id (ObjectId)      │
│ flatNumber (UK) │◄────────┤ flatNumber (FK)     │
│ ownerName       │         │ month (Enum)        │
│ contact         │         │ year (Number)       │
│ createdAt       │         │ amount (Number)     │
│ updatedAt       │         │ paidOn (Date)       │
└─────────────────┘         │ paymentMode (Enum)  │
                            │ createdAt           │
                            │ updatedAt           │
                            └─────────────────────┘
                            
                            Unique Index: (flatNumber, month, year)
```

---

## 📊 Collections Structure

## 🏠 1. FLATS Collection

### Schema Definition
```javascript
const mongoose = require('mongoose');

const flatSchema = new mongoose.Schema({
  flatNumber: {
    type: String,
    required: [true, 'Flat number is required'],
    unique: true,
    trim: true,
    uppercase: true,
    match: [/^[A-Z0-9-]+$/, 'Flat number can only contain letters, numbers, and hyphens']
  },
  ownerName: {
    type: String,
    required: [true, 'Owner name is required'],
    trim: true,
    minlength: [2, 'Owner name must be at least 2 characters'],
    maxlength: [100, 'Owner name cannot exceed 100 characters']
  },
  contact: {
    type: String,
    required: [true, 'Contact number is required'],
    trim: true,
    match: [/^[0-9]{10}$/, 'Contact must be a valid 10-digit number']
  }
}, {
  timestamps: true,
  collection: 'flats'
});

// Indexes
flatSchema.index({ flatNumber: 1 }, { unique: true });
flatSchema.index({ ownerName: 1 });

module.exports = mongoose.model('Flat', flatSchema);
```

### Field Specifications

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| `_id` | ObjectId | Auto | Unique | MongoDB auto-generated ID |
| `flatNumber` | String | ✅ | Unique, Uppercase, Pattern | Flat identifier (e.g., "101", "A-201") |
| `ownerName` | String | ✅ | 2-100 chars | Full name of flat owner |
| `contact` | String | ✅ | 10 digits | Mobile number |
| `createdAt` | Date | Auto | - | Record creation timestamp |
| `updatedAt` | Date | Auto | - | Last modification timestamp |

### Sample Document
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "flatNumber": "101",
  "ownerName": "Mr. Rajesh Kumar",
  "contact": "9876543210",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z",
  "__v": 0
}
```

---

## 💳 2. PAYMENTS Collection

### Schema Definition
```javascript
const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  flatNumber: {
    type: String,
    required: [true, 'Flat number is required'],
    trim: true,
    uppercase: true
  },
  month: {
    type: String,
    required: [true, 'Payment month is required'],
    enum: {
      values: ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
               'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'],
      message: 'Month must be a valid month name'
    }
  },
  year: {
    type: Number,
    required: [true, 'Payment year is required'],
    min: [2020, 'Year cannot be before 2020'],
    max: [2030, 'Year cannot be after 2030'],
    validate: {
      validator: Number.isInteger,
      message: 'Year must be an integer'
    }
  },
  amount: {
    type: Number,
    required: [true, 'Payment amount is required'],
    min: [0, 'Amount cannot be negative'],
    max: [100000, 'Amount cannot exceed ₹1,00,000']
  },
  paidOn: {
    type: Date,
    required: [true, 'Payment date is required'],
    validate: {
      validator: function(date) {
        return date <= new Date();
      },
      message: 'Payment date cannot be in the future'
    }
  },
  paymentMode: {
    type: String,
    required: [true, 'Payment mode is required'],
    enum: {
      values: ['CASH', 'UPI', 'BANK_TRANSFER', 'CHEQUE', 'ONLINE'],
      message: 'Payment mode must be one of: Cash, UPI, Bank Transfer, Cheque, Online'
    }
  }
}, {
  timestamps: true,
  collection: 'payments'
});

// Compound unique index to prevent duplicate payments
paymentSchema.index({ flatNumber: 1, month: 1, year: 1 }, { unique: true });

// Additional indexes for performance
paymentSchema.index({ flatNumber: 1 });
paymentSchema.index({ year: 1, month: 1 });
paymentSchema.index({ paidOn: -1 });
paymentSchema.index({ paymentMode: 1 });

// Pre-save middleware to validate flat exists
paymentSchema.pre('save', async function(next) {
  const Flat = mongoose.model('Flat');
  const flatExists = await Flat.findOne({ flatNumber: this.flatNumber });
  if (!flatExists) {
    next(new Error('Flat does not exist'));
  }
  next();
});

module.exports = mongoose.model('Payment', paymentSchema);
```

### Field Specifications

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| `_id` | ObjectId | Auto | Unique | MongoDB auto-generated ID |
| `flatNumber` | String | ✅ | Must exist in flats | Reference to flat |
| `month` | String | ✅ | Enum (12 months) | Payment month |
| `year` | Number | ✅ | 2020-2030 | Payment year |
| `amount` | Number | ✅ | 0-100000 | Payment amount in ₹ |
| `paidOn` | Date | ✅ | Not future date | Payment date |
| `paymentMode` | String | ✅ | Enum (5 modes) | Payment method |
| `createdAt` | Date | Auto | - | Record creation timestamp |
| `updatedAt` | Date | Auto | - | Last modification timestamp |

### Enum Values

#### Months
```javascript
['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER']
```

#### Payment Modes
```javascript
['CASH', 'UPI', 'BANK_TRANSFER', 'CHEQUE', 'ONLINE']
```

### Sample Document
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "flatNumber": "101",
  "month": "JANUARY",
  "year": 2024,
  "amount": 1500,
  "paidOn": "2024-01-05T00:00:00.000Z",
  "paymentMode": "UPI",
  "createdAt": "2024-01-05T14:30:00.000Z",
  "updatedAt": "2024-01-05T14:30:00.000Z",
  "__v": 0
}
```

---

## 🔗 Relationships & Constraints

### Primary Relationships
1. **One-to-Many**: One Flat → Many Payments
2. **Foreign Key**: `payments.flatNumber` → `flats.flatNumber`
3. **Referential Integrity**: Payments must reference existing flats

### Business Rules
1. ✅ **Unique Flat Numbers**: No duplicate flat numbers
2. ✅ **No Duplicate Payments**: One payment per flat per month per year
3. ✅ **Valid Date Ranges**: Years between 2020-2030
4. ✅ **Positive Amounts**: Non-negative payment amounts
5. ✅ **Valid Enums**: Only predefined months and payment modes
6. ✅ **Flat Existence**: Payments must reference existing flats

### Cascade Operations
- **Delete Flat**: All associated payments are deleted
- **Update Flat Number**: All payment references are updated

---

## 🚀 Setup Instructions

### 1. MongoDB Installation

#### Option A: Local MongoDB
```bash
# Ubuntu/Debian
sudo apt-get install mongodb

# macOS with Homebrew
brew install mongodb-community

# Windows
# Download from https://www.mongodb.com/try/download/community

# Start MongoDB service
sudo systemctl start mongod  # Linux
brew services start mongodb-community  # macOS
```

#### Option B: MongoDB Atlas (Cloud)
1. Visit [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create free account
3. Create new cluster
4. Get connection string
5. Update `.env` file

### 2. Environment Setup

#### Backend Environment Variables
```bash
# Create .env file in backend directory
cd backend
cp .env.example .env

# Edit .env file
MONGODB_URI=mongodb://localhost:27017/maintenance_system
# OR for Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/maintenance_system

PORT=5000
NODE_ENV=development
```

### 3. Database Connection

#### Connection Code (server.js)
```javascript
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('✅ Connected to MongoDB successfully');
});
```

### 4. Install Dependencies
```bash
cd backend
npm install express mongoose cors dotenv nodemon
```

---

## 📝 Sample Data

### Sample Flats Data
```javascript
const sampleFlats = [
  {
    flatNumber: "101",
    ownerName: "Mr. Rajesh Kumar",
    contact: "9876543210"
  },
  {
    flatNumber: "102",
    ownerName: "Mrs. Priya Sharma", 
    contact: "9876543211"
  },
  {
    flatNumber: "103",
    ownerName: "Mr. Amit Singh",
    contact: "9876543212"
  },
  {
    flatNumber: "201",
    ownerName: "Dr. Sunita Gupta",
    contact: "9876543213"
  },
  {
    flatNumber: "202",
    ownerName: "Mr. Vikash Jain",
    contact: "9876543214"
  },
  {
    flatNumber: "203",
    ownerName: "Mrs. Meera Patel",
    contact: "9876543215"
  },
  {
    flatNumber: "301",
    ownerName: "Mr. Arjun Reddy",
    contact: "9876543216"
  },
  {
    flatNumber: "302",
    ownerName: "Mrs. Kavita Nair",
    contact: "9876543217"
  }
];
```

### Sample Payments Data
```javascript
const samplePayments = [
  {
    flatNumber: "101",
    month: "JANUARY",
    year: 2024,
    amount: 1500,
    paidOn: new Date("2024-01-05"),
    paymentMode: "UPI"
  },
  {
    flatNumber: "101", 
    month: "FEBRUARY",
    year: 2024,
    amount: 1500,
    paidOn: new Date("2024-02-03"),
    paymentMode: "CASH"
  },
  {
    flatNumber: "102",
    month: "JANUARY", 
    year: 2024,
    amount: 1500,
    paidOn: new Date("2024-01-10"),
    paymentMode: "BANK_TRANSFER"
  },
  {
    flatNumber: "102",
    month: "MARCH",
    year: 2024, 
    amount: 1500,
    paidOn: new Date("2024-03-15"),
    paymentMode: "UPI"
  },
  {
    flatNumber: "201",
    month: "JANUARY",
    year: 2024,
    amount: 1500, 
    paidOn: new Date("2024-01-08"),
    paymentMode: "CASH"
  },
  {
    flatNumber: "203",
    month: "FEBRUARY",
    year: 2024,
    amount: 1500,
    paidOn: new Date("2024-02-20"), 
    paymentMode: "UPI"
  },
  {
    flatNumber: "301",
    month: "JANUARY",
    year: 2024,
    amount: 1500,
    paidOn: new Date("2024-01-12"),
    paymentMode: "BANK_TRANSFER"
  },
  {
    flatNumber: "302",
    month: "MARCH", 
    year: 2024,
    amount: 1500,
    paidOn: new Date("2024-03-25"),
    paymentMode: "CASH"
  }
];
```

### Data Seeding Script
```javascript
// seed.js
const mongoose = require('mongoose');
const Flat = require('./models/Flat');
const Payment = require('./models/Payment');

const seedDatabase = async () => {
  try {
    // Clear existing data
    await Flat.deleteMany({});
    await Payment.deleteMany({});
    
    // Insert flats
    await Flat.insertMany(sampleFlats);
    console.log('✅ Flats seeded successfully');
    
    // Insert payments
    await Payment.insertMany(samplePayments);
    console.log('✅ Payments seeded successfully');
    
    console.log('🎉 Database seeded successfully');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  }
};

module.exports = seedDatabase;
```

---

## 🔌 API Integration

### Complete API Endpoints

#### Flats Endpoints
```javascript
// GET /api/flats - Get all flats
app.get('/api/flats', async (req, res) => {
  try {
    const flats = await Flat.find().sort({ flatNumber: 1 });
    res.json(flats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/flats - Create new flat
app.post('/api/flats', async (req, res) => {
  try {
    const flat = new Flat(req.body);
    const savedFlat = await flat.save();
    res.status(201).json(savedFlat);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: 'Flat number already exists' });
    } else {
      res.status(400).json({ message: error.message });
    }
  }
});

// GET /api/flats/:flatNumber - Get specific flat
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

// PUT /api/flats/:flatNumber - Update flat
app.put('/api/flats/:flatNumber', async (req, res) => {
  try {
    const flat = await Flat.findOneAndUpdate(
      { flatNumber: req.params.flatNumber },
      req.body,
      { new: true, runValidators: true }
    );
    if (!flat) {
      return res.status(404).json({ message: 'Flat not found' });
    }
    res.json(flat);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/flats/:flatNumber - Delete flat
app.delete('/api/flats/:flatNumber', async (req, res) => {
  try {
    const flat = await Flat.findOneAndDelete({ flatNumber: req.params.flatNumber });
    if (!flat) {
      return res.status(404).json({ message: 'Flat not found' });
    }
    
    // Delete associated payments
    await Payment.deleteMany({ flatNumber: req.params.flatNumber });
    
    res.json({ message: 'Flat and associated payments deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
```

#### Payments Endpoints
```javascript
// GET /api/payments - Get all payments with filters
app.get('/api/payments', async (req, res) => {
  try {
    const { flatNumber, month, year, paymentMode } = req.query;
    const filter = {};
    
    if (flatNumber) filter.flatNumber = flatNumber;
    if (month) filter.month = month.toUpperCase();
    if (year) filter.year = parseInt(year);
    if (paymentMode) filter.paymentMode = paymentMode.toUpperCase();
    
    const payments = await Payment.find(filter).sort({ paidOn: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/payments - Create new payment
app.post('/api/payments', async (req, res) => {
  try {
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

// GET /api/payments/flat/:flatNumber - Get payments by flat
app.get('/api/payments/flat/:flatNumber', async (req, res) => {
  try {
    const payments = await Payment.find({ flatNumber: req.params.flatNumber })
      .sort({ year: -1, month: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/payments/:id - Delete payment
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
```

---

## 🔍 Query Examples

### Basic Queries

#### 1. Find All Flats
```javascript
// MongoDB Query
db.flats.find().sort({ flatNumber: 1 })

// Mongoose Query
const flats = await Flat.find().sort({ flatNumber: 1 });
```

#### 2. Find Payments for Specific Flat
```javascript
// MongoDB Query
db.payments.find({ flatNumber: "101" }).sort({ year: -1, month: -1 })

// Mongoose Query
const payments = await Payment.find({ flatNumber: "101" })
  .sort({ year: -1, month: -1 });
```

#### 3. Find Current Month Payments
```javascript
// MongoDB Query
db.payments.find({ 
  month: "JANUARY", 
  year: 2024 
}).sort({ paidOn: -1 })

// Mongoose Query
const currentPayments = await Payment.find({
  month: "JANUARY",
  year: 2024
}).sort({ paidOn: -1 });
```

### Advanced Aggregation Queries

#### 1. Monthly Revenue Report
```javascript
const monthlyRevenue = await Payment.aggregate([
  {
    $match: { year: 2024 }
  },
  {
    $group: {
      _id: "$month",
      totalAmount: { $sum: "$amount" },
      paymentCount: { $sum: 1 },
      flats: { $addToSet: "$flatNumber" }
    }
  },
  {
    $addFields: {
      uniqueFlats: { $size: "$flats" }
    }
  },
  {
    $sort: { _id: 1 }
  }
]);
```

#### 2. Outstanding Dues (Flats without current month payment)
```javascript
const outstandingDues = await Flat.aggregate([
  {
    $lookup: {
      from: "payments",
      let: { flatNum: "$flatNumber" },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ["$flatNumber", "$$flatNum"] },
                { $eq: ["$month", "JANUARY"] },
                { $eq: ["$year", 2024] }
              ]
            }
          }
        }
      ],
      as: "currentPayment"
    }
  },
  {
    $match: { currentPayment: { $size: 0 } }
  },
  {
    $project: {
      flatNumber: 1,
      ownerName: 1,
      contact: 1
    }
  }
]);
```

#### 3. Payment Mode Statistics
```javascript
const paymentModeStats = await Payment.aggregate([
  {
    $group: {
      _id: "$paymentMode",
      count: { $sum: 1 },
      totalAmount: { $sum: "$amount" },
      avgAmount: { $avg: "$amount" }
    }
  },
  {
    $sort: { count: -1 }
  }
]);
```

#### 4. Top Paying Flats
```javascript
const topPayingFlats = await Payment.aggregate([
  {
    $group: {
      _id: "$flatNumber",
      totalPaid: { $sum: "$amount" },
      paymentCount: { $sum: 1 },
      lastPayment: { $max: "$paidOn" }
    }
  },
  {
    $lookup: {
      from: "flats",
      localField: "_id",
      foreignField: "flatNumber", 
      as: "flatInfo"
    }
  },
  {
    $unwind: "$flatInfo"
  },
  {
    $project: {
      flatNumber: "$_id",
      ownerName: "$flatInfo.ownerName",
      totalPaid: 1,
      paymentCount: 1,
      lastPayment: 1
    }
  },
  {
    $sort: { totalPaid: -1 }
  },
  {
    $limit: 10
  }
]);
```

---

## ⚡ Performance Optimization

### Indexing Strategy

#### Primary Indexes
```javascript
// Flats Collection
db.flats.createIndex({ flatNumber: 1 }, { unique: true })
db.flats.createIndex({ ownerName: 1 })

// Payments Collection  
db.payments.createIndex({ flatNumber: 1, month: 1, year: 1 }, { unique: true })
db.payments.createIndex({ flatNumber: 1 })
db.payments.createIndex({ year: 1, month: 1 })
db.payments.createIndex({ paidOn: -1 })
db.payments.createIndex({ paymentMode: 1 })
```

#### Compound Indexes for Complex Queries
```javascript
// For date range queries
db.payments.createIndex({ year: 1, month: 1, paidOn: -1 })

// For flat-specific date queries
db.payments.createIndex({ flatNumber: 1, year: -1, month: -1 })
```

### Query Optimization Tips

#### 1. Use Projection to Limit Fields
```javascript
// Instead of fetching all fields
const flats = await Flat.find();

// Fetch only required fields
const flats = await Flat.find({}, 'flatNumber ownerName');
```

#### 2. Implement Pagination
```javascript
const page = parseInt(req.query.page) || 1;
const limit = parseInt(req.query.limit) || 10;
const skip = (page - 1) * limit;

const payments = await Payment.find()
  .sort({ paidOn: -1 })
  .skip(skip)
  .limit(limit);
```

#### 3. Use Lean Queries for Read-Only Operations
```javascript
// Faster for read-only operations
const payments = await Payment.find().lean();
```

### Caching Strategy
```javascript
const redis = require('redis');
const client = redis.createClient();

// Cache frequently accessed data
const getCachedFlats = async () => {
  const cached = await client.get('flats');
  if (cached) {
    return JSON.parse(cached);
  }
  
  const flats = await Flat.find();
  await client.setex('flats', 3600, JSON.stringify(flats)); // Cache for 1 hour
  return flats;
};
```

---

## 🔄 Migration Guide

### Database Migration Scripts

#### Version 1.0 → 1.1: Add Building Field
```javascript
// migration_v1_1.js
const addBuildingField = async () => {
  try {
    // Add building field to existing flats
    await db.flats.updateMany(
      { building: { $exists: false } },
      { $set: { building: "A" } }
    );
    
    console.log('✅ Building field added to all flats');
  } catch (error) {
    console.error('❌ Migration failed:', error);
  }
};
```

#### Version 1.1 → 1.2: Update Payment Modes
```javascript
// migration_v1_2.js
const updatePaymentModes = async () => {
  try {
    // Update old payment mode values
    await db.payments.updateMany(
      { paymentMode: "Net Banking" },
      { $set: { paymentMode: "ONLINE" } }
    );
    
    console.log('✅ Payment modes updated');
  } catch (error) {
    console.error('❌ Migration failed:', error);
  }
};
```

### Data Validation Scripts

#### Validate Data Integrity
```javascript
const validateDatabase = async () => {
  // Check for orphaned payments
  const orphanedPayments = await Payment.aggregate([
    {
      $lookup: {
        from: "flats",
        localField: "flatNumber",
        foreignField: "flatNumber",
        as: "flat"
      }
    },
    {
      $match: { flat: { $size: 0 } }
    }
  ]);
  
  if (orphanedPayments.length > 0) {
    console.warn('⚠️ Found orphaned payments:', orphanedPayments);
  }
  
  // Check for duplicate payments
  const duplicates = await Payment.aggregate([
    {
      $group: {
        _id: { flatNumber: "$flatNumber", month: "$month", year: "$year" },
        count: { $sum: 1 }
      }
    },
    {
      $match: { count: { $gt: 1 } }
    }
  ]);
  
  if (duplicates.length > 0) {
    console.warn('⚠️ Found duplicate payments:', duplicates);
  }
};
```

---

## 🛡️ Security Considerations

### Data Validation
```javascript
// Input sanitization
const sanitizeInput = (input) => {
  return input.toString().trim().replace(/[<>]/g, '');
};

// Rate limiting
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
```

### Authentication & Authorization
```javascript
// JWT middleware
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.sendStatus(401);
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};
```

---

## 📊 Monitoring & Analytics

### Database Monitoring
```javascript
// Connection monitoring
mongoose.connection.on('connected', () => {
  console.log('✅ Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️ Mongoose disconnected');
});
```

### Performance Metrics
```javascript
// Query performance monitoring
const queryLogger = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} - ${duration}ms`);
  });
  
  next();
};
```

---

## 🚀 Deployment Checklist

### Pre-deployment
- [ ] Environment variables configured
- [ ] Database indexes created
- [ ] Sample data seeded (if needed)
- [ ] API endpoints tested
- [ ] Error handling implemented
- [ ] Logging configured
- [ ] Security measures in place

### Production Setup
- [ ] MongoDB Atlas cluster configured
- [ ] Connection string secured
- [ ] Backup strategy implemented
- [ ] Monitoring tools setup
- [ ] SSL certificates configured
- [ ] Rate limiting enabled

---

This comprehensive database schema guide provides everything needed to set up, manage, and scale the maintenance payment tracking system database. The schema is designed for flexibility, performance, and future growth while maintaining data integrity and security.