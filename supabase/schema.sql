create extension if not exists "pgcrypto";

create table if not exists public.offers (
  id uuid primary key default gen_random_uuid(),
  company text,
  product_name text,
  category text,
  affiliate_url text,
  logo text,
  description text,
  amount_min numeric,
  amount_max numeric,
  term_min integer,
  term_max integer,
  rate text,
  first_loan text,
  interest_free_term text,
  decision_time text,
  min_age integer,
  max_age integer,
  issue_method text,
  additional_features text[],
  credit_limit text,
  cashback text,
  service_cost text,
  features text[],
  badge text,
  priority integer not null default 0,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.offers add column if not exists company text;
alter table public.offers add column if not exists product_name text;
alter table public.offers add column if not exists affiliate_url text;
alter table public.offers add column if not exists logo text;
alter table public.offers add column if not exists description text;
alter table public.offers add column if not exists amount_min numeric;
alter table public.offers add column if not exists amount_max numeric;
alter table public.offers add column if not exists term_min integer;
alter table public.offers add column if not exists term_max integer;
alter table public.offers add column if not exists rate text;
alter table public.offers add column if not exists first_loan text;
alter table public.offers add column if not exists interest_free_term text;
alter table public.offers add column if not exists decision_time text;
alter table public.offers add column if not exists min_age integer;
alter table public.offers add column if not exists max_age integer;
alter table public.offers add column if not exists issue_method text;
alter table public.offers add column if not exists additional_features text[];
alter table public.offers add column if not exists credit_limit text;
alter table public.offers add column if not exists cashback text;
alter table public.offers add column if not exists service_cost text;
alter table public.offers add column if not exists features text[];
alter table public.offers add column if not exists badge text;
alter table public.offers add column if not exists priority integer not null default 0;
alter table public.offers add column if not exists is_published boolean not null default false;
alter table public.offers add column if not exists created_at timestamptz not null default now();
alter table public.offers add column if not exists updated_at timestamptz not null default now();

alter table public.offers alter column slug drop not null;
alter table public.offers alter column partner_name drop not null;
alter table public.offers alter column title drop not null;
alter table public.offers alter column description drop not null;
alter table public.offers alter column rate_text drop not null;
alter table public.offers alter column amount_text drop not null;
alter table public.offers alter column term_text drop not null;
alter table public.offers alter column partner_url drop not null;

alter table public.offers drop constraint if exists offers_category_check;
alter table public.offers drop constraint if exists offers_partner_url_check;
alter table public.leads drop constraint if exists leads_category_check;

update public.offers
set company = coalesce(company, partner_name),
    product_name = coalesce(product_name, title),
    affiliate_url = coalesce(affiliate_url, partner_url),
    priority = coalesce(priority, sort_order, 0),
    is_published = coalesce(is_published, false)
where company is null or product_name is null or affiliate_url is null;

create index if not exists offers_published_priority_idx on public.offers (is_published, priority desc, updated_at desc);
create unique index if not exists offers_company_normalized_idx on public.offers ((lower(trim(company)))) where company is not null;

create or replace function public.set_offers_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists offers_set_updated_at on public.offers;
create trigger offers_set_updated_at before update on public.offers for each row execute function public.set_offers_updated_at();

alter table public.offers enable row level security;
drop policy if exists "Published offers are publicly readable" on public.offers;
create policy "Published offers are publicly readable" on public.offers for select using (is_published = true);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 80),
  phone text not null check (phone ~ '^\\+[1-9][0-9]{9,14}$'),
  amount integer check (amount is null or amount between 1000 and 10000000),
  term integer check (term is null or term between 1 and 3650),
  category text not null,
  consent boolean not null check (consent),
  created_at timestamptz not null default now()
);

alter table public.leads enable row level security;
