# Creem Webhook 混合架构实施计划

## 📋 项目概述

将原项目中基于Supabase的Creem webhook处理系统迁移到MkSaaS的混合架构中，实现统一的支付提供商接口，同时保持功能完整性和代码可维护性。

## 🏗️ 架构设计

### 混合架构流程
```
Creem Webhook → API Route (简化) → CreemProvider.handleWebhookEvent → Drizzle DB Operations
```

### 职责分离
- **API路由** (`src/app/api/webhooks/creem/route.ts`): HTTP请求处理、基础验证
- **CreemProvider** (`src/payment/provider/creem.ts`): 业务逻辑处理、事件分发
- **数据库操作** (`src/utils/drizzle/creem-operations.ts`): 统一的Drizzle数据库操作

## ⚠️ **重要注意事项**

### 🔧 **关键修正点**
1. **数据表结构差异**: MkSaaS使用统一表结构，不是分离的customers/subscriptions表
2. **事务处理方式**: 使用Drizzle的事务API，不是Supabase的事务
3. **类型导入路径**: 确保从正确路径导入Creem类型定义
4. **函数参数适配**: 需要适配MkSaaS的数据库schema结构

### 🎯 **实际项目状态**
- ✅ 数据库schema已更新，包含所有必要字段
- ✅ 现有Supabase实现可作为业务逻辑参考
- ✅ Creem类型定义已完整
- 🔴 Drizzle操作文件为空，需要从头实现
- 🔴 CreemProvider.handleWebhookEvent未实现

## 🎯 实施阶段

### 阶段一：数据库操作层迁移

#### 目标
将所有Supabase操作迁移到Drizzle，适配MkSaaS的统一表结构

#### 核心工作

##### 1. 创建Drizzle操作文件
**文件**: `src/utils/drizzle/creem-operations.ts`

**迁移函数列表**:
- `createOrUpdateCustomer` → `updateUserFromCreemCustomer`
- `createOrUpdateSubscription` → `createOrUpdatePaymentFromCreemSubscription`
- `addCreditsToCustomer` → `addCreditsToUser`
- `getUserSubscription` → `getUserPaymentStatus`
- `useCredits` → `useUserCredits`
- `getCustomerCredits` → `getUserCredits`
- `getCreditsHistory` → `getUserCreditsHistory`

##### 2. 数据表映射关系 **[已修正]**

**原Supabase表结构 → 新Drizzle表结构**:

```typescript
// ⚠️ 重要：MkSaaS使用统一表结构，不是分离的customers/subscriptions表

// Supabase customers表 → Drizzle user表 (统一用户和客户信息)
{
  // Supabase customers表字段 → Drizzle user表字段
  user_id: user.id,                    // 用户ID (主键)
  creem_customer_id: user.creemCustomerId,  // Creem客户ID
  email: user.email,                   // 邮箱
  name: user.name,                     // 姓名
  country: user.country,               // 国家
  credits: user.credits,               // 积分
  metadata: user.metadata              // 元数据
}

// Supabase subscriptions表 → Drizzle payment表 (统一订阅和支付信息)
{
  // Supabase subscriptions表字段 → Drizzle payment表字段
  customer_id: payment.userId,         // 用户ID (外键)
  creem_subscription_id: payment.subscriptionId,  // Creem订阅ID
  creem_product_id: payment.priceId,   // 产品/价格ID
  status: payment.status,              // 订阅状态
  current_period_start: payment.periodStart,      // 周期开始
  current_period_end: payment.periodEnd,          // 周期结束
  canceled_at: payment.canceledAt,     // 取消时间
  metadata: payment.metadata           // 元数据
}

// Supabase credits_history表 → Drizzle creditsHistory表 (积分历史)
{
  // 字段映射基本一致，但customer_id改为user_id
  customer_id: creditsHistory.userId,  // 用户ID (外键)
  amount: creditsHistory.amount,       // 积分数量
  type: creditsHistory.type,           // 操作类型 ('add' | 'subtract')
  description: creditsHistory.description,        // 描述
  creem_order_id: creditsHistory.creemOrderId,   // Creem订单ID
  created_at: creditsHistory.createdAt,          // 创建时间
  metadata: creditsHistory.metadata    // 元数据
}
```

##### 3. 状态映射工具

**Creem状态 → MkSaaS PaymentStatus映射**:
```typescript
const statusMapping: Record<string, string> = {
  'active': 'active',
  'canceled': 'canceled',
  'expired': 'canceled',
  'trialing': 'trialing',
  'paid': 'active',
  'unpaid': 'past_due'
}
```

##### 4. 核心函数实现要点 **[已修正]**

**updateUserFromCreemCustomer**:
- 通过metadata中的user_id查找用户
- 更新user表中的Creem相关字段
- 保持现有数据完整性

**createOrUpdatePaymentFromCreemSubscription**:
- 处理订阅状态映射
- 时间格式转换 (ISO字符串 → Date对象)
- 避免重复记录，使用subscriptionId作为唯一标识

**addCreditsToUser**:
- 事务安全的积分更新
- 同时更新user.credits和插入creditsHistory记录
- 支持积分来源追踪

##### 5. 必要的导入和依赖 **[新增]**

```typescript
// 正确的导入路径
import { getDb } from '@/db';
import { user, payment, creditsHistory } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import type { 
  CreemCustomer, 
  CreemSubscription, 
  CreemWebhookEvent,
  CreemCheckout 
} from '@/payment/types';

// Drizzle事务处理方式
const db = await getDb();
await db.transaction(async (tx) => {
  // 数据库操作
});
```

### 阶段二：Provider核心逻辑实现

#### 目标
在CreemProvider中实现完整的webhook事件处理逻辑

#### 核心工作

##### 1. 实现handleWebhookEvent主函数 **[已修正]**
**文件**: `src/payment/provider/creem.ts`

**函数结构**:
```typescript
import { verifyCreemWebhookSignature } from '@/utils/creem/verify-signature';
import type { CreemWebhookEvent } from '@/payment/types';
import {
  updateUserFromCreemCustomer,
  createOrUpdatePaymentFromCreemSubscription,
  addCreditsToUser
} from '@/utils/drizzle/creem-operations';

public async handleWebhookEvent(payload: string, signature: string): Promise<void> {
  // 1. 签名验证
  const secret = process.env.CREEM_WEBHOOK_SECRET!;
  if (!verifyCreemWebhookSignature(payload, signature, secret)) {
    throw new Error('Invalid webhook signature');
  }
  
  // 2. 事件解析
  const event = JSON.parse(payload) as CreemWebhookEvent;
  
  // 3. 事件分发
  switch (event.eventType) {
    case 'checkout.completed':
      await this.handleCheckoutCompleted(event);
      break;
    case 'subscription.active':
      await this.handleSubscriptionActive(event);
      break;
    case 'subscription.paid':
      await this.handleSubscriptionPaid(event);
      break;
    case 'subscription.canceled':
      await this.handleSubscriptionCanceled(event);
      break;
    case 'subscription.expired':
      await this.handleSubscriptionExpired(event);
      break;
    case 'subscription.trialing':
      await this.handleSubscriptionTrialing(event);
      break;
    default:
      console.log(`Unhandled event type: ${event.eventType}`);
  }
}
```

##### 2. 事件处理函数实现 **[已修正]**

**支持的事件类型**:
- `checkout.completed` - 支付完成
- `subscription.active` - 订阅激活
- `subscription.paid` - 订阅付费
- `subscription.canceled` - 订阅取消
- `subscription.expired` - 订阅过期
- `subscription.trialing` - 试用期

**每个事件处理函数结构**:
```typescript
private async handleCheckoutCompleted(event: CreemWebhookEvent): Promise<void> {
  const checkout = event.object as CreemCheckout;
  const db = await getDb();
  
  await db.transaction(async (tx) => {
    // 1. 更新用户信息
    const userId = await updateUserFromCreemCustomer(
      tx, 
      checkout.customer, 
      checkout.metadata?.user_id
    );
    
    // 2. 处理积分或订阅
    if (checkout.metadata?.product_type === 'credits') {
      await addCreditsToUser(
        tx, 
        userId, 
        checkout.metadata?.credits || 0, 
        checkout.order.id,
        `Purchased ${checkout.metadata?.credits} credits`
      );
    } else if (checkout.subscription) {
      await createOrUpdatePaymentFromCreemSubscription(
        tx, 
        checkout.subscription, 
        userId
      );
    }
  });
}
```

##### 3. 错误处理和日志记录

**错误处理策略**:
- 详细的错误日志记录
- 事务回滚机制
- 重试友好的错误抛出

**日志记录**:
- 事件接收日志
- 处理过程日志
- 错误详情日志

### 阶段三：API路由简化

#### 目标
将现有的复杂webhook路由简化为轻量级入口点

#### 核心工作

##### 1. 简化webhook路由 **[已修正]**
**文件**: `src/app/api/webhooks/creem/route.ts`

**新的实现**:
```typescript
import { getPaymentProvider } from '@/payment';
import type { CreemProvider } from '@/payment/provider/creem';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // 1. 获取请求数据
    const body = await request.text();
    const headersList = headers();
    const signature = (await headersList).get('creem-signature') || '';
    
    // 2. 基础验证
    if (!signature) {
      return new NextResponse('Missing signature', { status: 401 });
    }
    
    // 3. 委托给Provider处理
    const provider = getPaymentProvider() as CreemProvider;
    await provider.handleWebhookEvent(body, signature);
    
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return new NextResponse('Webhook error', { status: 400 });
  }
}
```

##### 2. 移除旧的处理逻辑
- 删除所有事件处理函数
- 移除Supabase操作导入
- 保留签名验证导入（在Provider中使用）

## 🔧 **实施前检查清单** **[新增]**

### 环境变量确认
- ✅ `CREEM_WEBHOOK_SECRET` - Webhook签名验证密钥
- ✅ `CREEM_API_KEY` - Creem API密钥
- ✅ `CREEM_API_URL` - Creem API地址
- ✅ `DATABASE_URL` - 数据库连接字符串

### 依赖确认
- ✅ Drizzle ORM已配置
- ✅ 数据库schema已更新
- ✅ Creem类型定义已存在
- ✅ 签名验证工具已实现

### 代码结构确认
- ✅ `src/db/index.ts` - 数据库连接
- ✅ `src/db/schema.ts` - 数据库schema
- ✅ `src/payment/types.ts` - Creem类型定义
- ✅ `src/utils/creem/verify-signature.ts` - 签名验证

## 🗑️ 清理工作

### 完成后删除的文件
- `src/utils/supabase/subscriptions.ts` - 原Supabase操作文件
- 原webhook路由中的复杂处理逻辑

### 保留的文件
- `src/utils/creem/verify-signature.ts` - 签名验证工具（Provider中使用）
- `src/payment/types.ts` - Creem类型定义

## 🧪 测试策略

### 单元测试
**测试文件**: `src/utils/drizzle/__tests__/creem-operations.test.ts`
- 测试每个数据库操作函数
- 测试状态映射函数
- 测试错误处理

### 集成测试
**测试文件**: `src/payment/provider/__tests__/creem.test.ts`
- 测试Provider的事件处理
- 测试完整的webhook流程
- 测试事务处理

### 端到端测试
- 模拟真实的webhook请求
- 验证数据库状态变化
- 测试错误恢复机制

## 📊 数据迁移验证

### 验证点
1. **用户数据完整性**: 确保所有Creem客户信息正确映射到user表
2. **订阅状态准确性**: 验证订阅状态正确转换为payment记录
3. **积分系统一致性**: 确保积分计算和历史记录准确
4. **时间数据正确性**: 验证时间格式转换正确

### 验证方法
- 数据库查询对比
- 日志记录分析
- 功能测试验证

## 🚨 风险控制

### 主要风险
1. **数据迁移风险**: 数据格式不兼容或丢失
2. **webhook处理失败**: 事件处理逻辑错误
3. **状态不一致**: Creem和本地状态不同步
4. **事务处理错误**: Drizzle事务使用不当

### 缓解措施
1. **分步骤迁移**: 每个函数独立测试验证
2. **事务保护**: 使用数据库事务确保数据一致性
3. **详细日志**: 记录所有关键操作便于调试
4. **回滚机制**: 保留原代码作为备份方案
5. **渐进式部署**: 先在测试环境验证，再部署到生产环境

## 🎯 成功标准

### 功能完整性
- ✅ 所有webhook事件类型正确处理
- ✅ 用户订阅状态准确更新
- ✅ 积分系统正常工作
- ✅ 错误处理机制完善

### 架构合规性
- ✅ 完全符合MkSaaS PaymentProvider接口
- ✅ 统一使用Drizzle数据库操作
- ✅ 代码组织清晰，职责分离明确

### 性能要求
- ✅ Webhook响应时间 < 5秒
- ✅ 数据库操作事务化
- ✅ 内存使用合理

## 📅 实施时间线

### 第1-2天: 数据库操作层迁移
- 创建Drizzle操作文件
- 实现核心数据库函数
- 测试数据映射逻辑

### 第3-4天: Provider逻辑实现
- 实现handleWebhookEvent主函数
- 实现各种事件处理函数
- 集成数据库操作

### 第5天: API路由简化和测试
- 简化webhook路由
- 端到端测试
- 清理旧代码

## 🔄 后续工作

完成webhook实现后，继续实现其他CreemProvider方法：
1. `getSubscriptions` - 获取用户订阅状态
2. `createCustomerPortal` - 创建客户管理门户

---

**文档版本**: v1.1  
**创建日期**: 2024-12-19  
**最后更新**: 2024-12-19  
**修正内容**: 数据表映射关系、事务处理方式、类型导入路径、实施检查清单

**准备开始实施！** 🚀 