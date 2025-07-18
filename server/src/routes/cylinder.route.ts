import { Router } from "express";
import { createCylinder, getCylinders } from "../controllers/cylinder.controller";

const router = Router();

router.post("/", createCylinder);
router.get("/", getCylinders);

export default router;
