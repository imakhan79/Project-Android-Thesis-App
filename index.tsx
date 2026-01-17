
import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import { 
  Video, Mic, Monitor, Layers, Settings, Play, Square, 
  BookOpen, Info, CheckCircle, ChevronRight, Download,
  ExternalLink, Menu, X, Volume2, VolumeX, BarChart2,
  Cpu, Activity, Globe, Zap, Shield, ArrowRight, Github,
  Twitter, Youtube, AlertCircle, Terminal, HelpCircle
} from 'lucide-react';
import { Scene, Source, AcademyLesson, StreamSettings } from './types';

// --- SHARED UI COMPONENTS ---

const Button = ({ children, onClick, variant = 'primary', className = '', disabled = false }: any) => {
  const base = "px-6 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 text-sm uppercase tracking-widest";
  const variants: any = {
    primary: "bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-600/30",
    secondary: "bg-slate-800 hover:bg-slate-700 text-white border border-slate-700",
    outline: "border-2 border-slate-700 hover:border-indigo-500 text-slate-300 hover:text-white",
    ghost: "text-slate-400 hover:text-white hover:bg-white/5",
    danger: "bg-rose-600 hover:bg-rose-500 text-white shadow-xl shadow-rose-600/30",
    neon: "bg-indigo-500 text-white hover:scale-105 shadow-[0_0_20px_rgba(99,102,241,0.5)]"
  };
  return (
    <button disabled={disabled} onClick={onClick} className={`${base} ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}>
      {children}
    </button>
  );
};

// --- PART B: MARKETING WEBSITE ---

const MarketingWebsite = ({ onLaunchApp }: { onLaunchApp: () => void }) => {
  return (
    <div className="bg-[#020617] text-slate-200 overflow-x-hidden font-sans">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-slate-950/50 backdrop-blur-xl border-b border-white/5 px-6 lg:px-20 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-black text-xl text-white">S</div>
          <span className="font-black text-xl tracking-tighter">STREAMFORGE</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-bold uppercase tracking-widest text-slate-400">
          <a href="#features" className="hover:text-white transition">Features</a>
          <a href="#academy" className="hover:text-white transition">Academy</a>
          <a href="#pricing" className="hover:text-white transition">Pricing</a>
          <a href="#docs" className="hover:text-white transition">Docs</a>
        </div>
        <Button onClick={onLaunchApp} variant="neon" className="hidden md:flex h-10 px-6 py-0">Launch Studio</Button>
        <button className="md:hidden"><Menu size={24} /></button>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6 lg:px-20 min-h-screen flex flex-col items-center justify-center text-center">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px]" />

        <div className="relative z-10 max-w-4xl">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-1.5 mb-8">
            <Zap size={14} className="text-indigo-400" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">Version 1.0 is Live</span>
          </div>
          <h1 className="text-6xl lg:text-8xl font-black mb-8 leading-[0.9] tracking-tighter text-white">
            STREAM LIKE A PRO <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 italic">IN MINUTES.</span>
          </h1>
          <p className="text-lg lg:text-xl text-slate-400 mb-10 max-w-2xl mx-auto font-medium">
            The world's first all-in-one desktop streaming suite with an integrated learning engine. Capture, mix, and grow your audience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={onLaunchApp} className="h-14 px-10">Download StreamForge</Button>
            <Button variant="secondary" className="h-14 px-10">Watch Demo Reel</Button>
          </div>
        </div>

        {/* Dashboard Preview Overlay */}
        <div className="mt-24 relative max-w-5xl mx-auto rounded-3xl border border-white/10 bg-slate-900/50 p-4 shadow-2xl backdrop-blur-sm">
          <img 
            src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=1200" 
            alt="Studio Preview" 
            className="rounded-2xl opacity-60 grayscale hover:grayscale-0 transition-all duration-700"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center shadow-2xl shadow-indigo-600/50 cursor-pointer hover:scale-110 transition">
              <Play size={32} fill="white" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 px-6 lg:px-20 bg-slate-950/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black mb-4 text-white uppercase tracking-tighter">Everything you need to broadcast.</h2>
            <p className="text-slate-500 font-medium">Built for speed, stability, and education.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Globe, title: 'RTMP Streaming', desc: 'Direct broadcast to Twitch, YouTube, Kick, and custom servers with sub-second latency.' },
              { icon: Layers, title: 'Scene Engine', desc: 'Unlimited scenes with layer-based composition. Scalable, croppable, and performant.' },
              { icon: Volume2, title: 'Studio Mixer', desc: 'WebAudio powered mixing with noise suppression, gain staging, and live monitoring.' },
              { icon: Cpu, title: 'Hardware Encoding', desc: 'Optimized for NVENC, QuickSync, and AMF. Low CPU overhead, high visual fidelity.' },
              { icon: BookOpen, title: 'Forge Academy', desc: 'The only studio app that teaches you how it works while you build your broadcast.' },
              { icon: Terminal, title: 'Pipeline Explorer', desc: 'Real-time diagnostic view of your FFmpeg pipeline and encoding parameters.' },
            ].map((f, i) => (
              <div key={i} className="p-8 rounded-3xl border border-white/5 bg-slate-900/20 hover:bg-slate-900/40 transition-all group">
                <div className="w-14 h-14 bg-indigo-600/10 rounded-2xl flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  <f.icon size={28} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">{f.title}</h3>
                <p className="text-slate-500 leading-relaxed text-sm font-medium">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6 lg:px-20">
         <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {[
                 { plan: 'Free', price: '$0', perks: ['720p 30fps', 'RTMP Basic', 'Forge Academy Basic'] },
                 { plan: 'Pro', price: '$12', perks: ['4K 60fps', 'Multistreaming', 'Full Academy Access'], active: true },
                 { plan: 'Studio', price: '$49', perks: ['Enterprise Support', 'NDI Input/Output', 'Team Profiles'] },
               ].map((p, i) => (
                 <div key={i} className={`p-10 rounded-[2.5rem] border ${p.active ? 'border-indigo-500 bg-indigo-500/5 shadow-2xl shadow-indigo-500/10' : 'border-white/5 bg-slate-900/20'} flex flex-col items-center text-center`}>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-4">{p.plan}</span>
                    <h4 className="text-5xl font-black text-white mb-8">{p.price}<span className="text-lg opacity-30">/mo</span></h4>
                    <ul className="space-y-4 mb-10">
                       {p.perks.map((perk, j) => (
                         <li key={j} className="text-sm font-medium text-slate-400 flex items-center gap-2">
                           <CheckCircle size={14} className="text-emerald-500" /> {perk}
                         </li>
                       ))}
                    </ul>
                    <Button variant={p.active ? 'primary' : 'secondary'} className="w-full mt-auto">Get Started</Button>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 lg:px-20 border-t border-white/5 bg-slate-950">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
          <div className="max-w-xs">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-black text-white text-lg">S</div>
              <span className="font-black text-xl tracking-tighter text-white">STREAMFORGE</span>
            </div>
            <p className="text-slate-500 text-sm font-medium leading-relaxed">
              Empowering creators with tools that dont just work, but teach. Built by broadcasters, for broadcasters.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-12 text-sm">
             <div className="space-y-4">
                <p className="font-black text-[10px] uppercase tracking-widest text-slate-500">Product</p>
                <div className="flex flex-col gap-2 font-bold text-slate-400">
                  <a href="#" className="hover:text-white">Changelog</a>
                  <a href="#" className="hover:text-white">API Reference</a>
                  <a href="#" className="hover:text-white">Hardware Guide</a>
                </div>
             </div>
             <div className="space-y-4">
                <p className="font-black text-[10px] uppercase tracking-widest text-slate-500">Social</p>
                <div className="flex flex-col gap-2 font-bold text-slate-400">
                  <a href="#" className="hover:text-white flex items-center gap-2"><Twitter size={14}/> Twitter</a>
                  <a href="#" className="hover:text-white flex items-center gap-2"><Youtube size={14}/> YouTube</a>
                  <a href="#" className="hover:text-white flex items-center gap-2"><Github size={14}/> GitHub</a>
                </div>
             </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

// --- PART A: STUDIO APP (STUDIO VIEW) ---

const StudioApp = () => {
  const [activeScene, setActiveScene] = useState<Scene>({
    id: '1',
    name: 'Main Scene',
    sources: []
  });
  const [isRecording, setIsRecording] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [stats, setStats] = useState({ fps: 60, bitrate: 4500, cpu: 12 });
  const [view, setView] = useState<'studio' | 'academy' | 'settings'>('studio');
  const [onboardingStep, setOnboardingStep] = useState(1); // 1-6 = wizard, 0 = done
  const videoRef = useRef<HTMLVideoElement>(null);

  // Initialize camera
  const addCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      const newSource: Source = {
        id: Math.random().toString(),
        type: 'camera',
        name: 'Webcam C920',
        visible: true,
        muted: false,
        volume: 0.8,
        zIndex: 1,
        stream: stream
      };
      setActiveScene(prev => ({ ...prev, sources: [...prev.sources, newSource] }));
    } catch (err) {
      alert("Camera access denied or device missing.");
    }
  };

  const addScreen = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      const newSource: Source = {
        id: Math.random().toString(),
        type: 'screen',
        name: 'Display Capture',
        visible: true,
        muted: true,
        volume: 0,
        zIndex: 0,
        stream: stream
      };
      setActiveScene(prev => ({ ...prev, sources: [...prev.sources, newSource] }));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (activeScene.sources.length > 0 && videoRef.current) {
      const primary = activeScene.sources.find(s => s.visible && s.stream);
      if (primary && primary.stream) {
        videoRef.current.srcObject = primary.stream;
      }
    }
  }, [activeScene]);

  // Statistics Simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setStats({
        fps: 58 + Math.floor(Math.random() * 4),
        bitrate: isStreaming ? 4200 + Math.floor(Math.random() * 600) : 0,
        cpu: 8 + Math.floor(Math.random() * 15)
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [isStreaming]);

  // --- SUB-COMPONENT: WIZARD ---
  const Wizard = () => {
    const steps = [
      { title: 'Permissions', icon: Shield, desc: 'We need access to your camera and microphone to start.' },
      { title: 'Goal', icon: Zap, desc: 'Are you here to stream live or record local content?' },
      { title: 'First Scene', icon: Layers, desc: 'Let\'s create your base layout.' },
      { title: 'Audio Setup', icon: Mic, desc: 'Connect your microphone and check the input levels.' },
      { title: 'Account', icon: Globe, desc: 'Link your streaming account or use custom RTMP.' },
      { title: 'All Set!', icon: CheckCircle, desc: 'You\'re ready to broadcast to the world.' },
    ];
    const s = steps[onboardingStep - 1];
    return (
      <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-xl flex items-center justify-center p-6">
        <div className="bg-slate-900 border border-white/10 w-full max-w-xl rounded-3xl p-10 shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-slate-800">
            <div className="h-full bg-indigo-600 transition-all duration-500" style={{ width: `${(onboardingStep/6)*100}%` }} />
          </div>
          <div className="flex flex-col items-center text-center">
             <div className="w-16 h-16 bg-indigo-600/20 rounded-2xl flex items-center justify-center text-indigo-400 mb-8">
               <s.icon size={32} />
             </div>
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-2">Step {onboardingStep} of 6</span>
             <h3 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter">{s.title}</h3>
             <p className="text-slate-400 font-medium leading-relaxed mb-10">{s.desc}</p>
             
             {onboardingStep === 1 && (
               <Button onClick={addCamera} className="w-full">Grant Permissions</Button>
             )}
             
             <div className="flex gap-4 w-full mt-4">
                <Button variant="secondary" onClick={() => setOnboardingStep(Math.max(1, onboardingStep - 1))} className="flex-1">Back</Button>
                <Button onClick={() => onboardingStep === 6 ? setOnboardingStep(0) : setOnboardingStep(onboardingStep + 1)} className="flex-1">
                  {onboardingStep === 6 ? 'Start Studio' : 'Continue'}
                </Button>
             </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-[#020617] text-slate-200 overflow-hidden font-sans select-none">
      {onboardingStep > 0 && <Wizard />}

      {/* Sidebar Navigation */}
      <nav className="w-20 border-r border-white/5 flex flex-col items-center py-8 gap-10 shrink-0 bg-slate-950">
        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center font-black text-2xl text-white shadow-2xl shadow-indigo-600/30">
          S
        </div>
        <div className="flex flex-col gap-6">
          <button onClick={() => setView('studio')} className={`p-4 rounded-2xl transition-all ${view === 'studio' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-500 hover:text-white'}`}>
            <Monitor size={24} />
          </button>
          <button onClick={() => setView('academy')} className={`p-4 rounded-2xl transition-all ${view === 'academy' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-500 hover:text-white'}`}>
            <BookOpen size={24} />
          </button>
          <button onClick={() => setView('settings')} className={`p-4 rounded-2xl transition-all ${view === 'settings' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-500 hover:text-white'}`}>
            <Settings size={24} />
          </button>
        </div>
        <div className="mt-auto flex flex-col gap-4">
           <button className="text-slate-600 hover:text-white"><HelpCircle size={20} /></button>
           <button className="w-10 h-10 rounded-full bg-slate-800 border border-white/5 overflow-hidden">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" />
           </button>
        </div>
      </nav>

      {/* Workspace Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header Console */}
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-slate-950">
          <div className="flex items-center gap-6">
            <h2 className="font-black text-[10px] uppercase tracking-[0.4em] text-slate-500">Forge Engine v1.0.4</h2>
            <div className="flex gap-6 border-l border-white/5 pl-6 text-[10px] font-black uppercase tracking-widest text-slate-500">
              <span className="flex items-center gap-2"><Cpu size={14} className="text-indigo-400"/> {stats.cpu}% Usage</span>
              <span className="flex items-center gap-2"><Activity size={14} className="text-purple-400"/> {stats.fps} FPS</span>
              <span className={`flex items-center gap-2 ${isStreaming ? 'text-emerald-400' : ''}`}><Globe size={14}/> {isStreaming ? stats.bitrate : '---'} KBPS</span>
            </div>
          </div>
          <div className="flex gap-4">
            <Button 
              variant={isStreaming ? 'danger' : 'primary'} 
              className="h-10 text-[10px] px-6"
              onClick={() => setIsStreaming(!isStreaming)}
            >
              {isStreaming ? <X size={16}/> : <Globe size={16}/>}
              {isStreaming ? 'Stop Broadcast' : 'Start Stream'}
            </Button>
            <Button 
              variant={isRecording ? 'danger' : 'secondary'} 
              className="h-10 text-[10px] px-6"
              onClick={() => setIsRecording(!isRecording)}
            >
              {isRecording ? <Square size={16}/> : <Play size={16}/>}
              {isRecording ? 'Stop Recording' : 'Start Recording'}
            </Button>
          </div>
        </header>

        {view === 'studio' && (
          <div className="flex-1 flex p-6 gap-6 overflow-hidden">
            {/* Stage Col */}
            <div className="flex-1 flex flex-col gap-6">
              {/* Preview Window (Canvas Simulation) */}
              <div className="flex-1 bg-black rounded-3xl border border-white/10 relative overflow-hidden shadow-2xl group ring-1 ring-white/5">
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                
                {/* Visual Indicators */}
                <div className="absolute top-6 left-6 flex flex-col gap-2">
                   <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 flex items-center gap-3">
                      <div className={`w-2.5 h-2.5 rounded-full ${isStreaming ? 'bg-rose-500 animate-pulse' : 'bg-slate-600'}`} />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em]">{isStreaming ? 'Live' : 'Preview Mode'}</span>
                   </div>
                   {isRecording && (
                     <div className="bg-rose-500/20 backdrop-blur-md px-4 py-2 rounded-2xl border border-rose-500/40 flex items-center gap-3">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-400 animate-pulse">REC</span>
                        <span className="text-[10px] font-mono text-rose-400">00:04:12</span>
                     </div>
                   )}
                </div>

                {!activeScene.sources.length && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500">
                    <div className="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center border border-white/5 mb-6">
                      <Video size={32} className="opacity-20" />
                    </div>
                    <p className="font-bold text-sm uppercase tracking-widest text-slate-600">No active sources</p>
                    <button onClick={addCamera} className="mt-4 text-[10px] font-black text-indigo-400 hover:text-indigo-300 transition uppercase tracking-widest">+ Add Webcam</button>
                  </div>
                )}
              </div>

              {/* Console Col: Scenes & Mixer */}
              <div className="h-64 flex gap-6">
                {/* Scene Library */}
                <div className="w-64 bg-slate-900/40 backdrop-blur-md rounded-3xl border border-white/5 p-6 flex flex-col gap-6">
                  <div className="flex justify-between items-center">
                     <h3 className="text-[10px] font-black uppercase text-slate-500 tracking-[0.3em] flex items-center gap-2">
                       <Layers size={14} /> Scenes
                     </h3>
                     <button className="p-1 hover:bg-white/5 rounded"><Settings size={14}/></button>
                  </div>
                  <div className="flex-1 overflow-y-auto space-y-2">
                    <div className="px-5 py-4 bg-indigo-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest cursor-pointer shadow-xl shadow-indigo-600/20 flex items-center justify-between">
                      Main Gameplay
                      <ArrowRight size={14} />
                    </div>
                    <div className="px-5 py-4 bg-slate-800/50 hover:bg-slate-800 text-slate-500 rounded-2xl text-xs font-black uppercase tracking-widest cursor-pointer transition-all">
                      BRB / Interval
                    </div>
                    <div className="px-5 py-4 bg-slate-800/50 hover:bg-slate-800 text-slate-500 rounded-2xl text-xs font-black uppercase tracking-widest cursor-pointer transition-all">
                      Just Chatting
                    </div>
                  </div>
                </div>

                {/* Audio Subsystem */}
                <div className="flex-1 bg-slate-900/40 backdrop-blur-md rounded-3xl border border-white/5 p-6 flex flex-col gap-6">
                  <div className="flex justify-between items-center">
                     <h3 className="text-[10px] font-black uppercase text-slate-500 tracking-[0.3em] flex items-center gap-2">
                       <BarChart2 size={14} /> Master Mixer
                     </h3>
                     <div className="flex gap-4">
                        <button className="text-[10px] font-black uppercase text-indigo-400 hover:text-white">Noise Gates</button>
                        <button className="text-[10px] font-black uppercase text-slate-500 hover:text-white">Filters</button>
                     </div>
                  </div>
                  <div className="flex-1 flex gap-10 overflow-x-auto p-2 scrollbar-hide">
                    {[
                      { name: 'Mic Input', value: 75, color: 'indigo' },
                      { name: 'System Audio', value: 40, color: 'purple' },
                      { name: 'Game Feed', value: 60, color: 'emerald' },
                      { name: 'Music (Spotify)', value: 20, color: 'blue' },
                    ].map(mix => (
                      <div key={mix.name} className="flex flex-col items-center gap-4">
                        <div className="h-full w-4 bg-slate-950 rounded-full relative overflow-hidden group">
                          <div className={`absolute bottom-0 w-full bg-${mix.color}-500 shadow-[0_0_10px_rgba(var(--color-rgb),0.5)]`} style={{ height: `${mix.value}%` }} />
                          <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" />
                        </div>
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">{mix.name}</span>
                        <button className="p-1 hover:bg-white/5 rounded-full"><Volume2 size={12} className="text-slate-500" /></button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar Assets */}
            <div className="w-80 flex flex-col gap-6">
              {/* Asset Rack */}
              <div className="flex-1 bg-slate-900/40 backdrop-blur-md rounded-3xl border border-white/5 p-6 flex flex-col gap-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-[10px] font-black uppercase text-slate-500 tracking-[0.3em] flex items-center gap-2">
                    <Video size={14} /> Sources
                  </h3>
                  <div className="flex gap-1">
                    <button onClick={addCamera} className="p-2 hover:bg-white/5 rounded-xl text-indigo-400 transition"><Video size={18}/></button>
                    <button onClick={addScreen} className="p-2 hover:bg-white/5 rounded-xl text-emerald-400 transition"><Monitor size={18}/></button>
                  </div>
                </div>
                
                <div className="flex-1 overflow-y-auto space-y-3">
                  {activeScene.sources.map(s => (
                    <div key={s.id} className="bg-slate-950 border border-white/5 p-4 rounded-2xl flex items-center justify-between group hover:border-indigo-500/50 transition-all">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.type === 'camera' ? 'bg-indigo-600/10 text-indigo-400' : 'bg-emerald-600/10 text-emerald-400'}`}>
                           {s.type === 'camera' ? <Video size={18} /> : <Monitor size={18} />}
                        </div>
                        <div>
                           <span className="text-xs font-black uppercase tracking-tight block">{s.name}</span>
                           <span className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">{s.type === 'camera' ? '1080p 60fps' : 'Direct Capture'}</span>
                        </div>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 hover:bg-white/5 rounded-lg transition"><Settings size={14}/></button>
                        <button className="p-2 hover:bg-white/5 rounded-lg text-rose-500 transition"><X size={14}/></button>
                      </div>
                    </div>
                  ))}
                  {!activeScene.sources.length && (
                    <div className="h-64 flex flex-col items-center justify-center gap-4 opacity-10">
                       <Zap size={64} />
                       <p className="text-[10px] font-black uppercase tracking-widest">Stack Empty</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Troubleshooting Coach */}
              <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-3xl p-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 text-indigo-400/20 group-hover:text-indigo-400/40 transition">
                   <Zap size={48} />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-4">
                    <Shield size={16} className="text-indigo-400" />
                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Stream Coach AI</span>
                  </div>
                  <p className="text-xs leading-relaxed text-indigo-300 font-medium mb-6">
                    "Observation: Your current scene has 3 overlapping layers. Consider disabling preview rendering to reduce CPU overhead by 4%."
                  </p>
                  <button onClick={() => setView('academy')} className="text-[10px] font-black uppercase tracking-widest text-indigo-400 hover:text-white transition flex items-center gap-2">
                    Open Academy <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {view === 'academy' && (
          <div className="flex-1 p-12 overflow-y-auto">
            <div className="max-w-5xl mx-auto">
              <div className="mb-16">
                <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em] mb-4 block">Integrated Education</span>
                <h2 className="text-5xl font-black mb-4 text-white uppercase tracking-tighter">Forge Academy</h2>
                <p className="text-slate-500 font-medium text-lg max-w-2xl">Master the technical architecture of broadcasting. Interactive lessons designed for modern creators.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                  { id: 'rtmp', title: 'The RTMP Pipeline', icon: Globe, desc: 'Capture → Encode → Stream. Visualize the data flow of a live broadcast.', completed: true },
                  { id: 'bitrate', title: 'Bitrate Mastery', icon: Zap, desc: 'Balance visual fidelity against upload bandwidth like a network engineer.', completed: false },
                  { id: 'audio', title: 'Gain Staging', icon: Volume2, desc: 'Eliminate clipping and static. Professional level mixing secrets.', completed: false },
                  { id: 'ffmpeg', title: 'Pipeline Explorer', icon: Terminal, desc: 'Understanding FFmpeg flags. Choosing the right encoder for your GPU.', completed: false },
                ].map((item, i) => (
                  <div key={i} className="bg-slate-900/40 border border-white/5 p-8 rounded-[2rem] hover:border-indigo-500/50 transition-all cursor-pointer group flex flex-col">
                    <div className="flex justify-between items-start mb-8">
                      <div className="w-16 h-16 bg-indigo-600/10 rounded-2xl flex items-center justify-center text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                        <item.icon size={32} />
                      </div>
                      {item.completed ? (
                         <div className="bg-emerald-500/20 text-emerald-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">Complete</div>
                      ) : (
                         <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">8 MIN READ</span>
                      )}
                    </div>
                    <h3 className="text-2xl font-black text-white mb-3 uppercase tracking-tighter group-hover:text-indigo-400 transition">{item.title}</h3>
                    <p className="text-slate-500 leading-relaxed text-sm font-medium mb-8">{item.desc}</p>
                    <button className="mt-auto flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-500 hover:text-white transition">
                       Start Lesson <ChevronRight size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {view === 'settings' && (
          <div className="flex-1 p-12 overflow-y-auto">
             <div className="max-w-4xl mx-auto bg-slate-900/20 border border-white/5 rounded-[2.5rem] p-12">
                <h2 className="text-3xl font-black text-white mb-10 uppercase tracking-tighter">System Configuration</h2>
                <div className="space-y-12">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="space-y-4">
                         <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Base Resolution</label>
                         <select className="w-full bg-slate-950 border border-white/10 rounded-2xl p-4 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-indigo-600 transition">
                            <option>1920x1080 (1080p)</option>
                            <option>1280x720 (720p)</option>
                            <option>3840x2160 (4K Pro)</option>
                         </select>
                      </div>
                      <div className="space-y-4">
                         <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Target Framerate</label>
                         <select className="w-full bg-slate-950 border border-white/10 rounded-2xl p-4 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-indigo-600 transition">
                            <option>60 FPS (Gaming)</option>
                            <option>30 FPS (Creative)</option>
                            <option>120 FPS (Competitive)</option>
                         </select>
                      </div>
                   </div>
                   <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">RTMP Server Endpoint</label>
                      <input type="text" placeholder="rtmp://stream.twitch.tv/app" className="w-full bg-slate-950 border border-white/10 rounded-2xl p-4 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-indigo-600 transition" />
                   </div>
                   <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Stream Key</label>
                      <div className="relative">
                        <input type="password" value="live_secret_key_********" className="w-full bg-slate-950 border border-white/10 rounded-2xl p-4 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-indigo-600 transition" />
                        <button className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black uppercase text-indigo-400 hover:text-white">Show Key</button>
                      </div>
                   </div>
                   <div className="pt-8 flex justify-end gap-4">
                      <Button variant="secondary">Reset Defaults</Button>
                      <Button onClick={() => setView('studio')}>Save Configuration</Button>
                   </div>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

// --- APP ENTRY POINT ---

const Main = () => {
  const [mode, setMode] = useState<'marketing' | 'studio'>('marketing');

  return (
    <>
      {mode === 'marketing' ? (
        <MarketingWebsite onLaunchApp={() => setMode('studio')} />
      ) : (
        <StudioApp />
      )}
    </>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<Main />);
