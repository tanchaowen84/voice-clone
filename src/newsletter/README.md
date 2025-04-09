# Newsletter Module

This module provides functionality for managing newsletter subscriptions using various email service providers. Currently, it supports [Resend](https://resend.com) for handling newsletter subscriptions.

## Structure

The newsletter system is designed with the following components:

- **Provider Interface**: A common interface for newsletter providers in `types.ts`
- **Providers**: Implementations for different newsletter service providers
- **Configuration**: Configuration for newsletter defaults and settings

## Features

- Subscribe users to newsletters
- Unsubscribe users from newsletters
- Check subscription status
- Provider-agnostic interface for easy integration with different newsletter services
- Automatic configuration using environment variables

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

## Configuration

The newsletter module is configured using environment variables:

```
# Required for Resend provider
RESEND_API_KEY=your-resend-api-key
RESEND_AUDIENCE_ID=your-audience-id
```

Or you can configure it programmatically:

```typescript
import { initializeNewsletterProvider } from '@/newsletter';

// Configure with Resend
initializeNewsletterProvider();
```

## Advanced Usage

### Using the Newsletter Provider Directly

If you need more control, you can interact with the newsletter provider directly:

```typescript
import { getNewsletterProvider } from '@/newsletter';

const provider = getNewsletterProvider();

// Use provider methods directly
const result = await provider.subscribe({ email: 'user@example.com' });
```

### Using a Custom Provider Implementation

You can create and use your own newsletter provider implementation:

```typescript
import { NewsletterProvider, SubscribeNewsletterProps } from '@/newsletter';

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
- `initializeNewsletterProvider()`: Initialize the newsletter provider

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