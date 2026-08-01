import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, X, Zap, Volume2, Sparkles, Hand, Send, MessageSquare, Radio } from 'lucide-react';
import { VoiceRecognitionManager, speakText, stopSpeaking, extractVoiceConcept, unlockBrowserAudio, requestMicrophonePermission } from '../services/voiceService';

interface VoiceModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendVoiceMessage: (text: string, onResponseReady?: (reply: string) => void) => void;
}

export const VoiceModeModal: React.FC<VoiceModeModalProps> = ({
  isOpen,
  onClose,
  onSendVoiceMessage,
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [micActive, setMicActive] = useState(false);
  const [status, setStatus] = useState<'listening' | 'thinking' | 'speaking'>('listening');
  const [liveTranscript, setLiveTranscript] = useState('');
  const [textInput, setTextInput] = useState('');
  const [detectedConcept, setDetectedConcept] = useState<string>('General Knowledge & Reasoning');
  const [aiSpeechText, setAiSpeechText] = useState('Listening... Speak naturally or type your prompt below.');
  const [voiceGender, setVoiceGender] = useState<'female' | 'male'>(
    (localStorage.getItem('zerogravity_voice_gender') as any) || 'female'
  );

  const recognitionRef = useRef<VoiceRecognitionManager | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Spoken greeting on mount
  useEffect(() => {
    if (isOpen) {
      unlockBrowserAudio();
      requestMicrophonePermission().then((granted) => {
        setMicActive(granted);
      });
      setStatus('speaking');
      const greetingMsg = "Zero Gravity Voice Assistant is online. Speak your question or type a prompt.";
      setAiSpeechText(greetingMsg);
      speakText(greetingMsg, {}, () => {
        setStatus('listening');
        setAiSpeechText('Listening... Speak to Zero Gravity Bot.');
      });
    }
  }, [isOpen]);

  // Glowing wave animation
  useEffect(() => {
    if (!isOpen) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 280;
    canvas.height = 280;

    let phase = 0;

    const renderWave = () => {
      const width = canvas.width || 280;
      const height = canvas.height || 280;
      const centerY = height / 2;

      ctx.clearRect(0, 0, width, height);

      phase += status === 'speaking' ? 0.08 : status === 'thinking' ? 0.12 : 0.04;

      const waves = [
        { color: 'rgba(59, 130, 246, 0.85)', amplitude: status === 'speaking' ? 32 : 14, frequency: 0.02 },
        { color: 'rgba(56, 189, 248, 0.7)', amplitude: status === 'speaking' ? 24 : 9, frequency: 0.03 },
        { color: 'rgba(99, 102, 241, 0.5)', amplitude: status === 'speaking' ? 18 : 6, frequency: 0.015 }
      ];

      waves.forEach((w) => {
        ctx.beginPath();
        ctx.strokeStyle = w.color;
        ctx.lineWidth = 3.5;

        for (let x = 0; x < width; x++) {
          const y = centerY + Math.sin(x * w.frequency + phase) * w.amplitude * Math.sin((x / width) * Math.PI);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      });

      const radius = status === 'speaking' ? 48 : status === 'listening' ? 40 : 34;
      const grad = ctx.createRadialGradient(width / 2, centerY, 5, width / 2, centerY, radius);
      grad.addColorStop(0, 'rgba(248, 250, 252, 0.95)');
      grad.addColorStop(0.5, 'rgba(59, 130, 246, 0.85)');
      grad.addColorStop(1, 'rgba(56, 189, 248, 0)');

      ctx.beginPath();
      ctx.arc(width / 2, centerY, radius, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      animationFrameRef.current = requestAnimationFrame(renderWave);
    };

    renderWave();

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isOpen, status]);

  // Voice STT & Continuous Speech Loop
  useEffect(() => {
    if (!isOpen) {
      stopSpeaking();
      if (recognitionRef.current) recognitionRef.current.stop();
      return;
    }

    const manager = new VoiceRecognitionManager(
      (transcript, isFinal) => {
        setLiveTranscript(transcript);
        const concept = extractVoiceConcept(transcript);
        setDetectedConcept(concept);

        if (isFinal && transcript.trim()) {
          processVoicePrompt(transcript.trim());
        }
      },
      (error) => {
        console.warn('Voice STT error:', error);
      },
      () => {
        if (status === 'listening' && !isMuted) {
          manager.start();
        }
      }
    );

    recognitionRef.current = manager;
    manager.start();

    return () => {
      stopSpeaking();
      manager.stop();
    };
  }, [isOpen]);

  const processVoicePrompt = (promptText: string) => {
    unlockBrowserAudio();
    const concept = extractVoiceConcept(promptText);
    setDetectedConcept(concept);
    setStatus('thinking');
    setAiSpeechText(`Processing query on ${concept}...`);

    onSendVoiceMessage(promptText, (replyText) => {
      setStatus('speaking');
      const speakableText = replyText.replace(/```[\s\S]*?```/g, 'Code block omitted.').slice(0, 300) || `I have processed your inquiry on ${concept}.`;
      setAiSpeechText(speakableText);

      speakText(speakableText, {}, () => {
        setStatus('listening');
        setLiveTranscript('');
        setAiSpeechText('Listening... Speak to Zero Gravity Bot.');
        recognitionRef.current?.start();
      });
    });
  };

  if (!isOpen) return null;

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (!isMuted) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
    }
  };

  const toggleVoiceGender = () => {
    const nextGender = voiceGender === 'female' ? 'male' : 'female';
    setVoiceGender(nextGender);
    localStorage.setItem('zerogravity_voice_gender', nextGender);
    unlockBrowserAudio();
    setStatus('speaking');
    const sampleMsg = nextGender === 'male' ? 'Real Male Voice Activated.' : 'Real Female Voice Activated.';
    setAiSpeechText(sampleMsg);
    speakText(sampleMsg, {}, () => {
      setStatus('listening');
      setAiSpeechText('Listening... Speak to Zero Gravity Bot.');
    });
  };

  const handleInterrupt = () => {
    stopSpeaking();
    setStatus('listening');
    setLiveTranscript('');
    setAiSpeechText('Listening... What else would you like to know?');
    recognitionRef.current?.start();
  };

  const handleTestAudio = () => {
    unlockBrowserAudio();
    setStatus('speaking');
    const testPhrase = "Zero Gravity Bot voice engine is operational and speaking out loud!";
    setAiSpeechText(testPhrase);
    speakText(testPhrase, {}, () => {
      setStatus('listening');
      setAiSpeechText('Listening... Speak to Zero Gravity Bot.');
    });
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim()) return;
    const prompt = textInput.trim();
    setTextInput('');
    processVoicePrompt(prompt);
  };

  const QUICK_VOICE_PRESETS = [
    "Hello Zero Gravity!",
    "Explain React state hook",
    "What is Groq Llama 3.3?",
    "Generate FLUX Image",
    "Code Python Function"
  ];

  return (
    <div className="fixed inset-0 z-50 bg-[#060a12] bg-gradient-to-b from-[#060a12] via-[#0b1329] to-[#0f172a] flex flex-col items-center justify-between p-3 sm:p-6 overflow-y-auto select-none animate-in fade-in duration-300">
      
      {/* Premium Background Glow Lights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-1/3 w-80 h-80 bg-cyan-400/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Bar */}
      <div className="w-full max-w-2xl flex items-center justify-between relative z-10 py-1">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-blue-600/30 text-blue-400 border border-blue-500/50 shadow-lg shadow-blue-500/20">
            <Zap className="w-4 h-4 text-cyan-300 fill-current" />
          </div>
          <div>
            <span className="text-xs font-bold text-white tracking-wider uppercase block">Zero Gravity SAT Voice AI</span>
            <span className="text-[10px] text-cyan-300 font-mono">SAT Voice AI Engine Active</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Gender Switcher */}
          <button
            onClick={toggleVoiceGender}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-blue-600/30 border border-blue-400/50 text-xs font-semibold text-white hover:bg-blue-600/50 transition-all shadow-md"
            title="Switch Voice Gender"
          >
            <span>{voiceGender === 'female' ? '👩 Female Voice' : '👨 Male Voice'}</span>
          </button>

          {/* Test Audio */}
          <button
            onClick={handleTestAudio}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-full bg-[#0f172a] border border-[#334155] text-xs font-mono text-cyan-300 hover:bg-[#1e293b] transition-all"
            title="Test Speaker Audio"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Test</span>
          </button>

          <button
            onClick={() => {
              stopSpeaking();
              onClose();
            }}
            className="p-2 text-[#94a3b8] hover:text-white rounded-full bg-[#0f172a] hover:bg-[#1e293b] transition-all border border-[#1e3a8a]/50 shadow-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Content Center Area */}
      <div className="flex flex-col items-center justify-center space-y-3.5 my-auto w-full max-w-xl relative z-10 py-2">
        
        {/* Status Indicators */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <div className="flex items-center space-x-2 px-3.5 py-1 rounded-full bg-blue-600/20 border border-blue-500/40 text-xs font-mono text-cyan-300 shadow-md">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Concept: {detectedConcept}</span>
          </div>

          <div className={`flex items-center space-x-1.5 px-3.5 py-1 rounded-full text-xs font-mono border shadow-md ${
            micActive
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
          }`}>
            <Radio className={`w-3.5 h-3.5 ${micActive ? 'animate-pulse text-emerald-400' : 'text-amber-400'}`} />
            <span>{micActive ? 'Mic Sensing: Active' : 'Mic Sensing: Ready'}</span>
          </div>
        </div>

        {/* Central Waveform Orb */}
        <div className="relative flex items-center justify-center my-1">
          <canvas ref={canvasRef} className="w-56 h-56 sm:w-64 sm:h-64" />
          <div className="absolute w-20 h-20 rounded-full bg-gradient-to-tr from-blue-600 via-cyan-400 to-white opacity-80 blur-xs animate-orb pointer-events-none shadow-[0_0_40px_rgba(56,189,248,0.5)]" />
        </div>

        {/* Tap to Speak Button */}
        <button
          onClick={() => {
            unlockBrowserAudio();
            if (recognitionRef.current) {
              recognitionRef.current.stop();
              recognitionRef.current.start();
            }
            setStatus('listening');
            setAiSpeechText('Listening... Speak now!');
          }}
          className="px-6 py-2.5 rounded-[14px] bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white font-bold text-xs flex items-center space-x-2 transition-all duration-200 shadow-[0_0_30px_rgba(59,130,246,0.4)] hover:scale-[1.03] active:scale-97 cursor-pointer"
        >
          <Mic className="w-4 h-4 text-white animate-pulse" />
          <span>Tap to Speak / Start Voice</span>
        </button>

        {/* Live Subtitles Box */}
        <div className="w-full bg-[#111827] border border-[#1F2937] shadow-[0_20px_40px_rgba(0,0,0,0.4)] p-4 rounded-[20px] text-center space-y-1.5">
          <p className="text-[10px] uppercase tracking-widest text-[#38BDF8] font-bold font-mono">
            {status === 'speaking' ? '🔊 ZERO GRAVITY SPEAKING OUT LOUD' : status === 'thinking' ? '⚡ PROCESSING CONCEPT' : '🎤 LISTENING TO YOUR VOICE'}
          </p>
          <h3 className="text-sm sm:text-base font-semibold text-[#F8FAFC] leading-relaxed line-clamp-3">
            {liveTranscript ? `"${liveTranscript}"` : aiSpeechText}
          </h3>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap justify-center gap-2">
          {QUICK_VOICE_PRESETS.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => processVoicePrompt(preset)}
              className="px-3.5 py-1.5 rounded-[14px] bg-[#111827] hover:bg-[#1D4ED8] border border-[#334155] hover:border-[#3B82F6] text-xs font-medium text-[#F8FAFC] transition-all duration-200 shadow-sm flex items-center space-x-1.5 hover:scale-[1.03] active:scale-97 cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#60A5FA]" />
              <span>{preset}</span>
            </button>
          ))}
        </div>
      </div>

      {/* PROMPT TYPING INPUT CAPSULE BAR (100% PROMINENT & VISIBLE) */}
      <div className="w-full max-w-xl space-y-2.5 relative z-10 pt-2 pb-1">
        <form onSubmit={handleTextSubmit} className="relative flex items-center shadow-[0_0_25px_rgba(59,130,246,0.25)] rounded-[18px]">
          <input
            type="text"
            placeholder="💬 Type your prompt here or speak out loud..."
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            className="w-full bg-[#111827] text-[#F8FAFC] text-xs sm:text-sm font-medium px-5 py-3.5 rounded-[18px] border-2 border-[#3B82F6] focus:border-[#60A5FA] outline-none pr-28 shadow-2xl placeholder-[#94A3B8]"
          />
          <button
            type="submit"
            className="absolute right-1.5 px-4 py-2 bg-[#3B82F6] hover:bg-[#2563EB] text-white font-bold text-xs rounded-[14px] flex items-center space-x-1.5 transition-all shadow-[0_10px_30px_rgba(59,130,246,0.35)] hover:scale-[1.03] active:scale-97"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Control Buttons */}
        <div className="flex items-center justify-center space-x-4">
          <button
            onClick={toggleMute}
            className={`p-3 rounded-full border transition-all shadow-lg ${
              isMuted
                ? 'bg-red-500/20 text-red-400 border-red-500/40'
                : 'bg-[#0f172a] text-white border-[#1e3a8a]/80 hover:bg-[#1e293b]'
            }`}
            title={isMuted ? 'Unmute Mic' : 'Mute Mic'}
          >
            {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          {status === 'speaking' && (
            <button
              onClick={handleInterrupt}
              className="p-3 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 hover:bg-amber-500/30 transition-all shadow-lg"
              title="Interrupt AI"
            >
              <Hand className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => {
              stopSpeaking();
              onClose();
            }}
            className="p-3 rounded-full bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-xl shadow-blue-500/30"
            title="Exit Voice Mode"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
