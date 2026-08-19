-- Biometric readings from wearable band
CREATE TABLE IF NOT EXISTS biometric_readings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  device_id TEXT,
  reading_type TEXT NOT NULL,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  synced_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  value JSONB DEFAULT '{}',
  metadata JSONB DEFAULT '{}'
);

-- Computed emotional snapshots combining biometrics, check-ins, and behavior
CREATE TABLE IF NOT EXISTS emotional_snapshots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  snapshot_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  inputs JSONB DEFAULT '{}',
  emotional_state JSONB DEFAULT '{}',
  emotion_label TEXT,
  eli_score INTEGER,
  suggestions JSONB DEFAULT '[]',
  provider_matches JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_biometric_readings_user_id ON biometric_readings(user_id);
CREATE INDEX IF NOT EXISTS idx_biometric_readings_type ON biometric_readings(reading_type);
CREATE INDEX IF NOT EXISTS idx_biometric_readings_recorded_at ON biometric_readings(recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_biometric_readings_synced_at ON biometric_readings(synced_at DESC);

CREATE INDEX IF NOT EXISTS idx_emotional_snapshots_user_id ON emotional_snapshots(user_id);
CREATE INDEX IF NOT EXISTS idx_emotional_snapshots_snapshot_at ON emotional_snapshots(snapshot_at DESC);

-- Row Level Security
ALTER TABLE biometric_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE emotional_snapshots ENABLE ROW LEVEL SECURITY;

-- Policies for biometric_readings
CREATE POLICY "Users can view own biometric readings"
  ON biometric_readings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own biometric readings"
  ON biometric_readings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own biometric readings"
  ON biometric_readings FOR DELETE
  USING (auth.uid() = user_id);

-- Policies for emotional_snapshots
CREATE POLICY "Users can view own emotional snapshots"
  ON emotional_snapshots FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own emotional snapshots"
  ON emotional_snapshots FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own emotional snapshots"
  ON emotional_snapshots FOR DELETE
  USING (auth.uid() = user_id);
