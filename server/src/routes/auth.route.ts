import { Router } from "express";
import { adminSignUp, adminSignIn, adminSignOut } from "../controllers/auth.controller";

const router = Router();

router.post("/adminsignup", adminSignUp);
router.post("/adminsignin", adminSignIn);
router.post("/adminsignout", adminSignOut);

export default router;
