
import React from 'react';
import { PaymentType, PaymentOptionProps } from '../types';

// Fixed: Use the simplified PaymentOptionProps as it now correctly handles demo-specific types
const PaymentOption: React.FC<PaymentOptionProps> = ({ type, isSelected, onSelect, label, icon }) => {
  return (
    <button
      onClick={() => onSelect(type)}
      className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all shrink-0 ${
        isSelected 
          ? 'border-[#6AB3FC] bg-blue-50/50 shadow-sm' 
          : 'border-slate-100 hover:border-slate-200 bg-white'
      }`}
    >
      <div className="flex items-center gap-4">
        <div className={`p-2 rounded-xl transition-colors ${isSelected ? 'bg-[#6AB3FC] text-white' : 'bg-slate-100 text-slate-500'}`}>
          {icon}
        </div>
        <span className={`font-semibold transition-colors ${isSelected ? 'text-blue-900' : 'text-slate-700'}`}>{label}</span>
      </div>
      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
        isSelected ? 'border-[#6AB3FC] bg-[#6AB3FC]' : 'border-slate-200'
      }`}>
        {isSelected && (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        )}
      </div>
    </button>
  );
};

export default PaymentOption;
