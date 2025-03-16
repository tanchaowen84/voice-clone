import { subscribeNewsletter, unsubscribeNewsletter, checkSubscribeStatus } from './provider/resend';

export const subscribe = async (email: string) => {
  const subscribed = await subscribeNewsletter({ email });
  return subscribed;
};

export const unsubscribe = async (email: string) => {
  const unsubscribed = await unsubscribeNewsletter({ email });
  return unsubscribed;
};

export const isSubscribed = async (email: string) => {
  const subscribed = await checkSubscribeStatus({ email });
  return subscribed;
};
