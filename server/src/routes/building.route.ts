import { Router } from "express";
import {
	createBuilding,
	getBuildings,
	getBuilding,
	deleteBuilding,
} from "../controllers/building.controller";

const router = Router();

router.post("/", createBuilding);
router.get("/", getBuildings);
router.get("/:number", getBuilding);
router.delete("/:number", deleteBuilding);

export default router;
