import { authClient } from '@/lib/auth-client';

export const useSession = () => {
  const { data: session, error } = authClient.useSession();
  // console.log('useCurrentUser, session:', session);
  if (error) {
    console.error('useSession, error:', error);
    return null;
  }
  return session;
};
