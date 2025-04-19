# Newsletter Module

This module provides functionality for managing newsletter subscriptions using various email service providers. Currently, it supports [Resend](https://resend.com) for handling newsletter subscriptions.

## Overview

The newsletter system is designed to be:

- **Modular**: Easy to extend with new providers
- **Flexible**: Simple API for subscription management
- **Type-safe**: Full TypeScript support
- **Provider-agnostic**: Common interface for different newsletter services

## Directory Structure

```
src/newsletter/
├── provider/       # Newsletter provider implementations
│   └── resend.ts   # Resend.com provider implementation
├── index.ts        # Main API and utility functions
├── types.ts        # TypeScript types and interfaces
└── README.md       # This documentation
```

## Features

- Subscribe users to newsletters
- Unsubscribe users from newsletters
- Check subscription status
- Provider-agnostic interface for easy integration with different newsletter services
- Automatic configuration using environment variables

## Configuration

The newsletter module is configured in two ways:

1. In `src/config/website.tsx`:

```typescript
// In src/config/website.tsx
export const websiteConfig = {
  // ...other config
  newsletter: {
    provider: 'resend', // Newsletter provider to use
    autoSubscribeAfterSignUp: false, // Whether to automatically subscribe users after sign up
  },
  // ...other config
}
```

2. Using environment variables:

```
# Required for Resend provider
RESEND_API_KEY=your-resend-api-key
RESEND_AUDIENCE_ID=your-audience-id
```

## Basic Usage

```typescript
import { subscribe, unsubscribe, isSubscribed } from '@/newsletter';

// Subscribe a user to the newsletter
const success = await subscribe('user@example.com');

// Unsubscribe a user from the newsletter
const success = await unsubscribe('user@example.com');

// Check if a user is subscribed
const subscribed = await isSubscribed('user@example.com');
```

## Using with Email Templates

You can combine the newsletter functionality with the email system to send confirmation emails:

```typescript
import { subscribe } from '@/newsletter';
import { sendEmail } from '@/mail';

export async function subscribeWithConfirmation(email: string) {
  // Subscribe the user
  const success = await subscribe(email);
  
  if (success) {
    // Send a confirmation email
    await sendEmail({
      to: email,
      template: 'subscribeNewsletter',
      context: {
        name: email.split('@')[0], // Simple name extraction
        unsubscribeUrl: `https://example.com/unsubscribe?email=${encodeURIComponent(email)}`,
      },
    });
  }
  
  return success;
}
```
## Customization

### Creating a Custom Provider

You can create and use your own newsletter provider implementation:

```typescript
import { 
  NewsletterProvider, 
  SubscribeNewsletterParams,
  UnsubscribeNewsletterParams,
  CheckSubscribeStatusParams 
} from '@/newsletter/types';

export class CustomNewsletterProvider implements NewsletterProvider {
  constructor() {
    // Initialize your provider
  }

  public getProviderName(): string {
    return 'CustomProvider';
  }

  async subscribe({ email }: SubscribeNewsletterParams): Promise<boolean> {
    // Implementation for subscribing a user
    return true;
  }

  async unsubscribe({ email }: UnsubscribeNewsletterParams): Promise<boolean> {
    // Implementation for unsubscribing a user
    return true;
  }

  async checkSubscribeStatus({ email }: CheckSubscribeStatusParams): Promise<boolean> {
    // Implementation for checking subscription status
    return true;
  }
}
```

Then update the provider selection logic in `index.ts`:

```typescript
import { CustomNewsletterProvider } from './provider/custom-provider';

export const initializeNewsletterProvider = (): NewsletterProvider => {
  if (!newsletterProvider) {
    if (websiteConfig.newsletter.provider === 'resend') {
      newsletterProvider = new ResendNewsletterProvider();
    } else if (websiteConfig.newsletter.provider === 'custom') {
      newsletterProvider = new CustomNewsletterProvider();
    } else {
      throw new Error(
        `Unsupported newsletter provider: ${websiteConfig.newsletter.provider}`
      );
    }
  }

  return newsletterProvider;
};
```

## API Reference

### Main Functions

- `subscribe(email)`: Subscribe a user to the newsletter
- `unsubscribe(email)`: Unsubscribe a user from the newsletter
- `isSubscribed(email)`: Check if a user is subscribed to the newsletter

### Provider Management

- `getNewsletterProvider()`: Get the configured newsletter provider instance
- `initializeNewsletterProvider()`: Initialize the newsletter provider based on configuration

### Provider Interface

The `NewsletterProvider` interface defines the following methods:

- `subscribe(params)`: Subscribe a user to the newsletter
- `unsubscribe(params)`: Unsubscribe a user from the newsletter
- `checkSubscribeStatus(params)`: Check if a user is subscribed to the newsletter
- `getProviderName()`: Get the provider name

### Types

- `SubscribeNewsletterParams`: Parameters for subscribing a user
- `UnsubscribeNewsletterParams`: Parameters for unsubscribing a user
- `CheckSubscribeStatusParams`: Parameters for checking subscription status

## Best Practices

1. **Validate Email Addresses**: Always validate email addresses before subscribing users
2. **Handle Errors Gracefully**: Provide user-friendly error messages when subscription fails
3. **Confirmation Emails**: Send confirmation emails when users subscribe
4. **Unsubscribe Link**: Always include an unsubscribe link in your newsletter emails
5. **Rate Limiting**: Implement rate limiting on your subscription endpoints to prevent abuse
6. **Privacy Policy**: Make sure your website has a privacy policy explaining how you use subscriber data