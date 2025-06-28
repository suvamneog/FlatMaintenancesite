import React, { useState } from 'react';
import { Plus, Edit, Trash2, Save, X, Home } from 'lucide-react';
import Navbar from './Navbar';

const ManageFlats = ({ flats, onAddFlat, onUpdateFlat, onDeleteFlat, user, onLogout }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingFlat, setEditingFlat] = useState(null);
  const [formData, setFormData] = useState({
    flatNumber: '',
    ownerName: '',
    contact: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingFlat) {
      onUpdateFlat(editingFlat.flatNumber, formData);
      setEditingFlat(null);
    } else {
      // Check if flat number already exists
      if (flats.some(flat => flat.flatNumber === formData.flatNumber)) {
        alert('Flat number already exists!');
        return;
      }
      onAddFlat(formData);
      setShowAddForm(false);
    }
    
    setFormData({ flatNumber: '', ownerName: '', contact: '' });
  };

  const handleEdit = (flat) => {
    setEditingFlat(flat);
    setFormData(flat);
    setShowAddForm(false);
  };

  const handleDelete = (flatNumber) => {
    if (window.confirm(`Are you sure you want to delete flat ${flatNumber}? This will also delete all associated payments.`)) {
      onDeleteFlat(flatNumber);
    }
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingFlat(null);
    setFormData({ flatNumber: '', ownerName: '', contact: '' });
  };

  return (
    <div className="min-h-screen">
      <Navbar user={user} onLogout={onLogout} />
      
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 rounded-full p-3">
                  <Home className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">Manage Flats</h1>
                  <p className="text-gray-600">Add, edit, or remove flat information</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Add Flat</span>
              </button>
            </div>
          </div>

          {/* Add/Edit Form */}
          {(showAddForm || editingFlat) && (
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                {editingFlat ? 'Edit Flat' : 'Add New Flat'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Flat Number *
                    </label>
                    <input
                      type="text"
                      value={formData.flatNumber}
                      onChange={(e) => setFormData({...formData, flatNumber: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 101"
                      required
                      disabled={!!editingFlat}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Owner Name *
                    </label>
                    <input
                      type="text"
                      value={formData.ownerName}
                      onChange={(e) => setFormData({...formData, ownerName: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter owner name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Number *
                    </label>
                    <input
                      type="tel"
                      value={formData.contact}
                      onChange={(e) => setFormData({...formData, contact: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter contact number"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors flex items-center space-x-2"
                  >
                    <X className="w-5 h-5" />
                    <span>Cancel</span>
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  >
                    <Save className="w-5 h-5" />
                    <span>{editingFlat ? 'Update' : 'Add'} Flat</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Flats List */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">All Flats ({flats.length})</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Flat No.</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Owner Name</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Contact</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {flats.map((flat) => (
                    <tr key={flat.flatNumber} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-800">{flat.flatNumber}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{flat.ownerName}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{flat.contact}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => handleEdit(flat)}
                            className="text-blue-600 hover:text-blue-800 transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(flat.flatNumber)}
                            className="text-red-600 hover:text-red-800 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
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

export default ManageFlats;