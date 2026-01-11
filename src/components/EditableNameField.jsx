
import React, { useState, useRef, useEffect } from 'react';
import { Pencil, Check, X, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const EditableNameField = ({ currentName, onSave, vehicleType = 'Vehicle' }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(currentName);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    // Sync external changes unless currently editing
    if (!isEditing) {
      setValue(currentName);
    }
  }, [currentName, isEditing]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSubmit = async () => {
    setError('');
    const trimmedValue = value.trim();
    
    if (!trimmedValue) {
      setError('Name cannot be empty');
      return;
    }

    if (trimmedValue === currentName) {
      setIsEditing(false);
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await onSave(trimmedValue);
      
      if (result.success) {
        setIsEditing(false);
        setError('');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('An error occurred while saving.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setValue(currentName);
    setError('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <div className="relative group">
      {!isEditing ? (
        <div className="flex items-center gap-3">
          <h2 className="text-3xl font-bold text-gray-800">{currentName}</h2>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsEditing(true)}
            className="p-2 text-gray-400 hover:text-[#ff6600] transition-colors rounded-full hover:bg-orange-50"
            aria-label={`Edit ${vehicleType} Name`}
          >
            <Pencil size={20} />
          </motion.button>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          className="flex flex-col items-start gap-2"
        >
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                if (error) setError('');
              }}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              className={`text-2xl font-bold text-[#4d148c] px-3 py-1 border-b-2 bg-transparent focus:outline-none transition-colors w-full min-w-[200px] ${
                error ? 'border-red-500' : 'border-[#4d148c]'
              }`}
              placeholder={`Enter ${vehicleType} name`}
            />
            
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="p-2 bg-[#ff6600] text-white rounded-lg shadow-md hover:bg-[#e55c00] disabled:opacity-50 transition-colors"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Check size={20} />
              )}
            </button>
            
            <button
              onClick={handleCancel}
              disabled={isLoading}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          
          <AnimatePresence>
            {error && (
              <motion.div
                key="error-message"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-1 text-sm text-red-600 bg-red-50 px-2 py-1 rounded"
              >
                <AlertCircle size={14} />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};

export default EditableNameField;
