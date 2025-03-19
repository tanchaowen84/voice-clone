# Newsletter Module

This module provides functionality for managing newsletter subscriptions using various email service providers. Currently, it supports [Resend](https://resend.com) for handling newsletter subscriptions.

## Features

- Subscribe users to newsletters
- Unsubscribe users from newsletters
- Check subscription status
- Provider-agnostic interface for easy integration with different newsletter services
- Automatic configuration using environment variables

## Basic Usage

```typescript
import { subscribe, unsubscribe, isSubscribed } from '@/src/newsletter';

// Subscribe a user to the newsletter
const success = await subscribe('user@example.com');

// Unsubscribe a user from the newsletter
const success = await unsubscribe('user@example.com');

// Check if a user is subscribed
const subscribed = await isSubscribed('user@example.com');
```

## Configuration

The newsletter module is configured using environment variables:

```
# Required for Resend provider
RESEND_API_KEY=your-resend-api-key
RESEND_AUDIENCE_ID=your-audience-id
```

Or you can configure it programmatically:

```typescript
import { initializeNewsletterProvider } from '@/src/newsletter';

// Configure with Resend
initializeNewsletterProvider({
  resend: {
    apiKey: 'your-api-key',
    audienceId: 'your-audience-id'
  }
});
```

## Advanced Usage

### Using the Newsletter Provider Directly

If you need more control, you can interact with the newsletter provider directly:

```typescript
import { getNewsletterProvider } from '@/src/newsletter';

const provider = getNewsletterProvider();

// Use provider methods directly
const result = await provider.subscribe({ email: 'user@example.com' });
```

### Creating a Provider Instance Manually

You can create a provider instance directly without configuring the global instance:

```typescript
import { createNewsletterProvider, ResendNewsletterProvider } from '@/src/newsletter';

// Using the factory function
const resendProvider = createNewsletterProvider('resend', {
  apiKey: 'your-api-key',
  audienceId: 'your-audience-id'
});

// Or creating an instance directly
const manualProvider = new ResendNewsletterProvider(
  'your-api-key',
  'your-audience-id'
);
```

### Using a Custom Provider Implementation

You can create and use your own newsletter provider implementation:

```typescript
import { NewsletterProvider, SubscribeNewsletterProps } from '@/src/newsletter';

class CustomNewsletterProvider implements NewsletterProvider {
  async subscribe(params: SubscribeNewsletterProps): Promise<boolean> {
    // Your implementation
    return true;
  }

  async unsubscribe(params: UnsubscribeNewsletterProps): Promise<boolean> {
    // Your implementation
    return true;
  }

  async checkSubscribeStatus(params: CheckSubscribeStatusProps): Promise<boolean> {
    // Your implementation
    return true;
  }
  
  getProviderName(): string {
    return 'CustomProvider';
  }
}

// Use your custom provider directly
const customProvider = new CustomNewsletterProvider();
const result = await customProvider.subscribe({ email: 'user@example.com' });
```

## API Reference

### Main Functions

- `subscribe(email)`: Subscribe a user to the newsletter
- `unsubscribe(email)`: Unsubscribe a user from the newsletter
- `isSubscribed(email)`: Check if a user is subscribed to the newsletter

### Provider Management

- `getNewsletterProvider()`: Get the configured newsletter provider instance
- `initializeNewsletterProvider(config?)`: Initialize the newsletter provider with specific options
- `createNewsletterProvider(type, config)`: Create a new provider instance of the specified type

### Provider Interface

The `NewsletterProvider` interface defines the following methods:

- `subscribe(params)`: Subscribe a user to the newsletter
- `unsubscribe(params)`: Unsubscribe a user from the newsletter
- `checkSubscribeStatus(params)`: Check if a user is subscribed to the newsletter
- `getProviderName()`: Get the provider name

### Types

- `SubscribeNewsletterProps`: Parameters for subscribing a user
- `UnsubscribeNewsletterProps`: Parameters for unsubscribing a user
- `CheckSubscribeStatusProps`: Parameters for checking subscription status
- `NewsletterConfig`: Configuration options for the newsletter module 