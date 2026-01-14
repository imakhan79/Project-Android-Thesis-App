
import React, { useState } from 'react';
import { Project, EpisodeTest, PrioritizedSuite, RunType, RunStatus } from '../types';
import { db } from '../services/mockDb';
import { GA_CONFIG_DEFAULT } from '../constants';
import { Sliders, TrendingUp, Download, CheckCircle, Info, ChevronRight } from 'lucide-react';

interface Props {
  project: Project;
}

export const GAPrioritizationView: React.FC<Props> = ({ project }) => {
  const [weights, setWeights] = useState(GA_CONFIG_DEFAULT.weights);
  const [rankedList, setRankedList] = useState<{ep: EpisodeTest, fitness: number}[]>([]);
  const [optimizing, setOptimizing] = useState(false);

  const runGA = () => {
    setOptimizing(true);
    // Fetch all RL runs for this project
    const rlRuns = db.getRuns(project.id).filter(r => r.runType === RunType.RL);
    let allEpisodes: EpisodeTest[] = [];
    rlRuns.forEach(r => {
      allEpisodes = [...allEpisodes, ...db.getEpisodes(r.id)];
    });

    if (allEpisodes.length === 0) {
      alert("No episodes found. Please run RL Exploration first.");
      setOptimizing(false);
      return;
    }

    // Mock GA logic: weighted sum fitness + sort
    setTimeout(() => {
      const calculated = allEpisodes.map(ep => {
        const fitness = (ep.depth/20 * weights.coverage) + 
                        (ep.faultLikelihood * weights.fault) + 
                        (ep.novelty * weights.novelty) - 
                        (ep.timeCost/50 * weights.cost);
        return { ep, fitness };
      }).sort((a, b) => b.fitness - a.fitness);

      setRankedList(calculated);
      
      // Store result
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
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* GA Parameters */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Sliders size={16} /> GA Parameters
            </h3>
            <div className="space-y-6">
              {Object.entries(weights).map(([key, val]) => (
                <div key={key}>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-semibold capitalize text-slate-700">{key} Weight</label>
                    {/* Fixed: cast val to number to resolve 'unknown' type error */}
                    <span className="text-xs font-bold bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded">{(val as number).toFixed(2)}</span>
                  </div>
                  <input 
                    type="range" min="0" max="1" step="0.05" 
                    value={val}
                    onChange={(e) => setWeights({...weights, [key]: parseFloat(e.target.value)})}
                    className="w-full accent-indigo-600 h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              ))}
              <div className="pt-4 border-t border-slate-100">
                 <button 
                  onClick={runGA}
                  disabled={optimizing}
                  className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-black transition flex items-center justify-center gap-2"
                 >
                   {optimizing ? 'Optimizing...' : 'Run GA Prioritizer'}
                   {!optimizing && <TrendingUp size={18} />}
                 </button>
              </div>
            </div>
          </div>

          <div className="bg-indigo-600 rounded-xl p-6 text-white shadow-xl shadow-indigo-200">
            <h4 className="font-bold flex items-center gap-2 mb-2"><Info size={16}/> How it works</h4>
            <p className="text-xs leading-relaxed opacity-90">
              The Genetic Algorithm encodes each test episode as a chromosome. We apply selection, crossover, and mutation to evolve the population until the optimal execution order is found based on your multi-objective fitness weights.
            </p>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-3 space-y-6">
           <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                 <h3 className="font-bold text-slate-800">Optimized Execution Order</h3>
                 <button className="text-xs font-bold text-indigo-600 flex items-center gap-1 hover:underline">
                    <Download size={14} /> Export Ranked Tests
                 </button>
              </div>
              <div className="divide-y divide-slate-100">
                {rankedList.map((item, idx) => (
                  <div key={item.ep.id} className="p-5 flex items-center justify-between hover:bg-slate-50 transition group">
                    <div className="flex items-center gap-5">
                      <div className="text-2xl font-black text-slate-200 group-hover:text-indigo-200 transition">
                        {(idx + 1).toString().padStart(2, '0')}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-800 flex items-center gap-2">
                           Test Episode #{item.ep.id.substr(0,6)}
                           {idx < 2 && <span className="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full uppercase">High Priority</span>}
                        </div>
                        <div className="text-xs text-slate-500 mt-1 flex items-center gap-3">
                           <span>Fitness: <b className="text-slate-700">{item.fitness.toFixed(3)}</b></span>
                           <span>Fault Likelihood: <b className="text-rose-500">{(item.ep.faultLikelihood * 100).toFixed(0)}%</b></span>
                           <span>Time Cost: <b className="text-slate-700">{item.ep.timeCost.toFixed(1)}s</b></span>
                        </div>
                      </div>
                    </div>
                    <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition">
                      <ChevronRight size={20} />
                    </button>
                  </div>
                ))}
                {rankedList.length === 0 && (
                  <div className="p-20 text-center text-slate-400">
                    <TrendingUp size={48} className="mx-auto mb-4 opacity-10" />
                    <p className="font-medium">Configure weights and run GA to see ranked results.</p>
                  </div>
                )}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
