# Email System

This module provides email functionality for the application. It supports sending emails using templates or raw content through different email providers.

## Structure

The email system is designed with the following components:

- **Provider Interface**: A common interface for email providers
- **Email Templates**: React-based email templates for different purposes
- **Configuration**: Configuration for email defaults and settings

## Usage

### Basic Usage

```typescript
import { send } from '@/mail';

// Send using a template
await send({
  to: 'user@example.com',
  template: 'verifyEmail',
  context: {
    name: 'John Doe',
    url: 'https://example.com/verify?token=abc123',
  },
  locale: 'en', // Optional, defaults to config default locale
});

// Send a raw email
await send({
  to: 'user@example.com',
  subject: 'Welcome to our platform',
  html: '<h1>Hello!</h1><p>Welcome to our platform.</p>',
  text: 'Hello! Welcome to our platform.', // Optional
});
```

### Using the Mail Provider Directly

```typescript
import { getMailProvider, sendTemplate, sendRawEmail } from '@/mail';

// Get the provider
const provider = getMailProvider();

// Send template email
const result = await sendTemplate({
  to: 'user@example.com',
  template: 'welcomeEmail',
  context: {
    name: 'John Doe',
  },
});

// Check result
if (result.success) {
  console.log('Email sent successfully!', result.messageId);
} else {
  console.error('Failed to send email:', result.error);
}

// Send raw email
await sendRawEmail({
  to: 'user@example.com',
  subject: 'Raw email example',
  html: '<p>This is a raw email</p>',
});
```

## Email Templates

Email templates are React components stored in the `emails` directory. Each template has specific props and is rendered to HTML/text when sent.

### Available Templates

- `verifyEmail`: For email verification
- `forgotPassword`: For password reset
- `subscribeNewsletter`: For new user subscribed

### Creating a New Template

1. Create a React component in the `emails` directory
2. Make sure it accepts `BaseEmailProps` plus any specific props
3. Add it to the `EmailTemplates` export in `emails/index.ts`
4. Add corresponding subject translations in the i18n messages

Example:

```tsx
// emails/MyNewEmail.tsx
import { BaseEmailProps } from '@/mail/types';
import { Body, Container, Head, Html, Text } from '@react-email/components';

interface MyNewEmailProps extends BaseEmailProps {
  username: string;
}

export default function MyNewEmail({ username, messages, locale }: MyNewEmailProps) {
  return (
    <Html lang={locale}>
      <Head />
      <Body>
        <Container>
          <Text>Hello {username}!</Text>
        </Container>
      </Body>
    </Html>
  );
}
```

Then add it to `emails/index.ts`:

```typescript
import MyNewEmail from './MyNewEmail';

export const EmailTemplates = {
  // ... existing templates
  myNewEmail: MyNewEmail,
};
```

## Configuration

The email system configuration is defined in `config/mail-config.ts`. It includes settings like:

- Default "from" email address
- Default locale for emails

## Providers

### Resend

[Resend](https://resend.com/) is the default email provider. It requires an API key set as `RESEND_API_KEY` in your environment variables.

### Adding a New Provider

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
    // Implementation
  }

  public async sendRawEmail(params: SendRawEmailParams): Promise<SendEmailResult> {
    // Implementation
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