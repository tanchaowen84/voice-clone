# Creem CreateCheckout 迁移方案

## 📋 概述

将原项目中的 `createCheckoutSession` 函数迁移到MkSaaS的 `CreemProvider.createCheckout` 方法中，实现与MkSaaS支付架构的完美集成。

## 🔍 原代码分析

### 原函数签名
```typescript
// src/utils/creem/create-checkout-session-creem.ts
export async function createCheckoutSession(
    productId: string,           // Creem产品ID
    email: string,              // 用户邮箱
    userId: string,             // 用户ID
    productType: "subscription" | "credits",  // 产品类型
    credits_amount?: number,    // 积分数量（可选）
    discountCode?: string       // 折扣码（可选）
): Promise<string>              // 返回checkout_url字符串
```

### 原代码核心逻辑
1. **构建请求体** - 包含product_id、customer、metadata等
2. **API调用** - 调用Creem的 `/checkouts` 端点
3. **错误处理** - 完善的错误日志和异常处理
4. **返回结果** - 返回checkout_url字符串

### 原代码优势
- ✅ 完善的错误处理和日志记录
- ✅ 支持折扣码和积分系统
- ✅ 灵活的metadata传递
- ✅ 环境变量配置支持

## 🎯 MkSaaS接口要求

### 目标接口签名
```typescript
// src/payment/provider/creem.ts
public async createCheckout(
    params: CreateCheckoutParams
): Promise<CheckoutResult>
```

### 接口定义
```typescript
interface CreateCheckoutParams {
  planId: string;                    // 计划ID（如"pro", "lifetime"）
  priceId: string;                   // 价格ID
  customerEmail: string;             // 客户邮箱
  successUrl?: string;               // 成功回调URL
  cancelUrl?: string;                // 取消回调URL
  metadata?: Record<string, string>; // 元数据
  locale?: Locale;                   // 语言设置
}

interface CheckoutResult {
  url: string;                       // 结账URL
  id: string;                        // 结账会话ID
}
```

## 🔄 参数映射分析

### 直接映射字段
| 原参数 | MkSaaS参数 | 映射方式 | 说明 |
|--------|------------|----------|------|
| `email` | `customerEmail` | ✅ 直接映射 | 完全一致 |
| `productId` | `priceId` | ✅ 直接映射 | Creem的product_id对应MkSaaS的priceId |

### 需要转换的字段
| 原参数 | MkSaaS参数 | 映射方式 | 说明 |
|--------|------------|----------|------|
| `userId` | `metadata.userId` | 🔄 移到metadata | 通过metadata传递 |
| `productType` | `metadata.productType` | 🔄 移到metadata | 通过metadata传递 |
| `credits_amount` | `metadata.credits` | 🔄 移到metadata | 通过metadata传递 |
| `discountCode` | `metadata.discountCode` | 🔄 移到metadata | 通过metadata传递 |

### 新增字段处理
| MkSaaS参数 | 处理方式 | 说明 |
|------------|----------|------|
| `planId` | 🔧 需要映射 | 从planId映射到Creem的productId |
| `successUrl` | ✅ 已支持 | 原代码已有success_url处理 |
| `cancelUrl` | 🔧 需要添加 | 添加cancel_url支持 |
| `locale` | 🔧 可选支持 | 如果Creem支持则添加 |

## 🚀 迁移策略

### 策略一：参数转换层（推荐）
```typescript
public async createCheckout(params: CreateCheckoutParams): Promise<CheckoutResult> {
  // 1. 参数转换
  const { planId, priceId, customerEmail, successUrl, cancelUrl, metadata, locale } = params;
  
  // 2. 从metadata中提取Creem特有参数
  const userId = metadata?.userId;
  const productType = metadata?.productType || "subscription";
  const credits = metadata?.credits ? parseInt(metadata.credits) : undefined;
  const discountCode = metadata?.discountCode;
  
  // 3. 调用原有逻辑（适配后的版本）
  const checkoutUrl = await this.createCreemCheckoutSession(
    priceId, // 使用priceId作为productId
    customerEmail,
    userId,
    productType,
    credits,
    discountCode,
    successUrl,
    cancelUrl
  );
  
  // 4. 返回符合接口的结果
  return {
    url: checkoutUrl,
    id: this.generateCheckoutId() // 生成或提取session ID
  };
}
```

### 策略二：完全重写（备选）
直接在createCheckout方法中重新实现所有逻辑，不依赖原有函数。

**推荐使用策略一**，因为原有代码已经很完善，只需要添加适配层即可。

## 📝 具体实施步骤

### 第一步：创建参数映射函数
```typescript
private mapParamsToCreemRequest(params: CreateCheckoutParams) {
  const { planId, priceId, customerEmail, metadata } = params;
  
  // 提取metadata中的参数
  const userId = metadata?.userId;
  const productType = metadata?.productType || "subscription";
  const credits = metadata?.credits ? parseInt(metadata.credits) : undefined;
  const discountCode = metadata?.discountCode;
  
  return {
    productId: priceId, // 直接使用priceId作为Creem的productId
    email: customerEmail,
    userId,
    productType: productType as "subscription" | "credits",
    credits_amount: credits,
    discountCode
  };
}
```

### 第二步：创建URL处理函数
```typescript
private buildCreemUrls(params: CreateCheckoutParams) {
  const { successUrl, cancelUrl } = params;
  
  return {
    success_url: successUrl || process.env.CREEM_SUCCESS_URL,
    cancel_url: cancelUrl || process.env.CREEM_CANCEL_URL
  };
}
```

### 第三步：适配原有API调用逻辑
```typescript
private async callCreemCheckoutAPI(requestData: any): Promise<string> {
  // 复制原有的API调用逻辑
  // 包括错误处理、日志记录等
  const response = await fetch(process.env.CREEM_API_URL + "/checkouts", {
    method: "POST",
    headers: {
      "x-api-key": process.env.CREEM_API_KEY!,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestData),
  });
  
  // ... 错误处理逻辑
  
  const data = await response.json();
  return data.checkout_url;
}
```

### 第四步：实现主要的createCheckout方法
```typescript
public async createCheckout(params: CreateCheckoutParams): Promise<CheckoutResult> {
  try {
    // 1. 参数映射
    const creemParams = this.mapParamsToCreemRequest(params);
    const urls = this.buildCreemUrls(params);
    
    // 2. 构建请求体
    const requestBody = {
      product_id: creemParams.productId,
      customer: {
        email: creemParams.email,
      },
      metadata: {
        user_id: creemParams.userId,
        product_type: creemParams.productType,
        credits: creemParams.credits_amount || 0,
      },
      ...urls
    };
    
    // 添加折扣码（如果有）
    if (creemParams.discountCode) {
      requestBody.discount_code = creemParams.discountCode;
    }
    
    // 3. 调用API
    const checkoutUrl = await this.callCreemCheckoutAPI(requestBody);
    
    // 4. 返回结果
    return {
      url: checkoutUrl,
      id: this.generateCheckoutSessionId(requestBody)
    };
  } catch (error) {
    console.error('Creem createCheckout error:', error);
    throw new Error('Failed to create Creem checkout session');
  }
}
```

### 第五步：实现辅助方法
```typescript
private generateCheckoutSessionId(requestBody: any): string {
  // 生成唯一的checkout session ID
  // 可以使用timestamp + userId的组合
  const timestamp = Date.now();
  const userId = requestBody.metadata?.user_id || 'anonymous';
  return `creem_checkout_${userId}_${timestamp}`;
}
```

## ⚙️ 环境变量配置

### 需要的环境变量
```bash
# Creem API配置
CREEM_API_URL=https://api.creem.io/v1
CREEM_API_KEY=your_creem_api_key
CREEM_WEBHOOK_SECRET=your_webhook_secret

# 默认回调URL
CREEM_SUCCESS_URL=https://your-domain.com/payment/success
CREEM_CANCEL_URL=https://your-domain.com/payment/cancel
```

### 在env.example中添加
```bash
# Creem Payment Gateway
CREEM_API_URL=
CREEM_API_KEY=
CREEM_WEBHOOK_SECRET=
CREEM_SUCCESS_URL=
CREEM_CANCEL_URL=
```

## 🔧 planId到productId映射

### 配置映射关系
```typescript
// 在CreemProvider中定义映射
private readonly PLAN_PRODUCT_MAPPING = {
  'pro': process.env.CREEM_PRODUCT_ID_PRO,
  'lifetime': process.env.CREEM_PRODUCT_ID_LIFETIME,
  // 可以根据需要添加更多映射
} as const;

private getProductIdFromPlanId(planId: string): string {
  const productId = this.PLAN_PRODUCT_MAPPING[planId as keyof typeof this.PLAN_PRODUCT_MAPPING];
  if (!productId) {
    throw new Error(`No Creem product ID found for plan: ${planId}`);
  }
  return productId;
}
```

### 或者使用priceId直接作为productId
```typescript
// 如果Creem的productId就是MkSaaS的priceId，则直接使用
private getProductIdFromPriceId(priceId: string): string {
  return priceId; // 直接使用priceId作为Creem的productId
}
```

## 🧪 测试策略

### 单元测试
```typescript
describe('CreemProvider.createCheckout', () => {
  it('should map parameters correctly', () => {
    // 测试参数映射逻辑
  });
  
  it('should handle API errors gracefully', () => {
    // 测试错误处理
  });
  
  it('should return correct CheckoutResult format', () => {
    // 测试返回值格式
  });
});
```

### 集成测试
1. **测试完整的支付流程** - 从创建checkout到完成支付
2. **测试错误场景** - API失败、网络错误等
3. **测试不同参数组合** - 订阅、积分、折扣码等

## ⚠️ 注意事项

### 1. 错误处理
- 保持原有的详细错误日志
- 确保错误信息对用户友好
- 添加适当的错误重试机制

### 2. 安全性
- 验证所有输入参数
- 确保API密钥安全存储
- 验证返回的URL格式

### 3. 性能
- 添加适当的超时设置
- 考虑添加请求缓存（如果适用）
- 监控API调用性能

### 4. 兼容性
- 确保与现有Stripe支付不冲突
- 保持向后兼容性
- 支持平滑的提供商切换

## 📈 迁移后的优势

### 1. 架构统一
- ✅ 符合MkSaaS的PaymentProvider接口
- ✅ 支持多支付提供商切换
- ✅ 统一的错误处理和日志记录

### 2. 功能完整
- ✅ 保留所有原有功能（积分、折扣码等）
- ✅ 支持MkSaaS的计划系统
- ✅ 完整的metadata传递

### 3. 可维护性
- ✅ 清晰的代码结构
- ✅ 完善的类型定义
- ✅ 易于测试和调试

## 🎯 下一步计划

1. **实施createCheckout迁移** - 按照本文档执行迁移
2. **测试验证** - 确保功能正常工作
3. **继续其他方法** - createCustomerPortal、getSubscriptions等
4. **完整集成测试** - 端到端的支付流程测试

---

**准备好开始实际的代码迁移工作！** 🚀 