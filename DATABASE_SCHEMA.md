# 🗄️ Database Schema Documentation

## Overview
The Maintenance Payment Tracking System uses MongoDB as the primary database with two main collections: `flats` and `payments`. The schema is designed to be flexible, scalable, and efficient for apartment maintenance management.

## 📊 Database Structure

### Database Name
```
maintenance_system
```

### Collections
1. **flats** - Stores apartment/flat information
2. **payments** - Stores payment records

---

## 🏠 Flats Collection

### Schema Definition
```javascript
const flatSchema = new mongoose.Schema({
  flatNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  ownerName: {
    type: String,
    required: true,
    trim: true
  },
  contact: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true  // Adds createdAt and updatedAt automatically
});
```

### Field Details

| Field | Type | Required | Unique | Description |
|-------|------|----------|--------|-------------|
| `_id` | ObjectId | Auto | Yes | MongoDB auto-generated unique identifier |
| `flatNumber` | String | Yes | Yes | Unique flat identifier (e.g., "101", "A-201") |
| `ownerName` | String | Yes | No | Full name of the flat owner |
| `contact` | String | Yes | No | Contact number of the owner |
| `createdAt` | Date | Auto | No | Timestamp when record was created |
| `updatedAt` | Date | Auto | No | Timestamp when record was last updated |

### Indexes
```javascript
// Unique index on flatNumber (automatically created)
{ flatNumber: 1 }
```

### Sample Document
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "flatNumber": "101",
  "ownerName": "Mr. Rajesh Kumar",
  "contact": "9876543210",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

### Validation Rules
- `flatNumber`: Must be unique across the collection
- `ownerName`: Cannot be empty, whitespace trimmed
- `contact`: Cannot be empty, whitespace trimmed
- All string fields are trimmed automatically

---

## 💳 Payments Collection

### Schema Definition
```javascript
const paymentSchema = new mongoose.Schema({
  flatNumber: {
    type: String,
    required: true,
    trim: true
  },
  month: {
    type: String,
    required: true,
    enum: ['January', 'February', 'March', 'April', 'May', 'June',
           'July', 'August', 'September', 'October', 'November', 'December']
  },
  year: {
    type: Number,
    required: true,
    min: 2020,
    max: 2030
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  paidOn: {
    type: Date,
    required: true
  },
  paymentMode: {
    type: String,
    required: true,
    enum: ['Cash', 'UPI', 'Bank Transfer', 'Cheque', 'Online']
  }
}, {
  timestamps: true
});
```

### Field Details

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| `_id` | ObjectId | Auto | Unique | MongoDB auto-generated unique identifier |
| `flatNumber` | String | Yes | Must exist in flats collection | Reference to flat |
| `month` | String | Yes | Enum values only | Month for which payment is made |
| `year` | Number | Yes | 2020-2030 | Year for which payment is made |
| `amount` | Number | Yes | >= 0 | Payment amount in rupees |
| `paidOn` | Date | Yes | Valid date | Date when payment was made |
| `paymentMode` | String | Yes | Enum values only | Method of payment |
| `createdAt` | Date | Auto | - | Timestamp when record was created |
| `updatedAt` | Date | Auto | - | Timestamp when record was last updated |

### Indexes
```javascript
// Compound unique index to prevent duplicate payments
{ flatNumber: 1, month: 1, year: 1 }

// Additional indexes for performance
{ flatNumber: 1 }
{ year: 1, month: 1 }
{ paidOn: -1 }
```

### Enums

#### Month Enum
```javascript
['January', 'February', 'March', 'April', 'May', 'June',
 'July', 'August', 'September', 'October', 'November', 'December']
```

#### Payment Mode Enum
```javascript
['Cash', 'UPI', 'Bank Transfer', 'Cheque', 'Online']
```

### Sample Document
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "flatNumber": "101",
  "month": "January",
  "year": 2024,
  "amount": 1500,
  "paidOn": "2024-01-05T00:00:00.000Z",
  "paymentMode": "UPI",
  "createdAt": "2024-01-05T14:30:00.000Z",
  "updatedAt": "2024-01-05T14:30:00.000Z"
}
```

### Validation Rules
- `flatNumber`: Must reference an existing flat
- `month`: Must be one of the 12 valid month names
- `year`: Must be between 2020 and 2030
- `amount`: Must be non-negative number
- `paymentMode`: Must be one of the allowed payment methods
- **Unique Constraint**: No duplicate payments for same flat, month, and year

---

## 🔗 Relationships

### Flat to Payments (One-to-Many)
```javascript
// One flat can have multiple payments
// Each payment belongs to exactly one flat
flatNumber (in payments) → flatNumber (in flats)
```

### Relationship Diagram
```
┌─────────────┐         ┌─────────────────┐
│    Flats    │         │    Payments     │
├─────────────┤         ├─────────────────┤
│ flatNumber  │◄────────┤ flatNumber      │
│ ownerName   │         │ month           │
│ contact     │         │ year            │
│ createdAt   │         │ amount          │
│ updatedAt   │         │ paidOn          │
└─────────────┘         │ paymentMode     │
                        │ createdAt       │
                        │ updatedAt       │
                        └─────────────────┘
```

---

## 📋 Database Operations

### Common Queries

#### 1. Get All Flats
```javascript
db.flats.find().sort({ flatNumber: 1 })
```

#### 2. Get Payments for a Specific Flat
```javascript
db.payments.find({ flatNumber: "101" }).sort({ year: -1, month: -1 })
```

#### 3. Get Payments for Current Month
```javascript
db.payments.find({ 
  month: "January", 
  year: 2024 
}).sort({ paidOn: -1 })
```

#### 4. Get Outstanding Dues (Flats without current month payment)
```javascript
// This requires aggregation pipeline
db.flats.aggregate([
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
                { $eq: ["$month", "January"] },
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
  }
])
```

#### 5. Monthly Revenue Report
```javascript
db.payments.aggregate([
  {
    $match: { year: 2024 }
  },
  {
    $group: {
      _id: "$month",
      totalAmount: { $sum: "$amount" },
      paymentCount: { $sum: 1 }
    }
  },
  {
    $sort: { _id: 1 }
  }
])
```

---

## 🛡️ Data Integrity & Constraints

### Business Rules Enforced

1. **Unique Flat Numbers**: No two flats can have the same number
2. **No Duplicate Payments**: One payment per flat per month per year
3. **Valid Date Ranges**: Years must be between 2020-2030
4. **Positive Amounts**: Payment amounts must be non-negative
5. **Valid Payment Modes**: Only predefined payment methods allowed
6. **Valid Months**: Only standard month names accepted

### Referential Integrity
- Payments must reference existing flats
- Application-level validation ensures flat exists before payment creation
- Cascade delete: Deleting a flat removes all associated payments

---

## 🔧 Database Setup Commands

### MongoDB Setup
```bash
# Start MongoDB service
sudo systemctl start mongod

# Connect to MongoDB
mongo

# Create database (automatically created on first use)
use maintenance_system

# Create collections (automatically created on first document insert)
```

### Sample Data Insertion
```javascript
// Insert sample flats
db.flats.insertMany([
  {
    flatNumber: "101",
    ownerName: "Mr. Rajesh Kumar",
    contact: "9876543210"
  },
  {
    flatNumber: "102", 
    ownerName: "Mrs. Priya Sharma",
    contact: "9876543211"
  }
])

// Insert sample payments
db.payments.insertMany([
  {
    flatNumber: "101",
    month: "January",
    year: 2024,
    amount: 1500,
    paidOn: new Date("2024-01-05"),
    paymentMode: "UPI"
  }
])
```

---

## 📊 Performance Considerations

### Indexing Strategy
1. **Primary Indexes**: Automatic on `_id` fields
2. **Unique Indexes**: `flatNumber` in flats collection
3. **Compound Indexes**: `flatNumber + month + year` in payments
4. **Query Optimization**: Additional indexes on frequently queried fields

### Query Optimization Tips
1. Use indexes for filtering and sorting
2. Limit result sets with pagination
3. Use aggregation pipelines for complex queries
4. Consider read replicas for reporting queries

### Scaling Considerations
1. **Horizontal Scaling**: Shard by building/complex if needed
2. **Vertical Scaling**: Increase server resources for larger datasets
3. **Caching**: Implement Redis for frequently accessed data
4. **Archiving**: Move old payment records to archive collections

---

## 🔄 Migration Scripts

### Version 1.0 to 1.1 (Example)
```javascript
// Add new field to existing documents
db.flats.updateMany(
  { building: { $exists: false } },
  { $set: { building: "A" } }
)
```

### Data Validation Script
```javascript
// Validate all payments have corresponding flats
db.payments.aggregate([
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
])
```

---

## 📈 Analytics Queries

### Monthly Collection Rate
```javascript
db.payments.aggregate([
  {
    $group: {
      _id: { month: "$month", year: "$year" },
      collected: { $sum: "$amount" },
      flatsCount: { $addToSet: "$flatNumber" }
    }
  },
  {
    $addFields: {
      flatsPaid: { $size: "$flatsCount" }
    }
  }
])
```

### Top Payment Methods
```javascript
db.payments.aggregate([
  {
    $group: {
      _id: "$paymentMode",
      count: { $sum: 1 },
      totalAmount: { $sum: "$amount" }
    }
  },
  {
    $sort: { count: -1 }
  }
])
```

---

## 🚀 Future Schema Enhancements

### Planned Additions
1. **Buildings Collection**: Multi-building support
2. **Expenses Collection**: Track maintenance expenses
3. **Users Collection**: Proper user management
4. **Notifications Collection**: System notifications
5. **Audit Logs**: Track all system changes

### Schema Evolution Strategy
1. Backward compatibility maintenance
2. Gradual migration approach
3. Version control for schema changes
4. Rollback procedures for failed migrations

---

This schema provides a solid foundation for the maintenance payment tracking system while allowing for future enhancements and scalability.