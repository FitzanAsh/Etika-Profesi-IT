import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendSubmissionEmail(to: string, subject: string, message: string) {
    try {
        await resend.emails.send({
            from: process.env.EMAIL_FROM!,
            to,
            subject,
            html: `
        <div style="font-family:Arial, sans-serif;padding:20px">
          <h2>${subject}</h2>
          <p>${message}</p>
          <br>
          <small>Email ini dikirim otomatis oleh sistem.</small>
        </div>
      `,
        });
    } catch (error) {
        console.error('Failed to send email:', error);
        // Don't throw - email failure shouldn't break the main flow
    }
}
