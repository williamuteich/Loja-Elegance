import { createTransport } from "nodemailer";
import { render } from "@react-email/render";

export class SendEmail {
    async sendEmail(to: string, subject: string, html: string, text?: string): Promise<void> {
        const transporter = createTransport({
          host: process.env.SMTP_EMAIL_HOST,
          port: 587,  
          secure: false,  
          auth: {
            user: process.env.EMAIL_USER,  
            pass: process.env.PASSOWRD_EMAIL_PASS,
          }
        });

        const response = await transporter.sendMail({
            from: {
              address: "teste@hotmail.com",  
              name: process.env.SMTP_NAME,  
            },
            to: to,
            subject: subject,
            html: html,
            text: text,
        });

        const failed = response.rejected.concat(response.pending).filter(Boolean);
        if (failed.length) {
            throw new Error(`Failed to send email to ${failed.join(", ")}`);
        }
    }

    async getHtml(element: React.ReactElement): Promise<string> {
        const html = await render(element);
        return html;
    }
}
