type GtagValue = string | number | boolean;
type GtagParams = Record<string, GtagValue>;

declare global {
  interface Window {
    gtag?: (command: 'event', eventName: string, params: GtagParams) => void;
  }
}

export type ActivationStatus = 'start' | 'success' | 'failure';
export type ActivationSource = 'text_to_speech_panel' | 'voice_clone_panel';

type TextToSpeechActivationParams = {
  audioFormat?: string | null;
  characterCount?: number | null;
  failureReason?: string | null;
  language?: string | null;
  model?: string | null;
  planId?: string | null;
  source: Extract<ActivationSource, 'text_to_speech_panel'>;
  waitTime?: number | null;
};

type VoiceCloneActivationParams = {
  characterCount?: number | null;
  failureReason?: string | null;
  inputMode?: 'record' | 'upload' | null;
  planId?: string | null;
  source: Extract<ActivationSource, 'voice_clone_panel'>;
  waitTime?: number | null;
};

const EVENT_NAMES = {
  text_to_speech: {
    failure: 'text_to_speech_failed',
    start: 'text_to_speech_started',
    success: 'text_to_speech_generated',
  },
  voice_clone: {
    failure: 'voice_clone_failed',
    start: 'voice_clone_started',
    success: 'voice_clone_completed',
  },
} as const;

function getCharacterBucket(characterCount?: number | null) {
  if (typeof characterCount !== 'number' || !Number.isFinite(characterCount)) {
    return undefined;
  }

  if (characterCount <= 0) {
    return 'empty';
  }

  if (characterCount <= 100) {
    return '1_100';
  }

  if (characterCount <= 500) {
    return '101_500';
  }

  if (characterCount <= 1000) {
    return '501_1000';
  }

  return '1001_plus';
}

function normalizeParamValue(value?: string | null) {
  const normalized = value
    ?.trim()
    .toLowerCase()
    .replace(/[^a-z0-9_]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 80);

  return normalized || undefined;
}

function normalizeCount(value?: number | null) {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return undefined;
  }

  return Math.max(0, Math.round(value));
}

function withDefinedParams(params: Record<string, GtagValue | undefined>) {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined)
  ) as GtagParams;
}

function sendActivationEvent(
  feature: keyof typeof EVENT_NAMES,
  status: ActivationStatus,
  params: {
    audioFormat?: string | null;
    characterCount?: number | null;
    failureReason?: string | null;
    inputMode?: 'record' | 'upload' | null;
    language?: string | null;
    model?: string | null;
    planId?: string | null;
    source: ActivationSource;
    waitTime?: number | null;
  }
) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') {
    return;
  }

  const characterCount = normalizeCount(params.characterCount);
  const waitTime = normalizeCount(params.waitTime);

  window.gtag(
    'event',
    EVENT_NAMES[feature][status],
    withDefinedParams({
      activation_status: status,
      audio_format: normalizeParamValue(params.audioFormat),
      character_bucket: getCharacterBucket(characterCount),
      character_count: characterCount,
      event_category: 'activation',
      failure_reason:
        status === 'failure'
          ? normalizeParamValue(params.failureReason) || 'unknown'
          : undefined,
      feature,
      input_mode: normalizeParamValue(params.inputMode),
      language: normalizeParamValue(params.language),
      model: normalizeParamValue(params.model),
      plan_id: normalizeParamValue(params.planId),
      source: params.source,
      wait_time_seconds: waitTime,
    })
  );
}

export function trackTextToSpeechActivation(
  status: ActivationStatus,
  params: TextToSpeechActivationParams
) {
  sendActivationEvent('text_to_speech', status, params);
}

export function trackVoiceCloneActivation(
  status: ActivationStatus,
  params: VoiceCloneActivationParams
) {
  sendActivationEvent('voice_clone', status, params);
}
