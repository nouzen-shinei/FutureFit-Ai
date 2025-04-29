/*
  # Create tables for career data

  1. New Tables
    - market_demand: Stores historical market demand and supply data for careers
    - career_reviews: Stores user reviews and ratings for careers
    - job_news: Stores job postings and career-related news

  2. Security
    - Enable RLS on all tables
    - Add public read-only access policies
    
  3. Indexes
    - Add indexes for frequently queried columns
*/

-- Market Demand Table
CREATE TABLE IF NOT EXISTS market_demand (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  career_title text NOT NULL,
  year integer NOT NULL,
  demand_score integer NOT NULL CHECK (demand_score BETWEEN 0 AND 100),
  supply_score integer NOT NULL CHECK (supply_score BETWEEN 0 AND 100),
  created_at timestamptz DEFAULT now(),
  UNIQUE(career_title, year)
);

ALTER TABLE market_demand ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Allow public read access to market demand data"
    ON market_demand
    FOR SELECT
    TO public
    USING (true);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Career Reviews Table
CREATE TABLE IF NOT EXISTS career_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  career_title text NOT NULL,
  rating integer NOT NULL CHECK (rating BETWEEN 1 AND 5),
  author text NOT NULL,
  text text NOT NULL,
  pros text[] NOT NULL DEFAULT '{}',
  cons text[] NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE career_reviews ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Allow public read access to career reviews"
    ON career_reviews
    FOR SELECT
    TO public
    USING (true);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Job News Table
CREATE TABLE IF NOT EXISTS job_news (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  career_title text NOT NULL,
  title text NOT NULL,
  company text NOT NULL,
  location text NOT NULL,
  description text,
  url text,
  salary text,
  type text CHECK (type IN ('job', 'news', 'event')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE job_news ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Allow public read access to job news"
    ON job_news
    FOR SELECT
    TO public
    USING (true);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Add indexes for frequently queried columns
CREATE INDEX IF NOT EXISTS idx_market_demand_career_title ON market_demand(career_title);
CREATE INDEX IF NOT EXISTS idx_career_reviews_career_title ON career_reviews(career_title);
CREATE INDEX IF NOT EXISTS idx_job_news_career_title ON job_news(career_title);
CREATE INDEX IF NOT EXISTS idx_job_news_created_at ON job_news(created_at DESC);