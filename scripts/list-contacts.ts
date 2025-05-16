import dotenv from 'dotenv';
import { Resend } from 'resend';
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function listContacts() {
  const contacts = await resend.contacts.list({
    audienceId: process.env.RESEND_AUDIENCE_ID!,
  });

  // print all emails
  const emails: string[] = [];
  if (Array.isArray(contacts.data?.data)) {
    for (const contact of contacts.data.data) {
      emails.push(contact.email);
    }
  } else {
    console.error('contacts is not iterable');
  }

  console.log(emails.join(', '));
}

listContacts();
