import React, { useState } from 'react';
import { 
  ChevronDown, 
  Share2, 
  PanelLeft,
  Check,
  SlidersHorizontal,
  SquarePen,
  Zap
} from 'lucide-react';
import { ChatThread } from '../types/chat';
import { AVAILABLE_MODELS } from '../services/aiService';

interface HeaderProps {
  selectedModel: string;
  onSelectModel: (modelId: string) => void;
  webSearchEnabled: boolean;
  onToggleWebSearch: () => void;
  reasoningMode: boolean;
  onToggleReasoning: () => void;
  activeThread: ChatThread | null;
  onToggleSidebar: () => void;
  onOpenSettings: () => void;
  onNewChat: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  selectedModel,
  onSelectModel,
  webSearchEnabled,
  onToggleWebSearch,
  reasoningMode,
  onToggleReasoning,
  activeThread,
  onToggleSidebar,
  onOpenSettings,
  onNewChat,
}) => {
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const currentModel = AVAILABLE_MODELS.find((m) => m.id === selectedModel) || AVAILABLE_MODELS[0];

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <header className="h-14 border-b border-[#1E293B] bg-[#09090B] px-3 sm:px-4 flex items-center justify-between sticky top-0 z-30 select-none">
      {/* Left: Sidebar toggle & Zero Gravity Bot Selector */}
      <div className="flex items-center space-x-2">
        <button
          onClick={onToggleSidebar}
          className="p-2 text-[#94A3B8] hover:text-[#F8FAFC] rounded-xl hover:bg-[#111827] transition-all active:scale-95"
          title="Toggle Sidebar"
        >
          <PanelLeft className="w-5 h-5" />
        </button>

        <button
          onClick={onNewChat}
          className="p-2 text-[#94A3B8] hover:text-[#F8FAFC] rounded-xl hover:bg-[#111827] transition-all md:hidden active:scale-95"
          title="New Chat"
        >
          <SquarePen className="w-5 h-5" />
        </button>

        {/* Zero Gravity Model Selector */}
        <div className="relative">
          <button
            onClick={() => setModelDropdownOpen(!modelDropdownOpen)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl hover:bg-[#111827] transition-colors text-base sm:text-lg font-bold text-[#F8FAFC] group"
          >
            <Zap className="w-4 h-4 text-[#3B82F6] fill-current" />
            <span>Zero Gravity Bot</span>
            <span className="text-xs text-[#60A5FA] font-semibold font-mono hidden sm:inline">({currentModel.name})</span>
            <ChevronDown className="w-4 h-4 text-[#94A3B8] group-hover:text-white transition-colors mt-0.5" />
          </button>

          {modelDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setModelDropdownOpen(false)}
              />
              <div className="absolute left-0 mt-2 w-72 sm:w-80 bg-[#111827] border border-[#1F2937] rounded-[20px] shadow-[0_20px_40px_rgba(0,0,0,0.4)] p-2 z-50 animate-in fade-in duration-150">
                <div className="text-[11px] font-semibold text-[#94A3B8] px-3 py-1.5 uppercase tracking-wider flex items-center justify-between">
                  <span>SELECT MODEL ENGINE</span>
                  <Zap className="w-3.5 h-3.5 text-[#3B82F6]" />
                </div>
                <div className="space-y-1">
                  {AVAILABLE_MODELS.map((model) => (
                    <button
                      key={model.id}
                      onClick={() => {
                        onSelectModel(model.id);
                        setModelDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-3 rounded-[14px] flex items-center justify-between transition-all duration-200 ${
                        selectedModel === model.id
                          ? 'bg-[#2563EB] text-[#F8FAFC] font-medium shadow-[0_10px_25px_rgba(37,99,235,0.25)] scale-[1.01]'
                          : 'hover:bg-[#1E293B] text-[#F8FAFC] hover:scale-[1.02]'
                      }`}
                    >
                      <div className="pr-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-bold text-white">{model.name}</span>
                          {model.badge && (
                            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                              selectedModel === model.id
                                ? 'bg-white/20 border-white/30 text-white'
                                : 'bg-[#3B82F6]/20 border-[#3B82F6]/40 text-[#60A5FA]'
                            }`}>
                              {model.badge}
                            </span>
                          )}
                        </div>
                        <p className={`text-xs mt-1 leading-snug ${
                          selectedModel === model.id ? 'text-blue-100' : 'text-[#94A3B8]'
                        }`}>
                          {model.description}
                        </p>
                      </div>
                      {selectedModel === model.id && (
                        <Check className="w-4 h-4 text-white flex-shrink-0 ml-1 stroke-[3]" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-2">
        {activeThread && activeThread.messages.length > 0 && (
          <button
            onClick={handleShare}
            className="p-2 text-[#94a3b8] hover:text-white rounded-xl hover:bg-[#0f172a] transition-colors"
            title="Share thread link"
          >
            {copiedLink ? <Check className="w-4 h-4 text-blue-400" /> : <Share2 className="w-4 h-4" />}
          </button>
        )}

        <button
          onClick={onOpenSettings}
          className="p-2 text-[#94a3b8] hover:text-white rounded-xl hover:bg-[#0f172a] transition-colors"
          title="Settings & Config"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
