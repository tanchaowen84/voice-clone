import { createAuthClient } from 'better-auth/react';
import { adminClient, usernameClient } from 'better-auth/client/plugins';
import { getBaseUrl } from './urls/get-base-url';

/**
 * https://www.better-auth.com/docs/installation#create-client-instance
 */
export const authClient = createAuthClient({
  baseURL: getBaseUrl(),
  plugins: [
    // https://www.better-auth.com/docs/plugins/username
    usernameClient(),
    // https://www.better-auth.com/docs/plugins/admin#add-the-client-plugin
    adminClient(),
  ],
});
