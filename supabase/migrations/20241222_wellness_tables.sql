-- Wellness Check-ins table
CREATE TABLE IF NOT EXISTS wellness_checkins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  answers JSONB,
  scores JSONB,
  concerns TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Wellness Chat Logs table
CREATE TABLE IF NOT EXISTS wellness_chat_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT,
  emotion_score INTEGER,
  emotion TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add wellness columns to profiles if they don't exist
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS wellness_scores JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS last_checkin TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS current_mood_score INTEGER DEFAULT 60,
ADD COLUMN IF NOT EXISTS last_chat TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS recommended_services TEXT[] DEFAULT '{}';

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_wellness_checkins_user_id ON wellness_checkins(user_id);
CREATE INDEX IF NOT EXISTS idx_wellness_checkins_created_at ON wellness_checkins(created_at);
CREATE INDEX IF NOT EXISTS idx_wellness_chat_logs_user_id ON wellness_chat_logs(user_id);

-- Row Level Security
ALTER TABLE wellness_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE wellness_chat_logs ENABLE ROW LEVEL SECURITY;

-- Policies for wellness_checkins
CREATE POLICY "Users can view own checkins" ON wellness_checkins
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own checkins" ON wellness_checkins
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policies for wellness_chat_logs  
CREATE POLICY "Users can view own chat logs" ON wellness_chat_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own chat logs" ON wellness_chat_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);
