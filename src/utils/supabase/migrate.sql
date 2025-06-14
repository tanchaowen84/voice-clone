-- Enable RLS (Row Level Security)
alter table auth.users enable row level security;

-- Create customers table to link Supabase users with Creem customers
create table public.customers (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users(id) on delete cascade not null,
    creem_customer_id text not null unique,
    email text not null,
    name text,
    country text,
    credits integer default 0 not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    metadata jsonb default '{}'::jsonb,
    constraint customers_email_match check (email = lower(email)),
    constraint credits_non_negative check (credits >= 0)
);

-- Create credits_history table to track credit transactions
create table public.credits_history (
    id uuid primary key default uuid_generate_v4(),
    customer_id uuid references public.customers(id) on delete cascade not null,
    amount integer not null,
    type text not null check (type in ('add', 'subtract')),
    description text,
    creem_order_id text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    metadata jsonb default '{}'::jsonb
);

-- Create subscriptions table
create table public.subscriptions (
    id uuid primary key default uuid_generate_v4(),
    customer_id uuid references public.customers(id) on delete cascade not null,
    creem_subscription_id text not null unique,
    creem_product_id text not null,
    status text not null check (status in ('incomplete', 'expired', 'active', 'past_due', 'canceled', 'unpaid', 'paused', 'trialing')),
    current_period_start timestamp with time zone not null,
    current_period_end timestamp with time zone not null,
    canceled_at timestamp with time zone,
    trial_end timestamp with time zone,
    metadata jsonb default '{}'::jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create indexes
create index customers_user_id_idx on public.customers(user_id);
create index customers_creem_customer_id_idx on public.customers(creem_customer_id);
create index subscriptions_customer_id_idx on public.subscriptions(customer_id);
create index subscriptions_status_idx on public.subscriptions(status);

-- Create indexes for credits_history
create index credits_history_customer_id_idx on public.credits_history(customer_id);
create index credits_history_created_at_idx on public.credits_history(created_at);

-- Create updated_at trigger function
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$ language plpgsql security definer;

-- Create updated_at triggers
create trigger handle_customers_updated_at
    before update on public.customers
    for each row
    execute function public.handle_updated_at();

create trigger handle_subscriptions_updated_at
    before update on public.subscriptions
    for each row
    execute function public.handle_updated_at();

-- Create RLS policies
-- Customers policies
create policy "Users can view their own customer data"
    on public.customers for select
    using (auth.uid() = user_id);

create policy "Users can update their own customer data"
    on public.customers for update
    using (auth.uid() = user_id);

-- Add policy for service role to insert/update customer data
create policy "Service role can manage customer data"
    on public.customers for all
    using (auth.role() = 'service_role');

-- Subscriptions policies
create policy "Users can view their own subscriptions"
    on public.subscriptions for select
    using (
        exists (
            select 1 from public.customers
            where customers.id = subscriptions.customer_id
            and customers.user_id = auth.uid()
        )
    );

-- Add policy for service role to manage subscriptions
create policy "Service role can manage subscriptions"
    on public.subscriptions for all
    using (auth.role() = 'service_role');

-- Credits history policies
create policy "Users can view their own credits history"
    on public.credits_history for select
    using (
        exists (
            select 1 from public.customers
            where customers.id = credits_history.customer_id
            and customers.user_id = auth.uid()
        )
    );

create policy "Service role can manage credits history"
    on public.credits_history for all
    using (auth.role() = 'service_role');

-- Ensure tables are accessible by service role
grant all on public.customers to service_role;
grant all on public.subscriptions to service_role;
grant all on public.credits_history to service_role; 