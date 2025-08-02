import { Router } from "express";
import {
	createBill,
	uploadBills,
	getBills,
	getFlatBills,
	getFlatUnpaidBills,
	deleteBill,
} from "../controllers/bill.controller";

const router = Router();

router.post("/create", createBill);
router.post("/upload", uploadBills);
router.get("/", getBills);
router.get("/:flatId", getFlatBills);
router.get("/unpaid/:flatId", getFlatUnpaidBills);
router.delete("/:id", deleteBill);

export default router;
