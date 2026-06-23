import express from "express";
import { getInventory, updateInventory } from "../controllers/inventory.js";

const router = express.Router();

// Get the main inventory page
router.get("/", getInventory);

// Update a specific item in a specific table
router.put("/:table/:id", updateInventory);

export default router;
