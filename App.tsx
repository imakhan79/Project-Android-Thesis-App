
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { ProjectSelector } from './components/ProjectSelector';
import { StaticAnalysisView } from './components/StaticAnalysisView';
import { RLExplorationView } from './components/RLExplorationView';
import { GAPrioritizationView } from './components/GAPrioritizationView';
import { DynamicAnalysisView } from './components/DynamicAnalysisView';
import { RunMonitor } from './components/RunMonitor';
import { Project } from './types';
import { db } from './services/mockDb';
import { BASELINE_DATA, REWARD_CONFIG_DEFAULT, ADVANCED_RL_PARAMS, GA_CONFIG_DEFAULT } from './constants';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  ComposedChart, Area, Line, ScatterChart, Scatter, ZAxis
} from 'recharts';
import { 
  Shield, Target, AlertCircle, Clock, Zap, 
  TrendingUp, Activity, Database, Layers, Info, Trash2, Save,
  PackageCheck
} from 'lucide-react';

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

// Fixed: Added missing TestSuiteView component as required by the 'suites' tab
const TestSuiteView: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center py-20">
        <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <PackageCheck size={40} />
        </div>
        <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Test Suite Repository</h3>
        <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto leading-relaxed">
          Access historical prioritized test suites and their execution status. 
          Suites are generated from the GA Prioritization engine (Stage 4).
        </p>
        <button className="mt-8 px-8 py-3 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-100">
          Sync with Device Lab
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2].map(i => (
          <div key={i} className="bg-white border border-slate-200 p-6 rounded-2xl hover:border-indigo-400 transition cursor-pointer group">
            <div className="flex justify-between items-start mb-4">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Suite ID: 0xRE2{i}F</div>
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            </div>
            <h4 className="font-black text-slate-800 uppercase tracking-tight mb-1 text-sm">Release Build v2.{i} Suite</h4>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-4">Coverage-Optimized Priority</p>
            <div className="flex items-center justify-between border-t border-slate-50 pt-4 mt-4">
              <span className="text-[9px] font-black text-indigo-600 uppercase">12 Episodes</span>
              <span className="text-[9px] font-black text-slate-400 uppercase">Aug 20, 2024</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Dashboard: React.FC<{ project: Project }> = ({ project }) => {
  const components = db.getComponents(project.id);
  const runs = db.getRuns(project.id);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Dynamically compute stats from DB
  const avgRisk = components.length > 0 
    ? (components.reduce((a, b) => a + b.riskScore, 0) / components.length).toFixed(1) 
    : "0.0";
  
  const stats = [
    { label: 'Avg Risk Score', value: avgRisk, icon: <Shield size={18} className="text-indigo-500" />, color: 'bg-indigo-50' },
    { label: 'States Explored', value: '142', icon: <Target size={18} className="text-emerald-500" />, color: 'bg-emerald-50' },
    { label: 'Faults (APFD)', value: '0.84', icon: <AlertCircle size={18} className="text-rose-500" />, color: 'bg-rose-50' },
    { label: 'Total Test Steps', value: '856', icon: <Activity size={18} className="text-amber-500" />, color: 'bg-amber-50' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Methodology Stepper - Mobile Scrollable */}
      <div className="bg-white p-6 lg:p-8 rounded-3xl border border-slate-200 shadow-sm overflow-x-auto">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Research Methodology Pipeline</h3>
        <div className="flex items-center justify-between min-w-[600px] relative px-4">
          <div className="absolute top-5 left-0 w-full h-[2px] bg-slate-100 z-0"></div>
          {[
            { stage: 'Stage 1', label: 'Analysis', icon: <Shield size={16}/>, active: true },
            { stage: 'Stage 2', label: 'Exploration', icon: <Zap size={16}/>, active: true },
            { stage: 'Stage 3', label: 'Hybrid RL', icon: <Database size={16}/>, active: true },
            { stage: 'Stage 4', label: 'GA Prioritization', icon: <TrendingUp size={16}/>, active: false },
          ].map((s, i) => (
            <div key={i} className="relative z-10 flex flex-col items-center gap-3 group">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-xl transition-all duration-300 group-hover:scale-110 ${s.active ? 'bg-indigo-600 ring-4 ring-indigo-50' : 'bg-slate-200 text-slate-400'}`}>
                {s.icon}
              </div>
              <div className="text-center">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{s.stage}</p>
                <p className={`text-[11px] font-black uppercase mt-0.5 ${s.active ? 'text-slate-800' : 'text-slate-400'}`}>{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-8 border-b border-slate-200 overflow-x-auto whitespace-nowrap scrollbar-none">
        {['overview', 'evaluation', 'artifacts'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 text-xs font-black uppercase tracking-widest transition-all border-b-2 ${activeTab === tab ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-5 transition hover:shadow-lg group">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${s.color}`}>{s.icon}</div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
                  <p className="text-2xl font-black text-slate-800">{s.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
              <h3 className="text-xs font-black uppercase tracking-widest mb-8 text-slate-400">Benchmarking Discovery Efficiency</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={BASELINE_DATA}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="metric" axisLine={false} tickLine={false} tick={{fontSize: 9, fontWeight: 700}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 9}} />
                    <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                    <Legend iconType="circle" wrapperStyle={{fontSize: 10, paddingTop: 20}} />
                    <Bar dataKey="hybridRL" name="Hybrid Agent" fill="#4f46e5" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="monkey" name="Monkey (Random)" fill="#cbd5e1" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="droidbot" name="DroidBot" fill="#94a3b8" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
              <h3 className="text-xs font-black uppercase tracking-widest mb-8 text-slate-400">Fault Detection Confidence</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis type="number" dataKey="depth" name="Episode Depth" unit=" steps" fontSize={9} axisLine={false} tickLine={false} />
                      <YAxis type="number" dataKey="fault" name="Fault Likelihood" unit="%" fontSize={9} axisLine={false} tickLine={false} />
                      <ZAxis type="number" range={[100, 500]} />
                      <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                      <Scatter name="Episodes" data={[
                        { depth: 5, fault: 20 },
                        { depth: 12, fault: 45 },
                        { depth: 8, fault: 90 },
                        { depth: 15, fault: 70 },
                        { depth: 3, fault: 10 },
                        { depth: 18, fault: 85 },
                      ]} fill="#4f46e5" />
                    </ScatterChart>
                </ResponsiveContainer>
              </div>
              <p className="text-[10px] font-bold text-slate-400 mt-4 text-center uppercase tracking-widest">Correlation: Depth vs Probabilistic Fault Detection</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'evaluation' && (
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
           <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight mb-4">Thesis Metric: APFD Graph</h3>
           <p className="text-sm text-slate-500 mb-8 max-w-2xl font-medium leading-relaxed">
              The Average Percentage of Faults Detected (APFD) represents the effectiveness of the Genetic Algorithm prioritization layer. Higher area under the curve indicates faster fault exposure.
           </p>
           <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                 <ComposedChart data={[
                   {time: 0, ours: 0, baseline: 0},
                   {time: 20, ours: 45, baseline: 10},
                   {time: 40, ours: 72, baseline: 25},
                   {time: 60, ours: 88, baseline: 40},
                   {time: 80, ours: 95, baseline: 55},
                   {time: 100, ours: 100, baseline: 70},
                 ]}>
                   <XAxis dataKey="time" axisLine={false} tickLine={false} label={{ value: '% Suite Executed', position: 'insideBottom', offset: -5, fontSize: 10, fontWeight: 700 }} />
                   <YAxis axisLine={false} tickLine={false} label={{ value: '% Faults Detected', angle: -90, position: 'insideLeft', fontSize: 10, fontWeight: 700 }} />
                   <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                   <Legend wrapperStyle={{fontSize: 10, paddingTop: 20}} />
                   <Area type="monotone" dataKey="ours" name="Hybrid RL + GA" fill="#4f46e510" stroke="#4f46e5" strokeWidth={4} />
                   <Line type="monotone" dataKey="baseline" name="Random Baseline" stroke="#94a3b8" strokeDasharray="6 6" strokeWidth={2} dot={false} />
                 </ComposedChart>
              </ResponsiveContainer>
           </div>
        </div>
      )}

      {activeTab === 'artifacts' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
           {runs.length === 0 ? (
             <div className="col-span-full py-24 text-center text-slate-400">
                <Database size={48} className="mx-auto mb-4 opacity-10" />
                <p className="font-bold uppercase tracking-widest">No trace artifacts available</p>
             </div>
           ) : runs.map(run => (
             <div key={run.id} className="bg-white border border-slate-200 p-6 rounded-2xl hover:border-indigo-400 hover:shadow-xl transition-all cursor-pointer group">
                <div className="flex justify-between items-start mb-6">
                   <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition duration-300"><Database size={24}/></div>
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded">0x{run.id.substr(0,8)}</span>
                </div>
                <h4 className="font-black text-slate-800 mb-1 uppercase tracking-tight truncate">{run.runType} Observation Run</h4>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-6">Processed on {new Date(run.startedAt).toLocaleDateString()}</p>
                <button className="w-full py-3 bg-slate-900 text-white text-xs font-black rounded-xl hover:bg-black transition-all uppercase tracking-widest shadow-lg shadow-slate-100">Download Logcat Trace</button>
             </div>
           ))}
        </div>
      )}
    </div>
  );
};

const SettingsView: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'project' | 'rl' | 'ga'>('project');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-500">
       <div className="lg:col-span-3 space-y-2">
          {[
            { id: 'project', label: 'Environment', icon: <Layers size={18}/> },
            { id: 'rl', label: 'RL Rewards', icon: <Zap size={18}/> },
            { id: 'ga', label: 'GA Evolve', icon: <TrendingUp size={18}/> },
          ].map(s => (
            <button 
              key={s.id}
              onClick={() => setActiveSection(s.id as any)}
              className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${activeSection === s.id ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'text-slate-500 hover:bg-white hover:shadow-sm'}`}
            >
              {s.icon} {s.label}
            </button>
          ))}
       </div>

       <div className="lg:col-span-9 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
          <div className="p-6 lg:p-8 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
             <div>
                <h3 className="font-black text-slate-800 uppercase text-xs tracking-[0.2em]">Research Configurator</h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase mt-1 tracking-wider">Tunable parameters for experimental consistency</p>
             </div>
             <button className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl text-[10px] font-black tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition uppercase">
                <Save size={14}/> Save Schema
             </button>
          </div>

          <div className="p-6 lg:p-8 flex-1">
             {activeSection === 'project' && (
               <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Target SDK Profile</label>
                        <select className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 transition">
                           <option>Android 14 (Tiramisu)</option>
                           <option>Android 13 (API 33)</option>
                        </select>
                     </div>
                     <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">AVD Virtual Instance</label>
                        <select className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 transition">
                           <option>Pixel 6 Pro (1440x3120)</option>
                           <option>Generic ARM64 (1080p)</option>
                        </select>
                     </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Research Abstract</label>
                    <textarea rows={5} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 transition" placeholder="Document testing objectives for trace headers..."></textarea>
                  </div>
               </div>
             )}

             {activeSection === 'rl' && (
               <div className="space-y-8">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                     {Object.entries(REWARD_CONFIG_DEFAULT).map(([key, val]) => (
                       <div key={key} className="bg-slate-50 p-6 rounded-2xl border border-slate-100 group hover:border-indigo-100 transition">
                          <label className="block text-[9px] font-black text-slate-400 uppercase mb-3 tracking-widest truncate">{key.replace(/([A-Z])/g, ' $1')}</label>
                          <input type="number" defaultValue={val} className="w-full bg-white border border-slate-200 rounded-xl p-3 text-lg font-black text-indigo-600 outline-none" />
                       </div>
                     ))}
                  </div>
               </div>
             )}

             {activeSection === 'ga' && (
               <div className="space-y-10">
                  <div className="space-y-4">
                     <div className="flex justify-between items-center px-1">
                        <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Population Entropy</span>
                        <span className="text-xs font-black text-indigo-600">85.4%</span>
                     </div>
                     <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 w-[85%] rounded-full"></div>
                     </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                     <div className="space-y-6">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b pb-2">Mutation Heuristic</h4>
                        <div className="space-y-3">
                           {['Uniform Distributed', 'Gaussian Noise', 'Bit-Flip Strategy'].map(m => (
                             <label key={m} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl cursor-pointer hover:bg-white hover:shadow-md transition duration-200 group">
                                <input type="radio" name="mutation" defaultChecked={m.includes('Gaussian')} className="w-4 h-4 accent-indigo-600" />
                                <span className="text-xs font-black text-slate-600 uppercase tracking-tight group-hover:text-indigo-600">{m}</span>
                             </label>
                           ))}
                        </div>
                     </div>
                     <div className="space-y-6">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b pb-2">Survivor Selection</h4>
                        <div className="space-y-3">
                           {['Elite Tournament', 'Stochastic Sampling', 'Rank-Based Bias'].map(s => (
                             <label key={s} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl cursor-pointer hover:bg-white hover:shadow-md transition duration-200 group">
                                <input type="radio" name="selection" defaultChecked={s.includes('Tournament')} className="w-4 h-4 accent-indigo-600" />
                                <span className="text-xs font-black text-slate-600 uppercase tracking-tight group-hover:text-indigo-600">{s}</span>
                             </label>
                           ))}
                        </div>
                     </div>
                  </div>
               </div>
             )}
          </div>
          
          <div className="p-8 bg-rose-50 border-t border-rose-100 flex flex-col sm:flex-row items-center justify-between gap-4">
             <div className="flex items-center gap-4 text-rose-700">
                <AlertCircle size={20}/>
                <p className="text-[10px] font-black uppercase tracking-widest">System Warning: This action purges all persistent trace logs.</p>
             </div>
             <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 bg-white border border-rose-200 text-rose-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all shadow-sm">
                <Trash2 size={14}/> Hard Reset Database
             </button>
          </div>
       </div>
    </div>
  );
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  if (!activeProject) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 lg:p-8">
        <div className="w-full max-w-6xl">
           <ProjectSelector onSelect={(p) => setActiveProject(p)} />
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard project={activeProject} />;
      case 'static': return <StaticAnalysisView project={activeProject} />;
      case 'dynamic': return <DynamicAnalysisView />;
      case 'rl': return <RLExplorationView project={activeProject} />;
      case 'monitor': return <RunMonitor />;
      case 'ga': return <GAPrioritizationView project={activeProject} />;
      case 'suites': return <TestSuiteView />;
      case 'settings': return <SettingsView />;
      case 'projects': return <ProjectSelector onSelect={(p) => setActiveProject(p)} />;
      default: return <div className="text-center p-20 opacity-30 text-4xl font-black italic">Coming Soon: {activeTab}</div>;
    }
  };

  return (
    <Layout 
      activeTab={activeTab} 
      onTabChange={setActiveTab} 
      projectName={activeProject?.name}
    >
      <div className="max-w-7xl mx-auto pb-12">
        {renderContent()}
      </div>
    </Layout>
  );
};

export default App;
