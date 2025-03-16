export interface SubscribeNewsletterProps {
  email: string;
}

export interface UnsubscribeNewsletterProps {
  email: string;
}

export interface CheckSubscribeStatusProps {
  email: string;
}

export type SubscribeNewsletterHandler = (params: SubscribeNewsletterProps) => Promise<boolean>;

export type UnsubscribeNewsletterHandler = (params: UnsubscribeNewsletterProps) => Promise<boolean>;

export type CheckSubscribeStatusHandler = (params: CheckSubscribeStatusProps) => Promise<boolean>;

/**
 * Newsletter provider, currently only Resend is supported
 */
export interface NewsletterProvider {
  subscribe: SubscribeNewsletterHandler;
  unsubscribe: UnsubscribeNewsletterHandler;
  checkSubscribeStatus: CheckSubscribeStatusHandler;
}
