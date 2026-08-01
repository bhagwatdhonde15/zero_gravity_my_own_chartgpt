import React, { useRef, useEffect } from 'react';
import { 
  Code, 
  FileText, 
  Briefcase, 
  Search, 
  ArrowUpRight,
  Zap
} from 'lucide-react';
import { Message, UserProfile, CodeExecutionResult } from '../types/chat';
import { ChatMessage } from './ChatMessage';

interface ChatWindowProps {
  messages: Message[];
  user: UserProfile;
  onSendPrompt: (prompt: string) => void;
  onRegenerate: () => void;
  isStreaming: boolean;
  onRunCode?: (result: CodeExecutionResult) => void;
  onSelectFollowUp?: (prompt: string) => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  user,
  onSendPrompt,
  onRegenerate,
  isStreaming,
  onRunCode,
  onSelectFollowUp,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const QUICK_PROMPTS = [
    {
      icon: <Code className="w-4 h-4 text-cyan-400" />,
      title: 'Write & Execute Code',
      desc: 'React TypeScript hook with live terminal sandbox runner',
      prompt: 'Write a production-ready React TypeScript hook for handling async API requests with retry logic and caching.'
    },
    {
      icon: <FileText className="w-4 h-4 text-blue-400" />,
      title: 'Analyze document or PDF',
      desc: 'Extract key clauses & executive summary',
      prompt: 'Can you summarize the key terms and clauses of a software service agreement?'
    },
    {
      icon: <Briefcase className="w-4 h-4 text-indigo-400" />,
      title: 'Review resume & CV',
      desc: 'ATS score optimization & impact verbs',
      prompt: 'Analyze my resume for ATS optimization, action verbs, and impact metrics for a Senior Full Stack Engineer role.'
    },
    {
      icon: <Search className="w-4 h-4 text-sky-400" />,
      title: 'Deep web research',
      desc: 'Compare Next.js App Router vs Vite SPA',
      prompt: 'Compare Next.js App Router vs Vite SPA for high-performance dashboard applications.'
    }
  ];

  return (
    <div className="flex-1 overflow-y-auto w-full select-none">
      {messages.length === 0 ? (
        <div className="min-h-full flex flex-col items-center justify-center p-6 text-center max-w-3xl mx-auto space-y-8 animate-in fade-in duration-300">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center shadow-xl shadow-blue-500/20">
            <Zap className="w-9 h-9 text-white fill-current" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-sans">
              What can Zero Gravity Bot build for you today?
            </h2>
            <p className="text-xs text-[#94a3b8] max-w-md mx-auto">
              Powered by Groq Llama 3.3 70B & OpenAI GPT-4o for ultra-fast streaming intelligence.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full text-left pt-2">
            {QUICK_PROMPTS.map((card, idx) => (
              <button
                key={idx}
                onClick={() => onSendPrompt(card.prompt)}
                className="p-4 rounded-[20px] bg-[#111827] hover:bg-[#1D4ED8] border border-[#334155] hover:border-[#3B82F6] transition-all duration-250 text-left space-y-2 group shadow-[0_20px_40px_rgba(0,0,0,0.4)] hover:scale-[1.03] active:scale-97 cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-[14px] bg-[#09090B] border border-[#334155]">
                    {card.icon}
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-[#60A5FA] group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white group-hover:text-white transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-xs text-[#CBD5E1] mt-0.5 line-clamp-1 group-hover:text-blue-100">
                    {card.desc}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="w-full pb-4">
          {messages.map((message, index) => (
            <ChatMessage
              key={message.id}
              message={message}
              user={user}
              onRegenerate={index === messages.length - 1 && message.role === 'assistant' ? onRegenerate : undefined}
              onRunCode={onRunCode}
              onSelectFollowUp={onSelectFollowUp}
            />
          ))}

          {isStreaming && messages[messages.length - 1]?.role === 'user' && (
            <div className="py-4 px-4 sm:px-6 w-full">
              <div className="max-w-3xl mx-auto flex space-x-4">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md">
                  <Zap className="w-4 h-4 text-white fill-current animate-spin-slow" />
                </div>
                <div className="flex items-center space-x-2 text-xs text-[#94a3b8]">
                  <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
                  <span>Zero Gravity Bot is streaming response...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
};
