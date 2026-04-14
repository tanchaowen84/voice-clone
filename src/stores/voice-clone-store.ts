import {
  convertWebMToWAV,
  isAudioConversionSupported,
} from '@/utils/audio-converter';
import { create } from 'zustand';
import { useAuthModalStore } from './auth-modal-store';
import { useSubscriptionStore } from './subscription-store';

/**
 * Voice clone input modes
 */
export type InputMode = 'record' | 'upload';

/**
 * Voice clone application steps
 */
export type AppStep = 'input' | 'generate';

/**
 * Voice clone state interface
 */
export interface VoiceCloneState {
  // Interface state
  inputMode: InputMode;
  currentStep: AppStep;

  // Audio data
  audioFile: File | null;
  recordedBlob: Blob | null;

  // Generation state
  isGenerating: boolean;
  generatedAudioUrl: string | null;
  pendingAudioUrl: string | null; // 暂存的音频URL，等待完成后显示

  // Error handling
  error: string | null;

  // Actions
  setInputMode: (mode: InputMode) => void;
  setCurrentStep: (step: AppStep) => void;
  setAudioFile: (file: File | null) => void;
  setRecordedBlob: (blob: Blob | null) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  setGeneratedAudioUrl: (url: string | null) => void;
  setError: (error: string | null) => void;
  generateSpeech: (text: string) => Promise<void>;
  showPendingResult: () => void;
  reset: () => void;
}

/**
 * Voice clone store using Zustand
 * Manages the voice cloning application state globally
 */
export const useVoiceCloneStore = create<VoiceCloneState>((set, get) => ({
  // Initial state
  inputMode: 'record',
  currentStep: 'input',
  audioFile: null,
  recordedBlob: null,
  isGenerating: false,
  generatedAudioUrl: null,
  pendingAudioUrl: null,
  error: null,

  /**
   * Set the input mode (record or upload)
   * Resets all audio-related state when switching modes for better UX
   */
  setInputMode: (mode) => {
    set({
      inputMode: mode,
      currentStep: 'input',
      audioFile: null,
      recordedBlob: null,
      generatedAudioUrl: null,
      error: null,
    });
  },

  /**
   * Set the current application step
   */
  setCurrentStep: (step) => {
    set({ currentStep: step, error: null });
  },

  /**
   * Set the uploaded audio file
   */
  setAudioFile: (file) => {
    set({ audioFile: file, error: null });
    // If file is set, automatically move to generate step
    if (file) {
      set({ currentStep: 'generate' });
    }
  },

  /**
   * Set the recorded audio blob
   */
  setRecordedBlob: (blob) => {
    set({ recordedBlob: blob, error: null });
    // If blob is set, automatically move to generate step
    if (blob) {
      set({ currentStep: 'generate' });
    }
  },

  /**
   * Set the generation loading state
   */
  setIsGenerating: (isGenerating) => {
    set({ isGenerating });
  },

  /**
   * Set the generated audio URL
   */
  setGeneratedAudioUrl: (url) => {
    set({ generatedAudioUrl: url });
  },

  /**
   * Set error message
   */
  setError: (error) => {
    set({ error });
  },

  /**
   * Generate speech from text using the recorded/uploaded voice
   */
  generateSpeech: async (text: string) => {
    const state = get();
    const subscriptionStore = useSubscriptionStore.getState();
    const isWaitingForFreePlan =
      subscriptionStore.waitingState.isWaiting &&
      subscriptionStore.subscription?.planId === 'free';

    // 检查是否在等待状态中
    if (isWaitingForFreePlan) {
      console.log(
        '⏳ [Voice Clone Store] Cannot generate speech while waiting'
      );
      set({
        error: `Please wait ${subscriptionStore.waitingState.remainingTime} seconds before generating again.`,
      });
      return;
    }

    // 检查免费用户的字符限制
    if (
      subscriptionStore.subscription?.planId === 'free' &&
      text.length > 100
    ) {
      console.log(
        `🚫 [Voice Clone Store] Free user character limit exceeded: ${text.length} > 100`
      );
      // 使用setTimeout避免在渲染过程中更新状态
      setTimeout(() => {
        subscriptionStore.showUpgradeModal('character_limit');
      }, 0);
      return;
    }

    try {
      set({ isGenerating: true, error: null, generatedAudioUrl: null });

      // Get audio data (either from recorded blob or uploaded file)
      let audioData: File;

      if (state.recordedBlob) {
        // Check if audio conversion is supported
        if (!isAudioConversionSupported()) {
          throw new Error('Audio conversion not supported in this browser');
        }

        // Convert WebM blob to WAV format for better API compatibility
        try {
          const wavBlob = await convertWebMToWAV(state.recordedBlob);
          audioData = new File([wavBlob], 'recorded-voice.wav', {
            type: 'audio/wav',
          });
        } catch (conversionError) {
          console.error('Audio conversion failed:', conversionError);
          // Fallback: try with original blob but with corrected metadata
          audioData = new File([state.recordedBlob], 'recorded-voice.webm', {
            type: state.recordedBlob.type || 'audio/webm',
          });
        }
      } else if (state.audioFile) {
        audioData = state.audioFile;
      } else {
        throw new Error('No audio data available');
      }

      // First, create voice clone
      const formData = new FormData();
      formData.append('audio', audioData); // Fixed: audioFile → audio
      formData.append('name', `Voice_${Date.now()}`); // Fixed: voiceName → name
      formData.append('gender', 'notSpecified');
      formData.append('fullName', 'Anonymous User');
      formData.append('email', 'user@example.com');
      formData.append('consent', 'true'); // Added: required consent field

      const createResponse = await fetch('/api/voice-clone/create', {
        method: 'POST',
        body: formData,
      });

      if (!createResponse.ok) {
        const errorData = await createResponse.json();
        throw new Error(errorData.error || 'Failed to create voice clone');
      }

      const { voiceId } = await createResponse.json();

      // 在发送语音生成请求前，先检查用户计划并预先启动等待状态
      console.log(
        '🔍 [Voice Clone Store] Pre-checking user plan for waiting...'
      );

      // Then generate speech with the created voice
      const generateResponse = await fetch('/api/voice-clone/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          voiceId,
        }),
      });

      if (!generateResponse.ok) {
        // Handle 401: require auth → open login modal and set pending
        if (generateResponse.status === 401) {
          const authStore = useAuthModalStore.getState();
          authStore.setPending(text, 'voice_clone_generate');
          authStore.open();
          return; // stop further handling
        }

        const errorData = await generateResponse.json();

        // 处理订阅限制错误
        if (generateResponse.status === 429) {
          // 使用量限制错误，更新订阅store状态
          const subscriptionStore = useSubscriptionStore.getState();

          // 根据错误类型弹出相应的升级modal
          if (errorData.reason === 'DAILY_LIMIT_EXCEEDED') {
            console.log(
              '🚫 [Voice Clone Store] Daily limit exceeded, showing upgrade modal'
            );
            setTimeout(() => {
              subscriptionStore.showUpgradeModal('daily_limit');
            }, 0);
            return; // 不抛出错误，直接返回
          }

          if (errorData.reason === 'CHAR_LIMIT_EXCEEDED') {
            console.log(
              '🚫 [Voice Clone Store] Character limit exceeded, showing upgrade modal'
            );
            setTimeout(() => {
              subscriptionStore.showUpgradeModal('character_limit');
            }, 0);
            return; // 不抛出错误，直接返回
          }

          if (errorData.waitTime && errorData.waitTime > 0) {
            // 免费用户需要等待
            subscriptionStore.startWaiting(errorData.waitTime);
          }

          // 设置详细的错误信息（对于其他类型的错误）
          const detailedError =
            errorData.reason === 'MONTHLY_LIMIT_EXCEEDED'
              ? `Monthly limit reached (${errorData.currentUsage}/${errorData.limit} characters). Please upgrade your plan.`
              : errorData.error;

          throw new Error(detailedError);
        }

        throw new Error(errorData.error || 'Failed to generate speech');
      }

      const responseData = await generateResponse.json();
      const { audioUrl, usageInfo } = responseData;

      // 更新订阅store的使用量信息
      if (usageInfo) {
        const subscriptionStore = useSubscriptionStore.getState();
        subscriptionStore.updateUsageAfterGeneration(
          responseData.billableCharacters || text.length
        );

        // 刷新最新的使用量数据
        subscriptionStore.fetchAllData().catch((error) => {
          console.warn(
            '⚠️ [Voice Clone Store] Failed to refresh usage data:',
            error
          );
        });

        // 如果是免费用户且有等待时间，启动等待状态并暂存结果
        if (usageInfo.waitTime && usageInfo.waitTime > 0) {
          console.log(
            `⏳ [Voice Clone Store] Starting wait time: ${usageInfo.waitTime} seconds, audio result will be shown after waiting`
          );

          const waitStarted = subscriptionStore.startWaiting(
            usageInfo.waitTime
          );

          if (waitStarted) {
            // 暂存音频结果，等待完成后再显示
            set({
              pendingAudioUrl: audioUrl,
              generatedAudioUrl: null, // 隐藏结果直到等待完成
            });

            console.log(
              '⏳ [Voice Clone Store] Audio result stored, waiting for countdown to complete...'
            );
          } else {
            set({
              generatedAudioUrl: audioUrl,
              pendingAudioUrl: null,
            });
          }
        } else {
          // 付费用户或无等待时间，直接显示结果
          set({ generatedAudioUrl: audioUrl, pendingAudioUrl: null });
        }
      } else {
        // 没有使用量信息，直接显示结果
        set({ generatedAudioUrl: audioUrl, pendingAudioUrl: null });
      }
    } catch (error) {
      console.error('Speech generation error:', error);
      set({
        error:
          error instanceof Error ? error.message : 'Failed to generate speech',
      });
    } finally {
      set({ isGenerating: false });
    }
  },

  /**
   * Reset the store to initial state
   */
  reset: () => {
    set({
      inputMode: 'record',
      currentStep: 'input',
      audioFile: null,
      recordedBlob: null,
      isGenerating: false,
      generatedAudioUrl: null,
      pendingAudioUrl: null,
      error: null,
    });
  },

  // 显示等待完成后的结果
  showPendingResult: () => {
    const state = get();
    if (state.pendingAudioUrl) {
      console.log('✅ [Voice Clone Store] Showing pending audio result');
      set({
        generatedAudioUrl: state.pendingAudioUrl,
        pendingAudioUrl: null,
      });
    }
  },
}));
