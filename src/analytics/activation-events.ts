type GtagValue = string | number | boolean;
type GtagParams = Record<string, GtagValue>;

declare global {
  interface Window {
    gtag?: (
      command: 'event',
      eventName: ActivationEventName,
      params: GtagParams
    ) => void;
  }
}

type ActivationEventName =
  | 'signup_completed'
  | 'text_to_speech_generated'
  | 'voice_clone_completed'
  | 'voice_clone_started';

type ActivationSource =
  | 'register_form'
  | 'text_to_speech_panel'
  | 'voice_clone_panel';

type TextToSpeechGeneratedParams = {
  audioFormat?: string | null;
  characterCount?: number | null;
  language?: string | null;
  model?: string | null;
  planId?: string | null;
  source: Extract<ActivationSource, 'text_to_speech_panel'>;
  waitTime?: number | null;
};

type VoiceCloneParams = {
  characterCount?: number | null;
  inputMode?: 'record' | 'upload' | null;
  planId?: string | null;
  source: Extract<ActivationSource, 'voice_clone_panel'>;
  waitTime?: number | null;
};

type SignupCompletedParams = {
  method: 'email';
  source: Extract<ActivationSource, 'register_form'>;
};

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

function normalizeCount(value?: number | null) {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return undefined;
  }

  return Math.max(0, Math.round(value));
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

function withDefinedParams(params: Record<string, GtagValue | undefined>) {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined)
  ) as GtagParams;
}

function sendActivationEvent(
  eventName: ActivationEventName,
  params: Record<string, GtagValue | undefined>
) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') {
    return;
  }

  window.gtag('event', eventName, withDefinedParams(params));
}

function buildGenerationParams(
  feature: 'text_to_speech' | 'voice_clone',
  source: ActivationSource,
  params: {
    characterCount?: number | null;
    planId?: string | null;
    waitTime?: number | null;
  }
) {
  const characterCount = normalizeCount(params.characterCount);
  const waitTime = normalizeCount(params.waitTime);

  return {
    character_bucket: getCharacterBucket(characterCount),
    character_count: characterCount,
    event_category: 'activation',
    feature,
    plan_id: normalizeParamValue(params.planId),
    source,
    wait_time_seconds: waitTime,
  };
}

export function trackTextToSpeechGenerated(
  params: TextToSpeechGeneratedParams
) {
  sendActivationEvent(
    'text_to_speech_generated',
    withDefinedParams({
      ...buildGenerationParams('text_to_speech', params.source, params),
      activation_status: 'success',
      audio_format: normalizeParamValue(params.audioFormat),
      language: normalizeParamValue(params.language),
      model: normalizeParamValue(params.model),
    })
  );
}

export function trackVoiceCloneStarted(params: VoiceCloneParams) {
  sendActivationEvent(
    'voice_clone_started',
    withDefinedParams({
      ...buildGenerationParams('voice_clone', params.source, params),
      activation_status: 'start',
      input_mode: normalizeParamValue(params.inputMode),
    })
  );
}

export function trackVoiceCloneCompleted(params: VoiceCloneParams) {
  sendActivationEvent(
    'voice_clone_completed',
    withDefinedParams({
      ...buildGenerationParams('voice_clone', params.source, params),
      activation_status: 'success',
      input_mode: normalizeParamValue(params.inputMode),
    })
  );
}

export function trackSignupCompleted(params: SignupCompletedParams) {
  sendActivationEvent(
    'signup_completed',
    withDefinedParams({
      activation_status: 'success',
      event_category: 'activation',
      feature: 'signup',
      signup_method: params.method,
      source: params.source,
    })
  );
}
