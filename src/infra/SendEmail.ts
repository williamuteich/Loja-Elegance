import { createTransport } from "nodemailer";
import { render } from "@react-email/render";

console.log('SMTP_EMAIL_HOST:', process.env.SMTP_EMAIL_HOST);
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('PASSOWRD_EMAIL_PASS:', process.env.PASSOWRD_EMAIL_PASS);
console.log('SMTP_NAME:', process.env.SMTP_NAME);

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
              address: "willianuteich@hotmail.com",  
              name: process.env.SMTP_NAME || 'William Uteichhh',  
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
