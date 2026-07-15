create type public.review_status as enum ('pending', 'published', 'rejected');

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  brand_id text not null check (brand_id ~ '^[a-z0-9-]{1,80}$'),
  display_name text not null check (char_length(display_name) between 2 and 50),
  rating smallint not null check (rating between 1 and 5),
  fit_result text not null check (fit_result in ('runsSmall', 'trueToSize', 'runsLarge')),
  garment_type text not null check (garment_type in ('tops_dresses', 'pants_bottoms', 'swimwear', 'intimates_lingerie')),
  user_size text check (user_size is null or char_length(user_size) <= 80),
  review_text text not null check (char_length(review_text) between 40 and 1000),
  status public.review_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index reviews_public_brand_created_idx
  on public.reviews (brand_id, created_at desc)
  where status = 'published';

alter table public.reviews enable row level security;

create policy "Anyone can read published reviews"
  on public.reviews
  for select
  to anon, authenticated
  using (status = 'published');

create policy "Visitors can submit pending reviews"
  on public.reviews
  for insert
  to anon, authenticated
  with check (status = 'pending');

revoke all on public.reviews from anon, authenticated;
grant select on public.reviews to anon, authenticated;
grant insert (
  brand_id,
  display_name,
  rating,
  fit_result,
  garment_type,
  user_size,
  review_text
) on public.reviews to anon, authenticated;

create table public.community_brands (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9-]{1,80}$'),
  name text not null check (char_length(name) between 2 and 80),
  category text not null check (category in ('premium_plus', 'mainstream', 'activewear', 'denim', 'swimwear', 'lingerie')),
  scale_system text not null check (scale_system in ('us_num', 'us_alpha', 'torrid', 'universal_standard', 'denim_waist', 'lingerie_bra')),
  fit_preference text not null check (fit_preference in ('generous', 'fitted', 'true_to_size')),
  price_tier smallint not null check (price_tier between 1 and 4),
  website_url text check (
    website_url is null
    or (char_length(website_url) <= 500 and website_url ~ '^https?://')
  ),
  aesthetic_tags text[] not null default '{}' check (cardinality(aesthetic_tags) <= 8),
  description text check (description is null or char_length(description) <= 800),
  status public.review_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index community_brands_public_name_idx
  on public.community_brands (name)
  where status = 'published';

alter table public.community_brands enable row level security;

create policy "Anyone can read published community brands"
  on public.community_brands
  for select
  to anon, authenticated
  using (status = 'published');

create policy "Visitors can suggest pending community brands"
  on public.community_brands
  for insert
  to anon, authenticated
  with check (status = 'pending');

revoke all on public.community_brands from anon, authenticated;
grant select on public.community_brands to anon, authenticated;
grant insert (
  slug,
  name,
  category,
  scale_system,
  fit_preference,
  price_tier,
  website_url,
  aesthetic_tags,
  description
) on public.community_brands to anon, authenticated;

create table public.brand_votes (
  id bigint generated always as identity primary key,
  brand_id text not null check (brand_id ~ '^[a-z0-9-]{1,80}$'),
  visitor_id uuid not null,
  vote_type text not null check (vote_type in ('up', 'down')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (brand_id, visitor_id)
);

alter table public.brand_votes enable row level security;
revoke all on public.brand_votes from anon, authenticated;

create or replace function public.get_brand_vote_totals()
returns table (brand_id text, votes_up bigint, votes_down bigint)
language sql
security definer
set search_path = ''
as $$
  select
    votes.brand_id,
    count(*) filter (where votes.vote_type = 'up') as votes_up,
    count(*) filter (where votes.vote_type = 'down') as votes_down
  from public.brand_votes as votes
  group by votes.brand_id;
$$;

create or replace function public.submit_brand_vote(
  p_brand_id text,
  p_visitor_id uuid,
  p_vote_type text
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if p_brand_id !~ '^[a-z0-9-]{1,80}$' then
    raise exception 'Invalid brand id';
  end if;

  if p_vote_type is null then
    delete from public.brand_votes as votes
    where votes.brand_id = p_brand_id and votes.visitor_id = p_visitor_id;
    return;
  end if;

  if p_vote_type not in ('up', 'down') then
    raise exception 'Invalid vote type';
  end if;

  insert into public.brand_votes (brand_id, visitor_id, vote_type)
  values (p_brand_id, p_visitor_id, p_vote_type)
  on conflict (brand_id, visitor_id)
  do update set vote_type = excluded.vote_type, updated_at = now();
end;
$$;

revoke all on function public.get_brand_vote_totals() from public;
revoke all on function public.submit_brand_vote(text, uuid, text) from public;
grant execute on function public.get_brand_vote_totals() to anon, authenticated;
grant execute on function public.submit_brand_vote(text, uuid, text) to anon, authenticated;

comment on table public.reviews is
  'Public community reviews. New submissions remain pending until approved in Supabase Studio.';

comment on table public.community_brands is
  'Community-suggested brands. New submissions remain pending until approved in Supabase Studio.';
