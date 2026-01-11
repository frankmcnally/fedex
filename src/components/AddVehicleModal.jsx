
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle } from 'lucide-react';

const AddVehicleModal = ({ isOpen, onClose, onSave, type }) => {
  const [name, setName] = useState('');
  const [capacity, setCapacity] = useState('');
  const [currentPackages, setCurrentPackages] = useState('0');
  const [error, setError] = useState('');

  const resetForm = () => {
    setName('');
    setCapacity('');
    setCurrentPackages('0');
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const cap = parseInt(capacity);
    const curr = parseInt(currentPackages);

    if (!name.trim()) {
      setError('Name is required');
      return;
    }
    if (isNaN(cap) || cap < 1) {
      setError('Capacity must be at least 1');
      return;
    }
    if (isNaN(curr) || curr < 0) {
      setError('Current packages cannot be negative');
      return;
    }
    if (curr > cap) {
      setError('Current packages cannot exceed capacity');
      return;
    }

    onSave({
      name,
      capacity: cap,
      currentPackages: curr
    });
    
    resetForm();
    onClose();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
          />
          
          {/* Modal */}
          <div key="modal-container" className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-xl shadow-2xl w-full max-w-md pointer-events-auto overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-800">Add New {type}</h3>
                  <button
                    onClick={handleClose}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
                  >
                    <X size={24} />
                  </button>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg flex items-center gap-2 text-sm">
                    <AlertCircle size={16} />
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {type} Name / Identifier
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={`e.g., ${type} 101`}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#4d148c] focus:border-transparent outline-none transition-all"
                      autoFocus
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Capacity
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={capacity}
                        onChange={(e) => setCapacity(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#4d148c] focus:border-transparent outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Current Packages
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={currentPackages}
                        onChange={(e) => setCurrentPackages(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#4d148c] focus:border-transparent outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="flex-1 px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-[#4d148c] text-white rounded-lg hover:bg-[#3d1070] font-medium transition-colors shadow-md"
                    >
                      Save {type}
                    </button>
                  </div>
                </form>
              </div>
              
              {/* Decorative accent bar */}
              <div className="h-2 w-full bg-[#ff6600]"></div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AddVehicleModal;
