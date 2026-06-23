import express from "express";
import { getSalesDashboard } from "../controllers/sales.js";

const router = express.Router();

router.get("/", getSalesDashboard);

export default router;
