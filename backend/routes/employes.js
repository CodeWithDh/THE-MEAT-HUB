import express from "express";
import { getEmployeesPage, createEmployee, updateEmployee, deleteEmployee } from "../controllers/employes.js";

const router = express.Router();

router.get("/", getEmployeesPage);
router.post("/", createEmployee);
router.put("/:id", updateEmployee);
router.delete("/:id", deleteEmployee);

export default router;
