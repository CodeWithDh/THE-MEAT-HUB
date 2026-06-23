import express from "express";
import { getInvoices, deleteInvoice, deleteAllInvoices, saveAllInvoices } from "../controllers/invoices.js";

const router = express.Router();

router.get("/", getInvoices);
router.delete("/all", deleteAllInvoices);
router.get("/download-all", saveAllInvoices);
router.delete("/:filename", deleteInvoice);

export default router;
