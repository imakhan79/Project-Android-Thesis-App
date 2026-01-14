
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
  PieChart, Pie, Cell, ComposedChart, Area, Line, ScatterChart, Scatter, ZAxis
} from 'recharts';
import { 
  Shield, Target, AlertCircle, Clock, CheckCircle, Package, Zap, 
  TrendingUp, Activity, Monitor, ChevronRight, FileCode, Sliders, Database,
  Settings as SettingsIcon, Layers, Info, Trash2, Save
} from 'lucide-react';

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const Dashboard: React.FC<{ project: Project }> = ({ project }) => {
  const components = db.getComponents(project.id);
  const runs = db.getRuns(project.id);
  const [activeTab, setActiveTab] = useState('overview');
  
  const stats = [
    { label: 'Avg Risk Score', value: (components.reduce((a, b) => a + b.riskScore, 0) / (components.length || 1)).toFixed(1), icon: <Shield size={18} className="text-indigo-500" />, color: 'bg-indigo-50' },
    { label: 'States Explored', value: '142', icon: <Target size={18} className="text-emerald-500" />, color: 'bg-emerald-50' },
    { label: 'Faults (APFD)', value: '0.84', icon: <AlertCircle size={18} className="text-rose-500" />, color: 'bg-rose-50' },
    { label: 'Total Test Steps', value: '856', icon: <Activity size={18} className="text-amber-500" />, color: 'bg-amber-50' },
  ];

  return (
    <div className="space-y-8">
      {/* Methodology Stepper */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">Research Methodology Pipeline</h3>
        <div className="flex items-center justify-between relative">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 z-0"></div>
          {[
            { stage: 'Stage 1', label: 'Analysis', icon: <Shield size={16}/>, color: 'bg-indigo-600', active: true },
            { stage: 'Stage 2', label: 'Exploration', icon: <Zap size={16}/>, color: 'bg-indigo-600', active: true },
            { stage: 'Stage 3', label: 'Hybrid RL', icon: <Database size={16}/>, color: 'bg-indigo-600', active: true },
            { stage: 'Stage 4', label: 'GA Prioritization', icon: <TrendingUp size={16}/>, color: 'bg-slate-200', active: false },
          ].map((s, i) => (
            <div key={i} className="relative z-10 flex flex-col items-center gap-2 group">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-110 ${s.active ? s.color : 'bg-slate-200 text-slate-400'}`}>
                {s.icon}
              </div>
              <div className="text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase">{s.stage}</p>
                <p className={`text-xs font-bold ${s.active ? 'text-slate-800' : 'text-slate-400'}`}>{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-4 border-b border-slate-200">
        {['overview', 'evaluation', 'artifacts'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-bold capitalize transition-colors border-b-2 ${activeTab === tab ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="animate-in fade-in duration-500 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 transition hover:shadow-md">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${s.color}`}>{s.icon}</div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
                  <p className="text-2xl font-black text-slate-800">{s.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold mb-6 text-slate-800">Research Baseline: Coverage Comparison</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={BASELINE_DATA}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="metric" axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                    <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none'}} />
                    <Legend iconType="circle" />
                    <Bar dataKey="hybridRL" name="Hybrid Agent (Our)" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="monkey" name="Monkey" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="droidbot" name="DroidBot" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold mb-6 text-slate-800">Fault Likelihood Correlation</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis type="number" dataKey="depth" name="Episode Depth" unit=" steps" fontSize={10} axisLine={false} tickLine={false} />
                      <YAxis type="number" dataKey="fault" name="Fault Likelihood" unit="%" fontSize={10} axisLine={false} tickLine={false} />
                      <ZAxis type="number" range={[50, 400]} />
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
              <p className="text-[10px] text-slate-400 mt-2 text-center">Correlating RL exploration depth with detected fault probability.</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'evaluation' && (
        <div className="animate-in slide-in-from-bottom-4 duration-500 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
           <h3 className="text-lg font-bold mb-4">Thesis Evaluation Metrics (APFD)</h3>
           <p className="text-sm text-slate-500 mb-8 max-w-2xl">
              Average Percentage of Faults Detected (APFD) measures the effectiveness of test prioritization. 
              The chart below shows the fault detection rate of the Hybrid RL approach over time compared to random execution.
           </p>
           <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                 <ComposedChart data={[
                   {time: 0, ours: 0, baseline: 0},
                   {time: 20, ours: 45, baseline: 10},
                   {time: 40, ours: 72, baseline: 25},
                   {time: 60, ours: 88, baseline: 40},
                   {time: 80, ours: 95, baseline: 55},
                   {time: 100, ours: 100, baseline: 70},
                 ]}>
                   <XAxis dataKey="time" label={{ value: '% of Test Suite Executed', position: 'insideBottom', offset: -5 }} />
                   <YAxis label={{ value: '% Faults Detected', angle: -90, position: 'insideLeft' }} />
                   <Tooltip />
                   <Legend />
                   <Area type="monotone" dataKey="ours" name="Hybrid RL + GA" fill="#4f46e520" stroke="#4f46e5" strokeWidth={4} />
                   <Line type="monotone" dataKey="baseline" name="Random Prioritization" stroke="#94a3b8" strokeDasharray="5 5" />
                 </ComposedChart>
              </ResponsiveContainer>
           </div>
        </div>
      )}

      {activeTab === 'artifacts' && (
        <div className="animate-in fade-in duration-500 grid grid-cols-1 md:grid-cols-3 gap-6">
           {runs.map(run => (
             <div key={run.id} className="bg-white border border-slate-200 p-5 rounded-xl hover:border-indigo-400 transition cursor-pointer">
                <div className="flex justify-between items-start mb-4">
                   <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><Database size={20}/></div>
                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">ID: {run.id.substr(0,8)}</span>
                </div>
                <h4 className="font-bold text-slate-800 mb-1 capitalize">{run.runType} Result Artifact</h4>
                <p className="text-xs text-slate-500 mb-4">Completed on {new Date(run.startedAt).toLocaleDateString()}</p>
                <button className="w-full py-2 bg-slate-50 text-slate-600 text-xs font-bold rounded-lg border border-slate-100 hover:bg-slate-100 transition">Download Trace</button>
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
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
       {/* Sidebar Settings Nav */}
       <div className="lg:col-span-1 space-y-2">
          {[
            { id: 'project', label: 'General Project', icon: <Layers size={18}/> },
            { id: 'rl', label: 'Hybrid RL Agent', icon: <Zap size={18}/> },
            { id: 'ga', label: 'GA Prioritization', icon: <TrendingUp size={18}/> },
          ].map(s => (
            <button 
              key={s.id}
              onClick={() => setActiveSection(s.id as any)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeSection === s.id ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-100'}`}
            >
              {s.icon} {s.label}
            </button>
          ))}
       </div>

       {/* Main Settings Form */}
       <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
          <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
             <div>
                <h3 className="font-black text-slate-800 uppercase text-xs tracking-widest">Research Configuration</h3>
                <p className="text-xs text-slate-500">Fine-tune the testing engine for reproducibility.</p>
             </div>
             <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-xs font-black shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition">
                <Save size={14}/> SAVE CHANGES
             </button>
          </div>

          <div className="p-8 flex-1">
             {activeSection === 'project' && (
               <div className="animate-in fade-in slide-in-from-top-2 duration-300 space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                     <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Android SDK Target</label>
                        <select className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                           <option>Android 14 (API 34)</option>
                           <option>Android 13 (API 33)</option>
                        </select>
                     </div>
                     <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Device Profile</label>
                        <select className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                           <option>Pixel 6 Pro (1440x3120)</option>
                           <option>Generic ARM64 (1080x1920)</option>
                        </select>
                     </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Project Metadata</label>
                    <textarea rows={4} className="w-full border border-slate-200 rounded-lg p-3 text-sm outline-none" placeholder="Research goals, constraints, and app context..."></textarea>
                  </div>
               </div>
             )}

             {activeSection === 'rl' && (
               <div className="animate-in fade-in slide-in-from-top-2 duration-300 space-y-8">
                  <div className="grid grid-cols-3 gap-4">
                     {Object.entries(REWARD_CONFIG_DEFAULT).map(([key, val]) => (
                       <div key={key} className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                          <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 truncate">{key.replace(/([A-Z])/g, ' $1')}</label>
                          <input type="number" defaultValue={val} className="w-full bg-white border border-slate-200 rounded-lg p-2 text-sm font-black text-indigo-600" />
                       </div>
                     ))}
                  </div>
                  <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                     <h4 className="text-xs font-black text-indigo-700 mb-2 flex items-center gap-2"><Info size={14}/> Actor-Critic Network Settings</h4>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="text-[10px] text-slate-500">Learning Rate: <span className="font-mono text-indigo-600">3e-4</span></div>
                        <div className="text-[10px] text-slate-500">Discount Factor: <span className="font-mono text-indigo-600">0.99</span></div>
                     </div>
                  </div>
               </div>
             )}

             {activeSection === 'ga' && (
               <div className="animate-in fade-in slide-in-from-top-2 duration-300 space-y-6">
                  <div className="space-y-4">
                     <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-slate-700">Population Diversity</span>
                        <span className="text-xs font-black text-indigo-600">85%</span>
                     </div>
                     <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 w-[85%]"></div>
                     </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                     <div className="space-y-4">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase">Mutation Strategy</h4>
                        <div className="space-y-2">
                           {['Uniform', 'Gaussian', 'Custom'].map(m => (
                             <label key={m} className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg cursor-pointer hover:bg-indigo-50 transition">
                                <input type="radio" name="mutation" defaultChecked={m === 'Gaussian'} className="accent-indigo-600" />
                                <span className="text-xs font-bold text-slate-600">{m}</span>
                             </label>
                           ))}
                        </div>
                     </div>
                     <div className="space-y-4">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase">Selection Method</h4>
                        <div className="space-y-2">
                           {['Tournament', 'Roulette Wheel', 'Elitism'].map(s => (
                             <label key={s} className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg cursor-pointer hover:bg-indigo-50 transition">
                                <input type="radio" name="selection" defaultChecked={s === 'Tournament'} className="accent-indigo-600" />
                                <span className="text-xs font-bold text-slate-600">{s}</span>
                             </label>
                           ))}
                        </div>
                     </div>
                  </div>
               </div>
             )}
          </div>
          
          <div className="p-6 bg-rose-50 border-t border-rose-100 flex items-center justify-between">
             <div className="flex items-center gap-3 text-rose-700">
                <AlertCircle size={18}/>
                <p className="text-xs font-bold">Dangerous Action: Wipe all project run data.</p>
             </div>
             <button className="flex items-center gap-2 px-4 py-2 border border-rose-200 text-rose-600 rounded-lg text-xs font-black hover:bg-rose-100 transition">
                <Trash2 size={14}/> WIPE PROJECT
             </button>
          </div>
       </div>
    </div>
  );
};

const TestSuiteView: React.FC = () => {
  const [scriptPreview, setScriptPreview] = useState(`@Test
public void testEpisode_A9F2() {
    onView(withId(R.id.btn_profile)).perform(click());
    onView(withId(R.id.settings_drawer)).perform(swipeLeft());
    pressBack();
    onView(withId(R.id.item_card_01)).check(matches(isDisplayed()));
}`);

  return (
    <div className="space-y-6">
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between group hover:border-indigo-200 transition">
             <div>
                <FileCode className="text-indigo-600 mb-4 group-hover:scale-110 transition duration-300" size={32} />
                <h3 className="text-xl font-bold mb-2">Espresso / UI Automator</h3>
                <p className="text-sm text-slate-500 mb-6">Generated Espresso JUnit 4 tests with state verification listeners.</p>
                
                <div className="bg-slate-900 rounded-xl p-4 mb-6">
                   <pre className="text-[10px] text-indigo-300 font-mono leading-relaxed overflow-x-auto">
                      {scriptPreview}
                   </pre>
                </div>
             </div>
             <button className="bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition flex items-center justify-center gap-2">
                <Package size={18}/> Download .java Suite
             </button>
          </div>
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between group hover:border-emerald-200 transition">
             <div>
                <CheckCircle className="text-emerald-600 mb-4 group-hover:scale-110 transition duration-300" size={32} />
                <h3 className="text-xl font-bold mb-2">Metrics Dataset (CSV/JSON)</h3>
                <p className="text-sm text-slate-500 mb-6">Complete tabular data for all episodes, suitable for research plotting in Excel or Python.</p>
                <div className="space-y-2 mb-6">
                   {['coverage_report.csv', 'fault_matrix.json', 'reward_history.log'].map(f => (
                     <div key={f} className="flex items-center justify-between p-2 bg-slate-50 rounded border border-slate-100 text-[10px] font-bold text-slate-600">
                        <span>{f}</span>
                        <span className="text-slate-400">124 KB</span>
                     </div>
                   ))}
                </div>
             </div>
             <button className="bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-black transition flex items-center justify-center gap-2">
                <Database size={18}/> Download Dataset
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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
        <ProjectSelector onSelect={(p) => setActiveProject(p)} />
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
      <div className="max-w-6xl mx-auto px-4 py-8">
        {renderContent()}
      </div>
    </Layout>
  );
};

export default App;
