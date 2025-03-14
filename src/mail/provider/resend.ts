import { websiteConfig } from '@/config';
import { SendEmailHandler } from '@/mail/utils/types';
import { Resend } from 'resend';

// 如果没有API密钥，使用一个假的密钥，避免构建错误
const apiKey = process.env.RESEND_API_KEY || 'test_api_key';
export const resend = new Resend(apiKey);

export const sendEmail: SendEmailHandler = async ({ to, subject, html }) => {
  // 如果没有API密钥，记录日志并返回，避免发送请求
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not set, skipping email send');
    return;
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: websiteConfig.mail.from,
      to,
      subject,
      html,
    }),
  });

  if (!response.ok) {
    console.error('Error sending email', await response.json());
    throw new Error('Error sending email');
  }
};
