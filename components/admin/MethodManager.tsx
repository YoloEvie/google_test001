
import React, { useState, useEffect } from 'react';

type IntegrationMode = 'Link' | 'Drop-in';

interface PaymentMethod {
  id: string;
  name: string;
  type: 'E-Wallet' | 'CreditCard' | 'BankTransfer';
  status: 'active' | 'inactive';
  iconType: string;
  integrationMode: IntegrationMode;
  iconUrl?: string;
}

const INITIAL_METHODS: PaymentMethod[] = [
  { id: '1', name: 'Google Pay', type: 'E-Wallet', status: 'active', iconType: 'google', integrationMode: 'Link' },
  { id: '2', name: 'Apple Pay', type: 'E-Wallet', status: 'active', iconType: 'apple', integrationMode: 'Drop-in' },
  { id: '3', name: 'Credit Card', type: 'CreditCard', status: 'active', iconType: 'card', integrationMode: 'Drop-in' },
  { id: '4', name: 'PayPal', type: 'E-Wallet', status: 'inactive', iconType: 'paypal', integrationMode: 'Link' },
];

const MethodManager: React.FC = () => {
  const [methods, setMethods] = useState<PaymentMethod[]>(INITIAL_METHODS);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingMethod, setEditingMethod] = useState<Partial<PaymentMethod> | null>(null);
  
  // Custom Modal States
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Toast Notification State
  const [toast, setToast] = useState<{msg: string, type: 'success' | 'error'} | null>(null);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const openAddDrawer = () => {
    setEditingMethod({
      name: '',
      type: 'E-Wallet',
      status: 'active',
      iconType: 'default',
      integrationMode: 'Link'
    });
    setIsDrawerOpen(true);
  };

  const openEditDrawer = (method: PaymentMethod) => {
    setEditingMethod({ ...method });
    setIsDrawerOpen(true);
  };

  const handleSave = () => {
    if (!editingMethod?.name) return;

    if (editingMethod.id) {
      setMethods(prev => prev.map(m => m.id === editingMethod.id ? (editingMethod as PaymentMethod) : m));
      setToast({ msg: '配置更新成功', type: 'success' });
    } else {
      const newMethod: PaymentMethod = {
        ...(editingMethod as PaymentMethod),
        id: Date.now().toString(),
      };
      setMethods(prev => [...prev, newMethod]);
      setToast({ msg: '新渠道已添加', type: 'success' });
    }
    setIsDrawerOpen(false);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setMethods(prev => prev.filter(m => m.id !== deleteId));
    setDeleteId(null);
    setIsDeleting(false);
    setToast({ msg: '支付渠道已成功移除', type: 'success' });
  };

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-500 pb-20 relative">
      
      {/* Global Toast */}
      {toast && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[300] animate-in slide-in-from-top-4 duration-300">
          <div className={`px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 ${toast.type === 'success' ? 'bg-[#051129] text-white' : 'bg-red-500 text-white'}`}>
             <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
             </div>
             <span className="text-sm font-bold tracking-tight">{toast.msg}</span>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-[28px] font-bold text-slate-900 tracking-tight">支付方式管理</h1>
          <p className="text-slate-500 font-medium">全局定义支付渠道及其业务模式</p>
        </div>
        <button 
          onClick={openAddDrawer}
          className="bg-[#051129] text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
          新增支付渠道
        </button>
      </div>

      {methods.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-slate-100 rounded-[3rem] p-20 text-center">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200">
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
          </div>
          <h3 className="text-xl font-bold text-slate-900">暂无配置中的支付方式</h3>
          <p className="text-slate-400 mt-2">点击上方按钮开始配置您的第一个支付渠道</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {methods.map(method => (
            <div key={method.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:translate-y-[-4px] transition-all group relative overflow-hidden">
              <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full transition-opacity duration-500 ${method.status === 'active' ? 'bg-green-500/5 opacity-100' : 'bg-slate-500/5 opacity-40'}`} />

              <div className="flex justify-between items-start mb-8 relative z-10">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-[#6AB3FC]/10 group-hover:text-[#6AB3FC] transition-colors">
                  {method.iconType === 'card' ? (
                    <svg className="w-9 h-9" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2-2v10a2 2 0 002 2z" /></svg>
                  ) : (
                    <span className="font-black text-[10px] uppercase tracking-tighter">{method.name.slice(0, 4)}</span>
                  )}
                </div>
                
                <div className="flex flex-col items-end">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${method.status === 'active' ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${method.status === 'active' ? 'bg-green-500 animate-pulse' : 'bg-slate-400'}`} />
                    {method.status === 'active' ? '已上线' : '已暂停'}
                  </span>
                  <span className="text-[10px] text-slate-300 font-bold mt-1 uppercase tracking-widest">{method.integrationMode}</span>
                </div>
              </div>
              
              <h3 className="text-[20px] font-bold text-slate-900 mb-1">{method.name}</h3>
              <p className="text-sm text-slate-400 mb-8 font-medium">{method.type}</p>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => openEditDrawer(method)}
                  className="flex-grow bg-[#051129]/5 text-slate-700 py-3.5 rounded-2xl font-bold text-sm hover:bg-[#051129] hover:text-white transition-all active:scale-95"
                >
                  配置详情
                </button>
                <button 
                  onClick={() => setDeleteId(method.id)}
                  className="bg-red-50 text-red-400 px-5 py-3.5 rounded-2xl hover:bg-red-500 hover:text-white transition-all active:scale-95"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center p-6 bg-[#051129]/40 backdrop-blur-md animate-in fade-in duration-300">
           <div className="bg-white rounded-[2.5rem] w-full max-w-md p-10 shadow-2xl animate-in zoom-in-95 duration-300 text-center">
              <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-8">
                 <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-3">确定移除该渠道？</h2>
              <p className="text-slate-400 font-medium mb-10">此操作将立即从全球收银台中移除 {methods.find(m => m.id === deleteId)?.name}。该操作无法撤销。</p>
              <div className="grid grid-cols-2 gap-4">
                 <button 
                    disabled={isDeleting}
                    onClick={() => setDeleteId(null)}
                    className="py-4 bg-slate-50 text-slate-500 font-bold rounded-2xl hover:bg-slate-100 transition-all disabled:opacity-50"
                 >
                    放弃
                 </button>
                 <button 
                    disabled={isDeleting}
                    onClick={confirmDelete}
                    className="py-4 bg-red-500 text-white font-bold rounded-2xl shadow-xl shadow-red-200 hover:bg-red-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                 >
                    {isDeleting ? (
                       <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    ) : '确定删除'}
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Configuration Drawer */}
      {isDrawerOpen && editingMethod && (
        <div className="fixed inset-0 bg-[#051129]/40 backdrop-blur-md z-[100] flex justify-end animate-in fade-in duration-300">
          <div className="w-[550px] bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-500 overflow-hidden">
            <div className="px-10 py-12 flex justify-between items-center border-b border-slate-50">
              <div>
                <h2 className="text-2xl font-black text-slate-900">{editingMethod.id ? '配置支付渠道' : '添加新渠道'}</h2>
                <p className="text-sm text-slate-400 font-medium mt-1">ID: {editingMethod.id || '自动生成'}</p>
              </div>
              <button 
                onClick={() => setIsDrawerOpen(false)} 
                className="w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all active:scale-90"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="flex-grow p-10 overflow-y-auto custom-scrollbar space-y-10">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">支付品牌图标</label>
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 bg-slate-50 rounded-3xl flex items-center justify-center border-2 border-dashed border-slate-200 text-slate-300 overflow-hidden group hover:border-[#6AB3FC] transition-colors cursor-pointer relative">
                    {editingMethod.iconUrl ? (
                        <img src={editingMethod.iconUrl} className="w-full h-full object-cover" />
                    ) : (
                        <svg className="w-8 h-8 group-hover:text-[#6AB3FC] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    )}
                  </div>
                  <div className="flex-grow">
                    <h4 className="text-sm font-bold text-slate-800">上传品牌 Logo</h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">支持 SVG, PNG (120x120px), 建议背景透明以适配收银台主题。</p>
                    <button className="mt-3 text-[12px] font-black text-[#6AB3FC] uppercase tracking-widest hover:text-blue-600">点击上传文件</button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">显示名称</label>
                  <input 
                    type="text" 
                    value={editingMethod.name}
                    onChange={e => setEditingMethod({...editingMethod, name: e.target.value})}
                    placeholder="例如: Alipay" 
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-100 focus:bg-white outline-none font-bold transition-all placeholder:text-slate-300" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">业务类型</label>
                  <select 
                    value={editingMethod.type}
                    onChange={e => setEditingMethod({...editingMethod, type: e.target.value as any})}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-100 focus:bg-white outline-none font-bold appearance-none transition-all cursor-pointer"
                  >
                    <option value="E-Wallet">数字钱包</option>
                    <option value="CreditCard">银行卡支付</option>
                    <option value="BankTransfer">本地转账</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">集成交互模式</label>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { mode: 'Link' as IntegrationMode, title: '跳转链接', desc: '跳转服务商页面', icon: 'M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14' },
                    { mode: 'Drop-in' as IntegrationMode, title: '内嵌表单', desc: '收银台原生体验', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' }
                  ].map(item => (
                    <button 
                      key={item.mode}
                      onClick={() => setEditingMethod({...editingMethod, integrationMode: item.mode})}
                      className={`p-6 rounded-3xl border-2 text-left transition-all relative overflow-hidden group ${editingMethod.integrationMode === item.mode ? 'border-[#6AB3FC] bg-blue-50/20' : 'border-slate-100 hover:border-slate-200'}`}
                    >
                      <div className={`w-10 h-10 rounded-xl mb-4 flex items-center justify-center transition-all ${editingMethod.integrationMode === item.mode ? 'bg-[#6AB3FC] text-white shadow-lg shadow-blue-200' : 'bg-slate-100 text-slate-400'}`}>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={item.icon} /></svg>
                      </div>
                      <div className="font-bold text-slate-900">{item.title}</div>
                      <div className="text-[11px] text-slate-400 mt-1 font-medium">{item.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-[#051129] p-8 rounded-[2rem] text-white flex items-center justify-between shadow-2xl shadow-blue-900/10">
                <div>
                  <h4 className="font-black uppercase tracking-widest text-xs text-blue-300 mb-1">渠道生效状态</h4>
                  <p className="text-sm text-slate-400 font-medium">关闭后，全球所有国家的收银台将不再显示该渠道。</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={editingMethod.status === 'active'}
                    onChange={e => setEditingMethod({...editingMethod, status: e.target.checked ? 'active' : 'inactive'})}
                  />
                  <div className="w-16 h-8 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#6AB3FC]"></div>
                </label>
              </div>
            </div>

            <div className="p-10 border-t border-slate-50 bg-slate-50/40 flex gap-4 shrink-0">
              <button 
                onClick={() => setIsDrawerOpen(false)} 
                className="flex-grow py-5 bg-white border border-slate-200 text-slate-500 font-black uppercase tracking-widest text-[12px] rounded-2xl hover:bg-slate-50 transition-all active:scale-95"
              >
                放弃修改
              </button>
              <button 
                onClick={handleSave} 
                className="flex-grow py-5 bg-[#051129] text-white font-black uppercase tracking-widest text-[12px] rounded-2xl shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all active:scale-95"
              >
                保存并发布
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MethodManager;
