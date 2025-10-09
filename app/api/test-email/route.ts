import { NextRequest, NextResponse } from 'next/server';
import { sendEmail, testEmailConnection } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { to = 'andiagung193@gmail.com', subject = 'Test Email dari Metito', message = 'Halo! Ini adalah email test dari sistem Metito. Email berhasil dikonfigurasi dengan baik.', testConnection } = body;

    // If testConnection flag is true, just test the connection
    if (testConnection) {
      const result = await testEmailConnection();
      return NextResponse.json(result);
    }

    // Send test email
    const result = await sendEmail({
      to,
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">${subject}</h2>
          <div style="padding: 20px; background-color: #f5f5f5; border-radius: 5px;">
            ${message}
          </div>
          <p style="color: #666; font-size: 12px; margin-top: 20px;">
            This is a test email from Metito System
          </p>
        </div>
      `,
      text: message,
    });

    return NextResponse.json({
      success: true,
      message: 'Email sent successfully',
      messageId: result.messageId,
    });

  } catch (error: any) {
    console.error('Test email error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to send email',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
