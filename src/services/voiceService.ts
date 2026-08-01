export interface VoiceOption {
  id: string;
  name: string;
  gender: 'female' | 'male' | 'neutral';
  description: string;
  openAiVoiceKey: string;
}

export const CHATGPT_VOICES: VoiceOption[] = [
  { id: 'sat-female', name: 'SAT Sol (High-Fidelity Female)', gender: 'female', description: 'SAT Voice Agent expressive natural female voice', openAiVoiceKey: 'nova' },
  { id: 'sat-male', name: 'SAT Spruce (Articulate Male)', gender: 'male', description: 'SAT Voice Agent deep articulate male voice', openAiVoiceKey: 'onyx' },
  { id: 'qwen3-female', name: 'Qwen3-TTS (Natural Female)', gender: 'female', description: 'Qwen3 High-Fidelity expressive neural female voice', openAiVoiceKey: 'nova' },
  { id: 'qwen3-male', name: 'Qwen3-TTS (Warm Male)', gender: 'male', description: 'Qwen3 Deep articulate neural male voice', openAiVoiceKey: 'onyx' },
  { id: 'sol', name: 'Sol', gender: 'female', description: 'Savvy and relaxed assistant', openAiVoiceKey: 'nova' },
  { id: 'spruce', name: 'Spruce', gender: 'male', description: 'Calm and authoritative', openAiVoiceKey: 'onyx' },
  { id: 'cove', name: 'Cove', gender: 'male', description: 'Warm and candid', openAiVoiceKey: 'echo' },
  { id: 'breeze', name: 'Breeze', gender: 'female', description: 'Animated and earnest', openAiVoiceKey: 'shimmer' },
  { id: 'ember', name: 'Ember', gender: 'female', description: 'Confident and optimistic', openAiVoiceKey: 'alloy' },
  { id: 'juniper', name: 'Juniper', gender: 'female', description: 'Open and upbeat', openAiVoiceKey: 'fable' },
  { id: 'sky', name: 'Sky', gender: 'female', description: 'Versatile and natural', openAiVoiceKey: 'nova' },
  { id: 'alloy', name: 'Alloy', gender: 'neutral', description: 'Balanced and clear', openAiVoiceKey: 'alloy' },
  { id: 'onyx', name: 'Onyx', gender: 'male', description: 'Deep and expressive', openAiVoiceKey: 'onyx' },
];

export interface VoiceConfig {
  voiceId?: string;
  pitch?: number;
  rate?: number;
  apiKey?: string;
}

export function isSpeechRecognitionSupported(): boolean {
  return typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
}

export function isSpeechSynthesisSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

let cachedVoices: SpeechSynthesisVoice[] = [];

if (typeof window !== 'undefined' && isSpeechSynthesisSupported()) {
  cachedVoices = window.speechSynthesis.getVoices();
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = () => {
      cachedVoices = window.speechSynthesis.getVoices();
    };
  }
}

export function unlockBrowserAudio(): void {
  if (!isSpeechSynthesisSupported()) return;
  try {
    window.speechSynthesis.resume();
    const silent = new SpeechSynthesisUtterance('');
    silent.volume = 0;
    window.speechSynthesis.speak(silent);
  } catch {
    // ignore
  }
}

export function extractVoiceConcept(transcript: string): string {
  const lower = transcript.toLowerCase();
  if (lower.includes('react') || lower.includes('hook') || lower.includes('state') || lower.includes('frontend')) {
    return 'React & Web Architecture';
  }
  if (lower.includes('code') || lower.includes('python') || lower.includes('script') || lower.includes('function') || lower.includes('algorithm')) {
    return 'Software Engineering & Algorithms';
  }
  if (lower.includes('resume') || lower.includes('job') || lower.includes('interview') || lower.includes('career')) {
    return 'Career & Interview Strategy';
  }
  if (lower.includes('database') || lower.includes('sql') || lower.includes('query') || lower.includes('data')) {
    return 'Database Systems & Data Analysis';
  }
  if (lower.includes('math') || lower.includes('calculate') || lower.includes('formula') || lower.includes('equation')) {
    return 'Mathematics & Computation';
  }
  if (lower.includes('ai') || lower.includes('model') || lower.includes('llm') || lower.includes('groq')) {
    return 'Artificial Intelligence & Neural Nets';
  }
  return 'General Knowledge & Reasoning';
}

export async function requestMicrophonePermission(): Promise<boolean> {
  if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
    return false;
  }
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    // Stop tracks after obtaining permission
    stream.getTracks().forEach((track) => track.stop());
    return true;
  } catch (err) {
    console.warn('Microphone permission request error:', err);
    return false;
  }
}

export class VoiceRecognitionManager {
  private recognition: any = null;
  private isListening = false;

  constructor(
    onResult: (transcript: string, isFinal: boolean) => void,
    onError: (error: string) => void,
    onEnd: () => void
  ) {
    if (!isSpeechRecognitionSupported()) return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = typeof navigator !== 'undefined' && navigator.language ? navigator.language : 'en-US';

    this.recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      if (finalTranscript) {
        onResult(finalTranscript, true);
      } else if (interimTranscript) {
        onResult(interimTranscript, false);
      }
    };

    this.recognition.onerror = (event: any) => {
      onError(event.error || 'Voice input error');
    };

    this.recognition.onend = () => {
      this.isListening = false;
      onEnd();
    };
  }

  public async start() {
    if (this.recognition && !this.isListening) {
      try {
        await requestMicrophonePermission();
        this.recognition.start();
        this.isListening = true;
      } catch (err) {
        console.warn('Speech recognition start error:', err);
      }
    }
  }

  public stop() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
        this.isListening = false;
      } catch (err) {
        console.warn('Speech recognition stop error:', err);
      }
    }
  }
}

export const DEFAULT_VOICE_API_KEY = 'dTJGeF_VT05uNEh1VHJJZEZPSzRGVFBRSGgtYXE3UjY6eVcwT2JXUjMzWm1sR1ZDdzFVY0ZtTg==';

export async function speakText(text: string, config: VoiceConfig = {}, onEnd?: () => void): Promise<void> {
  const customApiKey = config.apiKey || localStorage.getItem('zerogravity_voice_key') || localStorage.getItem('nova_openai_key') || DEFAULT_VOICE_API_KEY;
  const selectedVoiceId = config.voiceId || localStorage.getItem('nova_selected_voice') || 'sol';
  const voiceObj = CHATGPT_VOICES.find((v) => v.id === selectedVoiceId) || CHATGPT_VOICES[0];

  // If real OpenAI key is provided, try OpenAI TTS
  if (customApiKey && customApiKey.startsWith('sk-')) {
    try {
      await playOpenAITTSAudio(text, voiceObj.openAiVoiceKey, customApiKey, onEnd);
      return;
    } catch (err) {
      console.warn('OpenAI TTS API call failed, falling back to Web Speech API:', err);
    }
  }

  // Web Speech API Synthesis Engine
  if (!isSpeechSynthesisSupported()) {
    onEnd?.();
    return;
  }

  const cleanText = text
    .replace(/```[\s\S]*?```/g, 'Code block omitted.')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/[#*_-]/g, ' ')
    .trim();

  if (!cleanText) {
    onEnd?.();
    return;
  }

  window.speechSynthesis.cancel();
  window.speechSynthesis.resume();

  const genderPref = (localStorage.getItem('zerogravity_voice_gender') || 'female').toLowerCase();

  const utterance = new SpeechSynthesisUtterance(cleanText.slice(0, 450));
  utterance.rate = config.rate || parseFloat(localStorage.getItem('nova_voice_rate') || '1.0');
  utterance.pitch = genderPref === 'male' ? 0.85 : 1.05;
  utterance.volume = 1.0;

  const voices = cachedVoices.length > 0 ? cachedVoices : window.speechSynthesis.getVoices();
  if (voices.length > 0) {
    if (genderPref === 'male') {
      const maleVoice = voices.find(
        (v) => (v.name.includes('Male') || v.name.includes('David') || v.name.includes('Daniel') || v.name.includes('George') || v.name.includes('James') || v.name.includes('Alex')) && v.lang.startsWith('en')
      ) || voices.find((v) => v.lang.startsWith('en'));
      if (maleVoice) utterance.voice = maleVoice;
    } else {
      const femaleVoice = voices.find(
        (v) => (v.name.includes('Female') || v.name.includes('Samantha') || v.name.includes('Zira') || v.name.includes('Karen') || v.name.includes('Victoria') || v.name.includes('Natural')) && v.lang.startsWith('en')
      ) || voices.find((v) => v.lang.startsWith('en'));
      if (femaleVoice) utterance.voice = femaleVoice;
    }
  }

  let ended = false;
  const finish = () => {
    if (!ended) {
      ended = true;
      onEnd?.();
    }
  };

  utterance.onend = finish;
  utterance.onerror = finish;

  window.speechSynthesis.speak(utterance);
}

async function playOpenAITTSAudio(text: string, voiceKey: string, apiKey: string, onEnd?: () => void): Promise<void> {
  const cleanText = text.replace(/```[\s\S]*?```/g, '').trim().slice(0, 1000);
  if (!cleanText) {
    onEnd?.();
    return;
  }

  const response = await fetch('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'tts-1',
      input: cleanText,
      voice: voiceKey
    })
  });

  if (!response.ok) {
    throw new Error(`OpenAI TTS Error: ${response.statusText}`);
  }

  const blob = await response.blob();
  const audioUrl = URL.createObjectURL(blob);
  const audio = new Audio(audioUrl);

  audio.onended = () => {
    URL.revokeObjectURL(audioUrl);
    onEnd?.();
  };
  audio.onerror = () => {
    URL.revokeObjectURL(audioUrl);
    onEnd?.();
  };

  await audio.play();
}

export function stopSpeaking(): void {
  if (isSpeechSynthesisSupported()) {
    window.speechSynthesis.cancel();
  }
}
