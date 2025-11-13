-- Create the system "uncategorized" collection for each user
-- This collection will hold artifacts that don't belong to a specific user-created collection

-- First, create uncategorized collections for all existing users
INSERT INTO collections (id, user_id, title, description, slug, is_public, created_at, updated_at)
SELECT 
  gen_random_uuid(),
  id as user_id,
  'Uncategorized Artifacts' as title,
  'This collection holds your uncategorized artifacts — items you''ve created without assigning a collection, or ones that remained after a collection was deleted.' as description,
  'uncategorized' as slug,
  false as is_public,
  NOW() as created_at,
  NOW() as updated_at
FROM auth.users
WHERE NOT EXISTS (
  SELECT 1 FROM collections 
  WHERE collections.user_id = auth.users.id 
  AND collections.slug = 'uncategorized'
);

-- Update all artifacts with null collection_id to point to their user's uncategorized collection
UPDATE artifacts
SET collection_id = (
  SELECT id FROM collections 
  WHERE collections.user_id = artifacts.user_id 
  AND collections.slug = 'uncategorized'
  LIMIT 1
)
WHERE collection_id IS NULL;
