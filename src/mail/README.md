# Email System

This module provides email functionality for the application. It supports sending emails using templates or raw content through different email providers.

## Overview

The email system is designed to be:

- **Modular**: Easy to extend with new providers
- **Flexible**: Support for templates and raw emails
- **Type-safe**: Full TypeScript support
- **Internationalizable**: Multi-language email support

## Directory Structure

```
src/mail/
├── components/     # Reusable email components
│   ├── email-button.tsx
│   └── email-layout.tsx
├── provider/       # Email provider implementations
│   └── resend.ts   # Resend.com provider implementation
├── templates/      # React-based email templates
│   ├── contact-message.tsx
│   ├── forgot-password.tsx
│   ├── subscribe-newsletter.tsx
│   └── verify-email.tsx
├── index.ts        # Main API and utility functions
├── types.ts        # TypeScript types and interfaces
└── README.md       # This documentation
```

## Usage

```typescript
import { sendEmail } from '@/mail';

// Send using a template
await sendEmail({
  to: 'user@example.com',
  template: 'verifyEmail',
  context: {
    name: 'John Doe',
    url: 'https://example.com/verify?token=abc123',
  },
  locale: 'en', // Optional, defaults to config default locale
});

// Send a raw email
await sendEmail({
  to: 'user@example.com',
  subject: 'Welcome to our platform',
  html: '<h1>Hello!</h1><p>Welcome to our platform.</p>',
  text: 'Hello! Welcome to our platform.', // Optional
});
```

## Email Templates

Email templates are React components stored in the `templates` directory. Each template has specific props and is rendered to HTML/text when sent.

### Available Templates

- `verifyEmail`: For email verification during user registration or email changes
- `forgotPassword`: For password reset requests
- `subscribeNewsletter`: For newsletter subscription confirmations
- `contactMessage`: For contact form submissions

### Creating a New Template

1. Create a React component in the `templates` directory
2. Make sure it accepts `BaseEmailProps` plus any specific props
3. Add it to the `EmailTemplates` interface in `types.ts`
4. Add corresponding subject translations in the i18n messages

Example:

```tsx
// templates/my-custom-email.tsx
import { BaseEmailProps } from '@/mail/types';
import { EmailLayout } from '../components/email-layout';
import { EmailButton } from '../components/email-button';

interface MyCustomEmailProps extends BaseEmailProps {
  username: string;
  actionUrl: string;
}

export function MyCustomEmail({ 
  username, 
  actionUrl, 
  messages, 
  locale 
}: MyCustomEmailProps) {
  return (
    <EmailLayout>
      <p>Hello {username}!</p>
      <p>Thanks for joining our platform. Click the button below to get started.</p>
      <EmailButton href={actionUrl}>Get Started</EmailButton>
    </EmailLayout>
  );
}
```

Then update the `types.ts` file to include your new template:

```typescript
export interface EmailTemplates {
  // ... existing templates
  myCustomEmail: React.ComponentType<MyCustomEmailProps>;
}
```

## Email Components

The email system includes reusable components in the `components` directory:

- `EmailLayout`: Base wrapper component that provides consistent layout and styling
- `EmailButton`: Styled button component for call-to-action links

## Configuration

The email system configuration is defined in `src/config/website.tsx`:

```typescript
// In src/config/website.tsx
export const websiteConfig = {
  // ...other config
  mail: {
    provider: 'resend', // Email provider to use
    contact: 'contact@example.com', // Default recipient for contact forms
  },
  // ...other config
}
```

## Providers

### Resend

[Resend](https://resend.com/) is the default email provider. It requires an API key set as `RESEND_API_KEY` in your environment variables.

### Creating a New Provider

To add a new email provider:

1. Create a new file in the `provider` directory
2. Implement the `MailProvider` interface
3. Update the `initializeMailProvider` function in `index.ts` to use your new provider

Example:

```typescript
// provider/my-provider.ts
import { MailProvider, SendEmailResult, SendRawEmailParams, SendTemplateParams } from '@/mail/types';

export class MyProvider implements MailProvider {
  constructor() {
    // Initialize your provider
  }

  public async sendTemplate(params: SendTemplateParams): Promise<SendEmailResult> {
    // Implementation for template emails
  }

  public async sendRawEmail(params: SendRawEmailParams): Promise<SendEmailResult> {
    // Implementation for raw emails
  }

  public getProviderName(): string {
    return 'my-provider';
  }
}
```

Then update `index.ts`:

```typescript
import { MyProvider } from './provider/my-provider';

export const initializeMailProvider = (): MailProvider => {
  if (!mailProvider) {
    // Select provider based on configuration or environment
    mailProvider = new MyProvider();
  }
  return mailProvider;
};
```
