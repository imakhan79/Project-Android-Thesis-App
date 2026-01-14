
import React, { useState, useEffect } from 'react';
import { Project, RunStatus, RunType, EpisodeTest } from '../types';
import { db } from '../services/mockDb';
import { REWARD_CONFIG_DEFAULT, ADVANCED_RL_PARAMS } from '../constants';
import { simulateRLEpisode } from '../services/geminiService';
import { Play, RotateCcw, ShieldCheck, Bug, Activity, Loader2, Settings2, Info } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Props {
  project: Project;
}

export const RLExplorationView: React.FC<Props> = ({ project }) => {
  const [running, setRunning] = useState(false);
  const [episodes, setEpisodes] = useState<EpisodeTest[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [rlParams, setRlParams] = useState(ADVANCED_RL_PARAMS);

  const startRL = async () => {
    setRunning(true);
    setLogs(['[SYSTEM] Initializing Hybrid Actor-Critic Agent...', '[RL] Loading DDQN Replay Buffer...', '[ENV] Connecting to Android Emulator...']);
    
    const runId = Math.random().toString(36).substr(2, 9);
    db.addRun({
      id: runId,
      projectId: project.id,
      runType: RunType.RL,
      configJson: JSON.stringify({ rewards: REWARD_CONFIG_DEFAULT, params: rlParams }),
      startedAt: Date.now(),
      status: RunStatus.RUNNING
    });

    for (let i = 1; i <= 5; i++) {
      setLogs(prev => [...prev, `[EPISODE ${i}] Exploring with α=${rlParams.learningRate}, γ=${rlParams.discountFactor}`]);
      const data = await simulateRLEpisode({ rewardWeights: REWARD_CONFIG_DEFAULT, params: rlParams });
      
      if (data) {
        const episode: EpisodeTest = {
          id: Math.random().toString(36).substr(2, 9),
          runId,
          sequenceJson: JSON.stringify(data.sequence),
          totalReward: data.totalReward,
          depth: data.sequence.length,
          novelty: data.novelty,
          faultLikelihood: data.faultLikelihood,
          timeCost: data.sequence.length * 1.5,
          crashFlag: data.crashFlag
        };
        db.addEpisode(episode);
        setEpisodes(prev => [...prev, episode]);
        setLogs(prev => [...prev, `[EPISODE ${i}] Result: Reward=${data.totalReward.toFixed(1)}`]);
      }
      await new Promise(r => setTimeout(r, 1000));
    }

    db.updateRunStatus(runId, RunStatus.COMPLETED);
    setRunning(false);
    setLogs(prev => [...prev, '[SYSTEM] Run completed.']);
  };

  const chartData = episodes.map((e, idx) => ({ name: `Ep ${idx+1}`, reward: e.totalReward, novelty: e.novelty * 10 }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
               <h3 className="text-lg font-bold flex items-center gap-2">
                  <Activity className="text-indigo-600" size={20} />
                  Agent Strategy
               </h3>
               <button 
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-slate-400 hover:text-indigo-600 transition"
               >
                 <Settings2 size={18} />
               </button>
            </div>

            <div className="space-y-4">
              {showAdvanced ? (
                <div className="animate-in slide-in-from-top-2 duration-300 space-y-4">
                   <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                      <p className="text-[10px] font-black text-indigo-400 uppercase mb-3 flex items-center gap-1">
                        <Info size={10}/> Researcher Config (Actor-Critic)
                      </p>
                      <div className="space-y-3">
                         <div>
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Learning Rate (α)</label>
                            <input type="number" step="0.0001" className="w-full bg-white border border-slate-200 rounded p-1 text-sm mt-1" value={rlParams.learningRate} onChange={e => setRlParams({...rlParams, learningRate: parseFloat(e.target.value)})}/>
                         </div>
                         <div>
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Discount Factor (γ)</label>
                            <input type="number" step="0.01" className="w-full bg-white border border-slate-200 rounded p-1 text-sm mt-1" value={rlParams.discountFactor} onChange={e => setRlParams({...rlParams, discountFactor: parseFloat(e.target.value)})}/>
                         </div>
                      </div>
                   </div>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Reward Shaping</label>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center bg-slate-50 p-2 rounded text-sm">
                      <span>New State Discovered</span>
                      <span className="text-indigo-600 font-bold">+{REWARD_CONFIG_DEFAULT.newState}</span>
                    </div>
                    <div className="flex justify-between items-center bg-rose-50 p-2 rounded text-sm">
                      <span className="text-rose-700">Crash Detection</span>
                      <span className="text-rose-600 font-bold">+{REWARD_CONFIG_DEFAULT.crash}</span>
                    </div>
                  </div>
                </div>
              )}
              
              <button 
                onClick={startRL}
                disabled={running}
                className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 disabled:bg-slate-300 transition shadow-lg shadow-indigo-200"
              >
                {running ? <Loader2 className="animate-spin" size={20} /> : <Play size={20} />}
                {running ? 'Agent Exploring...' : 'Launch Exploration'}
              </button>
            </div>
          </div>

          <div className="bg-slate-900 rounded-xl p-6 text-slate-300 font-mono text-[10px] h-64 overflow-y-auto border-4 border-slate-800 shadow-xl">
            <p className="text-slate-500 mb-2 border-b border-slate-800 pb-1">root@gemini-rl:~$ tail -f agent.log</p>
            {logs.map((log, i) => (
              <div key={i} className="mb-1 leading-relaxed border-l border-indigo-500/30 pl-2">
                {log}
              </div>
            ))}
            {running && <div className="animate-pulse">_</div>}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 h-64 shadow-sm relative overflow-hidden">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Exploration Efficiency Curves</h3>
            <div className="h-40 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '10px' }} />
                  <Line type="monotone" dataKey="reward" stroke="#4f46e5" strokeWidth={3} dot={{r: 4}} />
                  <Line type="monotone" dataKey="novelty" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" dot={{r: 4}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="absolute top-6 right-6 flex gap-4 text-[10px] font-bold">
               <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-indigo-600"></div> Reward</div>
               <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Novelty</div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
             <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-bold text-sm text-slate-800">Generated Episode Summary</h3>
                <span className="text-[10px] text-slate-500 font-bold uppercase">{episodes.length} EPISODES READY</span>
             </div>
             <div className="divide-y divide-slate-100">
                {episodes.map((e, idx) => (
                  <div key={e.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center font-bold text-indigo-600 text-xs">
                        {idx + 1}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-800">Episode Trace ID: {e.id.substr(0,8)}</div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-3 mt-0.5">
                          <span className="flex items-center gap-1 font-bold"><RotateCcw size={10} /> {e.depth} Actions</span>
                          <span className="flex items-center gap-1 text-indigo-500 font-bold"><Activity size={10} /> ΣR: {e.totalReward.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                       {e.crashFlag && <div className="bg-rose-100 text-rose-700 text-[10px] font-black px-2 py-1 rounded-full uppercase flex items-center gap-1"><Bug size={10}/> CRASH</div>}
                       <div className="bg-slate-100 text-slate-600 text-[10px] font-black px-2 py-1 rounded-full uppercase"><ShieldCheck size={10} className="inline mr-1"/> {Math.round(e.novelty * 100)}% NEW</div>
                    </div>
                  </div>
                ))}
                {episodes.length === 0 && !running && (
                  <div className="p-16 text-center text-slate-300 flex flex-col items-center gap-2">
                    <Activity size={48} className="opacity-10" />
                    <p className="font-medium text-sm">No episodic data available.</p>
                  </div>
                )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
