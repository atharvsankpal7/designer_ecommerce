import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
} as SMTPTransport.Options);

export async function sendVerificationEmail(email: string, code: string) {
  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: email,
    subject: 'Verify Your Email - Purchase Confirmation',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Email Verification</h2>
        <p>Your verification code is:</p>
        <h1 style="background: #f0f0f0; padding: 20px; text-align: center; font-size: 32px; letter-spacing: 5px;">${code}</h1>
        <p>This code will expire in 10 minutes.</p>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
}

export async function sendProductFiles(email: string, productTitle: string, files: string[]) {
  const attachments = files.map(file => ({
    filename: file.split('/').pop(),
    path: file
  }));

  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: email,
    subject: `Your Purchase: ${productTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Thank you for your purchase!</h2>
        <p>Your product files for <strong>${productTitle}</strong> are attached to this email.</p>
        <p>If you have any questions, please contact our support team.</p>
      </div>
    `,
    attachments
  };

  await transporter.sendMail(mailOptions);
}