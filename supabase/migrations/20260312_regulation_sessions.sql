-- Create regulation_sessions table to store user regulation tool interactions
CREATE TABLE IF NOT EXISTS regulation_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tool_type TEXT NOT NULL,
  tool_name TEXT,
  responses JSONB DEFAULT '{}',
  completed_steps INTEGER DEFAULT 0,
  total_steps INTEGER DEFAULT 0,
  is_complete BOOLEAN DEFAULT FALSE,
  duration_seconds INTEGER DEFAULT 0,
  insights TEXT[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster user queries
CREATE INDEX IF NOT EXISTS idx_regulation_sessions_user_id ON regulation_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_regulation_sessions_tool_type ON regulation_sessions(tool_type);
CREATE INDEX IF NOT EXISTS idx_regulation_sessions_created_at ON regulation_sessions(created_at DESC);

-- Enable RLS
ALTER TABLE regulation_sessions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own regulation sessions"
  ON regulation_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own regulation sessions"
  ON regulation_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own regulation sessions"
  ON regulation_sessions FOR UPDATE
  USING (auth.uid() = user_id);

-- Add wellness_scores column to profiles if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'wellness_scores'
  ) THEN
    ALTER TABLE profiles ADD COLUMN wellness_scores JSONB DEFAULT '{"mind": 60, "body": 60, "sleep": 60, "energy": 60, "mood": 60, "stress": 60, "focus": 60, "hydration": 60, "overall": 60}';
  END IF;
END $$;

-- Add alignment_score column to profiles if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'alignment_score'
  ) THEN
    ALTER TABLE profiles ADD COLUMN alignment_score INTEGER DEFAULT 60;
  END IF;
END $$;

-- Add last_checkin column to profiles if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'last_checkin'
  ) THEN
    ALTER TABLE profiles ADD COLUMN last_checkin TIMESTAMPTZ;
  END IF;
END $$;
