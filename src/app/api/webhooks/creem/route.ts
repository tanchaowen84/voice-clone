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
