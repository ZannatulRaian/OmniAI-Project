
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { MODEL_VEO } from '../constants';

const VideoGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [status, setStatus] = useState('');

  const generateVideo = async () => {
    if (!prompt.trim()) return;
    
    // Check key selection as per requirement
    const hasKey = await (window as any).aistudio.hasSelectedApiKey();
    if (!hasKey) {
        await (window as any).aistudio.openSelectKey();
        return;
    }

    setIsGenerating(true);
    setStatus('Initializing Veo engine...');
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      let operation = await ai.models.generateVideos({
        model: MODEL_VEO,
        prompt: prompt,
        config: {
          numberOfVideos: 1,
          resolution: '1080p',
          aspectRatio: '16:9'
        }
      });

      setStatus('Forging pixels and motion... (This may take a minute)');
      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
      }

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (downloadLink) {
        const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
        const blob = await response.blob();
        setVideoUrl(URL.createObjectURL(blob));
      }
    } catch (error: any) {
        if (error.message?.includes("Requested entity was not found")) {
            await (window as any).aistudio.openSelectKey();
        }
        setStatus('Generation failed. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 p-8 items-center justify-center text-center">
      <div className="max-w-2xl w-full space-y-8">
        <div>
          <h2 className="text-4xl font-extrabold text-white mb-2">Video Forge</h2>
          <p className="text-slate-400 text-lg">Transform text into stunning cinematic experiences with Veo 3.1</p>
        </div>

        <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
          {videoUrl ? (
            <video src={videoUrl} controls className="w-full rounded-xl aspect-video bg-black shadow-lg" />
          ) : (
            <div className="aspect-video bg-slate-950 rounded-xl border border-dashed border-slate-800 flex flex-col items-center justify-center text-slate-600">
              {isGenerating ? (
                <div className="space-y-4">
                  <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="text-blue-400 font-medium animate-pulse">{status}</p>
                </div>
              ) : (
                <svg className="w-16 h-16 mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
              )}
            </div>
          )}
        </div>

        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isGenerating}
            placeholder="Describe your cinematic vision... (e.g., 'A golden eagle soaring over snow-capped mountains at sunset')"
            className="w-full h-32 bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white placeholder-slate-600 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all resize-none shadow-inner"
          />
          <button
            onClick={generateVideo}
            disabled={isGenerating || !prompt.trim()}
            className="mt-4 w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-2xl transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 shadow-xl shadow-blue-900/20"
          >
            {isGenerating ? 'Engine Running...' : 'Generate Video'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoGenerator;
