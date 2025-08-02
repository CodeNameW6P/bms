import { Router } from "express";
import { createCylinderLog, getCylinderLogs, deleteCylinderLog } from "../controllers/cylinderLog.controller";

const router = Router();

router.post("/", createCylinderLog);
router.get("/", getCylinderLogs);
router.delete("/:id", deleteCylinderLog);

export default router;
