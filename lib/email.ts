const nodemailer = require('nodemailer');

export interface EmailOptions {
  to: string;
  subject: string;
  html?: string;
  text?: string;
}

// Create reusable transporter
const createTransporter = () => {
  const port = parseInt(process.env.SMTP_PORT || '587');
  const config = {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: port,
    secure: port === 465, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  };

  return nodemailer.createTransport(config);
};

export async function sendEmail(options: EmailOptions) {
  try {
    const transporter = createTransporter();

    // Verify transporter configuration
    await transporter.verify();

    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.SMTP_USER,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    };

    const info = await transporter.sendMail(mailOptions);

    return {
      success: true,
      messageId: info.messageId,
      response: info.response,
    };
  } catch (error) {
    console.error('Email sending failed:', error);
    throw error;
  }
}

export async function testEmailConnection() {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    return { success: true, message: 'Email configuration is valid' };
  } catch (error: any) {
    return {
      success: false,
      message: 'Email configuration failed',
      error: error.message
    };
  }
}
