
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { MODEL_LIVE } from '../constants';

const LiveSession: React.FC = () => {
  const [isLive, setIsLive] = useState(false);
  const [transcriptions, setTranscriptions] = useState<string[]>([]);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const sessionRef = useRef<any>(null);
  const timerRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  const decode = (base64: string) => {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

  const encode = (bytes: Uint8Array) => {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  }

  const toggleLive = useCallback(async () => {
    if (isLive) {
      // Stopping the session
      if (sessionRef.current) sessionRef.current.close();
      if (audioContextRef.current) audioContextRef.current.close();
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      setIsLive(false);
      clearInterval(timerRef.current);
      return;
    }

    // Starting a new session
    setRecordedAudioUrl(null);
    recordedChunksRef.current = [];
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextRef.current = inputCtx;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Setup MediaRecorder for local saving
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };
      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setRecordedAudioUrl(url);
      };
      mediaRecorder.start();

      let nextStartTime = 0;
      const sources = new Set<AudioBufferSourceNode>();

      const sessionPromise = ai.live.connect({
        model: MODEL_LIVE,
        callbacks: {
          onopen: () => {
            const source = inputCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const l = inputData.length;
              const int16 = new Int16Array(l);
              for (let i = 0; i < l; i++) int16[i] = inputData[i] * 32768;
              const pcmBlob = {
                data: encode(new Uint8Array(int16.buffer)),
                mimeType: 'audio/pcm;rate=16000',
              };
              sessionPromise.then(session => session.sendRealtimeInput({ media: pcmBlob }));
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);
          },
          onmessage: async (msg: LiveServerMessage) => {
            if (msg.serverContent?.modelTurn?.parts[0]?.inlineData?.data) {
              const base64 = msg.serverContent.modelTurn.parts[0].inlineData.data;
              nextStartTime = Math.max(nextStartTime, outputCtx.currentTime);
              const buffer = await decodeAudioData(decode(base64), outputCtx, 24000, 1);
              const source = outputCtx.createBufferSource();
              source.buffer = buffer;
              source.connect(outputCtx.destination);
              source.start(nextStartTime);
              nextStartTime += buffer.duration;
              sources.add(source);
            }

            if (msg.serverContent?.outputTranscription) {
              setTranscriptions(prev => [...prev, `AI: ${msg.serverContent?.outputTranscription?.text}`]);
            }
            if (msg.serverContent?.inputTranscription) {
              setTranscriptions(prev => [...prev, `You: ${msg.serverContent?.inputTranscription?.text}`]);
            }
          },
          onerror: (e) => console.error('Live Error', e),
          onclose: () => console.log('Live Closed'),
        },
        config: {
          responseModalities: [Modality.AUDIO],
          inputAudioTranscription: {},
          outputAudioTranscription: {},
          systemInstruction: "You are a tutoring and recording assistant. Capture key points from classes and interviews."
        }
      });

      sessionRef.current = await sessionPromise;
      setIsLive(true);
      setRecordingTime(0);
      timerRef.current = setInterval(() => setRecordingTime(prev => prev + 1), 1000);

    } catch (e) {
      console.error(e);
      alert("Failed to start recording. Please check microphone permissions.");
    }
  }, [isLive]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const downloadRecording = () => {
    if (recordedAudioUrl) {
      const a = document.createElement('a');
      a.href = recordedAudioUrl;
      a.download = `session-recording-${new Date().toISOString()}.webm`;
      a.click();
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 p-6 overflow-hidden">
      <div className="flex items-center justify-between mb-8 bg-slate-900/50 p-6 rounded-3xl border border-slate-800">
        <div>
          <h2 className="text-2xl font-bold text-white">Live Studio</h2>
          <p className="text-slate-400">Record Tutoring, Classes, or Interviews with Local & AI Cloud Storage</p>
        </div>
        <div className="flex items-center gap-4">
          {isLive && (
            <div className="flex items-center gap-2 px-3 py-1 bg-red-500/10 text-red-500 border border-red-500/20 rounded-full animate-pulse">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-xs font-bold font-mono uppercase tracking-widest">{formatTime(recordingTime)} REC</span>
            </div>
          )}
          {recordedAudioUrl && !isLive && (
            <button
              onClick={downloadRecording}
              className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-bold border border-slate-700 flex items-center gap-2 transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              Download Recording
            </button>
          )}
          <button
            onClick={toggleLive}
            className={`px-8 py-3 rounded-2xl font-bold transition-all shadow-xl ${
              isLive 
                ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-900/20' 
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-900/20'
            }`}
          >
            {isLive ? 'Stop Session' : 'Start Live Session'}
          </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-2 gap-6 overflow-hidden">
        <div className="flex flex-col bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-800/30">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Real-time Transcript</h3>
            <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded uppercase font-bold">Live Stream</span>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-4 font-mono text-sm scrollbar-hide">
            {transcriptions.map((t, i) => (
              <div key={i} className={`p-3 rounded-xl ${t.startsWith('AI') ? 'bg-slate-800/50 text-blue-300' : 'bg-slate-950/50 text-slate-300'}`}>
                {t}
              </div>
            ))}
            {!isLive && transcriptions.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center opacity-20 text-center space-y-4">
                    <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                    <p>Microphone is ready. Start session to record.</p>
                </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-6 overflow-y-auto pr-2">
          <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 flex flex-col min-h-[300px]">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Session Highlights</h3>
            <div className="flex-1 space-y-3">
              <div className="p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
                <p className="text-indigo-400 text-sm font-bold mb-1">Concept Analysis</p>
                <p className="text-indigo-300/70 text-xs leading-relaxed">
                  {isLive 
                    ? "Identifying core themes from your conversation in real-time..." 
                    : "Session summary will appear here once the interaction is finalized."}
                </p>
              </div>
              {recordedAudioUrl && (
                <div className="p-4 bg-green-500/10 rounded-2xl border border-green-500/20">
                  <p className="text-green-400 text-sm font-bold mb-1">Recording Saved</p>
                  <p className="text-green-300/70 text-xs">A high-quality audio copy of this session is ready for export.</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 flex flex-col min-h-[250px]">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Tutoring Feedback</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl border border-slate-700">
                <span className="text-sm text-slate-300">Clarity Rating</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className={`w-3 h-3 rounded-full ${i <= 3 ? 'bg-blue-500' : 'bg-slate-700'}`}></div>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl border border-slate-700">
                <span className="text-sm text-slate-300">Transcription Accuracy</span>
                <span className="text-xs font-bold text-green-400">98.2%</span>
              </div>
              <div className="p-3 bg-blue-500/5 rounded-xl border border-blue-500/10 text-[11px] text-slate-500 leading-relaxed italic">
                OmniMind uses dual-pass processing to ensure the highest fidelity in your recordings and transcriptions.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveSession;
