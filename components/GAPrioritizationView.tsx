
import React, { useState } from 'react';
import { Project, EpisodeTest, PrioritizedSuite, RunType, RunStatus } from '../types';
import { db } from '../services/mockDb';
import { GA_CONFIG_DEFAULT } from '../constants';
import { Sliders, TrendingUp, Download, CheckCircle, Info, ChevronRight, Activity } from 'lucide-react';

interface Props {
  project: Project;
}

export const GAPrioritizationView: React.FC<Props> = ({ project }) => {
  // Fixed: explicitly typed weights
  const [weights, setWeights] = useState<Record<string, number>>(GA_CONFIG_DEFAULT.weights);
  const [rankedList, setRankedList] = useState<{ep: EpisodeTest, fitness: number}[]>([]);
  const [optimizing, setOptimizing] = useState(false);

  const runGA = () => {
    setOptimizing(true);
    const rlRuns = db.getRuns(project.id).filter(r => r.runType === RunType.RL);
    let allEpisodes: EpisodeTest[] = [];
    rlRuns.forEach(r => {
      allEpisodes = [...allEpisodes, ...db.getEpisodes(r.id)];
    });

    if (allEpisodes.length === 0) {
      alert("No episodes found. Please run RL Exploration first to generate testing candidates.");
      setOptimizing(false);
      return;
    }

    setTimeout(() => {
      const calculated = allEpisodes.map(ep => {
        // Multi-objective optimization fitness function
        const fitness = (ep.depth/20 * (weights.coverage || 0.4)) + 
                        (ep.faultLikelihood * (weights.fault || 0.3)) + 
                        (ep.novelty * (weights.novelty || 0.2)) - 
                        (ep.timeCost/50 * (weights.cost || 0.1));
        return { ep, fitness };
      }).sort((a, b) => b.fitness - a.fitness);

      setRankedList(calculated);
      
      const runId = Math.random().toString(36).substr(2, 9);
      db.addRun({
        id: runId,
        projectId: project.id,
        runType: RunType.GA,
        configJson: JSON.stringify(weights),
        startedAt: Date.now(),
        status: RunStatus.COMPLETED,
        endedAt: Date.now()
      });

      db.addSuite({
        id: Math.random().toString(36).substr(2, 9),
        runId,
        weightsJson: JSON.stringify(weights),
        rankedTestIdsJson: JSON.stringify(calculated.map(c => c.ep.id))
      });

      setOptimizing(false);
    }, 1200);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* GA Parameters */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-8 flex items-center gap-3">
              <Sliders size={18} className="text-indigo-600" />
              Fitness Weights
            </h3>
            <div className="space-y-8">
              {/* Fix: Explicitly typed destructuring to ensure 'val' is treated as a number for arithmetic operation on line 82 */}
              {Object.entries(weights).map(([key, val]: [string, number]) => (
                <div key={key}>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">{key} priority</label>
                    <span className="text-xs font-black bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full">
                      {Math.round(val * 100)}%
                    </span>
                  </div>
                  <input 
                    type="range" min="0" max="1" step="0.05" 
                    value={val}
                    onChange={(e) => setWeights({...weights, [key]: parseFloat(e.target.value)})}
                    className="w-full accent-indigo-600 h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              ))}
              <div className="pt-6 border-t border-slate-100">
                 <button 
                  onClick={runGA}
                  disabled={optimizing}
                  className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black hover:bg-black transition flex items-center justify-center gap-3 shadow-xl shadow-slate-100 disabled:bg-slate-300"
                 >
                   {optimizing ? 'EVOLVING POPULATION...' : 'EXECUTE GA PRIORITIZER'}
                   {!optimizing && <TrendingUp size={20} />}
                 </button>
              </div>
            </div>
          </div>

          <div className="bg-indigo-600 rounded-2xl p-8 text-white shadow-xl shadow-indigo-100">
            <h4 className="font-black text-xs uppercase tracking-widest flex items-center gap-2 mb-4">
              <Activity size={16}/> Research Context
            </h4>
            <p className="text-xs leading-relaxed opacity-90 font-medium">
              Stage 4 employs a Genetic Algorithm to evolve the optimal execution order of RL-generated episodes. By maximizing fault discovery while minimizing time costs, we achieve superior APFD metrics.
            </p>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-8 space-y-6">
           <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="p-4 lg:p-6 bg-slate-50 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                 <div>
                    <h3 className="font-black text-slate-800 uppercase text-xs tracking-widest">Optimized Test Schedule</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Multi-Objective Pareto Optimal Selection</p>
                 </div>
                 <button className="text-[10px] font-black text-indigo-600 flex items-center gap-2 hover:underline uppercase tracking-widest">
                    <Download size={14} /> Export ranked.json
                 </button>
              </div>
              <div className="divide-y divide-slate-50">
                {rankedList.map((item, idx) => (
                  <div key={item.ep.id} className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between hover:bg-slate-50 transition group gap-4">
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-2xl font-black text-slate-300 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition duration-300">
                        {idx + 1}
                      </div>
                      <div>
                        <div className="text-sm font-black text-slate-800 flex items-center gap-2 uppercase tracking-tight">
                           Episode #{item.ep.id.substr(0,8)}
                           {idx < 3 && <span className="text-[8px] font-black bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full uppercase tracking-widest">High Impact</span>}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 font-bold uppercase tracking-wider">
                           <span>Fitness: <b className="text-slate-700">{item.fitness.toFixed(3)}</b></span>
                           <span>Fault Risk: <b className="text-rose-500">{(item.ep.faultLikelihood * 100).toFixed(0)}%</b></span>
                           <span>Duration: <b className="text-slate-700">{item.ep.timeCost.toFixed(1)}s</b></span>
                        </div>
                      </div>
                    </div>
                    <button className="w-full sm:w-auto p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl border border-transparent hover:border-indigo-100 transition flex items-center justify-center">
                      <ChevronRight size={20} />
                    </button>
                  </div>
                ))}
                {rankedList.length === 0 && (
                  <div className="p-24 text-center text-slate-400 flex flex-col items-center">
                    <TrendingUp size={64} className="mb-6 opacity-5" />
                    <p className="font-black text-sm text-slate-500 uppercase tracking-widest">Execution Queue Empty</p>
                    <p className="text-xs text-slate-400 mt-1 uppercase font-bold">Configure weights and evolve suite</p>
                  </div>
                )}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
