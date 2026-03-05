
import React, { useState, useEffect } from 'react';
import { PaymentType, OrderData, SavedCard } from '../types';
import PaymentOption from './PaymentOption';
import OrderSummary from './OrderSummary';
import SmartAssistant from './SmartAssistant';

interface CheckoutModalProps {
  order: OrderData;
  onClose: () => void;
}

enum ExtendedPaymentType {
  ALIPAY = 'ALIPAY',
  WECHAT_PAY = 'WECHAT_PAY',
  PAYPAL = 'PAYPAL'
}

type AnyPaymentType = PaymentType | ExtendedPaymentType;

const MOCK_SAVED_CARDS: SavedCard[] = [
  { id: 'sc_1', brand: 'Visa', last4: '4242', expiry: '12/26', holderName: 'J. Smith' },
];

const CheckoutModal: React.FC<CheckoutModalProps> = ({ order, onClose }) => {
  const [selectedMethod, setSelectedMethod] = useState<AnyPaymentType | null>(PaymentType.CREDIT_CARD);
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'checkout' | 'success'>('checkout');
  const [isMaximized, setIsMaximized] = useState(false);
  
  // Credit Card Specific State
  const [savedCards, setSavedCards] = useState<SavedCard[]>(MOCK_SAVED_CARDS);
  const [selectedCardId, setSelectedCardId] = useState<string | 'new'>(MOCK_SAVED_CARDS[0]?.id || 'new');
  const [shouldSaveNewCard, setShouldSaveNewCard] = useState(false);
  const [newCardData, setNewCardData] = useState({ number: '', expiry: '', cvc: '', name: '' });

  const finalAmount = order.totalAmount - order.discountAmount;

  const handlePayment = () => {
    if (!selectedMethod) return;
    setIsProcessing(true);
    
    setTimeout(() => {
      if (selectedMethod === PaymentType.CREDIT_CARD && selectedCardId === 'new') {
        if (shouldSaveNewCard) {
            const last4 = newCardData.number.slice(-4) || '8888';
            const newCard: SavedCard = {
              id: `sc_${Date.now()}`,
              brand: 'Visa',
              last4,
              expiry: newCardData.expiry || '01/29',
              holderName: newCardData.name || 'Valued Customer'
            };
            setSavedCards(prev => [...prev, newCard]);
        }
      }
      
      setIsProcessing(false);
      setStep('success');
    }, 2000);
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  // Card Brand Icons
  const brands = [
    { name: 'UnionPay', color: 'bg-[#00707b]', icon: '银联' },
    { name: 'Mastercard', color: 'bg-white', icon: 'M' },
    { name: 'Visa', color: 'bg-[#1a1f71]', icon: 'VISA' },
    { name: 'Amex', color: 'bg-[#016fd0]', icon: 'AMEX' },
  ];

  if (step === 'success') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
        <div className="bg-white rounded-[2.5rem] p-12 max-w-sm w-full text-center shadow-2xl scale-in-center">
          <div className="w-24 h-24 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">支付成功</h2>
          <p className="text-slate-500 font-medium mb-10">您的订单已处理完成。订单号：{order.orderNumber}</p>
          <button
            onClick={onClose}
            className="w-full bg-[#051129] hover:bg-slate-800 text-white font-bold py-4 rounded-2xl transition-all shadow-xl shadow-slate-200"
          >
            完成
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300 ${isMaximized ? 'p-0' : 'p-4 md:p-8'}`}>
      <div className={`bg-white shadow-2xl flex flex-col md:flex-row animate-in slide-in-from-bottom-8 duration-500 transition-all ${isMaximized ? 'w-full h-full rounded-none' : 'rounded-[3rem] w-full max-w-6xl h-[820px] max-h-[95vh] overflow-hidden'}`}>
        
        {/* Left Side: Payment Methods */}
        <div className="flex-1 p-8 md:p-12 flex flex-col h-full bg-white relative">
          <div className="absolute top-8 left-8 flex items-center gap-4">
            <button 
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <button 
              onClick={() => setIsMaximized(!isMaximized)}
              className="text-[10px] font-black uppercase tracking-widest text-slate-300 hover:text-[#6AB3FC] transition-colors hidden md:block"
            >
              {isMaximized ? "Restore" : "Fullscreen"}
            </button>
          </div>

          <div className="mb-10 mt-12 shrink-0">
            <h2 className="text-[28px] font-black text-slate-900 tracking-tight">支付方式</h2>
            <p className="text-slate-400 font-medium">请选择您偏好的支付渠道进行结账</p>
          </div>

          <div className="space-y-4 flex-grow overflow-y-auto pr-3 custom-scrollbar pb-8">
            <PaymentOption 
              type={PaymentType.GOOGLE_PAY}
              isSelected={selectedMethod === PaymentType.GOOGLE_PAY}
              onSelect={(t) => setSelectedMethod(t)}
              label="Google Pay"
              icon={<svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M12.48 10.92v3.28h4.74c-.2 1.06-.9 1.95-1.82 2.56l2.72 2.12c1.59-1.47 2.51-3.62 2.51-6.12 0-.63-.06-1.24-.18-1.84h-8.03z"/></svg>}
            />
            <PaymentOption 
              type={PaymentType.APPLE_PAY}
              isSelected={selectedMethod === PaymentType.APPLE_PAY}
              onSelect={(t) => setSelectedMethod(t)}
              label="Apple Pay"
              icon={<svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.96.95-2.23 1.55-3.5 1.55-1.27 0-2.32-.45-3.23-.95-.9-.51-2.05-.51-2.95 0-.91.5-1.96.95-3.23.95-1.27 0-2.54-.6-3.5-1.55-3.75-3.71-3.75-9.73 0-13.44.96-.95 2.23-1.55 3.5-1.55 1.27 0-2.32.45 3.23.95.9.51 2.05.51 2.95 0 .91-.5 1.96-.95 3.23-.95 1.27 0-2.54.6 3.5 1.55 3.75 3.71 3.75 9.73 0 13.44z"/></svg>}
            />
            
            <div className="border-t border-slate-50 pt-6">
              <PaymentOption 
                type={PaymentType.CREDIT_CARD}
                isSelected={selectedMethod === PaymentType.CREDIT_CARD}
                onSelect={(t) => setSelectedMethod(t)}
                label="Credit Card"
                icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2-2v10a2 2 0 002 2z" /></svg>}
              />

              {selectedMethod === PaymentType.CREDIT_CARD && (
                <div className="mt-6 animate-in slide-in-from-top-4 duration-500 space-y-6">
                  <div className="bg-slate-50/50 border border-slate-100 rounded-[2rem] p-8 space-y-8">
                    
                    {/* Card Selector Toggle */}
                    <div className="space-y-3">
                      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">选择付款卡片</h3>
                      <div className="grid grid-cols-1 gap-3">
                        {savedCards.map(card => (
                          <button
                            key={card.id}
                            onClick={() => setSelectedCardId(card.id)}
                            className={`flex items-center justify-between p-5 rounded-2xl border-2 transition-all ${
                              selectedCardId === card.id 
                                ? 'border-[#6AB3FC] bg-white shadow-xl shadow-blue-500/5' 
                                : 'border-slate-100 bg-white/60 hover:border-slate-200'
                            }`}
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-[8px] text-white font-bold italic tracking-tighter">
                                {card.brand.toUpperCase()}
                              </div>
                              <div className="text-left">
                                <div className="text-[15px] font-bold text-slate-800">•••• •••• •••• {card.last4}</div>
                                <div className="text-[11px] text-slate-400 font-medium">Expires {card.expiry}</div>
                              </div>
                            </div>
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                              selectedCardId === card.id ? 'border-[#6AB3FC] bg-[#6AB3FC]' : 'border-slate-200'
                            }`}>
                              {selectedCardId === card.id && <div className="w-2 h-2 rounded-full bg-white" />}
                            </div>
                          </button>
                        ))}

                        <button
                          onClick={() => setSelectedCardId('new')}
                          className={`flex items-center justify-between p-5 rounded-2xl border-2 border-dashed transition-all ${
                            selectedCardId === 'new' 
                              ? 'border-[#6AB3FC] bg-blue-50/30' 
                              : 'border-slate-200 bg-transparent hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-8 rounded-lg flex items-center justify-center transition-colors ${selectedCardId === 'new' ? 'bg-[#6AB3FC] text-white' : 'bg-slate-100 text-slate-400'}`}>
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
                            </div>
                            <span className="text-[15px] font-bold text-slate-800">使用新信用卡</span>
                          </div>
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                            selectedCardId === 'new' ? 'border-[#6AB3FC] bg-[#6AB3FC]' : 'border-slate-200'
                          }`}>
                            {selectedCardId === 'new' && <div className="w-2 h-2 rounded-full bg-white" />}
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* New Card Form */}
                    {selectedCardId === 'new' && (
                      <div className="pt-4 space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
                        <div className="space-y-2">
                          <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">信用卡卡号</label>
                          <div className="relative">
                            <input 
                              type="text" 
                              placeholder="0000 0000 0000 0000"
                              value={newCardData.number}
                              onChange={(e) => setNewCardData({...newCardData, number: e.target.value})}
                              className="w-full bg-white border border-slate-200 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#6AB3FC] transition-all font-bold text-lg placeholder:text-slate-200"
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2">
                               {brands.map(b => (
                                 <div key={b.name} className={`w-8 h-5 rounded border border-slate-100 flex items-center justify-center text-[5px] font-bold ${b.color} ${b.color === 'bg-white' ? 'text-slate-300' : 'text-white'}`}>
                                    {b.icon}
                                 </div>
                               ))}
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                           <div className="space-y-2">
                              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">有效期 (MM/YY)</label>
                              <input 
                                type="text" 
                                placeholder="08 / 29"
                                value={newCardData.expiry}
                                onChange={(e) => setNewCardData({...newCardData, expiry: e.target.value})}
                                className="w-full bg-white border border-slate-200 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#6AB3FC] transition-all font-bold"
                              />
                           </div>
                           <div className="space-y-2">
                              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">安全码 (CVC)</label>
                              <input 
                                type="text" 
                                placeholder="•••"
                                value={newCardData.cvc}
                                onChange={(e) => setNewCardData({...newCardData, cvc: e.target.value})}
                                className="w-full bg-white border border-slate-200 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#6AB3FC] transition-all font-bold"
                              />
                           </div>
                        </div>

                        <div className="space-y-2">
                           <label className="text-[11px] font-black text-blue-500 uppercase tracking-widest px-1">持卡人姓名</label>
                           <input 
                              type="text" 
                              placeholder="Name on Card"
                              value={newCardData.name}
                              onChange={(e) => setNewCardData({...newCardData, name: e.target.value})}
                              className="w-full bg-white border-2 border-blue-100 p-4 rounded-2xl outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all font-bold text-slate-700 shadow-sm"
                           />
                        </div>

                        <label className="flex items-center gap-3 p-2 cursor-pointer group select-none">
                           <div className="relative">
                              <input 
                                type="checkbox" 
                                className="sr-only peer"
                                checked={shouldSaveNewCard}
                                onChange={(e) => setShouldSaveNewCard(e.target.checked)}
                              />
                              <div className="w-10 h-6 bg-slate-200 rounded-full peer-checked:bg-[#6AB3FC] transition-all" />
                              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-4" />
                           </div>
                           <span className="text-[13px] font-bold text-slate-500 group-hover:text-slate-700 transition-colors">将卡片保存至 Luxe 账户以供后续使用</span>
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <PaymentOption 
              type={ExtendedPaymentType.PAYPAL}
              isSelected={selectedMethod === ExtendedPaymentType.PAYPAL}
              onSelect={(t) => setSelectedMethod(t)}
              label="PayPal"
              icon={<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20.067 6.378c-.496 2.487-2.161 4.023-4.692 4.402-.77.113-1.447.113-2.25.113h-.83a.93.93 0 00-.916.786l-.997 6.322-.011.075c-.053.34.209.641.551.641h3.336a.75.75 0 00.738-.623l.035-.183.611-3.864.03-.162a.75.75 0 01.738-.623h.314c2.56 0 4.608-1.04 5.121-4.102.164-.972.073-1.841-.335-2.541a3.037 3.037 0 00-.838-.942z"/></svg>}
            />
          </div>

          <div className="mt-8 pt-6 border-t border-slate-50 shrink-0">
            <button
              onClick={handlePayment}
              disabled={isProcessing || !selectedMethod}
              className={`w-full py-5 rounded-2xl font-black text-[16px] tracking-widest uppercase transition-all flex items-center justify-center gap-3 shadow-2xl ${
                !selectedMethod 
                  ? 'bg-slate-100 text-slate-300 cursor-not-allowed' 
                  : 'bg-[#051129] text-white hover:bg-slate-800 active:scale-95 shadow-slate-200'
              }`}
            >
              {isProcessing ? (
                <svg className="animate-spin h-6 w-6 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  立即支付 {order.currency}{finalAmount.toFixed(2)}
                </>
              )}
            </button>
            <div className="mt-6">
               <SmartAssistant order={order} />
            </div>
          </div>
        </div>

        {/* Right Side: Order Summary */}
        <div className={`bg-[#F9FAFB] p-8 md:p-12 border-l border-slate-50 flex flex-col h-full relative transition-all ${isMaximized ? 'w-full md:w-[480px]' : 'w-full md:w-[420px]'}`}>
          <OrderSummary order={order} />
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
