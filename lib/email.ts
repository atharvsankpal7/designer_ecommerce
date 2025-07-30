import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { connectDB } from '@/lib/mongodb';
import ContactSettings from '@/models/ContactSettings';
import { getContactSettings } from './actions';

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
} as SMTPTransport.Options);

// Utility function to get canonical contact settings from backend


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

export async function sendBundleFiles(email: string, bundleName: string, files: string[]) {
  // Get canonical contact settings from backend
  const contactSettings = await getContactSettings();
  
  const attachments = files.map(file => ({
    filename: file.split('/').pop(),
    path: file
  }));

  const fileCount = files.length;
  const premiumBadge = fileCount > 5 ? 
    `<div style="background: #FFD700; color: #8B7500; padding: 6px 12px; border-radius: 20px; font-weight: bold; display: inline-block; margin: 10px 0; font-size: 14px;">
      ✨ PREMIUM BUNDLE ✨
    </div>` : '';

  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: email,
    subject: `🎁 Your Exclusive ${bundleName} Bundle is Ready!`,
    html: `
    <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 20px;">
      <!-- Hero Section -->
      <div style="background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%); border-radius: 8px; padding: 30px; text-align: center; color: white; position: relative; overflow: hidden;">
        <div style="position: absolute; top: -20px; right: -20px; width: 100px; height: 100px; background: rgba(255,255,255,0.1); border-radius: 50%;"></div>
        <div style="position: absolute; bottom: -30px; left: -30px; width: 150px; height: 150px; background: rgba(255,255,255,0.1); border-radius: 50%;"></div>
        <h1 style="margin: 0; font-size: 32px; font-weight: 700; position: relative;">Bundle Unlocked! 🎉</h1>
        <p style="font-size: 18px; opacity: 0.9; margin-bottom: 0; position: relative;">You've got ${fileCount} premium files waiting!</p>
      </div>
      
      <!-- Content Card -->
      <div style="background: white; border-radius: 8px; padding: 30px; margin-top: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.08); position: relative;">
        ${premiumBadge}
        <div style="text-align: center; margin-bottom: 20px;">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-bottom: 15px;">
            <path d="M20 12V22H4V12" stroke="#6a11cb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M22 7H2V12H22V7Z" stroke="#6a11cb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M12 22V7" stroke="#6a11cb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M12 7H7.5C6.83696 7 6.20107 6.73661 5.73223 6.26777C5.26339 5.79893 5 5.16304 5 4.5C5 3.83696 5.26339 3.20107 5.73223 2.73223C6.20107 2.26339 6.83696 2 7.5 2C11 2 12 7 12 7Z" stroke="#6a11cb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M12 7H16.5C17.163 7 17.7989 6.73661 18.2678 6.26777C18.7366 5.79893 19 5.16304 19 4.5C19 3.83696 18.7366 3.20107 18.2678 2.73223C17.7989 2.26339 17.163 2 16.5 2C13 2 12 7 12 7Z" stroke="#6a11cb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <h2 style="color: #6a11cb; margin-bottom: 5px; font-size: 24px;">${bundleName}</h2>
          <p style="color: #666; margin-top: 0; font-size: 16px;">Your exclusive design bundle is attached to this email</p>
        </div>
        
        <div style="background: #F8F9FA; border-radius: 6px; padding: 15px; margin: 20px 0; text-align: center;">
          <div style="display: inline-block; margin: 0 10px;">
            <div style="font-size: 24px; font-weight: bold; color: #6a11cb;">${fileCount}</div>
            <div style="font-size: 12px; color: #666;">Premium Files</div>
          </div>
          <div style="display: inline-block; margin: 0 10px;">
            <div style="font-size: 24px; font-weight: bold; color: #6a11cb;">100%</div>
            <div style="font-size: 12px; color: #666;">Original Quality</div>
          </div>
          <div style="display: inline-block; margin: 0 10px;">
            <div style="font-size: 24px; font-weight: bold; color: #6a11cb;">∞</div>
            <div style="font-size: 12px; color: #666;">Lifetime Access</div>
          </div>
        </div>
        
        <p style="color: #666; font-size: 15px; text-align: center; line-height: 1.6;">
          All ${fileCount} files from your <strong>${bundleName}</strong> bundle are attached to this email.<br>
          You'll find everything you need to create amazing designs!
        </p>
      </div>
      
      
      <!-- Support Section -->
      <div style="background: white; border-radius: 8px; padding: 20px; margin-top: 20px; text-align: center; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">
        <h3 style="margin-top: 0; color: #6a11cb;">Need Help With Your Bundle?</h3>
        <p style="color: #666; margin-bottom: 15px;">Our design experts are ready to assist you!</p>
        <a href="mailto:${contactSettings.email}" style="background: #6a11cb; color: white; padding: 12px 25px; border-radius: 4px; text-decoration: none; display: inline-block; font-weight: 500; font-size: 15px;">Contact Our Support Team</a>
      </div>
      
      <!-- Footer -->
      <div style="text-align: center; margin-top: 30px; color: #999; font-size: 12px;">
        <p>© ${new Date().getFullYear()} SS Creation. All rights reserved.</p>
        <p>${contactSettings.address}</p>
        <p>Phone: ${contactSettings.phone} | WhatsApp: ${contactSettings.whatsappNumber}</p>
      </div>
    </div>
    `,
    attachments
  };

  await transporter.sendMail(mailOptions);
}
export async function sendProductFiles(email: string, productTitle: string, files: string[]) {
  // Get canonical contact settings from backend
  const contactSettings = await getContactSettings();
  
  const fileLinksHTML = files.map(file => {
    const fileName = file.split('/').pop();
    return `
      <div style="background: #fff; border-radius: 8px; padding: 12px 16px; margin-bottom: 10px; border: 1px solid #e0e0e0; display: flex; align-items: center;">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-right: 12px;">
          <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="#4CAF50" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M14 2V8H20" stroke="#4CAF50" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M16 13H8" stroke="#4CAF50" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M16 17H8" stroke="#4CAF50" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M10 9H9H8" stroke="#4CAF50" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <a href="${file}" download style="color: #2E7D32; font-weight: 500; text-decoration: none; flex-grow: 1;">${fileName}</a>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="#4CAF50" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M7 10L12 15L17 10" stroke="#4CAF50" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M12 15V3" stroke="#4CAF50" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
    `;
  }).join('');

  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: email,
    subject: `🎉 Your Purchase: ${productTitle} is Ready!`,
    html: `
    <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 20px;">
      <div style="background: linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%); border-radius: 8px; padding: 30px; text-align: center; color: white;">
        <h1 style="margin: 0; font-size: 28px; font-weight: 700;">Congratulations! 🎉</h1>
        <p style="font-size: 16px; opacity: 0.9; margin-bottom: 0;">Your purchase is ready for download</p>
      </div>
      
      <div style="background: white; border-radius: 8px; padding: 25px; margin-top: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">
        <div style="text-align: center; margin-bottom: 20px;">
          <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.7649 14.1003 1.98232 16.07 2.85999" stroke="#4CAF50" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M22 4L12 14.01L9 11.01" stroke="#4CAF50" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <h2 style="color: #2E7D32; margin-bottom: 5px;">Your Files Are Here!</h2>
          <p style="color: #666; margin-top: 0;">Thank you for purchasing <strong>${productTitle}</strong></p>
        </div>
        
        <div style="margin: 25px 0;">
          ${fileLinksHTML}
        </div>
        
        <p style="color: #666; font-size: 14px; text-align: center;">
          Click on any file above to download it to your device. 
          The links will remain active for future downloads.
        </p>
      </div>
      
      <div style="background: #E8F5E9; border-radius: 8px; padding: 20px; margin-top: 20px; text-align: center;">
        <h3 style="margin-top: 0; color: #2E7D32;">Need Help?</h3>
        <p style="color: #666; margin-bottom: 15px;">We're here to help you with your purchase!</p>
        <a href="mailto:${contactSettings.email}" style="background: #4CAF50; color: white; padding: 10px 20px; border-radius: 4px; text-decoration: none; display: inline-block; font-weight: 500;">Contact Support</a>
      </div>
      
      <div style="text-align: center; margin-top: 30px; color: #999; font-size: 12px;">
        <p>© ${new Date().getFullYear()} SS Creation. All rights reserved.</p>
        <p>${contactSettings.address}</p>
        <p>Phone: ${contactSettings.phone} | WhatsApp: ${contactSettings.whatsappNumber}</p>
      </div>
    </div>
    `
  };

  await transporter.sendMail(mailOptions);
}
