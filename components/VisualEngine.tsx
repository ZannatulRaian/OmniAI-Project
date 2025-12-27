
import React, { useState } from 'react';
import { generateImage } from '../services/gemini';

const VisualEngine: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [images, setImages] = useState<string[]>([]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    try {
      const imgData = await generateImage(prompt);
      if (imgData) setImages(prev => [imgData, ...prev]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 p-8 overflow-hidden animate-in fade-in duration-700">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter">Visual Engine</h2>
          <p className="text-slate-400 font-medium">Generate hyper-realistic assets and diagrams</p>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-8 overflow-hidden">
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="glass p-8 rounded-[2.5rem] border border-white/5 flex flex-col h-full">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6">Creative Control</h3>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="flex-1 bg-white/5 border border-white/10 rounded-3xl p-6 text-white text-sm placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none"
              placeholder="Describe your vision (e.g. 'Isometric 3D diagram of a neural network with glowing pathways')..."
            />
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="mt-6 w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl shadow-xl shadow-blue-900/20 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {isGenerating ? 'Rendering...' : 'Create Visual'}
            </button>
          </div>
        </div>

        <div className="lg:col-span-3 overflow-y-auto pr-2 scrollbar-hide">
          {images.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center glass rounded-[3rem] border border-white/5 border-dashed">
              <div className="w-24 h-24 bg-white/5 rounded-[2rem] flex items-center justify-center mb-6">
                <svg className="w-10 h-10 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </div>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Canvas Empty</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-6">
              {images.map((img, i) => (
                <div key={i} className="group relative aspect-square glass rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl animate-in slide-in-from-bottom-4 duration-500">
                  <img src={img} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Generated" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    <button className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl text-white transition-colors backdrop-blur-md">
                       <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VisualEngine;
