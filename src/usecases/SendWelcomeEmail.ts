import { SendEmail } from "@/infra/SendEmail";
import { MyTemplate } from "transactional/emails/emailContact";

export class SendWelcomeEmail {
  async execute() {
    const sendEmail = new SendEmail();
    const html = await sendEmail.getHtml(MyTemplate());

    await sendEmail.sendEmail("willianuteich@hotmail.com", "Welcome", html);
  }
}
