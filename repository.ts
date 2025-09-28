import type { Attachment } from "nodemailer/lib/mailer";
import { send_transaction_report_mail } from "./send_mail";

interface ITransactionReportRequest {
  description: string;
  excelBuffer: Buffer;
  filename: string;
  send_to: string;
}

export class TransactionRepository {
  public async send_transaction_report({
    description,
    excelBuffer,
    filename,
    send_to,
  }: ITransactionReportRequest) {
    const attachments: Attachment[] = [
      {
        filename,
        content: excelBuffer,
      },
    ];

    try {
      await send_transaction_report_mail({
        reportId: Date.now().toString(),
        description,
        attachments,
        send_to,
      });
      return { status: "sent" };
    } catch (error: any) {
      throw new Error(`Falha ao enviar e-mail: ${error.message}`);
    }
  }
}
