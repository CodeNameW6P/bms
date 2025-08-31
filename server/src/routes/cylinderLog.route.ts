import { Router } from "express";
import {
	createCylinderLog,
	getCylinderLogs,
	updateCylinderLog,
	deleteCylinderLog,
} from "../controllers/cylinderLog.controller";

const router = Router();

router.post("/", createCylinderLog);
router.get("/", getCylinderLogs);
router.put("/:id", updateCylinderLog);
router.delete("/:id", deleteCylinderLog);

export default router;
