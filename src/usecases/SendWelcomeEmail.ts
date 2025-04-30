import { SendEmail } from "@/infra/SendEmail";
import { MyTemplate } from "@/packages/transactional/emails/emailContact";

export class SendWelcomeEmail {
  async execute(toEmail: string, message: string) {

    try {
      const sendEmail = new SendEmail();
      const html = await sendEmail.getHtml(MyTemplate({message}));

      await sendEmail.sendEmail(toEmail, "Welcome", html);

      return { success: true };
    } catch (error) {
      return { success: false, error: error || "Erro ao enviar e-mail" };
    }
  }
}
