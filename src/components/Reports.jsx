import React, { useState } from 'react';
import { FileText, Download, Calendar, TrendingUp, Users, DollarSign } from 'lucide-react';
import Navbar from './Navbar';

const Reports = ({ flats, payments, user, onLogout }) => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState('');

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const years = [2020, 2021, 2022, 2023, 2024, 2025];

  // Filter payments based on selected filters
  const filteredPayments = payments.filter(payment => {
    const yearMatch = payment.year === selectedYear;
    const monthMatch = !selectedMonth || payment.month === selectedMonth;
    return yearMatch && monthMatch;
  });

  // Calculate statistics
  const totalRevenue = filteredPayments.reduce((sum, payment) => sum + payment.amount, 0);
  const totalPayments = filteredPayments.length;
  const averagePayment = totalPayments > 0 ? totalRevenue / totalPayments : 0;

  // Payment mode distribution
  const paymentModeStats = filteredPayments.reduce((acc, payment) => {
    acc[payment.paymentMode] = (acc[payment.paymentMode] || 0) + 1;
    return acc;
  }, {});

  // Monthly revenue (for yearly view)
  const monthlyRevenue = months.map(month => {
    const monthPayments = payments.filter(p => p.year === selectedYear && p.month === month);
    return {
      month,
      revenue: monthPayments.reduce((sum, p) => sum + p.amount, 0),
      count: monthPayments.length
    };
  });

  // Flat-wise payment status
  const flatPaymentStatus = flats.map(flat => {
    const flatPayments = filteredPayments.filter(p => p.flatNumber === flat.flatNumber);
    const totalPaid = flatPayments.reduce((sum, p) => sum + p.amount, 0);
    return {
      ...flat,
      paymentsCount: flatPayments.length,
      totalPaid,
      lastPayment: flatPayments.length > 0 
        ? new Date(Math.max(...flatPayments.map(p => new Date(p.paidOn))))
        : null
    };
  });

  // Outstanding dues calculation
  const expectedMonthlyRevenue = flats.length * 1500; // Assuming ₹1500 per flat
  const currentMonth = new Date().getMonth();
  const monthsElapsed = selectedMonth ? 1 : currentMonth + 1;
  const expectedRevenue = expectedMonthlyRevenue * monthsElapsed;
  const outstandingDues = expectedRevenue - totalRevenue;

  const handleExportReport = () => {
    const reportData = {
      period: selectedMonth ? `${selectedMonth} ${selectedYear}` : `Year ${selectedYear}`,
      totalRevenue,
      totalPayments,
      averagePayment,
      outstandingDues,
      paymentModeStats,
      flatPaymentStatus
    };

    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `maintenance-report-${selectedYear}${selectedMonth ? `-${selectedMonth}` : ''}.json`;
    link.click();
  };

  return (
    <div className="min-h-screen">
      <Navbar user={user} onLogout={onLogout} />
      
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 rounded-full p-3">
                  <FileText className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">Reports & Analytics</h1>
                  <p className="text-gray-600">View payment reports and statistics</p>
                </div>
              </div>
              <button
                onClick={handleExportReport}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
              >
                <Download className="w-5 h-5" />
                <span>Export Report</span>
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Report Filters</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Month (Optional)</label>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Months</option>
                  {months.map(month => (
                    <option key={month} value={month}>{month}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Revenue</p>
                  <p className="text-2xl font-bold text-green-600">₹{totalRevenue.toLocaleString()}</p>
                </div>
                <div className="bg-green-100 rounded-full p-3">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Payments</p>
                  <p className="text-2xl font-bold text-blue-600">{totalPayments}</p>
                </div>
                <div className="bg-blue-100 rounded-full p-3">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Average Payment</p>
                  <p className="text-2xl font-bold text-purple-600">₹{Math.round(averagePayment).toLocaleString()}</p>
                </div>
                <div className="bg-purple-100 rounded-full p-3">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Outstanding Dues</p>
                  <p className="text-2xl font-bold text-red-600">₹{Math.max(0, outstandingDues).toLocaleString()}</p>
                </div>
                <div className="bg-red-100 rounded-full p-3">
                  <Users className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Payment Mode Distribution */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Payment Mode Distribution</h3>
              <div className="space-y-4">
                {Object.entries(paymentModeStats).map(([mode, count]) => (
                  <div key={mode} className="flex items-center justify-between">
                    <span className="text-gray-600">{mode}</span>
                    <div className="flex items-center space-x-3">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${(count / totalPayments) * 100}%` }}
                        ></div>
                      </div>
                      <span className="font-semibold text-gray-800">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Monthly Revenue (for yearly view) */}
            {!selectedMonth && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Monthly Revenue - {selectedYear}</h3>
                <div className="space-y-3">
                  {monthlyRevenue.map(({ month, revenue, count }) => (
                    <div key={month} className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">{month}</span>
                      <div className="flex items-center space-x-4">
                        <span className="text-gray-800">₹{revenue.toLocaleString()}</span>
                        <span className="text-gray-500">({count} payments)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Flat-wise Payment Status */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">Flat-wise Payment Status</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Flat No.</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Owner</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Payments</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Total Paid</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Last Payment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {flatPaymentStatus.map((flat) => (
                    <tr key={flat.flatNumber} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-800">{flat.flatNumber}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{flat.ownerName}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{flat.paymentsCount}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-800">
                        ₹{flat.totalPaid.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {flat.lastPayment ? flat.lastPayment.toLocaleDateString() : 'Never'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;