-- ENUMS
create type public.app_role as enum ('admin', 'customer');
create type public.order_status as enum ('pending', 'confirmed', 'packed', 'out_for_delivery', 'delivered', 'cancelled');

-- PROFILES
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  avatar_url text,
  default_address text,
  city text,
  pincode text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);

-- USER ROLES
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create policy "user_roles_select_own_or_admin" on public.user_roles for select using (auth.uid() = user_id or public.has_role(auth.uid(), 'admin'));
create policy "user_roles_admin_all" on public.user_roles for all using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

-- CATEGORIES
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  icon text,
  display_order int not null default 0,
  created_at timestamptz not null default now()
);
alter table public.categories enable row level security;
create policy "categories_public_read" on public.categories for select using (true);
create policy "categories_admin_write" on public.categories for all using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

-- PRODUCTS
create table public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories(id) on delete set null,
  name text not null,
  slug text not null unique,
  description text,
  image_url text,
  price_inr numeric(10,2) not null check (price_inr >= 0),
  mrp_inr numeric(10,2),
  unit text not null default '1 kg',
  stock_qty int not null default 0 check (stock_qty >= 0),
  low_stock_threshold int not null default 10,
  rating numeric(2,1) not null default 4.5 check (rating between 0 and 5),
  rating_count int not null default 0,
  is_trending boolean not null default false,
  is_featured boolean not null default false,
  is_active boolean not null default true,
  tags text[] default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.products enable row level security;
create policy "products_public_read" on public.products for select using (is_active = true or public.has_role(auth.uid(), 'admin'));
create policy "products_admin_write" on public.products for all using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

create index idx_products_category on public.products(category_id);
create index idx_products_trending on public.products(is_trending) where is_trending = true;
create index idx_products_featured on public.products(is_featured) where is_featured = true;

-- CART
create table public.cart_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  quantity int not null default 1 check (quantity > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, product_id)
);
alter table public.cart_items enable row level security;
create policy "cart_select_own" on public.cart_items for select using (auth.uid() = user_id);
create policy "cart_insert_own" on public.cart_items for insert with check (auth.uid() = user_id);
create policy "cart_update_own" on public.cart_items for update using (auth.uid() = user_id);
create policy "cart_delete_own" on public.cart_items for delete using (auth.uid() = user_id);

-- WISHLIST
create table public.wishlist_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, product_id)
);
alter table public.wishlist_items enable row level security;
create policy "wishlist_select_own" on public.wishlist_items for select using (auth.uid() = user_id);
create policy "wishlist_insert_own" on public.wishlist_items for insert with check (auth.uid() = user_id);
create policy "wishlist_delete_own" on public.wishlist_items for delete using (auth.uid() = user_id);

-- ORDERS
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  status public.order_status not null default 'pending',
  subtotal_inr numeric(10,2) not null default 0,
  delivery_fee_inr numeric(10,2) not null default 0,
  total_inr numeric(10,2) not null default 0,
  delivery_address text,
  delivery_city text,
  delivery_pincode text,
  estimated_delivery_minutes int,
  payment_status text not null default 'pending',
  payment_intent_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.orders enable row level security;
create policy "orders_select_own_or_admin" on public.orders for select using (auth.uid() = user_id or public.has_role(auth.uid(), 'admin'));
create policy "orders_insert_own" on public.orders for insert with check (auth.uid() = user_id);
create policy "orders_update_admin" on public.orders for update using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid not null references public.products(id),
  product_name text not null,
  unit_price_inr numeric(10,2) not null,
  quantity int not null check (quantity > 0),
  line_total_inr numeric(10,2) not null,
  created_at timestamptz not null default now()
);
alter table public.order_items enable row level security;
create policy "order_items_select_own_or_admin" on public.order_items for select using (
  exists (select 1 from public.orders o where o.id = order_id and (o.user_id = auth.uid() or public.has_role(auth.uid(), 'admin')))
);
create policy "order_items_insert_own" on public.order_items for insert with check (
  exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid())
);

-- updated_at trigger
create or replace function public.set_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end; $$;

create trigger trg_profiles_updated before update on public.profiles for each row execute function public.set_updated_at();
create trigger trg_products_updated before update on public.products for each row execute function public.set_updated_at();
create trigger trg_cart_updated before update on public.cart_items for each row execute function public.set_updated_at();
create trigger trg_orders_updated before update on public.orders for each row execute function public.set_updated_at();

-- Auto-create profile + default role on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name) values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''));
  insert into public.user_roles (user_id, role) values (new.id, 'customer');
  return new;
end; $$;

create trigger on_auth_user_created after insert on auth.users
for each row execute function public.handle_new_user();

-- SEED CATEGORIES
insert into public.categories (slug, name, description, icon, display_order) values
  ('fruits', 'Fresh Fruits', 'Seasonal and exotic fruits', '🍎', 1),
  ('vegetables', 'Vegetables', 'Farm-fresh daily vegetables', '🥬', 2),
  ('dairy', 'Dairy & Eggs', 'Milk, cheese, butter and eggs', '🥛', 3),
  ('bakery', 'Bakery', 'Fresh breads and pastries', '🥖', 4),
  ('snacks', 'Snacks', 'Chips, biscuits and munchies', '🍿', 5),
  ('beverages', 'Beverages', 'Juices, sodas and more', '🥤', 6),
  ('staples', 'Staples', 'Rice, dal, atta and oils', '🌾', 7),
  ('personal-care', 'Personal Care', 'Daily essentials', '🧴', 8);

-- SEED PRODUCTS
with c as (select id, slug from public.categories)
insert into public.products (category_id, name, slug, description, image_url, price_inr, mrp_inr, unit, stock_qty, rating, rating_count, is_trending, is_featured, tags) values
  ((select id from c where slug='fruits'), 'Royal Gala Apples', 'royal-gala-apples', 'Crisp & sweet imported apples', 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=600', 189, 220, '1 kg', 50, 4.7, 312, true, true, '{"organic","imported"}'),
  ((select id from c where slug='fruits'), 'Cavendish Bananas', 'bananas', 'Ripe yellow bananas', 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600', 59, 75, '1 dozen', 120, 4.5, 540, true, true, '{"daily"}'),
  ((select id from c where slug='fruits'), 'Alphonso Mangoes', 'alphonso-mangoes', 'King of mangoes from Ratnagiri', 'https://images.unsplash.com/photo-1605027990121-cbae9e0642db?w=600', 599, 799, '1 kg', 30, 4.9, 220, true, true, '{"premium","seasonal"}'),
  ((select id from c where slug='fruits'), 'Pomegranate', 'pomegranate', 'Juicy ruby seeds', 'https://images.unsplash.com/photo-1541344999736-83eca272f6fc?w=600', 149, 180, '1 kg', 40, 4.6, 145, false, false, '{}'),
  ((select id from c where slug='vegetables'), 'Roma Tomatoes', 'tomatoes', 'Fresh red tomatoes', 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600', 39, 50, '1 kg', 80, 4.4, 410, true, true, '{"daily"}'),
  ((select id from c where slug='vegetables'), 'Onions', 'onions', 'Premium quality onions', 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600', 35, 45, '1 kg', 200, 4.3, 820, false, true, '{"daily"}'),
  ((select id from c where slug='vegetables'), 'Baby Spinach', 'baby-spinach', 'Tender hydroponic leaves', 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600', 49, 60, '200 g', 60, 4.6, 95, true, false, '{"organic"}'),
  ((select id from c where slug='vegetables'), 'Bell Peppers Mix', 'bell-peppers', 'Red, yellow & green', 'https://images.unsplash.com/photo-1525607551316-4a8e16d1f9ba?w=600', 99, 130, '500 g', 45, 4.5, 78, false, false, '{}'),
  ((select id from c where slug='dairy'), 'Amul Gold Milk', 'amul-gold', 'Full cream milk 1L', 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=600', 68, 70, '1 L', 150, 4.8, 1200, true, true, '{"daily"}'),
  ((select id from c where slug='dairy'), 'Farm Eggs (12)', 'farm-eggs', 'Free-range brown eggs', 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=600', 119, 140, '12 pcs', 90, 4.7, 530, false, true, '{"protein"}'),
  ((select id from c where slug='dairy'), 'Cheddar Cheese Block', 'cheddar', 'Aged cheddar 200g', 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=600', 249, 299, '200 g', 35, 4.6, 88, false, false, '{}'),
  ((select id from c where slug='bakery'), 'Sourdough Loaf', 'sourdough', 'Artisan sourdough bread', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600', 189, 220, '450 g', 25, 4.8, 156, true, true, '{"artisan"}'),
  ((select id from c where slug='bakery'), 'Whole Wheat Bread', 'wheat-bread', 'Soft whole wheat loaf', 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=600', 55, 65, '400 g', 80, 4.4, 340, false, true, '{"daily"}'),
  ((select id from c where slug='snacks'), 'Lays Classic Salted', 'lays-classic', 'Crispy potato chips', 'https://images.unsplash.com/photo-1613919113640-25732ec5e61f?w=600', 20, 25, '52 g', 300, 4.3, 980, false, false, '{}'),
  ((select id from c where slug='snacks'), 'Dark Chocolate 70%', 'dark-choc', 'Belgian dark chocolate', 'https://images.unsplash.com/photo-1623660053975-cf75a8be0908?w=600', 299, 350, '100 g', 40, 4.7, 210, true, true, '{"premium"}'),
  ((select id from c where slug='beverages'), 'Cold-Pressed Orange', 'orange-juice', 'Fresh OJ no preservatives', 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=600', 159, 199, '1 L', 50, 4.6, 175, true, true, '{"fresh"}'),
  ((select id from c where slug='beverages'), 'Green Tea Box', 'green-tea', 'Premium loose-leaf tea', 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600', 349, 399, '100 g', 60, 4.5, 92, false, false, '{}'),
  ((select id from c where slug='staples'), 'Basmati Rice Premium', 'basmati', 'Long grain aged basmati', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600', 489, 599, '5 kg', 80, 4.8, 412, true, true, '{"premium"}'),
  ((select id from c where slug='staples'), 'Toor Dal', 'toor-dal', 'Premium yellow dal', 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=600', 169, 199, '1 kg', 100, 4.5, 280, false, false, '{}'),
  ((select id from c where slug='personal-care'), 'Aloe Vera Body Wash', 'aloe-wash', 'Gentle daily cleanser', 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600', 249, 299, '500 ml', 70, 4.4, 65, false, false, '{}');