import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

async function sendResetEmail(email: string, token: string) {

  const resetUrl = `${process.env.NEXTAUTH_URL}/resetPwd/reset/${token}`;

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_EMAIL_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_EMAIL_PORT || 465),
    secure: true, 
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.PASSOWRD_EMAIL_PASS,
    },
  });

  const htmlTemplate = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 5px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="color: #d53f8c; margin-bottom: 10px;">Elegance</h1>
        <p style="font-size: 18px; color: #333; font-weight: bold;">Recuperación de contraseña</p>
      </div>
      
      <div style="padding: 20px; background-color: #f9f9f9; border-radius: 5px;">
        <p style="margin-bottom: 15px;">Hemos recibido una solicitud para restablecer la contraseña de tu cuenta.</p>
        <p style="margin-bottom: 15px;">Para crear una nueva contraseña, haz clic en el siguiente enlace:</p>
        
        <div style="text-align: center; margin: 25px 0;">
          <a href="${resetUrl}" style="background-color: #d53f8c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Restablecer contraseña</a>
        </div>
        
        <p style="margin-bottom: 15px;">Este enlace expirará en 1 hora por motivos de seguridad.</p>
        <p style="margin-bottom: 15px;">Si no solicitaste restablecer tu contraseña, puedes ignorar este correo electrónico.</p>
      </div>
      
      <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e1e1e1; text-align: center; color: #666; font-size: 12px;">
        <p>&copy; ${new Date().getFullYear()} Elegance. Todos los derechos reservados.</p>
      </div>
    </div>
  `;

  const mailOptions = {
    from: `"${process.env.SMTP_NAME || 'Elegance'}" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Recuperación de contraseña - Elegance',
    html: htmlTemplate,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    return false;
  }
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'El correo electrónico es obligatorio' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
   
      return NextResponse.json({ message: 'Si el correo electrónico existe, se enviará un enlace de recuperación' }, { status: 200 });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const tokenExpiry = new Date();
    tokenExpiry.setHours(tokenExpiry.getHours() + 1); 

    await prisma.passwordReset.upsert({
      where: { userId: user.id },
      update: {
        token: resetToken,
        expiresAt: tokenExpiry,
      },
      create: {
        userId: user.id,
        token: resetToken,
        expiresAt: tokenExpiry,
      },
    });

    const emailSent = await sendResetEmail(email, resetToken);

    if (!emailSent) {
      return NextResponse.json({ error: 'Error al enviar el correo electrónico' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Si el correo electrónico existe, se enviará un enlace de recuperación' }, { status: 200 });
  } catch (error) {
    console.error('Error al procesar la solicitud de restablecimiento de contraseña:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}