import { Router } from "express";
import { createAdmin, getAdmins, getAdmin, deleteAdmin } from "../controllers/admin.controller";

const router = Router();

router.post("/", createAdmin);
router.get("/", getAdmins);
router.get("/:id", getAdmin);
router.delete("/:id", deleteAdmin);

export default router;
