
import React, { useState } from 'react';
import { db } from '../services/mockDb';
import { Project, ComponentCategory } from '../types';
import { analyzeApkStatic } from '../services/geminiService';
import { MOCK_MANIFEST } from '../constants';
import { AlertTriangle, Zap, Layers, MessageSquare, MapPin, Loader2, Play } from 'lucide-react';

interface Props {
  project: Project;
}

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
      <div className="bg-white rounded-xl border border-slate-200 p-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Static APK Analysis</h2>
          <p className="text-sm text-slate-500">Scan manifest and layouts to identify high-risk components.</p>
        </div>
        <button 
          onClick={runAnalysis}
          disabled={analyzing}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 transition"
        >
          {analyzing ? <Loader2 className="animate-spin" size={20} /> : <Play size={20} />}
          {analyzing ? 'Analyzing APK...' : 'Run New Scan'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {Object.values(ComponentCategory).map(cat => (
          <div key={cat} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              {getIcon(cat)}
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{cat}</span>
            </div>
            <div className="text-2xl font-black text-slate-800">
              {components.filter(c => c.typeCategory === cat).length}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-widest">
            <tr>
              <th className="px-6 py-4">Component Category</th>
              <th className="px-6 py-4">Identifier / Selector</th>
              <th className="px-6 py-4">Risk Score</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {components.map(c => (
              <tr key={c.id} className="hover:bg-slate-50 transition">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {getIcon(c.typeCategory)}
                    <span className="text-sm font-medium text-slate-700">{c.typeCategory}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <code className="bg-slate-100 px-2 py-1 rounded text-xs text-indigo-600 mono">{c.selector}</code>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden max-w-[100px]">
                      <div 
                        className={`h-full rounded-full ${c.riskScore > 7 ? 'bg-rose-500' : c.riskScore > 4 ? 'bg-amber-500' : 'bg-green-500'}`}
                        style={{ width: `${c.riskScore * 10}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-bold text-slate-600">{c.riskScore.toFixed(1)}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {c.riskScore > 8 && (
                    <div className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                      <AlertTriangle size={12} />
                      CRITICAL
                    </div>
                  )}
                  {c.riskScore <= 8 && c.riskScore > 5 && (
                    <div className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                      WARNING
                    </div>
                  )}
                  {c.riskScore <= 5 && (
                    <div className="inline-flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                      STABLE
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
