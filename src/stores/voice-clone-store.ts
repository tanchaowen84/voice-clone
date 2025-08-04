import {
  convertWebMToWAV,
  isAudioConversionSupported,
} from '@/utils/audio-converter';
import { create } from 'zustand';
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

    try {
      set({ isGenerating: true, error: null });

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
        const errorData = await generateResponse.json();

        // 处理订阅限制错误
        if (generateResponse.status === 429) {
          // 使用量限制错误，更新订阅store状态
          const subscriptionStore = useSubscriptionStore.getState();

          if (errorData.waitTime && errorData.waitTime > 0) {
            // 免费用户需要等待
            subscriptionStore.startWaiting(errorData.waitTime);
          }

          // 设置详细的错误信息
          const detailedError =
            errorData.reason === 'DAILY_LIMIT_EXCEEDED'
              ? `Daily limit reached (${errorData.currentUsage}/${errorData.limit} characters). ${errorData.waitTime ? `Please wait ${errorData.waitTime} seconds or ` : ''}upgrade to continue.`
              : errorData.reason === 'MONTHLY_LIMIT_EXCEEDED'
                ? `Monthly limit reached (${errorData.currentUsage}/${errorData.limit} characters). Please upgrade your plan.`
                : errorData.reason === 'CHAR_LIMIT_EXCEEDED'
                  ? `Text too long. Maximum ${errorData.limit} characters per request.`
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
      }

      set({ generatedAudioUrl: audioUrl });
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
      error: null,
    });
  },
}));
