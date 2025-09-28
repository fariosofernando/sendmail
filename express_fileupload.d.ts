import * as express from "express";
import type { UploadedFile } from "express-fileupload";

declare global {
  namespace Express {
    interface Request {
      files?: { [key: string]: UploadedFile | UploadedFile[] };
    }
  }
}
