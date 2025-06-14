# Creem支付网关数据库迁移方案

## 📋 项目概述

将原有Supabase + Creem支付系统迁移到MkSaaS模板的Drizzle ORM架构中，实现统一的多支付提供商支持。

## 🔍 原有数据库结构分析

### 原项目表结构 (Supabase)

#### 1. customers表
```sql
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
```

#### 2. subscriptions表
```sql
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
```

#### 3. credits_history表
```sql
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
```

## 🎯 MkSaaS目标结构分析

### 当前MkSaaS表结构 (Drizzle)

#### 1. user表
```sql
CREATE TABLE "user" (
    "id" text PRIMARY KEY NOT NULL,
    "name" text NOT NULL,
    "email" text NOT NULL,
    "email_verified" boolean NOT NULL,
    "image" text,
    "created_at" timestamp NOT NULL,
    "updated_at" timestamp NOT NULL,
    "role" text,
    "banned" boolean,
    "ban_reason" text,
    "ban_expires" timestamp,
    "customer_id" text,
    CONSTRAINT "user_email_unique" UNIQUE("email")
);
```

#### 2. payment表
```sql
CREATE TABLE "payment" (
    "id" text PRIMARY KEY NOT NULL,
    "price_id" text NOT NULL,
    "type" text NOT NULL,
    "interval" text,
    "user_id" text NOT NULL,
    "customer_id" text NOT NULL,
    "subscription_id" text,
    "status" text NOT NULL,
    "period_start" timestamp,
    "period_end" timestamp,
    "cancel_at_period_end" boolean,
    "trial_start" timestamp,
    "trial_end" timestamp,
    "created_at" timestamp DEFAULT now() NOT NULL,
    "updated_at" timestamp DEFAULT now() NOT NULL
);
```

## 🔄 字段映射分析

### User表映射 (customers → user)

| 原customers字段 | MkSaaS user字段 | 处理方式 | 状态 |
|-----------------|----------------|----------|------|
| `user_id` | ❌ 不需要 | 直接使用user.id，无需关联 | ✅ 简化 |
| `email` | ✅ `email` | 直接复用现有字段 | ✅ 兼容 |
| `name` | ✅ `name` | 直接复用现有字段 | ✅ 兼容 |
| `creem_customer_id` | 🔧 需要添加 | 新增字段 | 🔧 扩展 |
| `country` | 🔧 需要添加 | 新增字段 | 🔧 扩展 |
| `credits` | 🔧 需要添加 | 新增字段 | 🔧 扩展 |
| `metadata` | 🔧 需要添加 | 新增字段 | 🔧 扩展 |
| `created_at/updated_at` | ✅ 已存在 | 直接复用 | ✅ 兼容 |

### Payment表映射 (subscriptions → payment)

| 原subscriptions字段 | MkSaaS payment字段 | 处理方式 | 状态 |
|---------------------|-------------------|----------|------|
| `customer_id` | `user_id` | 关联简化：直接使用user.id | ✅ 简化 |
| `creem_subscription_id` | `subscription_id` | 直接映射 | ✅ 兼容 |
| `creem_product_id` | `price_id` | 概念映射：产品ID→价格ID | ✅ 兼容 |
| `status` | `status` | 直接复用 | ✅ 兼容 |
| `current_period_start` | `period_start` | 直接映射 | ✅ 兼容 |
| `current_period_end` | `period_end` | 直接映射 | ✅ 兼容 |
| `trial_end` | `trial_end` | 直接映射 | ✅ 兼容 |
| `canceled_at` | 🔧 需要添加 | 新增字段 | 🔧 扩展 |
| `metadata` | 🔧 需要添加 | 新增字段 | 🔧 扩展 |
| `created_at/updated_at` | ✅ 已存在 | 直接复用 | ✅ 兼容 |

### Credits_History表映射

| 原字段 | 新字段 | 处理方式 | 状态 |
|--------|--------|----------|------|
| `customer_id` | `user_id` | 直接关联user表 | 🔄 调整 |
| 其他字段 | 保持不变 | 完整迁移 | ✅ 迁移 |

## 🚀 迁移策略

### 策略选择：扩展现有表结构

**优势：**
- ✅ 保持MkSaaS原有架构
- ✅ 最小化代码改动
- ✅ 统一的数据管理
- ✅ 性能最优（单表查询）
- ✅ 支持多支付提供商

**劣势：**
- 需要修改现有表结构
- 需要适配查询逻辑

## 📝 具体迁移步骤

### 第一步：扩展User表

```sql
-- 添加Creem客户相关字段
ALTER TABLE user ADD COLUMN creem_customer_id text UNIQUE;
ALTER TABLE user ADD COLUMN country text;
ALTER TABLE user ADD COLUMN credits integer DEFAULT 0 CHECK (credits >= 0);
ALTER TABLE user ADD COLUMN metadata jsonb DEFAULT '{}';

-- 添加索引
CREATE UNIQUE INDEX user_creem_customer_id_idx ON user(creem_customer_id);
CREATE INDEX user_credits_idx ON user(credits);
```

### 第二步：扩展Payment表

```sql
-- 添加Creem特有字段
ALTER TABLE payment ADD COLUMN canceled_at timestamp;
ALTER TABLE payment ADD COLUMN metadata jsonb DEFAULT '{}';

-- 添加索引
CREATE INDEX payment_canceled_at_idx ON payment(canceled_at);
CREATE INDEX payment_metadata_idx ON payment USING GIN(metadata);
```

### 第三步：创建Credits_History表

```sql
-- 创建积分历史表
CREATE TABLE credits_history (
    id text PRIMARY KEY,
    user_id text NOT NULL REFERENCES user(id) ON DELETE CASCADE,
    amount integer NOT NULL,
    type text NOT NULL CHECK (type IN ('add', 'subtract')),
    description text,
    creem_order_id text,
    created_at timestamp DEFAULT now() NOT NULL,
    metadata jsonb DEFAULT '{}'
);

-- 添加索引
CREATE INDEX credits_history_user_id_idx ON credits_history(user_id);
CREATE INDEX credits_history_created_at_idx ON credits_history(created_at);
CREATE INDEX credits_history_type_idx ON credits_history(type);
```

## 🔧 Drizzle Schema更新

### User表Schema
```typescript
export const user = pgTable("user", {
  // 现有字段...
  id: text("id").primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').notNull(),
  image: text('image'),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
  role: text('role'),
  banned: boolean('banned'),
  banReason: text('ban_reason'),
  banExpires: timestamp('ban_expires'),
  customerId: text('customer_id'),
  
  // 新增Creem字段
  creemCustomerId: text('creem_customer_id').unique(),
  country: text('country'),
  credits: integer('credits').default(0),
  metadata: jsonb('metadata').default('{}'),
});
```

### Payment表Schema
```typescript
export const payment = pgTable("payment", {
  // 现有字段...
  id: text("id").primaryKey(),
  priceId: text('price_id').notNull(),
  type: text('type').notNull(),
  interval: text('interval'),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  customerId: text('customer_id').notNull(),
  subscriptionId: text('subscription_id'),
  status: text('status').notNull(),
  periodStart: timestamp('period_start'),
  periodEnd: timestamp('period_end'),
  cancelAtPeriodEnd: boolean('cancel_at_period_end'),
  trialStart: timestamp('trial_start'),
  trialEnd: timestamp('trial_end'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  
  // 新增Creem字段
  canceledAt: timestamp('canceled_at'),
  metadata: jsonb('metadata').default('{}'),
});
```

### Credits_History表Schema
```typescript
export const creditsHistory = pgTable("credits_history", {
  id: text("id").primaryKey(),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  amount: integer('amount').notNull(),
  type: text('type').notNull(), // 'add' | 'subtract'
  description: text('description'),
  creemOrderId: text('creem_order_id'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  metadata: jsonb('metadata').default('{}'),
});
```

## 📊 数据迁移映射

### 业务逻辑映射

#### 用户数据
```typescript
// 原项目查询
const customer = await supabase
  .from('customers')
  .select('*, user:auth.users(*)')
  .eq('user_id', userId)

// 迁移后查询
const user = await db
  .select()
  .from(userTable)
  .where(eq(userTable.id, userId))
```

#### 订阅数据
```typescript
// 原项目查询
const subscription = await supabase
  .from('subscriptions')
  .select(`
    *,
    customer:customers(
      *,
      user:auth.users(*)
    )
  `)

// 迁移后查询
const payment = await db
  .select()
  .from(paymentTable)
  .where(eq(paymentTable.userId, userId))
```

#### 积分数据
```typescript
// 原项目查询
const credits = await supabase
  .from('customers')
  .select('credits')
  .eq('user_id', userId)

// 迁移后查询
const user = await db
  .select({ credits: userTable.credits })
  .from(userTable)
  .where(eq(userTable.id, userId))
```

## ⚠️ 注意事项

### 1. 数据类型转换
- UUID → Text：确保ID的唯一性和格式一致性
- Timestamp with time zone → Timestamp：注意时区处理

### 2. 约束条件
- 保持所有原有的CHECK约束
- 确保唯一性约束正确迁移
- 外键关系正确建立

### 3. 索引优化
- 为新增字段添加适当的索引
- 特别注意creem_customer_id的唯一索引
- 为查询频繁的字段添加索引

### 4. 向后兼容性
- 新增字段都设为可选或有默认值
- 不影响现有的Stripe支付功能
- 确保用户注册流程正常

## 🧪 测试计划

### 1. 数据完整性测试
- 验证所有字段正确迁移
- 检查约束条件是否生效
- 确认索引性能

### 2. 功能测试
- 用户注册流程
- Creem支付流程
- 积分系统功能
- 订阅管理功能

### 3. 性能测试
- 查询性能对比
- 并发访问测试
- 数据库负载测试

## 📈 迁移后的优势

### 1. 架构优势
- ✅ 统一的支付架构
- ✅ 支持多支付提供商
- ✅ 简化的查询逻辑
- ✅ 更好的性能

### 2. 维护优势
- ✅ 减少表间关系复杂性
- ✅ 统一的数据管理
- ✅ 更好的类型安全
- ✅ 简化的业务逻辑

### 3. 扩展优势
- ✅ 易于添加新的支付提供商
- ✅ 灵活的元数据支持
- ✅ 完整的审计追踪
- ✅ 强大的查询能力

## 🎯 总结

通过扩展现有的user和payment表，我们可以以最小的代价将Creem支付系统完美集成到MkSaaS架构中，同时保持系统的统一性和高性能。这个方案既保留了原有功能的完整性，又充分利用了MkSaaS的优秀架构设计。 