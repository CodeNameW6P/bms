import { Router } from "express";
import { adminAuthMiddleware, flatAuthMiddleware } from "../middlewares/auth.middleware";
import {
	adminAuthVerify,
	adminSignUp,
	adminSignIn,
	adminSignOut,
	flatAuthVerify,
	flatSignIn,
	flatSignOut,
} from "../controllers/auth.controller";

const router = Router();

router.get("/admin-auth-verify", adminAuthMiddleware, adminAuthVerify);
router.post("/admin-sign-up", adminSignUp);
router.post("/admin-sign-in", adminSignIn);
router.post("/admin-sign-out", adminSignOut);
router.get("/flat-auth-verify", flatAuthMiddleware, flatAuthVerify);
router.post("/flat-sign-in", flatSignIn);
router.post("/flat-sign-out", flatSignOut);

export default router;
