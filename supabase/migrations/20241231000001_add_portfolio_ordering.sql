-- Migration: Add sort_order and is_featured columns for portfolio management
-- Date: 2024-12-31

-- Add sort_order column for portfolio ordering
ALTER TABLE content ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;

-- Add is_featured column for homepage featured selection
ALTER TABLE content ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;

-- Create index for sort_order for performance
CREATE INDEX IF NOT EXISTS idx_content_sort_order ON content(sort_order);

-- Create index for featured content
CREATE INDEX IF NOT EXISTS idx_content_is_featured ON content(is_featured) WHERE is_featured = true;

-- Initialize sort_order based on existing created_at order for images
WITH ranked AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at DESC) as rn
  FROM content
  WHERE type = 'image'
)
UPDATE content
SET sort_order = ranked.rn
FROM ranked
WHERE content.id = ranked.id;
