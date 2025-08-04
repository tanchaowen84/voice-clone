import {
  checkUsageLimit,
  getCurrentUser,
  getUsageLimitErrorMessage,
  updateUsageStats,
} from '@/lib/subscription-limits';
import { SpeechifyClient } from '@speechify/api';
import { type NextRequest, NextResponse } from 'next/server';

const client = new SpeechifyClient({
  token: process.env.SPEECHIFY_API_TOKEN || '',
});

export async function POST(request: NextRequest) {
  console.log('🎤 [Voice Generate API] Starting voice generation request');

  try {
    const { text, voiceId } = await request.json();

    if (!text || !voiceId) {
      console.log('❌ [Voice Generate API] Missing required fields');
      return NextResponse.json(
        { error: 'Missing required fields: text, voiceId' },
        { status: 400 }
      );
    }

    console.log(
      `🎤 [Voice Generate API] Request details: text length=${text.length}, voiceId=${voiceId}`
    );

    // 1. 获取当前用户
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      console.log('🚫 [Voice Generate API] No authenticated user found');
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // 2. 检查使用限制
    console.log(
      `🔍 [Voice Generate API] Checking usage limits for user ${currentUser.id}`
    );
    const usageCheck = await checkUsageLimit(text, currentUser.id);

    if (!usageCheck.allowed) {
      const errorMessage = getUsageLimitErrorMessage(usageCheck);
      console.log(
        `🚫 [Voice Generate API] Usage limit exceeded: ${usageCheck.reason} - ${errorMessage}`
      );

      return NextResponse.json(
        {
          error: errorMessage,
          reason: usageCheck.reason,
          waitTime: usageCheck.waitTime,
          currentUsage: usageCheck.currentUsage,
          limit: usageCheck.limit,
          remainingQuota: usageCheck.remainingQuota,
        },
        { status: 429 } // Too Many Requests
      );
    }

    console.log(
      '✅ [Voice Generate API] Usage check passed, proceeding with generation'
    );
    console.log(
      `📊 [Voice Generate API] Usage info: ${usageCheck.currentUsage}/${usageCheck.limit}, remaining: ${usageCheck.remainingQuota}, wait time: ${usageCheck.waitTime}s`
    );

    // 3. 生成语音
    console.log('🎵 [Voice Generate API] Calling Speechify API...');
    const response = await client.tts.audio.speech({
      input: text,
      voiceId: voiceId,
      audioFormat: 'mp3', // Explicitly set format
    });

    // Extract audio data from the response object
    if (!response.audioData) {
      throw new Error('No audio data received from Speechify API');
    }

    console.log(
      `🎵 [Voice Generate API] Speech generation successful, billable characters: ${response.billableCharactersCount || text.length}`
    );

    // 4. 更新使用统计
    const actualCharactersUsed =
      response.billableCharactersCount || text.length;
    console.log(
      `📈 [Voice Generate API] Updating usage stats: +${actualCharactersUsed} characters`
    );

    const statsUpdated = await updateUsageStats(
      currentUser.id,
      actualCharactersUsed
    );
    if (!statsUpdated) {
      console.warn(
        '⚠️ [Voice Generate API] Failed to update usage stats, but continuing...'
      );
    }

    // Determine content type based on audio format
    const contentType =
      response.audioFormat === 'wav' ? 'audio/wav' : 'audio/mpeg';

    // Create data URL for frontend consumption
    const audioUrl = `data:${contentType};base64,${response.audioData}`;

    console.log('✅ [Voice Generate API] Request completed successfully');

    // Return JSON response as expected by frontend
    return NextResponse.json({
      audioUrl: audioUrl,
      audioFormat: response.audioFormat,
      billableCharacters: actualCharactersUsed,
      // 添加使用量信息供前端显示
      usageInfo: {
        currentUsage: (usageCheck.currentUsage || 0) + actualCharactersUsed,
        limit: usageCheck.limit,
        remainingQuota: Math.max(
          0,
          (usageCheck.remainingQuota || 0) - actualCharactersUsed
        ),
        waitTime: usageCheck.waitTime,
      },
    });
  } catch (error) {
    console.error('❌ [Voice Generate API] Speech generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate speech' },
      { status: 500 }
    );
  }
}
