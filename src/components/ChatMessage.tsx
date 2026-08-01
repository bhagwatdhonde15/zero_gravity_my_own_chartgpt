import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  Copy, 
  Check, 
  Volume2, 
  VolumeX, 
  RotateCw, 
  ThumbsUp, 
  ThumbsDown, 
  Brain, 
  ChevronDown, 
  ChevronRight,
  FileText,
  Code,
  Image as ImageIcon,
  Play,
  Sparkles,
  ArrowRight,
  Zap
} from 'lucide-react';
import { Message, UserProfile, CodeExecutionResult } from '../types/chat';
import { speakText, stopSpeaking } from '../services/voiceService';
import { runSandboxedCode } from '../services/codeRunnerService';
import { ChartRenderer } from './ChartRenderer';
import { ImageGeneratorCard } from './ImageGeneratorCard';

interface ChatMessageProps {
  message: Message;
  user: UserProfile;
  onRegenerate?: () => void;
  onRunCode?: (result: CodeExecutionResult) => void;
  onSelectFollowUp?: (prompt: string) => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  user,
  onRegenerate,
  onRunCode,
  onSelectFollowUp,
}) => {
  const [copied, setCopied] = useState(false);
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [speaking, setSpeaking] = useState(false);
  const [reasoningExpanded, setReasoningExpanded] = useState(false);
  const [feedback, setFeedback] = useState<'like' | 'dislike' | null>(message.feedback || null);

  const isUser = message.role === 'user';

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyCode = (codeText: string, id: string) => {
    navigator.clipboard.writeText(codeText);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const handleExecuteCode = async (codeText: string, lang: string) => {
    const res = await runSandboxedCode(codeText, lang);
    if (onRunCode) onRunCode(res);
  };

  const handleToggleSpeak = () => {
    if (speaking) {
      stopSpeaking();
      setSpeaking(false);
    } else {
      setSpeaking(true);
      speakText(message.content, {}, () => setSpeaking(false));
    }
  };

  const handleFeedback = (type: 'like' | 'dislike') => {
    setFeedback(feedback === type ? null : type);
  };

  return (
    <div className={`py-4 px-4 sm:px-6 w-full ${isUser ? 'flex justify-end' : ''}`}>
      <div className={`max-w-3xl w-full mx-auto flex space-x-3 sm:space-x-4 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
        
        {/* Avatar */}
        <div className="flex-shrink-0 mt-0.5">
          {isUser ? (
            <div className="w-8 h-8 rounded-full bg-[#1e293b] text-white flex items-center justify-center font-semibold text-xs border border-[#334155]">
              {user.avatar ? (
                <img src={user.avatar} alt="User" className="w-8 h-8 rounded-full object-cover" />
              ) : (
                user.name.charAt(0).toUpperCase()
              )}
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-400 text-white flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Zap className="w-4 h-4 text-white fill-current" />
            </div>
          )}
        </div>

        {/* Message Body */}
        <div className={`flex-1 min-w-0 space-y-2 ${isUser ? 'flex flex-col items-end' : ''}`}>
          
          {/* Intent Tag */}
          {!isUser && message.intent && (
            <div className="flex items-center space-x-1 text-[10px] text-cyan-400 font-mono">
              <Sparkles className="w-3 h-3 text-blue-400" />
              <span>Intent: {message.intent}</span>
            </div>
          )}

          {/* User Bubble vs Assistant Content */}
          {isUser ? (
            <div className="bg-[#1e293b] text-[#f8fafc] px-4 py-2.5 rounded-3xl max-w-2xl text-sm sm:text-base leading-relaxed border border-[#334155] shadow-sm">
              {message.attachments && message.attachments.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {message.attachments.map((att) => (
                    <div
                      key={att.id}
                      className="flex items-center space-x-2 bg-[#090d16] border border-[#334155] px-2.5 py-1 rounded-xl text-xs text-white"
                    >
                      {att.type === 'image' ? (
                        <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
                      ) : att.type === 'pdf' ? (
                        <FileText className="w-3.5 h-3.5 text-red-400" />
                      ) : (
                        <Code className="w-3.5 h-3.5 text-blue-400" />
                      )}
                      <span className="truncate max-w-[120px] font-medium">{att.name}</span>
                    </div>
                  ))}
                </div>
              )}
              {message.content}
            </div>
          ) : (
            <div className="w-full space-y-2">
              {/* Reasoning Trace */}
              {message.reasoning && (
                <div className="mb-2">
                  <button
                    onClick={() => setReasoningExpanded(!reasoningExpanded)}
                    className="flex items-center space-x-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors group font-sans font-medium"
                  >
                    <Brain className="w-3.5 h-3.5 text-blue-400" />
                    <span>Thought for 2 seconds</span>
                    {reasoningExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                  </button>
                  {reasoningExpanded && (
                    <div className="mt-2 p-3 bg-[#0f172a] border border-[#1e3a8a]/50 rounded-2xl text-xs text-[#94a3b8] font-mono whitespace-pre-wrap leading-relaxed">
                      {message.reasoning}
                    </div>
                  )}
                </div>
              )}

              {/* Markdown Content */}
              <div className="prose prose-invert max-w-none text-sm sm:text-base leading-relaxed text-[#f8fafc] space-y-3 font-sans">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code({ node, inline, className, children, ...props }: any) {
                      const match = /language-(\w+)/.exec(className || '');
                      const codeString = String(children).replace(/\n$/, '');
                      const codeId = Math.random().toString(36).substr(2, 9);
                      const lang = match ? match[1] : 'javascript';

                      if (!inline && lang === 'chart') {
                        try {
                          const chartJson = JSON.parse(codeString);
                          return <ChartRenderer data={chartJson} />;
                        } catch (err) {
                          console.warn('Failed to parse ChartGPT JSON:', err);
                        }
                      }

                      if (!inline && lang === 'image') {
                        try {
                          const imageJson = JSON.parse(codeString);
                          return <ImageGeneratorCard data={imageJson} />;
                        } catch (err) {
                          console.warn('Failed to parse NanoBana Image JSON:', err);
                        }
                      }

                      return !inline ? (
                        <div className="relative my-3 rounded-2xl overflow-hidden border border-[#334155] bg-[#050811]">
                          <div className="flex items-center justify-between px-4 py-2 bg-[#0f172a] border-b border-[#1e293b] text-xs text-[#94a3b8] font-mono">
                            <span className="text-cyan-400 font-semibold">{lang}</span>
                            <div className="flex items-center space-x-3">
                              <button
                                onClick={() => handleExecuteCode(codeString, lang)}
                                className="flex items-center space-x-1 text-blue-400 hover:text-blue-300 transition-colors font-semibold"
                              >
                                <Play className="w-3.5 h-3.5 fill-current" />
                                <span>Run Code</span>
                              </button>

                              <button
                                onClick={() => handleCopyCode(codeString, codeId)}
                                className="flex items-center space-x-1 hover:text-white transition-colors"
                              >
                                {copiedCodeId === codeId ? (
                                  <>
                                    <Check className="w-3.5 h-3.5 text-blue-400" />
                                    <span className="text-blue-400">Copied!</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3.5 h-3.5" />
                                    <span>Copy code</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                          <pre className="p-4 overflow-x-auto text-xs font-mono text-[#f8fafc] leading-relaxed bg-[#050811]">
                            <code>{children}</code>
                          </pre>
                        </div>
                      ) : (
                        <code className="bg-[#1e293b] px-1.5 py-0.5 rounded text-cyan-300 font-mono text-xs" {...props}>
                          {children}
                        </code>
                      );
                    }
                  }}
                >
                  {message.content}
                </ReactMarkdown>

                {message.isStreaming && (
                  <span className="inline-block w-2 h-4 bg-blue-400 animate-pulse ml-1 align-middle" />
                )}
              </div>

              {/* Action Toolbar */}
              {!message.isStreaming && (
                <div className="pt-2 flex items-center space-x-1.5 text-[#94a3b8] text-xs">
                  <button
                    onClick={() => handleCopy(message.content)}
                    className="p-1.5 hover:text-white rounded-lg hover:bg-[#1e293b] transition-colors"
                    title="Copy response"
                  >
                    {copied ? <Check className="w-4 h-4 text-blue-400" /> : <Copy className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={handleToggleSpeak}
                    className={`p-1.5 rounded-lg hover:bg-[#1e293b] transition-colors ${
                      speaking ? 'text-blue-400' : 'hover:text-white'
                    }`}
                    title={speaking ? 'Stop Speaking' : 'Read Aloud'}
                  >
                    {speaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>

                  {onRegenerate && (
                    <button
                      onClick={onRegenerate}
                      className="p-1.5 hover:text-white rounded-lg hover:bg-[#1e293b] transition-colors"
                      title="Regenerate response"
                    >
                      <RotateCw className="w-4 h-4" />
                    </button>
                  )}

                  <div className="h-3 border-r border-[#334155] mx-1" />

                  <button
                    onClick={() => handleFeedback('like')}
                    className={`p-1.5 rounded-lg hover:bg-[#1e293b] transition-colors ${
                      feedback === 'like' ? 'text-blue-400' : 'hover:text-white'
                    }`}
                    title="Good response"
                  >
                    <ThumbsUp className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleFeedback('dislike')}
                    className={`p-1.5 rounded-lg hover:bg-[#1e293b] transition-colors ${
                      feedback === 'dislike' ? 'text-red-400' : 'hover:text-white'
                    }`}
                    title="Bad response"
                  >
                    <ThumbsDown className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Follow-up Suggestions Chips */}
              {!message.isStreaming && message.followUpSuggestions && message.followUpSuggestions.length > 0 && (
                <div className="pt-3 space-y-1.5">
                  <div className="text-[10px] uppercase tracking-wider text-[#94a3b8] font-semibold">
                    Suggested Follow-ups
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {message.followUpSuggestions.map((suggestion, sIdx) => (
                      <button
                        key={sIdx}
                        onClick={() => onSelectFollowUp?.(suggestion)}
                        className="px-3 py-1.5 rounded-xl bg-[#0f172a] hover:bg-[#1e293b] border border-[#334155] hover:border-blue-500/50 text-xs text-[#f8fafc] hover:text-white transition-all flex items-center space-x-1.5 shadow-sm group"
                      >
                        <span>{suggestion}</span>
                        <ArrowRight className="w-3 h-3 text-[#94a3b8] group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
