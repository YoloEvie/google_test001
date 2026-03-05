
import React, { useState, useMemo } from 'react';

interface Country {
  code: string;
  name: string;
  flag: string;
  methods: string[];
}

const COUNTRIES: Country[] = [
  { code: 'US', name: 'United States', flag: '🇺🇸', methods: ['Google Pay', 'Apple Pay', 'Credit Card'] },
  { code: 'CN', name: 'China', flag: '🇨🇳', methods: ['Alipay', 'WeChat Pay', 'UnionPay'] },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬', methods: ['GrabPay', 'PayNow', 'Credit Card'] },
  { code: 'UK', name: 'United Kingdom', flag: '🇬🇧', methods: ['Apple Pay', 'PayPal', 'Credit Card'] },
];

// All possible global methods for the multi-select/toggle demo
const ALL_AVAILABLE_METHODS = ['Google Pay', 'Apple Pay', 'Credit Card', 'Alipay', 'WeChat Pay', 'UnionPay', 'GrabPay', 'PayNow', 'PayPal'];

const CountryConfig: React.FC = () => {
  const [selectedCountryCode, setSelectedCountryCode] = useState(COUNTRIES[0].code);
  
  // Track enabled methods for each country in local state
  const [countryMethods, setCountryMethods] = useState<{ [key: string]: string[] }>(
    COUNTRIES.reduce((acc, c) => ({ ...acc, [c.code]: [...c.methods] }), {})
  );

  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [publishStatus, setPublishStatus] = useState<'idle' | 'no-changes' | 'confirm' | 'success'>('idle');

  const selectedCountry = useMemo(() => 
    COUNTRIES.find(c => c.code === selectedCountryCode)!, 
    [selectedCountryCode]
  );

  // Calculate changes compared to initial state
  const changesSummary = useMemo(() => {
    const changes: { countryName: string, added: string[], removed: string[] }[] = [];
    
    COUNTRIES.forEach(original => {
      const current = countryMethods[original.code];
      const added = current.filter(m => !original.methods.includes(m));
      const removed = original.methods.filter(m => !current.includes(m));
      
      if (added.length > 0 || removed.length > 0) {
        changes.push({
          countryName: original.name,
          added,
          removed
        });
      }
    });
    
    return changes;
  }, [countryMethods]);

  const toggleMethod = (method: string) => {
    setCountryMethods(prev => {
      const current = prev[selectedCountryCode];
      if (current.includes(method)) {
        return { ...prev, [selectedCountryCode]: current.filter(m => m !== method) };
      } else {
        return { ...prev, [selectedCountryCode]: [...current, method] };
      }
    });
  };

  const handlePublishClick = () => {
    if (changesSummary.length === 0) {
      setPublishStatus('no-changes');
    } else {
      setPublishStatus('confirm');
    }
    setIsPublishModalOpen(true);
  };

  const confirmPublish = () => {
    setPublishStatus('success');
    // In a real app, we would update the original state here or call an API
    setTimeout(() => {
      setIsPublishModalOpen(false);
      setPublishStatus('idle');
    }, 2000);
  };

  const resetConfig = () => {
    if (confirm('确定要重置当前国家的所有支付配置吗？')) {
      const original = COUNTRIES.find(c => c.code === selectedCountryCode)!;
      setCountryMethods(prev => ({ ...prev, [selectedCountryCode]: [...original.methods] }));
    }
  };

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-500 pb-20">
      <div className="mb-10">
        <h1 className="text-[28px] font-bold text-slate-900 tracking-tight">全球地区配置</h1>
        <p className="text-slate-500 font-medium">针对不同国家/地区定制支付可见性及合规策略</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Country List */}
        <div className="w-full lg:w-80 space-y-3">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-4 mb-4">目标市场列表</h3>
          {COUNTRIES.map(country => (
            <button
              key={country.code}
              onClick={() => setSelectedCountryCode(country.code)}
              className={`w-full flex items-center justify-between p-5 rounded-3xl transition-all relative overflow-hidden group ${
                selectedCountryCode === country.code 
                  ? 'bg-white shadow-2xl shadow-slate-200/50 border border-slate-100' 
                  : 'hover:bg-white/60'
              }`}
            >
              <div className="flex items-center gap-4 relative z-10">
                <span className="text-2xl drop-shadow-sm">{country.flag}</span>
                <span className={`font-bold transition-colors ${selectedCountryCode === country.code ? 'text-[#051129]' : 'text-slate-500'}`}>
                  {country.name}
                </span>
              </div>
              
              {/* Change Indicator Dot */}
              {countryMethods[country.code].length !== country.methods.length && (
                 <div className="w-2 h-2 rounded-full bg-orange-400 absolute right-4 top-4" />
              )}

              {selectedCountryCode === country.code && (
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50" />
              )}
            </button>
          ))}
        </div>

        {/* Configuration Panel */}
        <div className="flex-grow bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-12 relative overflow-hidden">
          {/* Subtle Background Mark */}
          <div className="absolute top-0 right-0 p-10 opacity-[0.03] select-none pointer-events-none">
             <span className="text-[120px] font-black">{selectedCountry.code}</span>
          </div>

          <div className="flex justify-between items-center mb-12 pb-8 border-b border-slate-50 relative z-10">
            <div>
              <h2 className="text-3xl font-black text-slate-900 flex items-center gap-4">
                <span className="text-4xl">{selectedCountry.flag}</span>
                {selectedCountry.name} 
              </h2>
              <p className="text-sm text-slate-400 font-medium mt-1">配置该地区用户在收银台可见的支付方式</p>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Status</span>
              <span className="bg-green-50 text-green-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                Live in Region
              </span>
            </div>
          </div>

          <div className="space-y-12 relative z-10">
            <div>
              <div className="flex justify-between items-center mb-8">
                <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-3">
                  支付渠道白名单
                  <span className="bg-slate-50 text-blue-500 px-3 py-1 rounded-full text-[11px] font-black">
                    {countryMethods[selectedCountryCode].length} SELECTED
                  </span>
                </h4>
                <span className="text-[11px] text-slate-400 font-medium italic">点击卡片切换启用状态</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ALL_AVAILABLE_METHODS.map(method => {
                  const isEnabled = countryMethods[selectedCountryCode].includes(method);
                  return (
                    <button
                      key={method}
                      onClick={() => toggleMethod(method)}
                      className={`flex items-center justify-between p-6 rounded-[2rem] border-2 transition-all group ${
                        isEnabled 
                          ? 'border-blue-500 bg-blue-50/20 shadow-lg shadow-blue-500/5' 
                          : 'border-slate-50 bg-slate-50/30 hover:border-slate-200 grayscale opacity-60'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${isEnabled ? 'bg-blue-500 text-white shadow-lg' : 'bg-white text-slate-300 shadow-sm'}`}>
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={isEnabled ? "M5 13l4 4L19 7" : "M12 6v6m0 0v6m0-6h6m-6 0H6"} />
                          </svg>
                        </div>
                        <div className="text-left">
                           <span className={`block font-bold transition-colors ${isEnabled ? 'text-slate-900' : 'text-slate-400'}`}>{method}</span>
                           <span className="text-[10px] text-slate-400 uppercase font-black tracking-tighter">Availability: {isEnabled ? 'Standard' : 'Disabled'}</span>
                        </div>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 transition-all flex items-center justify-center ${isEnabled ? 'border-blue-500 bg-blue-500 scale-110' : 'border-slate-200 bg-white group-hover:border-slate-300'}`}>
                         {isEnabled && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" /></svg>}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-12 flex justify-end gap-5 border-t border-slate-50">
              <button 
                onClick={resetConfig}
                className="px-10 py-4 bg-white border border-slate-200 text-slate-400 font-black uppercase tracking-widest text-[12px] rounded-2xl hover:bg-slate-50 hover:text-slate-600 transition-all active:scale-95"
              >
                还原当前配置
              </button>
              <button 
                onClick={handlePublishClick}
                className="px-10 py-4 bg-[#051129] text-white font-black uppercase tracking-widest text-[12px] rounded-2xl shadow-2xl shadow-slate-200 hover:bg-slate-800 transition-all active:scale-95 flex items-center gap-3"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                同步并发布变更
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Logic-specific Modal / Popup */}
      {isPublishModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-[#051129]/60 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-white rounded-[3rem] w-full max-w-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            
            {/* NO CHANGES UI */}
            {publishStatus === 'no-changes' && (
              <div className="p-12 text-center">
                <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 text-slate-300">
                   <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                </div>
                <h2 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">未检测到任何变更</h2>
                <p className="text-slate-500 font-medium mb-10 leading-relaxed">您当前并未修改任何国家或地区的支付渠道配置。请先进行调整后再尝试发布。</p>
                <button 
                  onClick={() => setIsPublishModalOpen(false)}
                  className="w-full py-5 bg-[#051129] text-white font-black uppercase tracking-widest text-[13px] rounded-2xl hover:bg-slate-800 transition-all"
                >
                  返回编辑器
                </button>
              </div>
            )}

            {/* CONFIRMATION UI */}
            {publishStatus === 'confirm' && (
              <div className="flex flex-col h-full">
                <div className="p-10 border-b border-slate-50 bg-slate-50/30">
                   <h2 className="text-2xl font-black text-slate-900">确认发布变更</h2>
                   <p className="text-sm text-slate-400 font-medium mt-1">请仔细核对以下受影响的国家及其渠道变动：</p>
                </div>
                
                <div className="p-10 max-h-[400px] overflow-y-auto custom-scrollbar space-y-8">
                   {changesSummary.map((item, idx) => (
                      <div key={idx} className="bg-slate-50 p-6 rounded-[2rem]">
                         <div className="flex items-center gap-2 mb-4">
                            <span className="text-lg font-bold text-slate-900">{item.countryName}</span>
                            <span className="text-[10px] bg-white border border-slate-200 text-slate-400 px-2 py-0.5 rounded uppercase font-black tracking-tighter">REVISED</span>
                         </div>
                         <div className="space-y-3">
                            {item.added.map(m => (
                               <div key={m} className="flex items-center gap-3 text-sm">
                                  <span className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center shrink-0">
                                     <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
                                  </span>
                                  <span className="text-slate-600 font-medium">新增渠道: <span className="font-bold text-slate-900">{m}</span></span>
                               </div>
                            ))}
                            {item.removed.map(m => (
                               <div key={m} className="flex items-center gap-3 text-sm">
                                  <span className="w-5 h-5 bg-red-100 text-red-600 rounded-full flex items-center justify-center shrink-0">
                                     <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M20 12H4" /></svg>
                                  </span>
                                  <span className="text-slate-600 font-medium">移除渠道: <span className="font-bold text-slate-900">{m}</span></span>
                               </div>
                            ))}
                         </div>
                      </div>
                   ))}
                </div>

                <div className="p-10 flex gap-4 bg-slate-50/50">
                   <button 
                    onClick={() => setIsPublishModalOpen(false)}
                    className="flex-grow py-5 bg-white border border-slate-200 text-slate-400 font-black uppercase tracking-widest text-[12px] rounded-2xl hover:bg-slate-50 transition-all"
                   >
                     返回修改
                   </button>
                   <button 
                    onClick={confirmPublish}
                    className="flex-grow py-5 bg-blue-600 text-white font-black uppercase tracking-widest text-[12px] rounded-2xl shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95"
                   >
                     确认并立即同步
                   </button>
                </div>
              </div>
            )}

            {/* SUCCESS UI */}
            {publishStatus === 'success' && (
               <div className="p-12 text-center animate-in zoom-in-95">
                  <div className="w-24 h-24 bg-green-500 text-white rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-green-200">
                     <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">发布成功</h2>
                  <p className="text-slate-500 font-medium mb-4 leading-relaxed">全球配置已更新。所有国家的收银台将立即同步至最新状态。</p>
                  <div className="inline-block px-4 py-2 bg-slate-50 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest">
                     Syncing to 12.0k nodes worldwide...
                  </div>
               </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
};

export default CountryConfig;
