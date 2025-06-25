import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Phone, User, CreditCard, Calendar, Plus } from 'lucide-react';
import { flatGraph } from '../data/sampleData';

const FlatDetails = ({ flats, payments }) => {
  const { flatNumber } = useParams();
  const flat = flats.find(f => f.flatNumber === flatNumber);
  const flatPayments = payments.filter(p => p.flatNumber === flatNumber);

  if (!flat) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Flat Not Found</h2>
          <Link to="/" className="text-blue-600 hover:text-blue-800">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // Get connected flats using the graph
  const connectedFlats = flatGraph[flatNumber] || [];
  
  // Calculate group stats
  const getGroupStats = () => {
    const allFlatsInGroup = [flatNumber, ...connectedFlats];
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                       'July', 'August', 'September', 'October', 'November', 'December'];
    
    const paidInGroup = allFlatsInGroup.filter(fNumber => 
      payments.some(p => 
        p.flatNumber === fNumber && 
        p.month === monthNames[currentMonth] && 
        p.year === currentYear
      )
    ).length;
    
    return {
      total: allFlatsInGroup.length,
      paid: paidInGroup,
      due: allFlatsInGroup.length - paidInGroup
    };
  };

  const groupStats = getGroupStats();
  const totalPaid = flatPayments.reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link 
            to="/" 
            className="flex items-center text-blue-600 hover:text-blue-800 mr-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </Link>
        </div>

        {/* Flat Info Card */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-6 md:mb-0">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Flat {flatNumber}</h1>
              <div className="flex items-center space-x-6 text-gray-600">
                <div className="flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  <span>{flat.ownerName}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="w-5 h-5 mr-2" />
                  <span>{flat.contact}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
              <Link
                to="/add-payment"
                state={{ flatNumber }}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Add Payment</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment History */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800">Payment History</h2>
                <p className="text-gray-600">Total Paid: ₹{totalPaid.toLocaleString()}</p>
              </div>
              
              {flatPayments.length > 0 ? (
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
                      {flatPayments.map((payment) => (
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
                  <Link
                    to="/add-payment"
                    state={{ flatNumber }}
                    className="inline-flex items-center mt-4 text-blue-600 hover:text-blue-800"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add First Payment
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Group Stats Sidebar */}
          <div className="space-y-6">
            {/* Group Statistics */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Group Statistics</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Flats in Group</span>
                  <span className="font-semibold text-gray-800">{groupStats.total}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Paid This Month</span>
                  <span className="font-semibold text-green-600">{groupStats.paid}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Pending Dues</span>
                  <span className="font-semibold text-red-600">{groupStats.due}</span>
                </div>
              </div>
              
              {connectedFlats.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-800 mb-3">Connected Flats</h4>
                  <div className="flex flex-wrap gap-2">
                    {connectedFlats.map(fNumber => (
                      <Link
                        key={fNumber}
                        to={`/flat/${fNumber}`}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm hover:bg-blue-200 transition-colors"
                      >
                        {fNumber}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Payments</span>
                  <span className="font-semibold text-gray-800">{flatPayments.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Average Payment</span>
                  <span className="font-semibold text-gray-800">
                    ₹{flatPayments.length > 0 ? Math.round(totalPaid / flatPayments.length).toLocaleString() : 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Last Payment</span>
                  <span className="font-semibold text-gray-800">
                    {flatPayments.length > 0 
                      ? new Date(Math.max(...flatPayments.map(p => new Date(p.paidOn)))).toLocaleDateString()
                      : 'Never'
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlatDetails;