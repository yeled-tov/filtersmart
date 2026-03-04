
-- Role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- User roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Helper function to check admin
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Convenience wrapper
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), 'admin')
$$;

-- user_roles policies
CREATE POLICY "Admins can view roles" ON public.user_roles FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Services table
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  short_desc TEXT,
  description TEXT,
  price TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'filtering',
  logo_url TEXT,
  features JSONB DEFAULT '[]'::jsonb,
  visible BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read visible services" ON public.services FOR SELECT USING (visible = true OR public.is_admin());
CREATE POLICY "Admins can insert services" ON public.services FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update services" ON public.services FOR UPDATE TO authenticated USING (public.is_admin());
CREATE POLICY "Admins can delete services" ON public.services FOR DELETE TO authenticated USING (public.is_admin());

-- Blog posts table
CREATE TABLE public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  excerpt TEXT,
  published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read published posts" ON public.blog_posts FOR SELECT USING (published = true OR public.is_admin());
CREATE POLICY "Admins can insert posts" ON public.blog_posts FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update posts" ON public.blog_posts FOR UPDATE TO authenticated USING (public.is_admin());
CREATE POLICY "Admins can delete posts" ON public.blog_posts FOR DELETE TO authenticated USING (public.is_admin());

-- Contact submissions
CREATE TABLE public.contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit contact" ON public.contact_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view submissions" ON public.contact_submissions FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "Admins can update submissions" ON public.contact_submissions FOR UPDATE TO authenticated USING (public.is_admin());
CREATE POLICY "Admins can delete submissions" ON public.contact_submissions FOR DELETE TO authenticated USING (public.is_admin());

-- Site settings (key-value)
CREATE TABLE public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Admins can insert settings" ON public.site_settings FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update settings" ON public.site_settings FOR UPDATE TO authenticated USING (public.is_admin());
CREATE POLICY "Admins can delete settings" ON public.site_settings FOR DELETE TO authenticated USING (public.is_admin());

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON public.blog_posts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
