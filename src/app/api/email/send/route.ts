import { requireAdmin } from "@/utils/auth";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {

  const authError = await requireAdmin(request);
  if (authError) {
      return authError;
  }
  
  try {
    const { formulario, resposta } = await request.json();

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: 465,
      secure: true, 
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions: nodemailer.SendMailOptions = {
      from: process.env.EMAIL_USER, 
      to: "willianuteich@hotmail.com", 
      subject: formulario.email, 
      text: "Resposta: Contato",
      html: `
        <div>
          <h2>Você recebeu uma nova mensagem do formulário de contato</h2>
          <p><strong>Nome:</strong> ${formulario.name}</p>
          <p><strong>E-mail:</strong> ${formulario.email}</p>
          <p><strong>Telefone:</strong> ${formulario.telefone}</p>
          <p><strong>Mensagem:</strong></p>
          <p>${resposta}</p>
        </div>
      `,  
    };

    const response = await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { error: false, emailSent: true, response },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message: "Erro ao enviar o e-mail", error }, { status: 500 });
  }
}
