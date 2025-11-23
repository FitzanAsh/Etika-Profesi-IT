-- SQL Script for Supabase AI Chatbot Setup
-- Run this in Supabase SQL Editor

-- ================================
-- 1. Enable pgvector extension
-- ================================
CREATE EXTENSION IF NOT EXISTS vector;

-- ================================
-- 2. Create embeddings table
-- ================================
CREATE TABLE IF NOT EXISTS embeddings (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  content_id int REFERENCES contents(id) ON DELETE CASCADE,
  chunk_text text NOT NULL,
  chunk_index int NOT NULL,
  embedding vector(384), -- Using 384 dimensions for compatibility
  metadata jsonb,
  created_at timestamptz DEFAULT now()
);

-- ================================
-- 3. Create index for vector similarity search
-- ================================
CREATE INDEX IF NOT EXISTS embeddings_vector_idx 
ON embeddings 
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- ================================
-- 4. Create index on content_id for faster joins
-- ================================
CREATE INDEX IF NOT EXISTS embeddings_content_id_idx 
ON embeddings(content_id);

-- ================================
-- 5. Create function for similarity search
-- ================================
CREATE OR REPLACE FUNCTION search_embeddings(
  query_embedding vector(384),
  match_threshold float DEFAULT 0.5,
  match_count int DEFAULT 5
)
RETURNS TABLE (
  id uuid,
  content_id int,
  chunk_text text,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    e.id,
    e.content_id,
    e.chunk_text,
    1 - (e.embedding <=> query_embedding) as similarity
  FROM embeddings e
  WHERE 1 - (e.embedding <=> query_embedding) > match_threshold
  ORDER BY e.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- ================================
-- 6. Grant permissions (adjust as needed)
-- ================================
-- GRANT SELECT, INSERT, UPDATE, DELETE ON embeddings TO authenticated;
-- GRANT SELECT ON embeddings TO anon;

-- ================================
-- 7. Enable Row Level Security (optional)
-- ================================
-- ALTER TABLE embeddings ENABLE ROW LEVEL SECURITY;

-- CREATE POLICY "Allow public read access" ON embeddings
--   FOR SELECT TO anon USING (true);

-- CREATE POLICY "Allow authenticated full access" ON embeddings
--   FOR ALL TO authenticated USING (true);

-- ================================
-- NOTES:
-- ================================
-- 1. After running this script, you need to populate the embeddings table
--    by calling: POST /api/admin/index-content
--
-- 2. The vector dimension is set to 384 (common for many embedding models)
--    Adjust if using a different embedding model
--
-- 3. The cosine distance operator (<=> ) is used for similarity search
--    Lower distance = higher similarity
--
-- 4. To use this from your API, you'll need to modify the vector-store.ts
--    to use Supabase queries instead of in-memory storage
