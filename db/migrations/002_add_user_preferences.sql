-- Migration: Add User Preferences Table
-- Version: 002
-- Description: Add table for storing user travel preferences and interests

BEGIN;

CREATE TABLE user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  traveler_id UUID NOT NULL REFERENCES travelers(id) ON DELETE CASCADE,
  preferred_climate VARCHAR(50),
  preferred_budget_range VARCHAR(50),
  preferred_trip_duration INTEGER,
  interested_activities TEXT[],
  dietary_restrictions TEXT[],
  mobility_requirements VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_preferences_traveler_id ON user_preferences(traveler_id);

COMMIT;
