/**
 * Send a message to Discord when a user makes a purchase
 * @param sessionId The Stripe checkout session ID
 * @param customerId The Stripe customer ID
 * @param githubUsername The GitHub username of the customer
 * @param amount The purchase amount in the currency's main unit (e.g., dollars, not cents)
 */
export async function sendMessageToDiscord(
  sessionId: string,
  customerId: string,
  githubUsername: string,
  amount: number
): Promise<void> {
  try {
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

    if (!webhookUrl) {
      console.warn(
        'DISCORD_WEBHOOK_URL is not set, skipping Discord notification'
      );
      return;
    }

    // Format the message
    const message = {
      // You can customize these values later
      username: 'MkSaaS Bot',
      avatar_url: 'https://mksaas.com/logo.png',
      embeds: [
        {
          title: '🎉 New Purchase',
          color: 0x4caf50, // Green color
          fields: [
            {
              name: 'GitHub Username',
              value: githubUsername,
              inline: true,
            },
            {
              name: 'Amount',
              value: `$${amount.toFixed(2)}`,
              inline: true,
            },
            {
              name: 'Customer ID',
              value: `\`${customerId}\``,
              inline: false,
            },
            {
              name: 'Session ID',
              value: `\`${sessionId}\``,
              inline: false,
            },
          ],
          timestamp: new Date().toISOString(),
        },
      ],
    };

    // Send the webhook request
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });

    if (!response.ok) {
      // throw new Error(`Discord webhook request failed with status ${response.status}`);
      console.error(
        `<< Failed to send Discord notification for GitHub user ${githubUsername}:`,
        response
      );
    }

    console.log(
      `<< Successfully sent Discord notification for GitHub user ${githubUsername}`
    );
  } catch (error) {
    console.error('<< Failed to send Discord notification:', error);
    // Don't rethrow the error to avoid interrupting the payment flow
  }
}
