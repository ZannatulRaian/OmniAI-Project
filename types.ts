
export type AppView = 'chat' | 'code' | 'video' | 'live' | 'files' | 'images' | 'dashboard';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  images?: string[];
  code?: string;
  language?: string;
  groundingLinks?: Array<{ uri: string; title: string }>;
  timestamp: number;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  type: 'class' | 'interview' | 'remote-work';
  timestamp: number;
  highlights: string[];
}

export interface Project {
  id: string;
  name: string;
  code: string;
  deployedUrl?: string;
}
