
import React, { useState, useEffect, useRef } from 'react';
import { AppView } from './types';
import Sidebar from './components/Sidebar';
import ChatInterface from './components/ChatInterface';
import CodeWorkspace from './components/CodeWorkspace';
import VideoGenerator from './components/VideoGenerator';
import LiveSession from './components/LiveSession';
import Login from './components/Login';
import VisualEngine from './components/VisualEngine';
import KnowledgeBase from './components/KnowledgeBase';

const Dashboard: React.FC = () => (
  <div className="p-12 h-full overflow-y-auto">
    <div className="max-w-6xl mx-auto space-y-16">
      {/* Hero Section */}
      <section className="relative py-12">
        <div className="max-w-3xl">
          <span className="inline-block px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-6">
            Intelligent Workspace 3.0
          </span>
          <h2 className="text-6xl font-black text-white leading-tight tracking-tighter mb-6">
            Design. Code. <span className="bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">Accelerate.</span>
          </h2>
          <p className="text-xl text-slate-400 font-medium leading-relaxed max-w-2xl">
            OmniMind is your premium AI-powered engine for high-end software engineering, cinematic content, and infinite knowledge.
          </p>
        </div>
      </section>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { icon: 'M13 10V3L4 14h7v7l9-11h-7z', title: 'AI Dialogue', desc: 'Real-time grounded search with visual explanation.', color: 'blue' },
          { icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4', title: 'Engineer Lab', desc: 'Clean, optimized professional level coding.', color: 'indigo' },
          { icon: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z', title: 'Video Forge', desc: 'Transform prompts into 1080p cinematic video.', color: 'purple' }
        ].map((feat, i) => (
          <div key={i} className="group p-8 glass rounded-[2.5rem] border border-white/5 hover:border-white/10 transition-all duration-500 cursor-pointer shadow-2xl relative overflow-hidden">
            <div className={`w-14 h-14 bg-${feat.color}-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
              <svg className={`w-7 h-7 text-${feat.color}-500`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feat.icon} /></svg>
            </div>
            <h3 className="text-2xl font-extrabold text-white mb-3 group-hover:text-blue-400 transition-colors">{feat.title}</h3>
            <p className="text-slate-400 leading-relaxed font-medium">{feat.desc}</p>
            <div className="mt-8 flex items-center text-xs font-bold uppercase tracking-widest text-white/40 group-hover:text-white transition-colors">
              Explore Module <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </div>
          </div>
        ))}
      </div>

      {/* Large Blocks */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 glass p-10 rounded-[2.5rem] border border-white/5 shadow-2xl group">
          <div className="flex justify-between items-start mb-10">
            <div>
              <h4 className="text-3xl font-black text-white mb-3">Knowledge Stream</h4>
              <p className="text-slate-400 font-medium">Record sessions, summarize 2000+ page books, and auto-generate intelligent notes.</p>
            </div>
            <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center float-animation">
               <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div className="p-6 bg-white/5 rounded-3xl border border-white/5 group-hover:bg-blue-600/10 transition-colors">
                <div className="text-xs font-bold text-blue-400 mb-2 uppercase tracking-tighter">Class Recording</div>
                <p className="text-sm text-slate-300 font-medium">Architecture Review v1.2</p>
                <p className="text-[10px] text-slate-500 mt-1">45m recorded • 12 insights</p>
             </div>
             <div className="p-6 bg-white/5 rounded-3xl border border-white/5 group-hover:bg-indigo-600/10 transition-colors">
                <div className="text-xs font-bold text-indigo-400 mb-2 uppercase tracking-tighter">Document Summary</div>
                <p className="text-sm text-slate-300 font-medium">Global Economic Forecast 2025</p>
                <p className="text-[10px] text-slate-500 mt-1">1,240 pages • Key points extracted</p>
             </div>
          </div>
        </div>

        <div className="lg:col-span-2 glass p-10 rounded-[2.5rem] border border-blue-500/10 shadow-2xl bg-gradient-to-br from-blue-600/10 to-transparent flex flex-col justify-between">
          <div>
            <h4 className="text-3xl font-black text-white mb-3">Live Tutoring</h4>
            <p className="text-slate-400 font-medium leading-relaxed">Personalized 1-on-1 tutoring sessions with real-time feedback and insufficiency tracking.</p>
          </div>
          <button className="mt-12 w-full py-5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all shadow-xl shadow-blue-600/20 active:scale-[0.98]">
            Start Tutoring Session
          </button>
        </div>
      </div>
    </div>
  </div>
);

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>('dashboard');
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!bgRef.current) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 20; // Subtle shift
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      bgRef.current.style.transform = `translate(${x}px, ${y}px) scale(1.1)`;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleLogin = (userData: { name: string; email: string }) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('dashboard');
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard />;
      case 'chat': return <ChatInterface />;
      case 'code': return <CodeWorkspace />;
      case 'video': return <VideoGenerator />;
      case 'live': return <LiveSession />;
      case 'images': return <VisualEngine />;
      case 'files': return <KnowledgeBase />;
      default: return (
        <div className="flex items-center justify-center h-full">
            <div className="text-center glass p-12 rounded-[3rem] border border-white/5">
                <div className="w-20 h-20 bg-blue-600/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-blue-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                </div>
                <h1 className="text-3xl font-black text-white mb-2">Module Offline</h1>
                <p className="text-slate-500 font-medium">The {currentView} module is currently being optimized.</p>
            </div>
        </div>
      );
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-slate-200">
      <div ref={bgRef} className="movable-bg"></div>
      
      {!user ? (
        <Login onLogin={handleLogin} />
      ) : (
        <>
          <Sidebar currentView={currentView} onViewChange={setCurrentView} user={user} onLogout={handleLogout} />
          
          <main className="flex-1 overflow-hidden relative z-10 animate-in fade-in duration-500">
            <div className="h-full w-full overflow-hidden transition-all duration-500 ease-in-out">
                {renderView()}
            </div>
          </main>
        </>
      )}
    </div>
  );
};

export default App;
