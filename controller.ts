import type { Request, Response } from "express";
import { TransactionRepository } from "./repository";

export class TransactionController {
  private transaction_repository: TransactionRepository;

  constructor() {
    this.transaction_repository = new TransactionRepository();
    this.send_report = this.send_report.bind(this);
  }

  public send_report = async (req: Request, res: Response) => {
    const { description, send_to } = req.body;
    const files = req.files;

    if (!description || !send_to) {
      return res.status(400).json({ error: "Campos obrigatórios faltando." });
    }

    if (!files || Object.keys(files).length === 0) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    try {
      const file = req.files.file as any;

      if (!file) {
        return res.status(400).json({ error: "Arquivo Excel é obrigatório." });
      }

      const result = await this.transaction_repository.send_transaction_report({
        description,
        excelBuffer: file.data,
        filename: file.name,
        send_to: send_to,
      });

      return res.status(201).json(result);
    } catch (error: any) {
      console.error("Erro em send_report:", error);
      return res.status(500).json({ error: error.message });
    }
  };
}
