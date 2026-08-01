import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ChatWindow } from './components/ChatWindow';
import { ChatInput } from './components/ChatInput';
import { VoiceModeModal } from './components/VoiceModeModal';
import { AIToolsSuite } from './components/AIToolsSuite';
import { AdminDashboard } from './components/AdminDashboard';
import { AuthSettingsModal } from './components/AuthSettingsModal';
import { CodeSandboxModal } from './components/CodeSandboxModal';

import { ChatThread, Message, Attachment, UserProfile, CodeExecutionResult } from './types/chat';
import { generateStreamingResponse } from './services/aiService';
import { runSandboxedCode } from './services/codeRunnerService';

const DEFAULT_USER: UserProfile = {
  id: 'usr_1',
  name: 'Bhagwat User',
  email: 'bhagwat@novagpt.ai',
  avatar: '',
  tier: 'Pro',
  isGuest: false
};

const WELCOME_THREAD: ChatThread = {
  id: 'thread_welcome',
  title: 'Welcome to Zero Gravity Bot',
  createdAt: Date.now(),
  updatedAt: Date.now(),
  modelId: 'llama-3.3-70b-versatile',
  messages: [
    {
      id: 'msg_welcome',
      role: 'assistant',
      content: `### Welcome to **Zero Gravity Bot** ⚡

I am your high-performance AI assistant powered by Groq Llama 3.3 70B & OpenAI GPT-4o for ultra-fast streaming intelligence.

What you can do right now:
- 💻 **Live Code Execution**: Click **"Run Code"** on any code snippet to execute JavaScript/Python live in the browser terminal.
- 🎙️ **Voice Assistant**: Tap the microphone button for hands-free voice conversations.
- 🛠️ **30+ AI SaaS Tools**: Explore specialized generators for LeetCode, Resumes, System Design, SQL, and Research.
- 📊 **Real Telemetry Admin**: Monitor real API execution logs, live query counts, and real tokens in the Admin Dashboard.

How can I assist you today?`,
      timestamp: Date.now(),
      model: 'Llama 3.3 70B (Groq)',
      intent: 'General Assistant',
      followUpSuggestions: [
        'Write a production React TypeScript hook with caching',
        'Analyze my resume for ATS optimization',
        'Visualize developer language adoption with a chart'
      ]
    }
  ]
};

export function App() {
  const [threads, setThreads] = useState<ChatThread[]>(() => {
    const saved = localStorage.getItem('nova_chat_threads');
    return saved ? JSON.parse(saved) : [WELCOME_THREAD];
  });

  const [activeThreadId, setActiveThreadId] = useState<string | null>(() => {
    const saved = localStorage.getItem('nova_active_thread_id');
    return saved || 'thread_welcome';
  });

  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('nova_user_profile');
    return saved ? JSON.parse(saved) : DEFAULT_USER;
  });

  const [selectedModel, setSelectedModel] = useState<string>('gpt-5');
  const [webSearchEnabled, setWebSearchEnabled] = useState<boolean>(false);
  const [reasoningMode, setReasoningMode] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(true);

  // Modals
  const [voiceModalOpen, setVoiceModalOpen] = useState<boolean>(false);
  const [aiToolsOpen, setAiToolsOpen] = useState<boolean>(false);
  const [adminDashboardOpen, setAdminDashboardOpen] = useState<boolean>(false);
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);

  // Terminal Code Execution Sandbox
  const [sandboxResult, setSandboxResult] = useState<CodeExecutionResult | null>(null);
  const [sandboxOpen, setSandboxOpen] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem('nova_chat_threads', JSON.stringify(threads));
  }, [threads]);

  useEffect(() => {
    if (activeThreadId) {
      localStorage.setItem('nova_active_thread_id', activeThreadId);
    }
  }, [activeThreadId]);

  useEffect(() => {
    localStorage.setItem('nova_user_profile', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) root.classList.add('dark');
    else root.classList.remove('dark');
  }, [darkMode]);

  const activeThread = threads.find((t) => t.id === activeThreadId) || null;

  const handleNewChat = () => {
    const newId = 'thread_' + Math.random().toString(36).substr(2, 9);
    const newThread: ChatThread = {
      id: newId,
      title: 'New Conversation',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      modelId: selectedModel,
      messages: []
    };
    setThreads([newThread, ...threads]);
    setActiveThreadId(newId);
  };

  const handleDeleteThread = (threadId: string) => {
    const updated = threads.filter((t) => t.id !== threadId);
    setThreads(updated);
    if (activeThreadId === threadId) {
      setActiveThreadId(updated.length > 0 ? updated[0].id : null);
    }
  };

  const handleRenameThread = (threadId: string, newTitle: string) => {
    setThreads((prev) =>
      prev.map((t) => (t.id === threadId ? { ...t, title: newTitle } : t))
    );
  };

  const handleRunCode = (result: CodeExecutionResult) => {
    setSandboxResult(result);
    setSandboxOpen(true);
  };

  const handleReRunSandboxCode = async () => {
    if (!sandboxResult) return;
    const freshRes = await runSandboxedCode(sandboxResult.code, sandboxResult.language);
    setSandboxResult(freshRes);
  };

  const handleSendMessage = async (
    content: string, 
    attachments: Attachment[] = [],
    onResponseReady?: (fullContent: string) => void
  ) => {
    let currentThreadId = activeThreadId;

    if (!currentThreadId || !threads.some((t) => t.id === currentThreadId)) {
      const newId = 'thread_' + Math.random().toString(36).substr(2, 9);
      const newThread: ChatThread = {
        id: newId,
        title: content.slice(0, 32) || 'New Conversation',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        modelId: selectedModel,
        messages: []
      };
      setThreads((prev) => [newThread, ...prev]);
      setActiveThreadId(newId);
      currentThreadId = newId;
    }

    const userMsg: Message = {
      id: 'msg_' + Math.random().toString(36).substr(2, 9),
      role: 'user',
      content,
      attachments,
      timestamp: Date.now()
    };

    const aiMsgId = 'msg_' + Math.random().toString(36).substr(2, 9);
    const aiMsgPlaceholder: Message = {
      id: aiMsgId,
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
      model: selectedModel,
      isStreaming: true
    };

    setThreads((prev) =>
      prev.map((t) => {
        if (t.id === currentThreadId) {
          const autoTitle = t.messages.length === 0 ? (content.slice(0, 32) || 'New Conversation') : t.title;
          return {
            ...t,
            title: autoTitle,
            updatedAt: Date.now(),
            messages: [...t.messages, userMsg, aiMsgPlaceholder]
          };
        }
        return t;
      })
    );

    setIsStreaming(true);

    const historyForLLM = activeThread ? activeThread.messages : [];

    await generateStreamingResponse(
      content,
      selectedModel,
      historyForLLM,
      attachments,
      webSearchEnabled,
      reasoningMode,
      {
        onIntent: (intent) => {
          setThreads((prev) =>
            prev.map((t) => {
              if (t.id === currentThreadId) {
                const updatedMessages = t.messages.map((m) => {
                  if (m.id === aiMsgId) return { ...m, intent };
                  return m;
                });
                return { ...t, messages: updatedMessages };
              }
              return t;
            })
          );
        },
        onReasoning: (chunk) => {
          setThreads((prev) =>
            prev.map((t) => {
              if (t.id === currentThreadId) {
                const updatedMessages = t.messages.map((m) => {
                  if (m.id === aiMsgId) return { ...m, reasoning: (m.reasoning || '') + chunk };
                  return m;
                });
                return { ...t, messages: updatedMessages };
              }
              return t;
            })
          );
        },
        onChunk: (chunk) => {
          setThreads((prev) =>
            prev.map((t) => {
              if (t.id === currentThreadId) {
                const updatedMessages = t.messages.map((m) => {
                  if (m.id === aiMsgId) return { ...m, content: m.content + chunk };
                  return m;
                });
                return { ...t, messages: updatedMessages };
              }
              return t;
            })
          );
        },
        onFollowUps: (followUps) => {
          setThreads((prev) =>
            prev.map((t) => {
              if (t.id === currentThreadId) {
                const updatedMessages = t.messages.map((m) => {
                  if (m.id === aiMsgId) return { ...m, followUpSuggestions: followUps };
                  return m;
                });
                return { ...t, messages: updatedMessages };
              }
              return t;
            })
          );
        },
        onDone: (fullContent, fullReasoning, intent, followUps) => {
          setThreads((prev) =>
            prev.map((t) => {
              if (t.id === currentThreadId) {
                const updatedMessages = t.messages.map((m) => {
                  if (m.id === aiMsgId) {
                    return {
                      ...m,
                      content: fullContent,
                      reasoning: fullReasoning || m.reasoning,
                      intent: intent || m.intent,
                      followUpSuggestions: followUps || m.followUpSuggestions,
                      isStreaming: false
                    };
                  }
                  return m;
                });
                return { ...t, messages: updatedMessages };
              }
              return t;
            })
          );
          setIsStreaming(false);
          if (onResponseReady) {
            onResponseReady(fullContent);
          }
        },
        onError: (err) => {
          console.error('LLM Error:', err);
          setIsStreaming(false);
        }
      }
    );
  };

  const handleRegenerate = () => {
    if (!activeThread || activeThread.messages.length < 2) return;
    const lastUserMsg = [...activeThread.messages].reverse().find((m) => m.role === 'user');
    if (lastUserMsg) {
      handleSendMessage(lastUserMsg.content, lastUserMsg.attachments);
    }
  };

  return (
    <div className="flex h-[100dvh] w-screen bg-[#141414] text-[#ececec] overflow-hidden select-none">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        threads={threads}
        activeThreadId={activeThreadId}
        onSelectThread={(id) => setActiveThreadId(id)}
        onNewChat={handleNewChat}
        onDeleteThread={handleDeleteThread}
        onRenameThread={handleRenameThread}
        onOpenAITools={() => setAiToolsOpen(true)}
        onOpenAdminDashboard={() => setAdminDashboardOpen(true)}
        onOpenVoiceModal={() => setVoiceModalOpen(true)}
        onOpenSettings={() => setSettingsOpen(true)}
        darkMode={darkMode}
        onToggleTheme={() => setDarkMode(!darkMode)}
        user={user}
      />

      <div className="flex-1 flex flex-col min-w-0 h-full relative">
        <Header
          selectedModel={selectedModel}
          onSelectModel={(mId) => setSelectedModel(mId)}
          webSearchEnabled={webSearchEnabled}
          onToggleWebSearch={() => setWebSearchEnabled(!webSearchEnabled)}
          reasoningMode={reasoningMode}
          onToggleReasoning={() => setReasoningMode(!reasoningMode)}
          activeThread={activeThread}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onOpenSettings={() => setSettingsOpen(true)}
          onNewChat={handleNewChat}
        />

        <ChatWindow
          messages={activeThread ? activeThread.messages : []}
          user={user}
          onSendPrompt={(p) => handleSendMessage(p)}
          onRegenerate={handleRegenerate}
          isStreaming={isStreaming}
          onRunCode={handleRunCode}
          onSelectFollowUp={(p) => handleSendMessage(p)}
        />

        <ChatInput
          onSendMessage={handleSendMessage}
          isStreaming={isStreaming}
          onStopStreaming={() => setIsStreaming(false)}
          webSearchEnabled={webSearchEnabled}
          onToggleWebSearch={() => setWebSearchEnabled(!webSearchEnabled)}
          reasoningMode={reasoningMode}
          onToggleReasoning={() => setReasoningMode(!reasoningMode)}
          onOpenVoiceModal={() => setVoiceModalOpen(true)}
        />
      </div>

      <VoiceModeModal
        isOpen={voiceModalOpen}
        onClose={() => setVoiceModalOpen(false)}
        onSendVoiceMessage={(txt, onReady) => handleSendMessage(txt, [], onReady)}
      />

      <AIToolsSuite
        isOpen={aiToolsOpen}
        onClose={() => setAiToolsOpen(false)}
        onUseToolPrompt={(p) => handleSendMessage(p)}
      />

      <AdminDashboard
        isOpen={adminDashboardOpen}
        onClose={() => setAdminDashboardOpen(false)}
        threads={threads}
      />

      <AuthSettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        user={user}
        onUpdateUser={(updated) => setUser((prev) => ({ ...prev, ...updated }))}
        darkMode={darkMode}
        onToggleTheme={() => setDarkMode(!darkMode)}
      />

      <CodeSandboxModal
        isOpen={sandboxOpen}
        onClose={() => setSandboxOpen(false)}
        result={sandboxResult}
        onReRun={handleReRunSandboxCode}
      />
    </div>
  );
}
