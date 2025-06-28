import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, CreditCard, Calendar, Phone, User, LogOut, Receipt, TrendingUp, Clock } from 'lucide-react';
import Navbar from './Navbar';

const UserDashboard = ({ flats, payments, user, onLogout }) => {
  const userFlat = flats.find(flat => flat.flatNumber === user.flatNumber);
  const userPayments = payments.filter(payment => payment.flatNumber === user.flatNumber);

  // Calculate payment statistics
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                     'July', 'August', 'September', 'October', 'November', 'December'];

  const currentMonthPayment = userPayments.find(p => 
    p.month === monthNames[currentMonth] && p.year === currentYear
  );

  const yearlyPayments = userPayments.filter(p => p.year === currentYear);
  const totalPaidThisYear = yearlyPayments.reduce((sum, payment) => sum + payment.amount, 0);
  const monthsPaid = yearlyPayments.length;
  const monthsPending = 12 - monthsPaid;

  // Recent payments (last 6 months)
  const recentPayments = userPayments
    .sort((a, b) => new Date(b.paidOn) - new Date(a.paidOn))
    .slice(0, 6);

  // Payment status for current month
  const isCurrentMonthPaid = !!currentMonthPayment;

  return (
    <div className="min-h-screen">
      <Navbar user={user} onLogout={onLogout} />
      
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          {/* Welcome Header */}
          <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  Welcome, {userFlat?.ownerName || 'Resident'}
                </h1>
                <div className="flex items-center space-x-6 text-gray-600">
                  <div className="flex items-center">
                    <Home className="w-5 h-5 mr-2" />
                    <span>Flat {user.flatNumber}</span>
                  </div>
                  {userFlat && (
                    <div className="flex items-center">
                      <Phone className="w-5 h-5 mr-2" />
                      <span>{userFlat.contact}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className={`px-6 py-3 rounded-full text-sm font-medium ${
                isCurrentMonthPaid 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {isCurrentMonthPaid ? 'Current Month Paid' : 'Payment Due'}
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">This Year Paid</p>
                  <p className="text-2xl font-bold text-green-600">₹{totalPaidThisYear.toLocaleString()}</p>
                </div>
                <div className="bg-green-100 rounded-full p-3">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Months Paid</p>
                  <p className="text-2xl font-bold text-blue-600">{monthsPaid}/12</p>
                </div>
                <div className="bg-blue-100 rounded-full p-3">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Pending Months</p>
                  <p className="text-2xl font-bold text-orange-600">{monthsPending}</p>
                </div>
                <div className="bg-orange-100 rounded-full p-3">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Payments</p>
                  <p className="text-2xl font-bold text-purple-600">{userPayments.length}</p>
                </div>
                <div className="bg-purple-100 rounded-full p-3">
                  <Receipt className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Payment History */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-800">Recent Payment History</h2>
                    <Link
                      to="/my-payments"
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      View All
                    </Link>
                  </div>
                </div>
                
                {recentPayments.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Month</th>
                          <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Year</th>
                          <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Amount</th>
                          <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Paid On</th>
                          <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Mode</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {recentPayments.map((payment) => (
                          <tr key={payment.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm text-gray-800">{payment.month}</td>
                            <td className="px-6 py-4 text-sm text-gray-600">{payment.year}</td>
                            <td className="px-6 py-4 text-sm font-medium text-gray-800">
                              ₹{payment.amount.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              {new Date(payment.paidOn).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4">
                              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                {payment.paymentMode}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    <CreditCard className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No payment history found</p>
                    <p className="text-sm mt-2">Contact admin to add your payments</p>
                  </div>
                )}
              </div>
            </div>

            {/* Current Month Status & Quick Actions */}
            <div className="space-y-6">
              {/* Current Month Status */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Current Month Status</h3>
                <div className="text-center">
                  <div className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center ${
                    isCurrentMonthPaid ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    <CreditCard className={`w-8 h-8 ${
                      isCurrentMonthPaid ? 'text-green-600' : 'text-red-600'
                    }`} />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">
                    {monthNames[currentMonth]} {currentYear}
                  </h4>
                  <p className={`text-sm font-medium ${
                    isCurrentMonthPaid ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {isCurrentMonthPaid ? 'Payment Completed' : 'Payment Pending'}
                  </p>
                  {currentMonthPayment && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">
                        Paid: ₹{currentMonthPayment.amount.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600">
                        On: {new Date(currentMonthPayment.paidOn).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-600">
                        Via: {currentMonthPayment.paymentMode}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Summary */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Payment Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Standard Monthly Fee</span>
                    <span className="font-semibold">₹1,500</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Payments Made</span>
                    <span className="font-semibold">{userPayments.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Average Payment</span>
                    <span className="font-semibold">
                      ₹{userPayments.length > 0 ? 
                        Math.round(userPayments.reduce((sum, p) => sum + p.amount, 0) / userPayments.length).toLocaleString() 
                        : 0}
                    </span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-gray-200">
                    <span className="text-gray-600">Last Payment</span>
                    <span className="font-semibold">
                      {userPayments.length > 0 
                        ? new Date(Math.max(...userPayments.map(p => new Date(p.paidOn)))).toLocaleDateString()
                        : 'Never'
                      }
                    </span>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-blue-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-blue-800 mb-3">Need Help?</h3>
                <div className="space-y-2 text-blue-700 text-sm">
                  <p>• Contact admin for payment issues</p>
                  <p>• Standard maintenance fee: ₹1,500/month</p>
                  <p>• Payment due by 5th of each month</p>
                  <p>• Multiple payment modes accepted</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;