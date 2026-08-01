import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowUp, 
  Square, 
  Plus, 
  Mic, 
  Globe, 
  Brain, 
  X, 
  FileText, 
  Image as ImageIcon,
  Code
} from 'lucide-react';
import { Attachment } from '../types/chat';
import { parseFileToAttachment } from '../services/documentService';

interface ChatInputProps {
  onSendMessage: (content: string, attachments: Attachment[]) => void;
  isStreaming: boolean;
  onStopStreaming: () => void;
  webSearchEnabled: boolean;
  onToggleWebSearch: () => void;
  reasoningMode: boolean;
  onToggleReasoning: () => void;
  onOpenVoiceModal: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isStreaming,
  onStopStreaming,
  webSearchEnabled,
  onToggleWebSearch,
  reasoningMode,
  onToggleReasoning,
  onOpenVoiceModal,
}) => {
  const [input, setInput] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if ((!input.trim() && attachments.length === 0) || isStreaming) return;

    onSendMessage(input.trim(), attachments);
    setInput('');
    setAttachments([]);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      const parsedAttachments: Attachment[] = [];
      for (let i = 0; i < files.length; i++) {
        const att = await parseFileToAttachment(files[i]);
        parsedAttachments.push(att);
      }
      setAttachments((prev) => [...prev, ...parsedAttachments]);
    } catch (err) {
      console.error('Failed to parse attached file:', err);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 pb-4 select-none">
      <div className="relative bg-[#111827] border-2 border-[#3B82F6] focus-within:border-[#60A5FA] rounded-[18px] p-3 shadow-[0_0_25px_rgba(59,130,246,0.25)] focus-within:shadow-[0_0_35px_rgba(59,130,246,0.45)] transition-all duration-250">
        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2 px-2 pt-1">
            {attachments.map((att) => (
              <div
                key={att.id}
                className="flex items-center space-x-2 bg-[#1E293B] border border-[#334155] px-3 py-1.5 rounded-[14px] text-xs text-[#F8FAFC]"
              >
                {att.type === 'image' ? (
                  <ImageIcon className="w-3.5 h-3.5 text-[#06B6D4]" />
                ) : att.type === 'pdf' ? (
                  <FileText className="w-3.5 h-3.5 text-[#EF4444]" />
                ) : (
                  <Code className="w-3.5 h-3.5 text-[#3B82F6]" />
                )}
                <span className="truncate max-w-[120px] font-medium">{att.name}</span>
                <button
                  onClick={() => removeAttachment(att.id)}
                  className="hover:text-[#EF4444] text-[#94A3B8] transition-colors ml-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Message Zero Gravity Bot..."
          rows={1}
          className="w-full bg-transparent text-[#F8FAFC] placeholder-[#94A3B8] text-base outline-none resize-none px-2 max-h-48 leading-relaxed font-sans"
        />

        <div className="flex items-center justify-between pt-2.5 px-1">
          <div className="flex items-center space-x-2">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,.pdf,.txt,.md,.json,.csv,.js,.ts,.py,.java"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="p-2 text-[#F8FAFC] hover:bg-[#334155] rounded-[14px] transition-all bg-[#1E293B] border border-[#334155] hover:scale-[1.03] active:scale-97"
              title="Add attachment"
            >
              <Plus className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onToggleWebSearch}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-[14px] text-xs font-semibold transition-all ${
                webSearchEnabled
                  ? 'bg-[#3B82F6] text-white border border-[#60A5FA] shadow-[0_0_20px_rgba(59,130,246,0.4)]'
                  : 'bg-[#1F2937] text-[#38BDF8] hover:bg-[#334155] border border-[#334155]'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Search</span>
            </button>
            {/* Reasoning Mode Pill */}
            <button
              type="button"
              onClick={onToggleReasoning}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-[14px] text-xs font-semibold transition-all ${
                reasoningMode
                  ? 'bg-gradient-to-r from-[#7C3AED] to-[#2563EB] text-white border border-purple-400/50 shadow-md'
                  : 'bg-[#1E293B] text-[#94A3B8] hover:text-white hover:bg-[#334155] border border-[#334155]'
              }`}
            >
              <Brain className="w-3.5 h-3.5" />
              <span>Reasoning</span>
            </button>

            {/* NanoBana Image Mode Pill */}
            <button
              type="button"
              onClick={() => {
                setInput((prev) => (prev.startsWith('Generate an image of ') ? prev : `Generate an image of ${prev}`));
                if (textareaRef.current) textareaRef.current.focus();
              }}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-[14px] text-xs font-semibold bg-[#1E293B] hover:bg-[#334155] text-[#38BDF8] hover:text-white border border-[#334155] transition-all"
              title="NanoBana Image Generator"
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>NanoBana Image</span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            {/* Voice Gradient Button */}
            <button
              type="button"
              onClick={onOpenVoiceModal}
              className="p-2 text-white bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] hover:from-[#2563EB] hover:to-[#0284C7] rounded-[14px] transition-all shadow-[0_0_30px_rgba(59,130,246,0.4)] hover:scale-[1.03] active:scale-97"
              title="Voice Mode"
            >
              <Mic className="w-4 h-4 animate-pulse" />
            </button>

            {isStreaming ? (
              <button
                type="button"
                onClick={onStopStreaming}
                className="p-2 text-white bg-[#DC2626] hover:bg-[#EF4444] rounded-[14px] transition-all shadow-md active:scale-97"
                title="Stop generation"
              >
                <Square className="w-4 h-4 fill-current" />
              </button>
            ) : (
              /* Send Button */
              <button
                type="button"
                onClick={() => handleSubmit()}
                disabled={!input.trim() && attachments.length === 0}
                className={`p-2 rounded-[14px] transition-all duration-200 ${
                  input.trim() || attachments.length > 0
                    ? 'bg-[#3B82F6] hover:bg-[#2563EB] text-white shadow-[0_10px_30px_rgba(59,130,246,0.35)] hover:scale-[1.03] active:scale-97 cursor-pointer'
                    : 'bg-[#374151] text-[#94A3B8] cursor-not-allowed opacity-60'
                }`}
                title="Send Message"
              >
                <ArrowUp className="w-4 h-4 stroke-[2.5]" />
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="text-center text-[11px] text-[#94a3b8] mt-2 font-sans">
        Zero Gravity Bot can process code, files, and voice inputs in real time.
      </div>
    </div>
  );
};
