import type { Messages } from '@/i18n/messages';
import { getMessagesForLocale } from '@/i18n/messages';
import { Locale, routing } from '@/i18n/routing';
import { mailTemplates } from '@/mail/emails';
import { sendEmail } from '@/mail/provider/resend';
import { render } from '@react-email/render';

type Template = keyof typeof mailTemplates;

/**
 * send email
 *
 * 1. with given template, and context
 * 2. with given subject, text, and html
 */
export async function send<T extends Template>(
  params: {
    to: string;
    locale?: Locale;
  } & (
    | {
        template: T;
        context: Omit<
          Parameters<(typeof mailTemplates)[T]>[0],
          'locale' | 'messages'
        >;
      }
    | {
        subject: string;
        text?: string;
        html?: string;
      }
  )
) {
  const { to, locale = routing.defaultLocale } = params;
  console.log('send, locale:', locale);

  let html: string;
  let text: string;
  let subject: string;

  // if template is provided, get the template
  // otherwise, use the subject, text, and html
  if ('template' in params) {
    const { template, context } = params;
    const mailTemplate = await getTemplate({
      template,
      context,
      locale,
    });
    subject = mailTemplate.subject;
    text = mailTemplate.text;
    html = mailTemplate.html;
  } else {
    subject = params.subject;
    text = params.text ?? '';
    html = params.html ?? '';
  }

  try {
    await sendEmail({
      to,
      subject,
      text,
      html,
    });
    return true;
  } catch (e) {
    console.error('Error sending email', e);
    return false;
  }
}

/**
 * get rendered email for given template, context, and locale
 */
async function getTemplate<T extends Template>({
  template,
  context,
  locale,
}: {
  template: T;
  context: Omit<
    Parameters<(typeof mailTemplates)[T]>[0],
    'locale' | 'messages'
  >;
  locale: Locale;
}) {
  const mainTemplate = mailTemplates[template];
  const messages = await getMessagesForLocale(locale);

  const email = mainTemplate({
    ...(context as any),
    locale,
    messages,
  });

  // get the subject from the messages
  const subject =
    'subject' in messages.Mail[template as keyof Messages['Mail']]
      ? messages.Mail[template].subject
      : '';

  const html = await render(email);
  const text = await render(email, { plainText: true });
  return { html, text, subject };
}
