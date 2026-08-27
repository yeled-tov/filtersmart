CREATE TABLE IF NOT EXISTS public.app_download_counters (
  app_slug TEXT PRIMARY KEY,
  downloads BIGINT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.app_download_counters TO anon, authenticated;
GRANT ALL ON public.app_download_counters TO service_role;

ALTER TABLE public.app_download_counters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view download counters"
ON public.app_download_counters FOR SELECT TO anon, authenticated USING (true);

INSERT INTO public.app_download_counters (app_slug, downloads)
VALUES ('filtertube', 0)
ON CONFLICT (app_slug) DO NOTHING;

CREATE OR REPLACE FUNCTION public.increment_app_download(_app_slug TEXT)
RETURNS BIGINT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _total BIGINT;
BEGIN
  INSERT INTO public.app_download_counters (app_slug, downloads, updated_at)
  VALUES (_app_slug, 1, now())
  ON CONFLICT (app_slug)
  DO UPDATE SET downloads = public.app_download_counters.downloads + 1, updated_at = now()
  RETURNING downloads INTO _total;
  RETURN _total;
END;
$$;

GRANT EXECUTE ON FUNCTION public.increment_app_download(TEXT) TO anon, authenticated;