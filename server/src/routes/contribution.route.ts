import { Router } from "express";
import {
	createContribution,
	getFlatContributions,
	deleteContribution,
	getContributions,
	updateContribution,
	getCurrentFlatContribution,
} from "../controllers/contribution.controller";

const router = Router();

router.post("/create", createContribution);
router.post("/upload", () => {});
router.get("/", getContributions);
router.get("/flat/:flatId", getFlatContributions);
router.get("/flat/current/:flatId", getCurrentFlatContribution);
router.put("/:id", updateContribution);
router.delete("/:id", deleteContribution);

export default router;
