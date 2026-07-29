-- Добавляет дополнительные метаданные для offers, если колонки ещё отсутствуют.
-- Запускайте на целевой базе Supabase до развёртывания нового кода.

ALTER TABLE public.offers ADD COLUMN IF NOT EXISTS interest_free_term text;
ALTER TABLE public.offers ADD COLUMN IF NOT EXISTS decision_time text;
ALTER TABLE public.offers ADD COLUMN IF NOT EXISTS min_age integer;
ALTER TABLE public.offers ADD COLUMN IF NOT EXISTS max_age integer;
ALTER TABLE public.offers ADD COLUMN IF NOT EXISTS issue_method text;
ALTER TABLE public.offers ADD COLUMN IF NOT EXISTS additional_features text[];
