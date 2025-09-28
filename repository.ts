import ExcelJS from "exceljs";
import type { Attachment } from "nodemailer/lib/mailer";
import { send_transaction_report_mail } from "./send_mail";

interface ITransactionReportRequest {
  description: string;
  transaction: any;
  send_to: string;
}

export class TransactionRepository {
  public async send_transaction_report({
    description,
    transaction,
    send_to,
  }: ITransactionReportRequest) {
    try {
      // 1. Cria workbook
      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet("Transactions");

      // 2. Cabeçalho
      sheet.addRow([
        "Item line",
        "From",
        "Channel",
        "Data",
        "Hora",
        "Transaction ID",
        "Payer Number",
        "Payer Name",
        "Payee Title",
        "Reference put by Payer",
        "Customer",
        "Customer Name",
        "Customer ID",
        "Loan ID",
      ]);

      // 3. Linha de saldo inicial
      sheet.addRow([
        "Opening Balance",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
      ]);

      // 4. Linha da transação (com defaults para campos vazios)
      sheet.addRow([
        transaction.item_line ?? "", // Item line
        transaction.from ?? "", // From (ex: mpesa/emola)
        transaction.channel ?? "", // Channel
        transaction.data ?? "", // Data
        transaction.hora ?? "", // Hora
        transaction.transaction_id ?? "", // Transaction ID
        transaction.payer_number ?? "", // Payer Number
        transaction.payer_name ?? "", // Payer Name
        transaction.payee_title ?? "TL", // Payee Title
        transaction.reference_put_by_payer ?? "N/A", // Reference
        transaction.customer ?? "N/A", // Customer
        transaction.customer_name ?? "N/A", // Customer Name
        transaction.customer_id ?? "N/A", // Customer ID
        transaction.loan_id ?? "N/A", // Loan ID
      ]);

      // 5. Gera buffer do excel
      const arrayBuffer = await workbook.xlsx.writeBuffer();
      const buffer = Buffer.from(arrayBuffer); // converte para Buffer do Node

      // 6. Prepara anexo
      const attachments: Attachment[] = [
        {
          filename: `transactions-${Date.now()}.xlsx`,
          content: buffer,
        },
      ];

      // 7. Envia email
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
