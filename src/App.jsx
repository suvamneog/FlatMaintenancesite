import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import FlatDetails from './components/FlatDetails';
import AddPayment from './components/AddPayment';
import { sampleData } from './data/sampleData';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Set to false to show login
  const [flats, setFlats] = useState(sampleData.flats);
  const [payments, setPayments] = useState(sampleData.payments);

  const addPayment = (payment) => {
    setPayments([...payments, { ...payment, id: Date.now() }]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Routes>
        <Route 
          path="/login" 
          element={!isAuthenticated ? <Login onLogin={() => setIsAuthenticated(true)} /> : <Navigate to="/" />} 
        />
        <Route 
          path="/" 
          element={isAuthenticated ? <Dashboard flats={flats} payments={payments} /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/flat/:flatNumber" 
          element={isAuthenticated ? <FlatDetails flats={flats} payments={payments} /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/add-payment" 
          element={isAuthenticated ? <AddPayment flats={flats} onAddPayment={addPayment} /> : <Navigate to="/login" />} 
        />
      </Routes>
    </div>
  );
}

export default App;