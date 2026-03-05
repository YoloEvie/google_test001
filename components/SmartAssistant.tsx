
import React, { useState } from 'react';
import { getOrderAssistance } from '../services/geminiService';
import { OrderData } from '../types';

interface SmartAssistantProps {
  order: OrderData;
}

const SmartAssistant: React.FC<SmartAssistantProps> = ({ order }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', content: string}[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    setIsLoading(true);

    const response = await getOrderAssistance(userMsg, order);
    setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    setIsLoading(false);
  };

  return (
    <div className="relative">
      {!isOpen ? (
        <button 
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 text-slate-500 hover:text-[#6AB3FC] transition-colors text-sm font-semibold group"
        >
          <div className="w-8 h-8 rounded-full bg-slate-200 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          Have a question about your order?
        </button>
      ) : (
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col max-h-[260px] animate-in slide-in-from-bottom-2">
          <div className="bg-slate-50 px-4 py-2 flex justify-between items-center border-b border-slate-100">
            <span className="text-xs font-bold text-slate-600">Luxe Assistant</span>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex-grow p-4 overflow-y-auto space-y-3 custom-scrollbar text-sm">
            {messages.length === 0 && (
              <p className="text-slate-400 text-xs text-center italic">Ask me anything about your items or payment.</p>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] px-3 py-2 rounded-xl ${
                  m.role === 'user' ? 'bg-[#6AB3FC] text-white rounded-br-none' : 'bg-slate-100 text-slate-700 rounded-bl-none'
                }`}>
                  {m.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-100 px-3 py-2 rounded-xl animate-pulse">Thinking...</div>
              </div>
            )}
          </div>
          <div className="p-2 border-t border-slate-100 flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask a question..."
              className="flex-grow text-xs px-3 py-2 rounded-lg bg-slate-50 border-none focus:ring-1 focus:ring-[#6AB3FC] focus:outline-none"
            />
            <button 
              onClick={handleSend}
              className="bg-[#6AB3FC] text-white p-2 rounded-lg hover:bg-[#549EE8] transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartAssistant;
