CREATE TABLE user_data (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  birth_date TEXT,
  people JSONB DEFAULT '[]'::jsonb,
  custom_experiences JSONB DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE user_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own data" ON user_data
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own data" ON user_data
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own data" ON user_data
  FOR UPDATE USING (auth.uid() = id);
