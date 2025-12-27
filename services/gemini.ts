
import { GoogleGenAI, GenerateContentResponse, Type, Modality, LiveServerMessage } from "@google/genai";
import { MODEL_TEXT, SYSTEM_INSTRUCTION } from "../constants";

const getApiKey = () => process.env.API_KEY || "";

export const sendMessage = async (message: string, history: any[] = []) => {
  const ai = new GoogleGenAI({ apiKey: getApiKey() });
  const response = await ai.models.generateContent({
    model: MODEL_TEXT,
    contents: [
      ...history,
      { role: 'user', parts: [{ text: message }] }
    ],
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      tools: [{ googleSearch: {} }],
    },
  });
  return response;
};

export const generateImage = async (prompt: string) => {
  const ai = new GoogleGenAI({ apiKey: getApiKey() });
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [{ text: prompt }]
    }
  });

  const part = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
  return part?.inlineData?.data ? `data:image/png;base64,${part.inlineData.data}` : null;
};

export const summarizeLargeFile = async (fileName: string, content: string) => {
  const ai = new GoogleGenAI({ apiKey: getApiKey() });
  const prompt = `Summarize the following document titled "${fileName}". It is a large text book/document. Provide a comprehensive summary, key takeaways, and a structured table of contents. Content: ${content.substring(0, 100000)}...`;
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
        thinkingConfig: { thinkingBudget: 5000 }
    }
  });
  return response.text;
};

export const startLiveSession = (callbacks: any) => {
    const ai = new GoogleGenAI({ apiKey: getApiKey() });
    return ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks,
        config: {
            responseModalities: [Modality.AUDIO],
            inputAudioTranscription: {},
            outputAudioTranscription: {},
            systemInstruction: "You are a tutoring and recording assistant. Capture key points and help the user learn."
        }
    });
};
