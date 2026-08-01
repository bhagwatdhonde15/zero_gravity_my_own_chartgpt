export type Role = 'user' | 'assistant' | 'system';

export interface Attachment {
  id: string;
  name: string;
  type: 'image' | 'pdf' | 'text' | 'code' | 'excel' | 'doc';
  size: number;
  content: string;
  previewUrl?: string;
}

export interface ChartDataset {
  label: string;
  data: number[];
  color?: string;
}

export interface ChartData {
  type: 'bar' | 'line' | 'pie' | 'doughnut' | 'area';
  title: string;
  labels: string[];
  datasets: ChartDataset[];
}

export interface GeneratedImageData {
  prompt: string;
  imageUrl: string;
  aspectRatio: string;
  style: string;
  seed: number;
}

export interface Message {
  id: string;
  role: Role;
  content: string;
  reasoning?: string;
  timestamp: number;
  model?: string;
  attachments?: Attachment[];
  webSearchUsed?: boolean;
  feedback?: 'like' | 'dislike' | null;
  isStreaming?: boolean;
  intent?: string;
  followUpSuggestions?: string[];
  chartData?: ChartData;
  generatedImage?: GeneratedImageData;
}

export interface ChatThread {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
  modelId: string;
  systemPrompt?: string;
  isPinned?: boolean;
  folderId?: string;
  summary?: string;
}

export interface ModelOption {
  id: string;
  name: string;
  provider: 'OpenAI' | 'Anthropic' | 'Google' | 'DeepSeek';
  description: string;
  badge?: string;
  isReasoningModel?: boolean;
  contextWindow: string;
}

export interface GoogleAccountItem {
  id: string;
  name: string;
  email: string;
  avatar: string;
  isActive?: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  tier: 'Pro' | 'Enterprise' | 'Free';
  isGuest: boolean;
  isGoogleConnected?: boolean;
  googleId?: string;
  savedGoogleAccounts?: GoogleAccountItem[];
}

export interface AdminLog {
  id: string;
  timestamp: string;
  userEmail: string;
  model: string;
  tokens: number;
  latencyMs: number;
  status: '200 OK' | '429 RateLimit' | '500 Error';
}

export interface UserFeedback {
  id: string;
  user: string;
  rating: number;
  comment: string;
  date: string;
}

export interface AdminStats {
  totalUsers: number;
  totalQueries: number;
  totalTokens: number;
  avgLatencyMs: number;
  systemHealth: string;
  activeModels: number;
  recentLogs: AdminLog[];
  feedbacks: UserFeedback[];
}

export interface AITool {
  id: string;
  name: string;
  description: string;
  iconName: string;
  category: 'Development' | 'Career' | 'Research' | 'Data & Math' | 'Business' | 'Creative';
  promptTemplate: string;
  placeholder: string;
}

export interface CodeExecutionResult {
  code: string;
  language: string;
  output: string[];
  error?: string;
  executionTimeMs: number;
}
