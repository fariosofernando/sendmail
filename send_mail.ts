import nodemailer from "nodemailer";
import type { Attachment } from "nodemailer/lib/mailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.USER_GMAIL,
    pass: process.env.PASSWORD_GMAIL,
  },
});

export async function send_transaction_report_mail(reportDetails: {
  reportId: string;
  description: string;
  attachments: Attachment[];
  send_to: string;
}) {
  const { reportId, description, attachments, send_to } = reportDetails;

  try {
    const info = await transporter.sendMail({
      from: {
        name: "Finance Tracker",
        address: `no-reply@${process.env.USER_GMAIL}`,
      },
      to: send_to,
      subject: `Relatório de Transações - ID: ${reportId}`,
      html: `<p>Olá,</p>
        <p>Um novo relatório de transações foi recebido:</p>
        <p><strong>ID:</strong> ${reportId}</p>
        <p><strong>Descrição:</strong> ${description}</p>
        <p>Em anexo, o arquivo Excel com os detalhes das transações.</p>
        <p>Obrigado,</p>
        <p><strong>Equipe Finance Tracker</strong></p>`,
      attachments,
    });
    console.log("✅ Email de relatório de transações enviado:", info.response);
  } catch (error) {
    console.error("❌ Erro ao enviar email de relatório de transações:", error);
  }
}
