'use server';

export async function createCheckoutSession(
    productId: string,
    email: string,
    userId: string,
    productType: "subscription" | "credits",
    credits_amount?: number,
    discountCode?: string
  ) {
    try {
      console.log("🚀 Creating checkout session with:", {
        productId,
        email,
        userId,
        productType,
        credits_amount,
        discountCode,
        apiUrl: process.env.CREEM_API_URL,
        hasApiKey: !!process.env.CREEM_API_KEY
      });
  
      const requestBody: any = {
        product_id: productId,
        // request_id: `${userId}-${Date.now()}`, // use Unique request ID if you need
        customer: {
          email: email,
        },
        metadata: {
          user_id: userId,
          product_type: productType,
          credits: credits_amount || 0,
        },
      };
  
      // 如果配置了成功重定向 URL，则添加到请求中
      if (process.env.CREEM_SUCCESS_URL) {
        requestBody.success_url = process.env.CREEM_SUCCESS_URL;
      }
  
      // 添加折扣码（如果有）
      if (discountCode) {
        requestBody.discount_code = discountCode;
      }
  
      console.log("📤 Request body:", JSON.stringify(requestBody, null, 2));
  
      const response = await fetch(process.env.CREEM_API_URL + "/checkouts", {
        method: "POST",
        headers: {
          "x-api-key": process.env.CREEM_API_KEY!,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
  
      console.log("📥 Response status:", response.status);
      console.log("📥 Response headers:", Object.fromEntries(response.headers.entries()));
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Creem API Error:", {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        });
        throw new Error(`Creem API Error: ${response.status} - ${errorText}`);
      }
  
      const data = await response.json();
      console.log("✅ Checkout session created:", data);
      return data.checkout_url;
    } catch (error) {
      console.error("💥 Error creating checkout session:", error);
      throw error;
    }
}