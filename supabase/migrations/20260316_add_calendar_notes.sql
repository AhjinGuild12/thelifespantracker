-- Add calendar_notes column to user_data table
ALTER TABLE user_data
ADD COLUMN calendar_notes JSONB DEFAULT '[]'::jsonb;
