
import React, { useEffect, useState } from 'react';
import { Activity, Cloud, CloudOff, Menu, X, ChevronRight } from 'lucide-react';
import { NAV_ITEMS } from '../constants';
import { checkSupabaseConnection } from '../services/supabase';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (id: string) => void;
  projectName?: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange, projectName }) => {
  const [dbStatus, setDbStatus] = useState<{connected: boolean, msg: string}>({ connected: false, msg: 'Checking...' });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    checkSupabaseConnection().then(setDbStatus);
  }, []);

  const SidebarContent = () => (
    <>
      <div className="p-6 flex items-center gap-3 border-b border-slate-800">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-bold text-2xl shadow-lg shadow-indigo-500/20">A</div>
        <div className="flex flex-col">
          <span className="font-black text-xs tracking-widest uppercase">Android Smart</span>
          <span className="text-[10px] text-slate-400 font-bold uppercase opacity-60">GUI Platform v1.0</span>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              onTabChange(item.id);
              setIsMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === item.id 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            {item.icon}
            <span className="flex-1 text-left">{item.label}</span>
            {activeTab === item.id && <ChevronRight size={14} />}
          </button>
        ))}
      </nav>
      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-800/80">
          <p className="text-[10px] text-slate-500 mb-1 uppercase font-black tracking-widest">Workspace</p>
          <p className="text-sm font-bold text-slate-200 truncate">{projectName || 'No Project'}</p>
          <div className="mt-3 space-y-2">
             <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Emulator Online</span>
             </div>
             <div className="flex items-center gap-2">
                {dbStatus.connected ? (
                  <Cloud size={10} className="text-emerald-500" />
                ) : (
                  <CloudOff size={10} className="text-rose-500" />
                )}
                <span className={`text-[10px] font-bold uppercase ${dbStatus.connected ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {dbStatus.msg}
                </span>
             </div>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-slate-900 text-white flex-col shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-slate-900 text-white flex flex-col z-50 transition-transform duration-300 transform lg:hidden ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="absolute top-4 right-4 text-white lg:hidden">
          <button onClick={() => setIsMobileMenuOpen(false)}><X size={24} /></button>
        </div>
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden w-full">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 shrink-0 relative z-10">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2 hover:bg-slate-100 rounded-lg text-slate-600"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
            <h1 className="text-sm lg:text-lg font-black text-slate-800 tracking-tight uppercase truncate">
              {NAV_ITEMS.find(n => n.id === activeTab)?.label}
            </h1>
          </div>
          
          <div className="flex items-center gap-2 lg:gap-4">
             <div className="hidden sm:flex items-center gap-3 pr-4 border-r border-slate-100">
                <div className="text-right">
                   <p className="text-[10px] font-black text-slate-400 uppercase leading-none">System</p>
                   <p className="text-xs font-bold text-emerald-600">Active</p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100">
                   <Activity size={16}/>
                </div>
             </div>
             <button className="text-sm font-bold text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-widest text-[10px]">Log Out</button>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto bg-slate-50/50 p-4 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};
