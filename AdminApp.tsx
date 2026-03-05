
import React, { useState, useEffect } from 'react';
import MethodManager from './components/admin/MethodManager';
import CountryConfig from './components/admin/CountryConfig';

const AdminApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'methods' | 'countries' | 'overview'>('methods');
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAF9] font-sans text-slate-900">
      {/* Sidebar */}
      <aside className="w-64 bg-[#051129] text-white flex flex-col shrink-0">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-[#6AB3FC] rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight">SeaMe <span className="text-[#6AB3FC]">Cloud</span></span>
          </div>
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">Merchant Portal</p>
        </div>

        <nav className="flex-grow px-4 space-y-2">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'overview' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
            <span className="text-sm font-semibold">控制面板</span>
          </button>
          <button 
            onClick={() => setActiveTab('countries')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'countries' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" /></svg>
            <span className="text-sm font-semibold">地区配置</span>
          </button>
          <button 
            onClick={() => setActiveTab('methods')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'methods' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2-2v10a2 2 0 002 2z" /></svg>
            <span className="text-sm font-semibold">支付方式</span>
          </button>
        </nav>

        <div className="p-6 mt-auto space-y-3">
          <button 
            onClick={toggleFullscreen}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 text-slate-400 hover:text-white transition-all border border-white/5 hover:border-white/20"
          >
            {isFullscreen ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9L4 4m0 0l5 0M4 4l0 5m11 11l5 5m0 0l-5 0m5 0l0-5" /></svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5" /></svg>
            )}
            <span className="text-sm font-semibold">{isFullscreen ? '退出全屏' : '全屏模式'}</span>
          </button>

          <div className="bg-white/5 p-4 rounded-2xl">
            <p className="text-[10px] text-slate-500 uppercase font-black mb-2">System Status</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs font-bold">API Online</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-10 overflow-y-auto">
        {activeTab === 'methods' && <MethodManager />}
        {activeTab === 'countries' && <CountryConfig />}
        {activeTab === 'overview' && (
          <div className="flex flex-col items-center justify-center h-full text-slate-300">
            <svg className="w-20 h-20 mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            <h2 className="text-2xl font-bold">数据概览开发中...</h2>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminApp;
