-- ====================================================
-- ⚡ Zero Gravity Bot — Supabase SQL Database Schema
-- Project Reference: vcvdblkdeqatvzdgidic
-- ====================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. User Profiles Table
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    avatar TEXT,
    tier TEXT DEFAULT 'Pro',
    google_accounts JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Chat Threads Table
CREATE TABLE IF NOT EXISTS public.chat_threads (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    model_id TEXT DEFAULT 'llama-3.3-70b-versatile',
    created_at BIGINT NOT NULL,
    updated_at BIGINT NOT NULL
);

-- 4. Messages Table
CREATE TABLE IF NOT EXISTS public.messages (
    id TEXT PRIMARY KEY,
    thread_id TEXT REFERENCES public.chat_threads(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    model TEXT,
    intent TEXT,
    timestamp BIGINT NOT NULL,
    follow_up_suggestions JSONB DEFAULT '[]'::jsonb
);

-- 5. Create Performance Indexes
CREATE INDEX IF NOT EXISTS idx_chat_threads_user_id ON public.chat_threads(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_thread_id ON public.messages(thread_id);

-- 6. Enable Row Level Security (RLS)
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- 7. Public Access Policies for Anonymous / Authenticated Session Sync
CREATE POLICY "Allow public read access to user_profiles" ON public.user_profiles FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update to user_profiles" ON public.user_profiles FOR ALL USING (true);

CREATE POLICY "Allow public access to chat_threads" ON public.chat_threads FOR ALL USING (true);
CREATE POLICY "Allow public access to messages" ON public.messages FOR ALL USING (true);
