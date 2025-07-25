import { Router } from "express";
import { adminAuthMiddleware, flatAuthMiddleware } from "../middlewares/auth.middleware";
import {
	adminAuthCheck,
	adminSignUp,
	adminSignIn,
	adminSignOut,
	flatAuthCheck,
	flatSignIn,
	flatSignOut,
} from "../controllers/auth.controller";

const router = Router();

router.get("/admin-auth-check", adminAuthMiddleware, adminAuthCheck);
router.post("/admin-sign-up", adminSignUp);
router.post("/admin-sign-in", adminSignIn);
router.post("/admin-sign-out", adminSignOut);
router.get("/flat-auth-check", flatAuthMiddleware, flatAuthCheck);
router.post("/flat-sign-in", flatSignIn);
router.post("/flat-sign-out", flatSignOut);

export default router;
