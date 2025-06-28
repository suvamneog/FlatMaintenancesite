import React, { useState } from 'react';
import { Lock, User, Building2, UserCheck, Shield } from 'lucide-react';

const Login = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [loginType, setLoginType] = useState('admin'); // 'admin' or 'user'
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (loginType === 'admin') {
      if (credentials.username === 'admin' && credentials.password === 'admin') {
        onLogin({
          username: 'admin',
          role: 'admin',
          name: 'System Administrator'
        });
      } else {
        alert('Invalid admin credentials. Use admin/admin');
      }
    } else {
      // User login - check if username matches a flat number
      const flatNumber = credentials.username;
      if (credentials.password === 'user123') {
        onLogin({
          username: flatNumber,
          role: 'user',
          name: `Flat ${flatNumber} Owner`,
          flatNumber: flatNumber
        });
      } else {
        alert('Invalid user credentials. Use your flat number as username and "user123" as password');
      }
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="bg-blue-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Building2 className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Maintenance System</h1>
          <p className="text-gray-600 mt-2">Welcome Back</p>
        </div>

        {/* Login Type Selector */}
        <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
          <button
            type="button"
            onClick={() => setLoginType('admin')}
            className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              loginType === 'admin'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Shield className="w-4 h-4 mr-2" />
            Admin
          </button>
          <button
            type="button"
            onClick={() => setLoginType('user')}
            className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              loginType === 'user'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <UserCheck className="w-4 h-4 mr-2" />
            Resident
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {loginType === 'admin' ? 'Username' : 'Flat Number'}
            </label>
            <div className="relative">
              <User className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                value={credentials.username}
                onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={loginType === 'admin' ? 'Enter username' : 'Enter your flat number (e.g., 101)'}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
              <input
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter password"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              'Login'
            )}
          </button>
        </form>

        <div className="mt-6 space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800 font-medium mb-2">Admin Access:</p>
            <p className="text-sm text-blue-700">
              Username: <span className="font-mono">admin</span><br />
              Password: <span className="font-mono">admin</span>
            </p>
          </div>
          
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-green-800 font-medium mb-2">Resident Access:</p>
            <p className="text-sm text-green-700">
              Flat Number: <span className="font-mono">101, 102, 103, etc.</span><br />
              Password: <span className="font-mono">user123</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;