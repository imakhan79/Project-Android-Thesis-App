
import React, { useState } from 'react';
import { Activity, ArrowRight, Share2, Upload, Database, Hash, Layout, Maximize2 } from 'lucide-react';

export const DynamicAnalysisView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'graph' | 'table'>('graph');
  const [traces] = useState([
    { id: 't1', from: 'MainActivity', to: 'ProfileActivity', action: 'CLICK', target: 'btn_profile', hash: 'x9f2' },
    { id: 't2', from: 'ProfileActivity', to: 'SettingsActivity', action: 'SWIPE_LEFT', target: 'settings_drawer', hash: 'a1b3' },
    { id: 't3', from: 'SettingsActivity', to: 'MainActivity', action: 'BACK_BUTTON', target: 'system', hash: 'c5d6' },
    { id: 't4', from: 'MainActivity', to: 'ProductDetail', action: 'CLICK', target: 'item_card_01', hash: 'e8f9' },
  ]);

  // Mock Graph Data for SVG rendering
  const nodes = [
    { id: 'n1', label: 'Main', x: 100, y: 150, risk: 'low' },
    { id: 'n2', label: 'Profile', x: 300, y: 100, risk: 'medium' },
    { id: 'n3', label: 'Detail', x: 300, y: 200, risk: 'high' },
    { id: 'n4', label: 'Settings', x: 500, y: 150, risk: 'medium' },
  ];

  const edges = [
    { from: 'n1', to: 'n2', label: 'CLICK' },
    { from: 'n1', to: 'n3', label: 'TAP' },
    { from: 'n2', to: 'n4', label: 'SWIPE' },
    { from: 'n3', to: 'n1', label: 'BACK' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 p-6 flex items-center justify-between shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Dynamic GUI Exploration</h2>
          <p className="text-sm text-slate-500">Visualizing state-transition paths and behavioral coverage.</p>
        </div>
        <div className="flex gap-2">
          <div className="bg-slate-100 p-1 rounded-lg flex mr-4">
            <button 
              onClick={() => setActiveTab('graph')}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${activeTab === 'graph' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}
            >
              Graph View
            </button>
            <button 
              onClick={() => setActiveTab('table')}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${activeTab === 'table' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}
            >
              Trace Table
            </button>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">
            <Share2 size={16} /> Export Map
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          {activeTab === 'graph' ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden relative min-h-[500px] flex flex-col">
              <div className="p-4 bg-slate-50/50 border-b border-slate-100 flex justify-between items-center">
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active State Graph Model</span>
                 <button className="p-1 text-slate-400 hover:text-indigo-600"><Maximize2 size={16}/></button>
              </div>
              <div className="flex-1 bg-slate-50 flex items-center justify-center p-8">
                 <svg viewBox="0 0 600 300" className="w-full h-full max-w-4xl drop-shadow-sm">
                   {/* Edges */}
                   {edges.map((edge, i) => {
                     const from = nodes.find(n => n.id === edge.from)!;
                     const to = nodes.find(n => n.id === edge.to)!;
                     return (
                       <g key={i}>
                         <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4" />
                         <circle cx={(from.x + to.x) / 2} cy={(from.y + to.y) / 2} r="10" fill="white" stroke="#e2e8f0" />
                         <text x={(from.x + to.x) / 2} y={(from.y + to.y) / 2 + 3} textAnchor="middle" fontSize="6" fontWeight="bold" fill="#64748b">{edge.label}</text>
                       </g>
                     );
                   })}
                   {/* Nodes */}
                   {nodes.map(node => (
                     <g key={node.id} className="cursor-pointer group">
                       <circle 
                         cx={node.x} cy={node.y} r="30" 
                         className={`transition-all duration-300 ${node.risk === 'high' ? 'fill-rose-50 stroke-rose-500' : node.risk === 'medium' ? 'fill-amber-50 stroke-amber-500' : 'fill-indigo-50 stroke-indigo-500'}`} 
                         strokeWidth="2"
                       />
                       <text x={node.x} y={node.y} textAnchor="middle" fontSize="10" fontWeight="black" className="fill-slate-700 pointer-events-none">{node.label}</text>
                       <text x={node.x} y={node.y + 12} textAnchor="middle" fontSize="6" fontWeight="bold" className="fill-slate-400 pointer-events-none">#x{node.id}f2</text>
                     </g>
                   ))}
                 </svg>
              </div>
              <div className="p-4 bg-white border-t border-slate-100 flex gap-6 text-[10px] font-bold">
                 <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-indigo-100 border border-indigo-500"></div> Static Activity</div>
                 <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-rose-100 border border-rose-500"></div> High Risk Component Detected</div>
                 <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-amber-100 border border-amber-500"></div> Medium Complexity</div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="px-6 py-4 tracking-widest">Source Activity</th>
                      <th className="px-6 py-4 tracking-widest">Action Meta</th>
                      <th className="px-6 py-4 tracking-widest">Target Screen</th>
                      <th className="px-6 py-4 tracking-widest">Hash Correlation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {traces.map(t => (
                      <tr key={t.id} className="hover:bg-slate-50/50 transition">
                        <td className="px-6 py-4 font-bold text-slate-700">{t.from}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter">{t.action}</span>
                            <span className="text-slate-400 text-xs">{t.target}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-medium text-slate-600">{t.to}</td>
                        <td className="px-6 py-4 font-mono text-slate-400 text-xs">0x{t.hash}...{t.id}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
             <div className="relative z-10">
                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Coverage Insight</p>
                <h3 className="text-2xl font-black mb-4">74.2%</h3>
                <div className="space-y-4">
                   <div>
                      <div className="flex justify-between text-[10px] mb-1"><span>Activity Coverage</span><span>8/12</span></div>
                      <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                         <div className="h-full bg-indigo-500 w-[66%]"></div>
                      </div>
                   </div>
                   <div>
                      <div className="flex justify-between text-[10px] mb-1"><span>Interaction Variety</span><span>92%</span></div>
                      <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                         <div className="h-full bg-emerald-500 w-[92%]"></div>
                      </div>
                   </div>
                </div>
             </div>
             <Activity className="absolute -bottom-4 -right-4 w-32 h-32 text-indigo-500 opacity-10" />
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
             <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2"><Layout size={16} className="text-indigo-600"/> Screen Profiling</h3>
             <div className="space-y-3">
                {['MainActivity', 'ProfilePage', 'DetailsView'].map(name => (
                  <div key={name} className="p-3 bg-slate-50 rounded-xl flex items-center justify-between group hover:bg-white hover:border hover:border-indigo-100 transition">
                     <div>
                        <p className="text-xs font-bold text-slate-700">{name}</p>
                        <p className="text-[10px] text-slate-400">12 Interactive Widgets</p>
                     </div>
                     <div className="text-[10px] font-black text-indigo-500 group-hover:underline cursor-pointer">VIEW</div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
