import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  try {
    const { to, subject, message, pdfBase64 } = await req.json();
    if (!to || !subject || !message || !pdfBase64) {
      return NextResponse.json({ error: 'Dados incompletos.' }, { status: 400 });
    }

    // Configuração do transporte (ajustar para SMTP real do escritório)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `ArcFlow <${process.env.SMTP_USER}>`,
      to,
      subject,
      text: message,
      html: `<p>${message}</p>`,
      attachments: [
        {
          filename: 'Proposta-ArcFlow.pdf',
          content: Buffer.from(pdfBase64, 'base64'),
          contentType: 'application/pdf',
        },
      ],
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao enviar e-mail', details: String(error) }, { status: 500 });
  }
} 