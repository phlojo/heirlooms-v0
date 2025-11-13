-- Migration: Consolidate all uncategorized artifacts
-- This script handles existing uncategorized collections and migrates null artifacts

-- Step 1: First, let's move all NULL collection_id artifacts to existing uncategorized collections
UPDATE artifacts
SET collection_id = (
  SELECT c.id 
  FROM collections c
  WHERE c.user_id = artifacts.user_id 
  AND c.slug = 'uncategorized'
  LIMIT 1
)
WHERE collection_id IS NULL
AND EXISTS (
  SELECT 1 FROM collections c
  WHERE c.user_id = artifacts.user_id 
  AND c.slug = 'uncategorized'
);

-- Step 2: For users without an uncategorized collection, create one
DO $$
DECLARE
  user_record RECORD;
  new_collection_id UUID;
BEGIN
  FOR user_record IN 
    SELECT DISTINCT a.user_id
    FROM artifacts a
    WHERE a.collection_id IS NULL
    AND NOT EXISTS (
      SELECT 1 FROM collections c
      WHERE c.user_id = a.user_id 
      AND c.slug = 'uncategorized'
    )
  LOOP
    -- Create uncategorized collection for this user
    INSERT INTO collections (user_id, title, description, slug, is_public)
    VALUES (
      user_record.user_id,
      'Uncategorized Artifacts',
      'This collection holds your uncategorized artifacts — items you''ve created without assigning a collection, or ones that remained after a collection was deleted.',
      'uncategorized',
      false
    )
    RETURNING id INTO new_collection_id;
    
    -- Move artifacts to this new collection
    UPDATE artifacts
    SET collection_id = new_collection_id
    WHERE user_id = user_record.user_id 
    AND collection_id IS NULL;
  END LOOP;
END $$;

-- Step 3: Remove duplicate uncategorized collections per user (keep oldest)
DELETE FROM collections
WHERE slug = 'uncategorized'
AND id NOT IN (
  SELECT MIN(id)
  FROM collections
  WHERE slug = 'uncategorized'
  GROUP BY user_id
);
