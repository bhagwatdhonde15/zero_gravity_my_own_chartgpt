import React, { useState } from 'react';
import { 
  SquarePen, 
  Search, 
  Wrench, 
  ShieldCheck, 
  Trash2, 
  Edit3, 
  Settings, 
  Mic,
  Zap,
  Bot
} from 'lucide-react';
import { ChatThread, UserProfile } from '../types/chat';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  threads: ChatThread[];
  activeThreadId: string | null;
  onSelectThread: (threadId: string) => void;
  onNewChat: () => void;
  onDeleteThread: (threadId: string) => void;
  onRenameThread: (threadId: string, newTitle: string) => void;
  onOpenAITools: () => void;
  onOpenAdminDashboard: () => void;
  onOpenVoiceModal: () => void;
  onOpenSettings: () => void;
  darkMode: boolean;
  onToggleTheme: () => void;
  user: UserProfile;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  threads,
  activeThreadId,
  onSelectThread,
  onNewChat,
  onDeleteThread,
  onRenameThread,
  onOpenAITools,
  onOpenAdminDashboard,
  onOpenVoiceModal,
  onOpenSettings,
  darkMode,
  onToggleTheme,
  user,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingThreadId, setEditingThreadId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const filteredThreads = threads.filter((t) =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const startRenaming = (t: ChatThread, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingThreadId(t.id);
    setEditTitle(t.title);
  };

  const saveRenaming = (id: string, e: React.FormEvent) => {
    e.preventDefault();
    if (editTitle.trim()) {
      onRenameThread(id, editTitle.trim());
    }
    setEditingThreadId(null);
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed md:static top-0 left-0 bottom-0 z-50 w-64 sm:w-68 bg-[#0B1220] border-r border-[#1F2937] flex flex-col transition-transform duration-300 ease-in-out select-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-3.5 flex items-center justify-between border-b border-[#1F2937]">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-[14px] bg-gradient-to-tr from-[#2563EB] to-[#06B6D4] flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.35)]">
              <Zap className="w-4 h-4 text-white fill-current" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-[#F8FAFC] tracking-wide flex items-center space-x-1">
                <span>Zero Gravity Bot</span>
              </h1>
              <p className="text-[10px] text-[#38BDF8] font-mono">v3.0 Pro SaaS</p>
            </div>
          </div>

          <button
            onClick={onNewChat}
            className="p-2 text-[#CBD5E1] hover:text-white hover:bg-[#1E40AF] rounded-[14px] transition-all active:scale-95"
            title="New Chat"
          >
            <SquarePen className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Action Navigation */}
        <div className="px-3 py-2 space-y-1.5">
          <button
            onClick={() => {
              onNewChat();
              onClose();
            }}
            className="w-full py-2.5 px-3.5 bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-[14px] text-xs font-semibold flex items-center justify-between transition-all duration-200 shadow-[0_10px_30px_rgba(59,130,246,0.35)] hover:scale-[1.03] active:scale-97"
          >
            <span className="flex items-center space-x-2">
              <SquarePen className="w-4 h-4" />
              <span>New Conversation</span>
            </span>
          </button>

          <button
            onClick={() => {
              onOpenVoiceModal();
              onClose();
            }}
            className="w-full py-2.5 px-3.5 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white rounded-[14px] text-xs font-bold flex items-center space-x-2.5 transition-all duration-200 shadow-[0_0_30px_rgba(59,130,246,0.4)] hover:scale-[1.03] active:scale-97"
          >
            <Mic className="w-4 h-4 text-white animate-pulse" />
            <span>Voice Assistant</span>
          </button>

          <button
            onClick={() => {
              onOpenAITools();
              onClose();
            }}
            className="w-full py-2 px-3 bg-[#111827] hover:bg-[#1E40AF] text-[#CBD5E1] hover:text-white rounded-[14px] text-xs font-medium flex items-center space-x-2.5 transition-all border border-[#1F2937] hover:border-[#3B82F6] hover:scale-[1.02]"
          >
            <Wrench className="w-4 h-4 text-[#38BDF8]" />
            <span>AI Tools Suite</span>
          </button>

          <button
            onClick={() => {
              onOpenAdminDashboard();
              onClose();
            }}
            className="w-full py-2 px-3 bg-[#111827] hover:bg-[#1E40AF] text-[#CBD5E1] hover:text-white rounded-[14px] text-xs font-medium flex items-center space-x-2.5 transition-all border border-[#1F2937] hover:border-[#3B82F6] hover:scale-[1.02]"
          >
            <ShieldCheck className="w-4 h-4 text-[#F59E0B]" />
            <span>Real Telemetry Admin</span>
          </button>
        </div>

        {/* Search Input Box */}
        <div className="px-3 pt-1 pb-1">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#38BDF8]" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1F2937] text-xs text-[#F8FAFC] placeholder-[#94A3B8] pl-8 pr-3 py-2 rounded-[14px] border border-[#334155] focus:border-[#3B82F6] focus:bg-[#334155] outline-none transition-all"
            />
          </div>
        </div>

        {/* Recent Threads List */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          <div className="text-[10px] font-bold text-[#94A3B8] px-2 py-1 uppercase tracking-wider">
            Conversations ({filteredThreads.length})
          </div>

          {filteredThreads.map((thread) => {
            const isActive = thread.id === activeThreadId;
            const isEditing = thread.id === editingThreadId;

            return (
              <div
                key={thread.id}
                onClick={() => {
                  onSelectThread(thread.id);
                  onClose();
                }}
                className={`group relative w-full text-left px-3 py-2.5 rounded-[14px] text-xs flex items-center justify-between cursor-pointer transition-all duration-200 ${
                  isActive
                    ? 'bg-[#2563EB] text-white font-semibold shadow-[0_10px_25px_rgba(37,99,235,0.25)] scale-[1.01]'
                    : 'hover:bg-[#1E40AF] text-[#CBD5E1] hover:text-white hover:scale-[1.02]'
                }`}
              >
                <div className="flex items-center space-x-2 min-w-0 pr-2 flex-1">
                  {isEditing ? (
                    <form onSubmit={(e) => saveRenaming(thread.id, e)} className="flex-1">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        autoFocus
                        onBlur={(e) => saveRenaming(thread.id, e)}
                        className="w-full bg-[#09090B] text-white text-xs px-2 py-1 rounded-[10px] outline-none border border-[#3B82F6]"
                      />
                    </form>
                  ) : (
                    <span className="truncate">{thread.title}</span>
                  )}
                </div>

                {!isEditing && (
                  <div className="hidden group-hover:flex items-center space-x-1">
                    <button
                      onClick={(e) => startRenaming(thread, e)}
                      className="p-1 hover:text-white text-[#94a3b8] transition-colors"
                      title="Rename"
                    >
                      <Edit3 className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteThread(thread.id);
                      }}
                      className="p-1 hover:text-red-400 text-[#94a3b8] transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer User Profile */}
        <div className="p-3 border-t border-[#1e293b] bg-[#090d16]">
          <div className="flex items-center justify-between p-2 rounded-xl hover:bg-[#0f172a] transition-colors">
            <div className="flex items-center space-x-2.5 min-w-0">
              <div className="relative w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0 shadow-md">
                {user.avatar ? (
                  <img src={user.avatar} alt="Avatar" className="w-8 h-8 rounded-full object-cover" />
                ) : (
                  user.name.charAt(0).toUpperCase()
                )}
                {user.isGoogleConnected && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-white flex items-center justify-center p-0.5 shadow-sm border border-[#090d16]" title="Connected with Google">
                    <svg className="w-2.5 h-2.5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                    </svg>
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-white truncate flex items-center space-x-1">
                  <span>{user.name}</span>
                </div>
                <div className="text-[10px] text-[#94a3b8] truncate">{user.email}</div>
              </div>
            </div>

            <button
              onClick={onOpenSettings}
              className="p-1.5 text-[#94a3b8] hover:text-white rounded-lg hover:bg-[#1e293b] transition-colors"
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
