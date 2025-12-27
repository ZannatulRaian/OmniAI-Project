
import React, { useState } from 'react';
import { sendMessage } from '../services/gemini';

const languages = [
  { id: 'typescript', name: 'TypeScript', icon: 'TS' },
  { id: 'python', name: 'Python', icon: 'PY' },
  { id: 'javascript', name: 'JavaScript', icon: 'JS' },
  { id: 'rust', name: 'Rust', icon: 'RS' },
  { id: 'go', name: 'Go', icon: 'GO' },
];

const CodeWorkspace: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [selectedLang, setSelectedLang] = useState(languages[0]);
  const [code, setCode] = useState('// Architect your future here...');
  const [isGenerating, setIsGenerating] = useState(false);
  const [optimizationLog, setOptimizationLog] = useState<string[]>([]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    try {
      const fullPrompt = `Task: ${prompt}. Language: ${selectedLang.name}. Professional Level. Requirements: Optimized, efficient, and short code. Provide ONLY the raw code.`;
      const response = await sendMessage(fullPrompt);
      const text = response.text || '';
      const match = text.match(/```(?:\w+)?\n([\s\S]*?)```/);
      const extractedCode = match ? match[1] : text;
      setCode(extractedCode);
      setOptimizationLog(prev => [`Refactored ${selectedLang.name} patterns for efficiency`, ...prev]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 p-6 overflow-hidden animate-in fade-in duration-700">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight">Engineer Lab</h2>
          <p className="text-slate-400 font-medium">Professional grade development suite</p>
        </div>
        <div className="flex gap-3">
          <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10">
            {languages.map(lang => (
              <button
                key={lang.id}
                onClick={() => setSelectedLang(lang)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedLang.id === lang.id ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {lang.name}
              </button>
            ))}
          </div>
          <button onClick={() => {}} className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-sm font-bold shadow-xl shadow-blue-900/20 transition-all">
            Deploy Build
          </button>
        </div>
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden">
        <div className="flex-1 flex flex-col gap-6">
          <div className="flex-1 bg-slate-900/50 rounded-[2.5rem] border border-white/5 overflow-hidden flex flex-col relative group">
            <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
               <button className="p-2 bg-white/10 hover:bg-white/20 rounded-xl text-slate-300 transition-colors">
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
               </button>
            </div>
            <pre className="flex-1 p-8 font-mono text-sm text-blue-300/90 overflow-auto bg-[#020617]/50 scrollbar-hide">
              <code>{code}</code>
            </pre>
          </div>

          <div className="glass rounded-[2.5rem] p-6 border border-white/5">
            <textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full h-24 bg-transparent text-white placeholder-slate-600 focus:outline-none resize-none font-medium"
              placeholder={`Describe the ${selectedLang.name} logic you need...`}
            />
            <div className="flex justify-end mt-2">
               <button 
                 onClick={handleGenerate}
                 disabled={isGenerating}
                 className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white rounded-2xl text-sm font-bold border border-white/10 transition-all active:scale-[0.98] disabled:opacity-50"
               >
                 {isGenerating ? 'Compiling Logic...' : 'Optimize & Generate'}
               </button>
            </div>
          </div>
        </div>

        <div className="w-80 flex flex-col gap-6">
          <div className="glass rounded-[2.5rem] border border-white/5 p-6 flex-1 overflow-y-auto">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6">Execution Insights</h3>
            <div className="space-y-4">
              {optimizationLog.map((log, i) => (
                <div key={i} className="flex gap-3 text-xs text-slate-400 p-4 bg-white/5 rounded-2xl border border-white/5">
                  <div className="w-4 h-4 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 text-[8px]">✓</div>
                  {log}
                </div>
              ))}
              {optimizationLog.length === 0 && (
                <div className="text-center py-12 opacity-20">
                   <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                   <p className="text-[10px] uppercase font-bold tracking-widest">Awaiting Analysis</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeWorkspace;
