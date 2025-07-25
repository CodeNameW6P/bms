import { Router } from "express";
import { createBill, getBills, deleteBill } from "../controllers/bill.controller";

const router = Router();

router.post("/", createBill);
router.get("/", getBills);
router.delete("/:id", deleteBill);

export default router;
