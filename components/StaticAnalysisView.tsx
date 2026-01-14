
import React, { useState } from 'react';
import { db } from '../services/mockDb';
import { Project, ComponentCategory } from '../types';
import { analyzeApkStatic } from '../services/geminiService';
import { MOCK_MANIFEST } from '../constants';
import { AlertTriangle, Zap, Layers, MessageSquare, MapPin, Loader2, Play, Info } from 'lucide-react';

interface Props { project: Project; }

export const StaticAnalysisView: React.FC<Props> = ({ project }) => {
  const [components, setComponents] = useState(db.getComponents(project.id));
  const [analyzing, setAnalyzing] = useState(false);

  const runAnalysis = async () => {
    setAnalyzing(true);
    const results = await analyzeApkStatic(MOCK_MANIFEST, "// Layout with RecyclerView, DrawerLayout, and ModalDialogs");
    if (results) {
      results.forEach((res: any) => {
        db.addComponent({
          id: Math.random().toString(36).substr(2, 9),
          projectId: project.id,
          typeCategory: res.typeCategory as ComponentCategory,
          selector: res.selector,
          riskScore: res.riskScore,
          source: 'static'
        });
      });
      setComponents(db.getComponents(project.id));
    }
    setAnalyzing(false);
  };

  const getIcon = (cat: string) => {
    switch (cat) {
      case ComponentCategory.GESTURE: return <Zap size={16} className="text-amber-500" />;
      case ComponentCategory.RUNTIME: return <Layers size={16} className="text-blue-500" />;
      case ComponentCategory.MODAL: return <MessageSquare size={16} className="text-purple-500" />;
      case ComponentCategory.CONTEXT: return <MapPin size={16} className="text-green-500" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 p-6 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
              <Layers size={24}/>
           </div>
           <div>
             <h2 className="text-lg font-bold text-slate-800">Static APK Profiling (Stage 1)</h2>
             <p className="text-sm text-slate-500">Heuristic component discovery & risk estimation.</p>
           </div>
        </div>
        <button 
          onClick={runAnalysis}
          disabled={analyzing}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 transition shadow-lg shadow-indigo-100"
        >
          {analyzing ? <Loader2 className="animate-spin" size={20} /> : <Play size={20} />}
          {analyzing ? 'Processing APK...' : 'Analyze Artifact'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {Object.values(ComponentCategory).map(cat => (
          <div key={cat} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm relative overflow-hidden group">
            <div className="flex items-center gap-2 mb-2 relative z-10">
              {getIcon(cat)}
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{cat}</span>
            </div>
            <div className="text-2xl font-black text-slate-800 relative z-10">
              {components.filter(c => c.typeCategory === cat).length}
            </div>
            <div className="absolute -right-2 -bottom-2 opacity-[0.03] group-hover:scale-110 transition duration-500">
               {getIcon(cat) && React.cloneElement(getIcon(cat) as React.ReactElement, { size: 64 })}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
           <AlertTriangle size={16} className="text-amber-500" />
           <span className="text-xs font-bold text-slate-600 uppercase">High Risk Component Catalog</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white border-b border-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-widest">
              <tr>
                <th className="px-6 py-4">Categorisation</th>
                <th className="px-6 py-4">Resource Identifier</th>
                <th className="px-6 py-4">Undertested Risk Score</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {components.map(c => (
                <tr key={c.id} className="hover:bg-slate-50/50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-indigo-400"></div>
                      <span className="text-sm font-bold text-slate-700">{c.typeCategory}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <code className="bg-slate-100 px-2 py-1 rounded text-[10px] text-indigo-600 font-mono">{c.selector}</code>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden w-24">
                        <div 
                          className={`h-full rounded-full ${c.riskScore > 7 ? 'bg-rose-500' : c.riskScore > 4 ? 'bg-amber-500' : 'bg-green-500'}`}
                          style={{ width: `${c.riskScore * 10}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-black text-slate-800">{c.riskScore.toFixed(1)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition">
                      <Info size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {components.length === 0 && (
          <div className="p-16 text-center text-slate-400">
             <Layers size={48} className="mx-auto mb-4 opacity-10" />
             <p className="font-medium text-sm">Awaiting APK upload and static profiling...</p>
          </div>
        )}
      </div>
    </div>
  );
};
