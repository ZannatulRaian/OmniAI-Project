
import React, { useState } from 'react';
import { sendMessage } from '../services/gemini';

const CodeWorkspace: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [code, setCode] = useState('// Your generated code will appear here...');
  const [isGenerating, setIsGenerating] = useState(false);
  const [optimizationLog, setOptimizationLog] = useState<string[]>([]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    try {
      const fullPrompt = `Task: ${prompt}. Professional Level. Requirements: Optimized, efficient, and clean. Provide only the code in a standard format.`;
      const response = await sendMessage(fullPrompt);
      const text = response.text || '';
      // Extract code block
      const match = text.match(/```(?:\w+)?\n([\s\S]*?)```/);
      const extractedCode = match ? match[1] : text;
      setCode(extractedCode);
      setOptimizationLog(prev => [`Optimized logic for "${prompt.slice(0, 20)}..."`, ...prev]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'omniproject.js';
    a.click();
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 p-6 overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Code Lab</h2>
          <p className="text-slate-400">Build, Refactor, and Deploy Professional Apps</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleDownload}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-all shadow-lg shadow-blue-500/20"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            Download Zip
          </button>
          <button 
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-sm font-medium border border-slate-700 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Deploy
          </button>
        </div>
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden">
        <div className="flex-1 flex flex-col gap-4">
          <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden flex flex-col">
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 border-b border-slate-800">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
              </div>
              <span className="text-xs text-slate-500 font-mono ml-4">main.js</span>
            </div>
            <pre className="flex-1 p-4 font-mono text-sm text-blue-300 overflow-auto bg-[#0d1117]">
              <code>{code}</code>
            </pre>
          </div>

          <div className="h-48 bg-slate-900 rounded-xl border border-slate-800 p-4">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Build Requirements</label>
            <textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full h-24 bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-slate-300 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all resize-none"
              placeholder="e.g., Build a React hook for managing global state with local storage persistence..."
            />
            <button 
              onClick={handleGenerate}
              disabled={isGenerating}
              className="mt-2 w-full py-2 bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white rounded-lg text-sm font-semibold transition-all"
            >
              {isGenerating ? 'Analyzing & Building...' : 'Generate Optimized Code'}
            </button>
          </div>
        </div>

        <div className="w-80 flex flex-col gap-4">
          <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-4 flex-1 overflow-y-auto">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Optimization Log</h3>
            <div className="space-y-3">
              {optimizationLog.map((log, i) => (
                <div key={i} className="text-xs p-2 bg-slate-800/50 rounded border border-slate-700/50 text-slate-400 flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  {log}
                </div>
              ))}
              {optimizationLog.length === 0 && (
                <p className="text-xs text-slate-600 italic">No optimizations run yet.</p>
              )}
            </div>
          </div>
          <div className="bg-indigo-600/10 rounded-xl border border-indigo-500/20 p-4">
            <h4 className="text-sm font-bold text-indigo-400 mb-2">OmniHint™</h4>
            <p className="text-xs text-indigo-300/70 leading-relaxed">
              Using functional components with hooks is 20% more memory-efficient than class components. OmniMind automatically refactors these patterns.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeWorkspace;
