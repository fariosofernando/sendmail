import type { Request, Response } from "express";
import { TransactionRepository } from "./repository";

export class TransactionController {
  private transaction_repository: TransactionRepository;

  constructor() {
    this.transaction_repository = new TransactionRepository();
    this.send_report = this.send_report.bind(this);
  }

  public send_report = async (req: Request, res: Response) => {
    const { description, send_to, transaction } = req.body;

    if (!description || !send_to || !transaction) {
      return res.status(400).json({ error: "Campos obrigatórios faltando." });
    }

    try {
      const result = await this.transaction_repository.send_transaction_report({
        description,
        transaction,
        send_to,
      });

      return res.status(201).json(result);
    } catch (error: any) {
      console.error("Erro em send_report:", error);
      return res.status(500).json({ error: error.message });
    }
  };
}
