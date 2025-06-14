import type {
  CheckoutResult,
  CreateCheckoutParams,
  CreatePortalParams,
  PaymentProvider,
  PortalResult,
  Subscription,
  getSubscriptionsParams,
} from '@/payment/types';

export class CreemProvider implements PaymentProvider {
  // constructor() {
  //   // Initialize your provider
  // }

  /**
   * 创建Creem结账会话
   * 按照迁移文档策略实现，保留原有API调用逻辑，添加参数转换层
   */
  public async createCheckout(
    params: CreateCheckoutParams
  ): Promise<CheckoutResult> {
    try {
      // 1. 参数映射
      const creemParams = this.mapParamsToCreemRequest(params);
      const urls = this.buildCreemUrls(params);

      // 2. 构建请求体
      const requestBody: any = {
        product_id: creemParams.productId,
        customer: {
          email: creemParams.email,
        },
        metadata: {
          user_id: creemParams.userId,
          product_type: creemParams.productType,
          credits: creemParams.credits_amount || 0,
        },
        ...urls,
      };

      // 添加折扣码（如果有）
      if (creemParams.discountCode) {
        requestBody.discount_code = creemParams.discountCode;
      }

      console.log('🚀 Creating Creem checkout session with:', {
        productId: creemParams.productId,
        email: creemParams.email,
        userId: creemParams.userId,
        productType: creemParams.productType,
        credits_amount: creemParams.credits_amount,
        discountCode: creemParams.discountCode,
        apiUrl: process.env.CREEM_API_URL,
        hasApiKey: !!process.env.CREEM_API_KEY,
      });

      // 3. 调用API
      const checkoutUrl = await this.callCreemCheckoutAPI(requestBody);

      // 4. 返回结果
      return {
        url: checkoutUrl,
        id: this.generateCheckoutSessionId(requestBody),
      };
    } catch (error) {
      console.error('❌ Creem createCheckout error:', error);
      throw new Error('Failed to create Creem checkout session');
    }
  }

  /**
   * 参数映射函数 - 将MkSaaS参数转换为Creem参数
   */
  private mapParamsToCreemRequest(params: CreateCheckoutParams) {
    const { planId, priceId, customerEmail, metadata } = params;

    // 提取metadata中的参数
    const userId = metadata?.userId;
    const productType = metadata?.productType || 'subscription';
    const credits = metadata?.credits
      ? Number.parseInt(metadata.credits)
      : undefined;
    const discountCode = metadata?.discountCode;

    return {
      productId: priceId, // 直接使用priceId作为Creem的productId
      email: customerEmail,
      userId,
      productType: productType as 'subscription' | 'credits',
      credits_amount: credits,
      discountCode,
    };
  }

  /**
   * URL处理函数 - 构建成功回调URL（Creem API不支持cancel_url）
   */
  private buildCreemUrls(params: CreateCheckoutParams) {
    const { successUrl } = params;

    const urls: any = {};

    // 添加成功URL（Creem API文档中只有success_url，没有cancel_url）
    if (successUrl || process.env.CREEM_SUCCESS_URL) {
      urls.success_url = successUrl || process.env.CREEM_SUCCESS_URL;
    }

    return urls;
  }

  /**
   * Creem API调用函数 - 复制原有的完善逻辑
   */
  private async callCreemCheckoutAPI(requestData: any): Promise<string> {
    console.log('📤 Request body:', JSON.stringify(requestData, null, 2));

    const response = await fetch(process.env.CREEM_API_URL + '/v1/checkouts', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.CREEM_API_KEY!,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    console.log('📥 Response status:', response.status);
    console.log(
      '📥 Response headers:',
      Object.fromEntries(response.headers.entries())
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Creem API Error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
      });
      throw new Error(`Creem API Error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ Checkout session created:', data);
    return data.checkout_url;
  }

  /**
   * 生成唯一的checkout session ID
   */
  private generateCheckoutSessionId(requestBody: any): string {
    // 生成唯一的checkout session ID
    // 使用timestamp + userId的组合
    const timestamp = Date.now();
    const userId = requestBody.metadata?.user_id || 'anonymous';
    return `creem_checkout_${userId}_${timestamp}`;
  }

  public async createCustomerPortal(
    params: CreatePortalParams
  ): Promise<PortalResult> {
    // Implementation for creating a customer portal
    throw new Error('createCustomerPortal not implemented yet');
  }

  public async getSubscriptions(
    params: getSubscriptionsParams
  ): Promise<Subscription[]> {
    // Implementation for getting subscriptions
    throw new Error('getSubscriptions not implemented yet');
  }

  public async handleWebhookEvent(
    payload: string,
    signature: string
  ): Promise<void> {
    // Implementation for handling webhook events
    throw new Error('handleWebhookEvent not implemented yet');
  }
}
