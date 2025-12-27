
import React, { useState } from 'react';
import { summarizeLargeFile } from '../services/gemini';

interface Document {
  id: string;
  name: string;
  size: string;
  summary?: string;
  status: 'processing' | 'ready';
}

const KnowledgeBase: React.FC = () => {
  const [docs, setDocs] = useState<Document[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const newDoc: Document = {
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
      status: 'processing'
    };
    setDocs(prev => [newDoc, ...prev]);

    try {
      // For demo, reading text. In real app use libraries for PDF/DOCX
      const reader = new FileReader();
      reader.onload = async (event) => {
        const text = event.target?.result as string;
        const summary = await summarizeLargeFile(file.name, text);
        setDocs(prev => prev.map(d => d.id === newDoc.id ? { ...d, status: 'ready', summary } : d));
      };
      reader.readAsText(file);
    } catch (e) {
      console.error(e);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 p-8 overflow-hidden animate-in fade-in duration-700">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter">Knowledge Stream</h2>
          <p className="text-slate-400 font-medium">Extracting intelligence from infinite context</p>
        </div>
        <label className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold cursor-pointer transition-all shadow-xl shadow-indigo-900/20 active:scale-[0.98]">
          Upload Library
          <input type="file" className="hidden" onChange={handleFileUpload} accept=".txt,.md" />
        </label>
      </div>

      <div className="flex-1 flex gap-8 overflow-hidden">
        <div className="w-96 flex flex-col gap-4">
          <div className="glass rounded-[2.5rem] border border-white/5 p-8 flex-1 overflow-y-auto scrollbar-hide">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6">Your Repository</h3>
            <div className="space-y-4">
              {docs.map(doc => (
                <div 
                  key={doc.id}
                  onClick={() => doc.status === 'ready' && setSelectedDoc(doc)}
                  className={`p-5 rounded-3xl border transition-all cursor-pointer ${
                    selectedDoc?.id === doc.id 
                      ? 'bg-blue-600 border-blue-500 shadow-lg' 
                      : 'bg-white/5 border-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-sm font-bold text-white truncate">{doc.name}</p>
                      <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">
                        {doc.status === 'processing' ? 'Thinking...' : doc.size}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {docs.length === 0 && (
                <div className="text-center py-20 opacity-20">
                   <p className="text-[10px] uppercase font-bold tracking-widest">No Context Provided</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 glass rounded-[3rem] border border-white/5 p-10 overflow-y-auto scrollbar-hide">
          {selectedDoc ? (
            <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="pb-8 border-b border-white/5">
                <span className="text-xs font-black text-blue-400 uppercase tracking-widest mb-2 block">Extracted Summary</span>
                <h3 className="text-4xl font-black text-white">{selectedDoc.name}</h3>
              </div>
              <div className="prose prose-invert prose-slate max-w-none">
                <div className="text-slate-300 leading-relaxed text-lg whitespace-pre-wrap">
                  {selectedDoc.summary}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-indigo-500/10 rounded-[2rem] flex items-center justify-center mb-6">
                 <svg className="w-10 h-10 text-indigo-400 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
              </div>
              <h4 className="text-xl font-bold text-white mb-2">Select Context</h4>
              <p className="text-slate-500 max-w-xs">Upload or select a document from your repository to reveal deep intelligence.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KnowledgeBase;
