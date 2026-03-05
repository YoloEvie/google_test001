
import React, { useState } from 'react';
import { OrderData } from '../types';

interface OrderSummaryProps {
  order: OrderData;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ order }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const displayCount = isExpanded ? order.items.length : 3;
  const hasMore = order.items.length > 3;
  
  const finalAmount = order.totalAmount - order.discountAmount;

  return (
    <div className="flex flex-col h-full overflow-hidden mt-8 md:mt-4">
      {/* 1. Payment Details Section */}
      <div className="bg-white/50 rounded-2xl p-5 border border-slate-100 shadow-sm mb-6">
        <div className="space-y-3">
          <div className="flex justify-between text-slate-500 text-sm">
            <span>Subtotal</span>
            <span className="font-medium text-slate-700">{order.currency}{order.totalAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-red-500 text-sm">
            <span>Discount Applied</span>
            <span className="font-medium">-{order.currency}{order.discountAmount.toFixed(2)}</span>
          </div>
          <div className="h-px bg-slate-100 my-2"></div>
          <div className="flex justify-between items-baseline">
            <span className="text-sm font-bold text-slate-900 uppercase tracking-tight">Total to Pay</span>
            <span className="text-3xl font-black text-red-600 tracking-tighter">
              {order.currency}{finalAmount.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Order Metadata Area */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div>
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Order Details</h3>
          <p className="text-sm font-bold text-slate-600">ID: {order.orderNumber}</p>
        </div>
        <div className="bg-slate-200/50 px-2 py-1 rounded text-[10px] font-bold text-slate-500">
          {order.items.length} {order.items.length === 1 ? 'ITEM' : 'ITEMS'}
        </div>
      </div>

      {/* 3. Product List (Scrollable) */}
      <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar space-y-3 pb-4">
        {order.items.slice(0, displayCount).map((item) => (
          <div 
            key={item.id} 
            className="group flex gap-3 p-2 rounded-2xl hover:bg-white/80 transition-all duration-200 border border-transparent hover:border-slate-100"
          >
            <div className="relative shrink-0">
              <img 
                src={item.image} 
                alt={item.name} 
                className="w-14 h-14 rounded-xl object-cover shadow-sm bg-white border border-slate-50" 
              />
              {item.quantity > 1 && (
                <span className="absolute -top-1.5 -right-1.5 bg-slate-900 text-white text-[9px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-slate-50 shadow-sm">
                  {item.quantity}
                </span>
              )}
            </div>
            <div className="flex-grow min-w-0 flex flex-col justify-center">
              <div className="text-xs font-bold text-slate-800 truncate group-hover:text-[#6AB3FC] transition-colors">{item.name}</div>
              <div className="text-[10px] text-slate-400 truncate mt-0.5">{item.description}</div>
              <div className="text-xs font-black text-slate-900 mt-1">
                {order.currency}{item.price.toFixed(2)}{item.quantity > 1 ? <span className="text-slate-400 font-medium ml-1">× {item.quantity}</span> : ''}
              </div>
            </div>
          </div>
        ))}

        {hasMore && (
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full text-center text-[#6AB3FC] hover:text-[#549EE8] text-[11px] font-black py-3 rounded-xl border border-dashed border-slate-200 hover:border-[#6AB3FC] hover:bg-blue-50/30 transition-all flex items-center justify-center gap-2 mt-2"
          >
            {isExpanded ? (
              <>COLLAPSE LIST <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 transform rotate-180" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg></>
            ) : (
              <>VIEW ALL {order.items.length} ITEMS <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg></>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default OrderSummary;
