
import React, { useState, useEffect } from 'react';
import { Smartphone, Terminal, Cpu, Layout, Play, Square, RefreshCcw, Wifi, Battery, Signal } from 'lucide-react';

export const RunMonitor: React.FC = () => {
  const [isLive, setIsLive] = useState(false);
  const [currentAction, setCurrentAction] = useState('IDLE');
  const [currentScreen, setCurrentScreen] = useState('Splash Screen');
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

  const toggleRun = () => {
    setIsLive(!isLive);
    if (!isLive) {
      setLogs(['[SYSTEM] Attached to device pixel_6_pro_5554', '[HYBRID-RL] Initializing Actor-Critic policy...', '[DDQN] Loading stable target Q-network...']);
    } else {
      setProgress(0);
    }
  };

  useEffect(() => {
    if (!isLive) return;
    const actions = ['TAP(0.4, 0.8)', 'SWIPE_UP', 'LONG_PRESS(0.2, 0.2)', 'TYPE("Testing")', 'BACK'];
    const screens = ['LoginScreen', 'DashboardView', 'SettingsPage', 'ProfileEdit', 'ProductGallery'];
    
    const interval = setInterval(() => {
      const act = actions[Math.floor(Math.random() * actions.length)];
      const scr = screens[Math.floor(Math.random() * screens.length)];
      setCurrentAction(act);
      setCurrentScreen(scr);
      setProgress(p => Math.min(100, p + 5));
      setLogs(prev => [
        `[POLICY] Predicted action: ${act} (p=0.82)`, 
        `[CRITIC] State value V(s): ${(Math.random() * 10).toFixed(2)}`, 
        `[ENV] Observed state transition to ${scr}`,
        ...prev
      ].slice(0, 15));
    }, 2000);

    return () => clearInterval(interval);
  }, [isLive]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full min-h-[650px]">
      {/* Device View */}
      <div className="lg:col-span-5 flex flex-col items-center justify-center bg-slate-100/50 rounded-3xl p-10 border border-slate-200 shadow-inner">
        <div className="relative w-80 h-[600px] bg-slate-900 rounded-[3.5rem] border-[12px] border-slate-800 shadow-2xl overflow-hidden ring-4 ring-slate-200">
          {/* Top Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-7 bg-slate-800 rounded-b-3xl z-30 flex items-center justify-center">
             <div className="w-10 h-1 bg-slate-700 rounded-full"></div>
          </div>
          
          <div className="relative h-full w-full bg-white flex flex-col">
            {/* Status Bar */}
            <div className="h-8 bg-slate-50 flex items-center justify-between px-8 text-[10px] font-bold text-slate-500">
              <span>12:45 PM</span>
              <div className="flex gap-2">
                <Signal size={10} />
                <Wifi size={10} />
                <Battery size={10} className="rotate-90" />
              </div>
            </div>

            {/* Simulated App UI */}
            <div className="flex-1 flex flex-col overflow-hidden relative">
               {!isLive ? (
                 <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-4 animate-pulse">
                    <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-300">
                       <Smartphone size={32} />
                    </div>
                    <div>
                      <p className="text-slate-800 font-black text-sm uppercase">Waiting for Agent</p>
                      <p className="text-slate-400 text-[10px] mt-1">Initialize the Hybrid RL engine to start exploration.</p>
                    </div>
                 </div>
               ) : (
                 <div className="h-full flex flex-col animate-in fade-in duration-500">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                       <span className="text-[10px] font-black text-indigo-600 uppercase tracking-tighter">{currentScreen}</span>
                       <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    </div>
                    <div className="flex-1 p-6 flex flex-col gap-4">
                       <div className="w-full aspect-[9/16] bg-slate-50 border-2 border-slate-100 rounded-2xl overflow-hidden flex flex-col">
                          <div className="h-10 bg-indigo-600 flex items-center px-4 justify-between">
                             <div className="w-8 h-1 bg-white/20 rounded-full"></div>
                             <div className="w-4 h-4 rounded-full bg-white/20"></div>
                          </div>
                          <div className="flex-1 flex items-center justify-center flex-col gap-2 p-4 text-center">
                             <Layout size={48} className="text-slate-200" />
                             <p className="text-[8px] font-mono text-slate-400 break-all">ID: com.example.app/.ui.{currentScreen}</p>
                          </div>
                       </div>
                       <div className="p-4 bg-slate-900 rounded-xl shadow-lg transform scale-105 border border-indigo-500/30">
                          <p className="text-[8px] font-black text-indigo-400 uppercase mb-1">Agent Action</p>
                          <p className="text-white font-mono text-xs">{currentAction}</p>
                       </div>
                    </div>
                 </div>
               )}
            </div>

            {/* Navigation Bar */}
            <div className="h-14 bg-slate-50 border-t border-slate-100 flex items-center justify-center gap-16 pb-2">
               <div className="w-3.5 h-3.5 border-2 border-slate-300 rounded-sm"></div>
               <div className="w-3.5 h-3.5 border-2 border-slate-300 rounded-full"></div>
               <div className="w-3.5 h-3.5 border-2 border-slate-300 transform rotate-45"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls & Logs */}
      <div className="lg:col-span-7 flex flex-col gap-6">
         <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex-1 flex flex-col">
            <div className="flex justify-between items-start mb-8">
               <div>
                  <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
                     <Cpu size={22} className="text-indigo-600" />
                     Hybrid RL Runtime
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">Actor-Critic + DDQN Exploration Monitoring</p>
               </div>
               <div className="flex gap-3">
                  <button 
                    onClick={toggleRun}
                    className={`px-6 py-2.5 rounded-xl font-black text-xs flex items-center gap-2 transition-all shadow-lg ${isLive ? 'bg-rose-100 text-rose-600 shadow-rose-100' : 'bg-indigo-600 text-white shadow-indigo-200 hover:bg-indigo-700'}`}
                  >
                    {isLive ? <Square size={14} fill="currentColor"/> : <Play size={14} fill="currentColor"/>}
                    {isLive ? 'TERMINATE RUN' : 'INITIALIZE AGENT'}
                  </button>
                  <button className="p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl border border-slate-100 transition">
                    <RefreshCcw size={18} />
                  </button>
               </div>
            </div>

            <div className="grid grid-cols-3 gap-6 mb-8">
               {[
                 { label: 'Avg Q-Value', value: isLive ? (4.2 + Math.random()).toFixed(2) : '0.00', color: 'indigo' },
                 { label: 'Reward Σ', value: isLive ? progress.toFixed(1) : '0.0', color: 'emerald' },
                 { label: 'Policy Entropy', value: isLive ? (0.8 + Math.random() * 0.1).toFixed(3) : '0.000', color: 'amber' },
               ].map(stat => (
                 <div key={stat.label} className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                    <p className={`text-xl font-black text-${stat.color}-600`}>{stat.value}</p>
                 </div>
               ))}
            </div>

            <div className="bg-slate-900 rounded-2xl p-6 flex flex-col flex-1 shadow-2xl relative">
               <div className="flex items-center gap-2 text-indigo-400 text-[10px] font-black uppercase mb-4 border-b border-slate-800 pb-3">
                  <Terminal size={14} /> Global Policy Trace Output
               </div>
               <div className="flex-1 overflow-y-auto font-mono text-[11px] text-slate-300 space-y-1.5 scrollbar-thin scrollbar-thumb-slate-700">
                  {logs.map((log, i) => (
                    <div key={i} className={`animate-in slide-in-from-left-2 duration-300 ${log.includes('CRITIC') ? 'text-indigo-400/80' : log.includes('POLICY') ? 'text-emerald-400/80' : 'text-slate-300'}`}>
                      <span className="text-slate-600 mr-2">{i.toString().padStart(3, '0')}</span> {log}
                    </div>
                  ))}
                  {!isLive && <div className="text-slate-700 italic flex items-center gap-2"><div className="w-1.5 h-1.5 bg-slate-700 rounded-full"></div> Awaiting ADB socket connection...</div>}
               </div>
               <div className="absolute bottom-6 right-6 px-3 py-1 bg-indigo-500 text-white text-[10px] font-black rounded-full shadow-lg">LIVE LOGGING</div>
            </div>
         </div>
      </div>
    </div>
  );
};
