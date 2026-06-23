import express from "express";
import { getMenu, addDish, updateDish, deleteDish } from "../controllers/edit.js";
const router = express.Router();

router.get("/:menuType", getMenu);
router.post("/:menuType", addDish);
router.put("/:menuType/:id", updateDish);
router.delete("/:menuType/:id", deleteDish);

export default router;
