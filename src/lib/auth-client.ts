import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL!,
  plugins: [
    // https://www.better-auth.com/docs/plugins/admin#add-the-client-plugin
    adminClient(),
  ]
});
