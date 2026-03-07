
ALTER TABLE public.blog_posts 
  ADD COLUMN IF NOT EXISTS category text DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS featured_image text DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS meta_title text DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS meta_description text DEFAULT NULL;

ALTER TABLE public.services
  ADD COLUMN IF NOT EXISTS emoji_icon text DEFAULT '🛡️',
  ADD COLUMN IF NOT EXISTS is_popular boolean DEFAULT false;
