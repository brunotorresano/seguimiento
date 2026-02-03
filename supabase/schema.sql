-- Create the daily_scores table
create table daily_scores (
  date date primary key,
  teeth int check (teeth >= 0 and teeth <= 10) default 0,
  food int check (food >= 0 and food <= 10) default 0,
  sport int check (sport >= 0 and sport <= 10) default 0,
  notes text,
  updated_at timestamp with time zone default now()
);

-- Enable Row Level Security (RLS)
-- We will enable it but create public policies for non-authenticated users
alter table daily_scores enable row level security;

-- Create policy to allow anyone to select
create policy "Public Select" on daily_scores for select using (true);

-- Create policy to allow anyone to insert/upsert
create policy "Public Insert" on daily_scores for insert with check (true);

-- Create policy to allow anyone to update
create policy "Public Update" on daily_scores for update using (true);

-- Create policy to allow anyone to delete
create policy "Public Delete" on daily_scores for delete using (true);

-- Note: Since we use UPSERT (Insert or Update), both Insert and Update policies are needed.
-- In some Supabase setups, you might also need a Delete policy if you ever delete rows.
