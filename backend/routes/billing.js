import express from "express";
import { getBillingPage, generateManualInvoice } from "../controllers/billing.js";

const router = express.Router();

router.get("/", getBillingPage);
router.post("/generate", generateManualInvoice);

export default router;
