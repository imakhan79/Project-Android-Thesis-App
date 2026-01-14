
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { ProjectSelector } from './components/ProjectSelector';
import { StaticAnalysisView } from './components/StaticAnalysisView';
import { RLExplorationView } from './components/RLExplorationView';
import { GAPrioritizationView } from './components/GAPrioritizationView';
import { Project } from './types';
import { db } from './services/mockDb';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell 
} from 'recharts';
// Fixed: Added missing icons Zap, TrendingUp, and Activity to the import list
import { Shield, Target, AlertCircle, Clock, CheckCircle, Package, Zap, TrendingUp, Activity } from 'lucide-react';

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const Dashboard: React.FC<{ project: Project }> = ({ project }) => {
  const components = db.getComponents(project.id);
  const runs = db.getRuns(project.id);
  
  const stats = [
    { label: 'Static Risk Score', value: (components.reduce((a, b) => a + b.riskScore, 0) / (components.length || 1)).toFixed(1), icon: <Shield className="text-indigo-500" />, color: 'bg-indigo-50' },
    { label: 'States Discovered', value: '142', icon: <Target className="text-emerald-500" />, color: 'bg-emerald-50' },
    { label: 'Crashes Detected', value: '3', icon: <AlertCircle className="text-rose-500" />, color: 'bg-rose-50' },
    { label: 'Avg Execution', value: '18.4s', icon: <Clock className="text-amber-500" />, color: 'bg-amber-50' },
  ];

  const coverageData = [
    { name: 'Activities', coverage: 85, target: 100 },
    { name: 'Transitions', coverage: 62, target: 100 },
    { name: 'Gestures', coverage: 45, target: 100 },
    { name: 'Modals', coverage: 78, target: 100 },
  ];

  const riskData = [
    { name: 'Gesture', value: components.filter(c => c.typeCategory === 'Gesture-sensitive').length },
    { name: 'Runtime', value: components.filter(c => c.typeCategory === 'Runtime-loaded').length },
    { name: 'Modal', value: components.filter(c => c.typeCategory === 'Modal/Interruptive').length },
    { name: 'Context', value: components.filter(c => c.typeCategory === 'Context-aware').length },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${s.color}`}>{s.icon}</div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{s.label}</p>
              <p className="text-2xl font-black text-slate-800">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold mb-6 text-slate-800">Testing Coverage Analysis</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={coverageData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none'}} />
                <Bar dataKey="coverage" fill="#4f46e5" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold mb-6 text-slate-800">Risk Distribution by Category</h3>
          <div className="h-64 flex items-center">
             <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {riskData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
             </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
           <h3 className="text-lg font-bold text-slate-800">Recent Runs</h3>
           <button className="text-sm font-bold text-indigo-600 hover:text-indigo-800">View All Runs</button>
        </div>
        <div className="divide-y divide-slate-100">
           {runs.slice(-5).reverse().map(run => (
             <div key={run.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition">
                <div className="flex items-center gap-4">
                   <div className={`p-2 rounded-lg ${run.runType === 'rl' ? 'bg-indigo-50 text-indigo-600' : run.runType === 'ga' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-600'}`}>
                      {run.runType === 'rl' ? <Zap size={20}/> : run.runType === 'ga' ? <TrendingUp size={20}/> : <Activity size={20}/>}
                   </div>
                   <div>
                      <div className="font-bold text-slate-800 uppercase text-xs tracking-wider">Run: {run.runType} Optimization</div>
                      <div className="text-sm text-slate-500">Started {new Date(run.startedAt).toLocaleTimeString()}</div>
                   </div>
                </div>
                <div className="flex items-center gap-4">
                   <div className={`text-xs font-bold px-3 py-1 rounded-full ${run.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-indigo-100 text-indigo-700'}`}>
                      {run.status.toUpperCase()}
                   </div>
                </div>
             </div>
           ))}
           {runs.length === 0 && <div className="p-12 text-center text-slate-400">No recent runs recorded.</div>}
        </div>
      </div>
    </div>
  );
};

const DynamicAnalysisView: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm text-center">
         <Activity size={48} className="text-indigo-600 mx-auto mb-4" />
         <h2 className="text-xl font-bold mb-2">GUI State-Transition Graph</h2>
         <p className="text-slate-500 max-w-md mx-auto mb-6">
            Visualizing the dynamic exploration flow. This map shows how states (screens) are connected through user actions.
         </p>
         
         <div className="relative h-[400px] bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center">
            <div className="grid grid-cols-4 gap-12">
               {[1,2,3,4].map(i => (
                 <div key={i} className="flex flex-col items-center gap-2">
                    <div className="w-16 h-24 bg-white border-2 border-indigo-400 rounded shadow-sm flex items-center justify-center text-[10px] text-slate-400 font-bold p-2 text-center">Screen {i}</div>
                    <div className="w-1 h-12 bg-indigo-200"></div>
                 </div>
               ))}
            </div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
               <span className="bg-white px-4 py-2 rounded-full border border-slate-200 text-xs font-bold text-slate-400 shadow-sm uppercase tracking-widest">Live Exploration Map (Preview)</span>
            </div>
         </div>
      </div>
    </div>
  );
};

const TestSuiteView: React.FC = () => {
  return (
    <div className="space-y-6">
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
             <div>
                <Package className="text-indigo-600 mb-4" size={32} />
                <h3 className="text-xl font-bold mb-2">Export for Espresso</h3>
                <p className="text-sm text-slate-500 mb-6">Generated a ready-to-use JUnit test suite based on the top-ranked prioritized sequences.</p>
             </div>
             <button className="bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition">Download .java Suite</button>
          </div>
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
             <div>
                <CheckCircle className="text-emerald-600 mb-4" size={32} />
                <h3 className="text-xl font-bold mb-2">Full JSON Trace</h3>
                <p className="text-sm text-slate-500 mb-6">Raw execution data including screenshot hashes, rewards, and action metadata for research papers.</p>
             </div>
             <button className="bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-black transition">Download Trace Logs</button>
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
      case 'ga': return <GAPrioritizationView project={activeProject} />;
      case 'suites': return <TestSuiteView />;
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
      {renderContent()}
    </Layout>
  );
};

export default App;
