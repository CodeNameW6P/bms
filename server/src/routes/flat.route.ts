import { Router } from "express";
import {
	createFlat,
	getFlats,
	getFlat,
	updateFlat,
	deleteFlat,
} from "../controllers/flat.controller";

const router = Router();

router.post("/", createFlat);
router.get("/", getFlats);
router.get("/:number", getFlat);
router.put("/:number", updateFlat);
router.delete("/:number", deleteFlat);

export default router;
