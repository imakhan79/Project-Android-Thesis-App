
import React, { useState } from 'react';
import { db } from '../services/mockDb';
import { Project, ComponentCategory } from '../types';
import { analyzeApkStatic } from '../services/geminiService';
import { MOCK_MANIFEST } from '../constants';
import { AlertTriangle, Zap, Layers, MessageSquare, MapPin, Loader2, Play, Info, FileUp, CheckCircle2 } from 'lucide-react';

interface Props { project: Project; }

export const StaticAnalysisView: React.FC<Props> = ({ project }) => {
  const [components, setComponents] = useState(db.getComponents(project.id));
  const [analyzing, setAnalyzing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [stage, setStage] = useState<'idle' | 'uploading' | 'analyzing' | 'done'>('idle');

  const runAnalysis = async () => {
    setStage('uploading');
    setAnalyzing(true);
    
    // Simulate upload
    for (let i = 0; i <= 100; i += 10) {
      setUploadProgress(i);
      await new Promise(r => setTimeout(r, 150));
    }
    
    setStage('analyzing');
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
    
    setStage('done');
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
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Control Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm h-full">
            <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
              <FileUp size={32}/>
            </div>
            <h2 className="text-xl font-black text-slate-800 mb-2 uppercase tracking-tight">Stage 1: Static Profiling</h2>
            <p className="text-sm text-slate-500 mb-8 leading-relaxed">
              Upload the application binary (APK) or source directory to initiate heuristic component discovery.
            </p>

            <div className="space-y-4">
              {stage === 'idle' && (
                <button 
                  onClick={runAnalysis}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-4 rounded-2xl font-black flex items-center justify-center gap-3 transition shadow-xl shadow-indigo-100"
                >
                  <Play size={20} fill="currentColor" />
                  START ANALYSIS
                </button>
              )}

              {(stage === 'uploading' || stage === 'analyzing') && (
                <div className="space-y-4 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">
                      {stage === 'uploading' ? 'Extracting Assets...' : 'Heuristic Reasoning...'}
                    </span>
                    <span className="text-xs font-black text-slate-400">{uploadProgress}%</span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-indigo-500 transition-all duration-300" 
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold">
                    <Loader2 size={12} className="animate-spin" />
                    Connecting to Gemini Analysis Engine...
                  </div>
                </div>
              )}

              {stage === 'done' && (
                <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 flex flex-col items-center text-center">
                  <CheckCircle2 size={40} className="text-emerald-500 mb-3" />
                  <p className="text-sm font-bold text-emerald-800">Profiling Complete</p>
                  <p className="text-[10px] text-emerald-600 font-medium uppercase tracking-widest mt-1">
                    {components.length} Components Indexed
                  </p>
                  <button 
                    onClick={() => setStage('idle')}
                    className="mt-4 text-[10px] font-black text-emerald-700 hover:underline uppercase tracking-widest"
                  >
                    Analyze New Version
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Fixed: Cast Object.values to string[] to resolve 'unknown' type assignment to string parameter in getIcon */}
          {(Object.values(ComponentCategory) as string[]).map(cat => (
            <div key={cat} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-indigo-200 transition">
              <div className="flex items-center gap-2 mb-3 relative z-10">
                {getIcon(cat)}
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest truncate">{cat}</span>
              </div>
              <div className="text-3xl font-black text-slate-800 relative z-10">
                {components.filter(c => c.typeCategory === cat).length}
              </div>
              <div className="absolute -right-2 -bottom-2 opacity-[0.03] group-hover:scale-110 transition duration-500">
                 {getIcon(cat) && React.cloneElement(getIcon(cat) as React.ReactElement, { size: 80 })}
              </div>
            </div>
          ))}

          {/* Table Area */}
          <div className="col-span-full bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm mt-2">
            <div className="p-4 lg:p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
               <div className="flex items-center gap-2">
                 <AlertTriangle size={18} className="text-amber-500" />
                 <span className="text-xs font-black text-slate-700 uppercase tracking-widest">High Risk Component Catalog</span>
               </div>
               <span className="text-[10px] text-slate-400 font-bold uppercase">{components.length} Total</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[600px]">
                <thead className="bg-white border-b border-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                  <tr>
                    <th className="px-6 py-4">Categorisation</th>
                    <th className="px-6 py-4">Resource Identifier</th>
                    <th className="px-6 py-4">Risk Magnitude</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {components.map(c => (
                    <tr key={c.id} className="hover:bg-slate-50/50 transition group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${c.riskScore > 7 ? 'bg-rose-500' : 'bg-indigo-400'}`}></div>
                          <span className="text-xs font-bold text-slate-700">{c.typeCategory}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <code className="bg-slate-100 px-2 py-1 rounded text-[10px] text-indigo-600 font-mono font-bold">{c.selector}</code>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden w-24">
                            <div 
                              className={`h-full rounded-full transition-all duration-700 ${c.riskScore > 7 ? 'bg-rose-500' : c.riskScore > 4 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                              style={{ width: `${c.riskScore * 10}%` }}
                            ></div>
                          </div>
                          <span className="text-xs font-black text-slate-800">{c.riskScore.toFixed(1)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right opacity-0 group-hover:opacity-100 transition">
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
              <div className="p-16 text-center text-slate-400 flex flex-col items-center">
                 <Layers size={48} className="mb-4 opacity-10" />
                 <p className="font-bold text-sm text-slate-500">No components analyzed yet.</p>
                 <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-bold">Launch stage 1 to begin</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
