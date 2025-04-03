import { createAuthClient } from 'better-auth/react';
import { adminClient, inferAdditionalFields, usernameClient } from 'better-auth/client/plugins';
import { getBaseUrl } from './urls/get-base-url';
import { auth } from './auth';

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
    // https://www.better-auth.com/docs/concepts/typescript#inferring-additional-fields-on-client
    inferAdditionalFields<typeof auth>(),
  ],
});
