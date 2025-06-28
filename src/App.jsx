import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import UserDashboard from './components/UserDashboard';
import FlatDetails from './components/FlatDetails';
import AddPayment from './components/AddPayment';
import ManageFlats from './components/ManageFlats';
import Reports from './components/Reports';
import { sampleData } from './data/sampleData';

function App() {
  const [user, setUser] = useState(null);
  const [flats, setFlats] = useState(sampleData.flats);
  const [payments, setPayments] = useState(sampleData.payments);

  // Check for saved authentication on app load
  useEffect(() => {
    const savedUser = localStorage.getItem('maintenanceUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('maintenanceUser', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('maintenanceUser');
  };

  const addPayment = (payment) => {
    const newPayment = { ...payment, id: Date.now() };
    setPayments([...payments, newPayment]);
  };

  const addFlat = (flat) => {
    setFlats([...flats, flat]);
  };

  const updateFlat = (flatNumber, updatedFlat) => {
    setFlats(flats.map(flat => 
      flat.flatNumber === flatNumber ? updatedFlat : flat
    ));
  };

  const deleteFlat = (flatNumber) => {
    setFlats(flats.filter(flat => flat.flatNumber !== flatNumber));
    setPayments(payments.filter(payment => payment.flatNumber !== flatNumber));
  };

  const deletePayment = (paymentId) => {
    setPayments(payments.filter(payment => payment.id !== paymentId));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Routes>
        <Route 
          path="/login" 
          element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/" />} 
        />
        
        {/* Admin Routes */}
        {user?.role === 'admin' && (
          <>
            <Route 
              path="/" 
              element={
                <Dashboard 
                  flats={flats} 
                  payments={payments} 
                  user={user}
                  onLogout={handleLogout}
                />
              } 
            />
            <Route 
              path="/flat/:flatNumber" 
              element={
                <FlatDetails 
                  flats={flats} 
                  payments={payments} 
                  user={user}
                  onLogout={handleLogout}
                  onDeletePayment={deletePayment}
                />
              } 
            />
            <Route 
              path="/add-payment" 
              element={
                <AddPayment 
                  flats={flats} 
                  onAddPayment={addPayment}
                  user={user}
                  onLogout={handleLogout}
                />
              } 
            />
            <Route 
              path="/manage-flats" 
              element={
                <ManageFlats 
                  flats={flats}
                  onAddFlat={addFlat}
                  onUpdateFlat={updateFlat}
                  onDeleteFlat={deleteFlat}
                  user={user}
                  onLogout={handleLogout}
                />
              } 
            />
            <Route 
              path="/reports" 
              element={
                <Reports 
                  flats={flats}
                  payments={payments}
                  user={user}
                  onLogout={handleLogout}
                />
              } 
            />
          </>
        )}

        {/* User Routes */}
        {user?.role === 'user' && (
          <>
            <Route 
              path="/" 
              element={
                <UserDashboard 
                  flats={flats} 
                  payments={payments} 
                  user={user}
                  onLogout={handleLogout}
                />
              } 
            />
            <Route 
              path="/my-payments" 
              element={
                <FlatDetails 
                  flats={flats} 
                  payments={payments} 
                  user={user}
                  onLogout={handleLogout}
                  userView={true}
                />
              } 
            />
          </>
        )}

        {/* Redirect based on authentication */}
        <Route 
          path="*" 
          element={
            user ? <Navigate to="/" /> : <Navigate to="/login" />
          } 
        />
      </Routes>
    </div>
  );
}

export default App;