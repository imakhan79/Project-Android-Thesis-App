
import React, { useState, useEffect } from 'react';
import { Project, RunStatus, RunType, EpisodeTest } from '../types';
import { db } from '../services/mockDb';
import { REWARD_CONFIG_DEFAULT } from '../constants';
import { simulateRLEpisode } from '../services/geminiService';
import { Play, RotateCcw, ShieldCheck, Bug, Activity, Loader2, CheckCircle2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Props {
  project: Project;
}

export const RLExplorationView: React.FC<Props> = ({ project }) => {
  const [running, setRunning] = useState(false);
  const [episodes, setEpisodes] = useState<EpisodeTest[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [currentRunId, setCurrentRunId] = useState<string | null>(null);

  const startRL = async () => {
    setRunning(true);
    setLogs(['[SYSTEM] Initializing Hybrid Actor-Critic Agent...', '[RL] Loading DDQN Replay Buffer...', '[ENV] Connecting to Android Emulator...']);
    
    const runId = Math.random().toString(36).substr(2, 9);
    setCurrentRunId(runId);
    db.addRun({
      id: runId,
      projectId: project.id,
      runType: RunType.RL,
      configJson: JSON.stringify(REWARD_CONFIG_DEFAULT),
      startedAt: Date.now(),
      status: RunStatus.RUNNING
    });

    // Simulate 5 episodes with small delays
    for (let i = 1; i <= 5; i++) {
      setLogs(prev => [...prev, `[EPISODE ${i}] Starting exploration...`]);
      const data = await simulateRLEpisode({ rewardWeights: REWARD_CONFIG_DEFAULT });
      
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
        setLogs(prev => [...prev, `[EPISODE ${i}] Finished. Reward: ${data.totalReward.toFixed(1)}, Novelty: ${(data.novelty * 100).toFixed(1)}%`]);
        if (data.crashFlag) setLogs(prev => [...prev, `[CRASH] Potential anomaly detected in episode ${i}!`]);
      }
      await new Promise(r => setTimeout(r, 1500));
    }

    db.updateRunStatus(runId, RunStatus.COMPLETED);
    setRunning(false);
    setLogs(prev => [...prev, '[SYSTEM] Run completed. 5 episodes generated.']);
  };

  const chartData = episodes.map((e, idx) => ({ name: `Ep ${idx+1}`, reward: e.totalReward, novelty: e.novelty * 10 }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Config and Controls */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Activity className="text-indigo-600" />
              Agent Parameters
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Reward Shaping</label>
                <div className="space-y-3">
                  <div className="flex justify-between items-center bg-slate-50 p-2 rounded">
                    <span className="text-sm font-medium">New State Discovered</span>
                    <span className="text-indigo-600 font-bold">+{REWARD_CONFIG_DEFAULT.newState}</span>
                  </div>
                  <div className="flex justify-between items-center bg-slate-50 p-2 rounded">
                    <span className="text-sm font-medium">High-risk Component</span>
                    <span className="text-indigo-600 font-bold">+{REWARD_CONFIG_DEFAULT.highRiskInteraction}</span>
                  </div>
                  <div className="flex justify-between items-center bg-rose-50 p-2 rounded">
                    <span className="text-sm font-medium text-rose-700">Crash Detection</span>
                    <span className="text-rose-600 font-bold">+{REWARD_CONFIG_DEFAULT.crash}</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={startRL}
                disabled={running}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 disabled:bg-slate-300 transition shadow-lg shadow-indigo-200"
              >
                {running ? <Loader2 className="animate-spin" size={20} /> : <Play size={20} />}
                {running ? 'Agent Exploring...' : 'Launch Exploration'}
              </button>
            </div>
          </div>

          <div className="bg-slate-900 rounded-xl p-6 text-slate-300 mono text-xs h-64 overflow-y-auto border-4 border-slate-800">
            <p className="text-slate-500 mb-2">Agent Execution Logs:</p>
            {logs.map((log, i) => (
              <div key={i} className="mb-1 leading-relaxed">
                <span className="text-indigo-400">root@gemini-rl:~$</span> {log}
              </div>
            ))}
            {running && <div className="animate-pulse">|</div>}
          </div>
        </div>

        {/* Metrics & Results */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 h-64 shadow-sm">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Cumulative Reward Convergence</h3>
            <div className="h-40 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Line type="monotone" dataKey="reward" stroke="#4f46e5" strokeWidth={3} dot={{r: 6, fill: '#4f46e5'}} />
                  <Line type="monotone" dataKey="novelty" stroke="#10b981" strokeWidth={3} dot={{r: 6, fill: '#10b981'}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
             <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-bold text-slate-800">Generated Test Episodes</h3>
                <span className="text-xs text-slate-500 font-medium">{episodes.length} episodes ready</span>
             </div>
             <div className="divide-y divide-slate-100">
                {episodes.map((e, idx) => (
                  <div key={e.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center font-bold text-indigo-600">
                        {idx + 1}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-800">Episode #{e.id.substr(0,4)}</div>
                        <div className="text-xs text-slate-400 flex items-center gap-3 mt-0.5">
                          <span className="flex items-center gap-1"><RotateCcw size={12} /> Steps: {e.depth}</span>
                          <span className="flex items-center gap-1 text-indigo-500"><Activity size={12} /> Reward: {e.totalReward.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                       {e.crashFlag && <div className="bg-rose-100 text-rose-700 text-[10px] font-black px-2 py-1 rounded-full uppercase flex items-center gap-1"><Bug size={10}/> Anomaly</div>}
                       <div className="bg-slate-100 text-slate-600 text-[10px] font-black px-2 py-1 rounded-full uppercase flex items-center gap-1"><ShieldCheck size={10}/> {Math.round(e.novelty * 100)}% Novel</div>
                    </div>
                  </div>
                ))}
                {episodes.length === 0 && !running && (
                  <div className="p-12 text-center text-slate-400 flex flex-col items-center gap-2">
                    <Activity size={40} className="opacity-20" />
                    <p>No episodes generated yet. Launch exploration to begin.</p>
                  </div>
                )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
