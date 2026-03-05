
import React, { useState } from 'react';
import CheckoutModal from './components/CheckoutModal';
import { OrderData } from './types';

const MOCK_ORDER: OrderData = {
  orderNumber: "LX-98725410",
  totalAmount: 1380.00,
  discountAmount: 121.00,
  currency: "$",
  items: [
    {
      id: "1",
      name: "Smart Pro Monitor X1",
      price: 899.00,
      quantity: 1,
      image: "https://picsum.photos/seed/monitor/200/200",
      description: "27-inch 4K UHD display with HDR support."
    },
    {
      id: "2",
      name: "Mechanical Keyboard G-Series",
      price: 150.00,
      quantity: 1,
      image: "https://picsum.photos/seed/keyboard/200/200",
      description: "RGB backlit mechanical keyboard with blue switches."
    },
    {
      id: "3",
      name: "Ergonomic Office Mouse",
      price: 85.00,
      quantity: 2,
      image: "https://picsum.photos/seed/mouse/200/200",
      description: "Wireless ergonomic mouse with precision sensor."
    }
  ]
};

const App: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#F8FAF9]">
      <div className="text-center max-w-2xl animate-in fade-in zoom-in duration-700">
        <div className="mb-8 inline-block p-6 bg-white rounded-[2.5rem] shadow-xl shadow-blue-500/5 border border-slate-50">
           <svg className="w-16 h-16 text-[#6AB3FC]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
           </svg>
        </div>
        <h1 className="text-[40px] font-black text-[#051129] mb-4 tracking-tight leading-tight">
          SeaMe <span className="text-[#6AB3FC]">Checkout</span>
        </h1>
        <p className="text-slate-500 mb-12 text-lg font-medium leading-relaxed">
          体验新一代极致支付交互。专为高端品牌定制的极简收银流程，<br/>集成智能辅助与全球主流支付渠道。
        </p>
        
        <div className="flex justify-center">
          <button
            onClick={() => setIsModalOpen(true)}
            className="group relative bg-[#051129] hover:bg-slate-800 text-white font-bold py-5 px-14 rounded-[2rem] transition-all transform hover:scale-105 active:scale-95 shadow-2xl shadow-slate-300 overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-3 text-lg">
              开始结账体验
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>
        
        <p className="mt-12 text-[10px] text-slate-300 font-black uppercase tracking-[0.3em]">
          Powered by SeaMe Cloud Ecosystem
        </p>
      </div>

      {isModalOpen && (
        <CheckoutModal 
          order={MOCK_ORDER} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </div>
  );
};

export default App;
