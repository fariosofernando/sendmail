import express from "express";
import cors from "cors";
import file_upload from "express-fileupload";
import { TransactionController } from "./controller";

const PORT = process.env.PORT || 3015;
const REQUEST_TIMEOUT = 120000;

const app = express();
app.use(express.json());
app.set("trust proxy", true);
app.use(
  cors({
    origin: "*",
  }),
);
app.use(
  file_upload({
    limits: { fileSize: 10 * 1024 * 1024 },
    useTempFiles: true,
    tempFileDir: "/app/files",
  }),
);

app.use((req, res, next) => {
  const start = Date.now();
  console.log(`Início da requisição: ${req.method} ${req.url}`);

  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(
      `Término da requisição: ${req.method} ${req.url} - Status: ${res.statusCode} - Tempo: ${duration}ms`,
    );
  });

  next();
});

const controller = new TransactionController();
app.post("/transaction-report", controller.send_report);

app.use((err: any, req: any, res: any, next: any) => {
  console.error(
    `Erro na requisição: ${req.method} ${req.url} - Erro: ${err.message}`,
  );
  res.status(500).json({ error: "Internal Server Error" });
});

const server = app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

server.setTimeout(REQUEST_TIMEOUT);
