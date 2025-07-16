import { Router } from "express";
import { testCylinder, createCylinder, getCylinders } from "../controllers/cylinder.controller";

const router = Router();

router.get("/test", testCylinder);
router.post("/", createCylinder);
router.get("/", getCylinders);

export default router;
