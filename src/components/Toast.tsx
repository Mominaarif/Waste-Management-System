// Toast.jsx
import { X } from 'lucide-react';
import React, { useEffect } from 'react';

const Toast = ({ message, type, onClose, timeout }:any) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, timeout);

    return () => clearTimeout(timer); // Cleanup on unmount
  }, [onClose, timeout]);

  return (
    <div
      className={` text-sm fixed top-5 right-5 min-w-[250px] p-4 flex items-center justify-between shadow-lg z-50 ${
        type === 'success' ? 'text-green-500 bg-white border-l-3 border-green-500' : 'border-l-3 border-red-500 text-red-500 bg-white'
      }`}
    >
      <span>{message}</span>
      <button
        className="fixed top-[18px] right-[25px] cursor-pointer"
        onClick={onClose}
      >
        <X className=' w-4'/>
      </button>
    </div>
  );
};

export default Toast;