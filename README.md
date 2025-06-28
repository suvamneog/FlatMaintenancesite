# 🏢 Maintenance Payment Tracking System

A comprehensive web application for managing apartment maintenance payments with role-based access control, built with React.js frontend and Node.js backend.

## 📋 Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [What's Been Implemented](#whats-been-implemented)
- [Getting Started](#getting-started)
- [Usage Guide](#usage-guide)
- [API Documentation](#api-documentation)
- [Next Steps](#next-steps)
- [Contributing](#contributing)

## ✨ Features

### 🔐 Authentication System
- **Dual Role Login**: Separate interfaces for Admin and Residents
- **Persistent Sessions**: Login state maintained across browser sessions
- **Role-based Access Control**: Different permissions for admin and users

### 👨‍💼 Admin Features
- **Dashboard Overview**: Complete statistics and analytics
- **Payment Management**: Add, view, edit, and delete payments
- **Flat Management**: CRUD operations for flat information
- **Advanced Reports**: Export functionality with detailed analytics
- **Group Analytics**: DFS algorithm for flat grouping and statistics
- **Search & Filter**: Advanced filtering options for data management

### 🏠 Resident Features
- **Personal Dashboard**: Individual payment history and status
- **Payment Summary**: Current month status and yearly statistics
- **Group Information**: View connected flats and group statistics
- **Payment History**: Detailed view of all personal payments

### 🎨 UI/UX Features
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Modern Interface**: Clean, professional design with smooth animations
- **Interactive Elements**: Hover effects, loading states, and transitions
- **Status Indicators**: Visual feedback for payment status
- **Navigation**: Role-based navigation with mobile menu support

## 🛠 Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **Vite** - Fast build tool and dev server

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

## 📁 Project Structure

```
maintenance-payment-system/
├── backend/                    # Backend API server
│   ├── models/                # Database models
│   │   ├── Flat.js           # Flat schema
│   │   └── Payment.js        # Payment schema
│   ├── .env.example          # Environment variables template
│   ├── package.json          # Backend dependencies
│   ├── server.js             # Main server file
│   └── README.md             # Backend documentation
├── src/                       # Frontend React application
│   ├── components/           # React components
│   │   ├── Login.jsx         # Authentication component
│   │   ├── Dashboard.jsx     # Admin dashboard
│   │   ├── UserDashboard.jsx # Resident dashboard
│   │   ├── FlatDetails.jsx   # Flat details and payments
│   │   ├── AddPayment.jsx    # Payment form
│   │   ├── ManageFlats.jsx   # Flat management
│   │   ├── Reports.jsx       # Analytics and reports
│   │   └── Navbar.jsx        # Navigation component
│   ├── data/                 # Sample data and configurations
│   │   └── sampleData.js     # Initial data and flat graph
│   ├── App.jsx               # Main application component
│   ├── main.jsx              # Application entry point
│   └── index.css             # Global styles
├── package.json              # Frontend dependencies
├── tailwind.config.js        # Tailwind CSS configuration
├── vite.config.ts            # Vite configuration
└── README.md                 # This file
```

## 🚀 What's Been Implemented

### ✅ Completed Features

#### 1. **Authentication System**
- Login page with role selection (Admin/Resident)
- Session management with localStorage
- Protected routes based on user roles
- Logout functionality

#### 2. **Admin Interface**
- **Dashboard**: Overview with statistics, group analytics using DFS algorithm
- **Payment Management**: Add new payments with validation
- **Flat Management**: CRUD operations for flat information
- **Reports**: Comprehensive analytics with export functionality
- **Search & Filter**: Advanced filtering for flats and payments

#### 3. **Resident Interface**
- **Personal Dashboard**: Payment history and current status
- **Payment Summary**: Monthly and yearly statistics
- **Group Information**: Connected flats visualization

#### 4. **Data Management**
- **Sample Data**: Pre-populated flats and payments for testing
- **Graph Structure**: Flat connections for group analytics
- **State Management**: Proper React state handling
- **Data Validation**: Form validation and error handling

#### 5. **UI/UX Design**
- **Responsive Layout**: Mobile-friendly design
- **Modern Styling**: Professional appearance with Tailwind CSS
- **Interactive Elements**: Smooth animations and hover effects
- **Loading States**: User feedback during operations
- **Status Indicators**: Visual payment status representation

#### 6. **Backend API** (Ready for Integration)
- **RESTful Endpoints**: Complete API for all operations
- **Database Models**: MongoDB schemas for flats and payments
- **Authentication**: Simple admin authentication
- **Data Seeding**: Sample data population endpoint

### 🔧 Technical Implementations

#### 1. **Algorithms Used**
- **DFS (Depth-First Search)**: For grouping connected flats
- **Data Filtering**: Advanced search and filter algorithms
- **Statistics Calculation**: Real-time analytics computation

#### 2. **Design Patterns**
- **Component-based Architecture**: Modular React components
- **State Management**: Centralized state in App component
- **Role-based Access Control**: Conditional rendering and routing
- **Responsive Design**: Mobile-first approach

#### 3. **Data Structures**
- **Graph Representation**: Flat connections using adjacency list
- **Array Operations**: Efficient data filtering and sorting
- **Object Manipulation**: Dynamic data transformations

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

### Frontend Setup (Current)
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Backend Setup (When Ready)
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start MongoDB service (if local)
# Update MONGODB_URI in .env if needed

# Start development server
npm run dev

# Seed sample data (optional)
curl -X POST http://localhost:5000/api/seed
```

## 📖 Usage Guide

### 🔑 Login Credentials

#### Admin Access
- **Username**: `admin`
- **Password**: `admin`
- **Features**: Full system access, payment management, reports

#### Resident Access
- **Username**: Any flat number (101, 102, 103, 201, 202, 203, 301, 302)
- **Password**: `user123`
- **Features**: Personal payment history, group information

### 🎯 Admin Workflow
1. **Login** as admin
2. **Dashboard**: View overall statistics and group analytics
3. **Add Payment**: Record new maintenance payments
4. **Manage Flats**: Add, edit, or remove flat information
5. **Reports**: Generate and export detailed analytics
6. **Search**: Use filters to find specific data

### 🏠 Resident Workflow
1. **Login** with flat number
2. **Dashboard**: View personal payment summary
3. **Payment History**: Check detailed payment records
4. **Group Info**: See connected flats and group statistics

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Endpoints

#### Flats
- `GET /flats` - Get all flats
- `POST /flats` - Create new flat
- `GET /flats/:flatNumber` - Get flat by number

#### Payments
- `GET /payments` - Get all payments (with filters)
- `POST /payments` - Create new payment
- `GET /payments/flat/:flatNumber` - Get payments by flat
- `DELETE /payments/:id` - Delete payment

#### Authentication
- `POST /auth/login` - Admin login

#### Development
- `POST /seed` - Seed database with sample data

## 🎯 Next Steps

### 🔄 Immediate Actions (What You Should Do Now)

#### 1. **Test the Current Frontend**
```bash
# Start the development server
npm run dev

# Test both login types:
# Admin: admin/admin
# Resident: 101/user123 (or any flat number)
```

#### 2. **Set Up Backend Integration**
```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Start MongoDB (if local)
# Or update .env with MongoDB Atlas connection

# Start backend server
npm run dev

# Seed sample data
curl -X POST http://localhost:5000/api/seed
```

#### 3. **Connect Frontend to Backend**
- Update API calls in components to use backend endpoints
- Replace sample data with real API calls
- Implement proper error handling for API failures

### 🚀 Future Enhancements

#### 1. **Authentication Improvements**
- [ ] JWT token-based authentication
- [ ] Password hashing and security
- [ ] Password reset functionality
- [ ] Email verification for residents

#### 2. **Payment Features**
- [ ] Online payment integration (Razorpay/Stripe)
- [ ] Payment reminders and notifications
- [ ] Bulk payment upload (Excel/CSV)
- [ ] Payment receipts generation (PDF)

#### 3. **Advanced Features**
- [ ] Email notifications for due payments
- [ ] SMS integration for reminders
- [ ] Mobile app development
- [ ] Advanced reporting with charts
- [ ] Expense tracking for maintenance activities

#### 4. **System Improvements**
- [ ] Database backup and restore
- [ ] Audit logs for all operations
- [ ] Multi-building support
- [ ] Role-based permissions (Secretary, Treasurer, etc.)

#### 5. **UI/UX Enhancements**
- [ ] Dark mode support
- [ ] Advanced data visualization
- [ ] Drag-and-drop file uploads
- [ ] Real-time notifications

### 📋 Development Checklist

#### Phase 1: Backend Integration
- [ ] Set up MongoDB database
- [ ] Test all API endpoints
- [ ] Connect frontend to backend
- [ ] Implement error handling
- [ ] Test authentication flow

#### Phase 2: Production Readiness
- [ ] Environment configuration
- [ ] Security hardening
- [ ] Performance optimization
- [ ] Testing (unit, integration)
- [ ] Documentation updates

#### Phase 3: Deployment
- [ ] Choose hosting platform
- [ ] Set up CI/CD pipeline
- [ ] Configure production database
- [ ] Domain and SSL setup
- [ ] Monitoring and logging

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Current Status**: ✅ Frontend Complete | 🔄 Backend Ready for Integration | 🚀 Ready for Testing

**Next Action**: Start the development server and test the authentication system!