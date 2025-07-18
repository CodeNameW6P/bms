import { Router } from "express";
import { adminAuthMiddleware, flatAuthMiddleware } from "../middlewares/auth.middleware";
import {
	adminAuthResponse,
	adminSignUp,
	adminSignIn,
	adminSignOut,
	flatAuthResponse,
	flatSignIn,
	flatSignOut,
} from "../controllers/auth.controller";

const router = Router();

router.get("/adminAuth", adminAuthMiddleware, adminAuthResponse);
router.post("/adminsignup", adminSignUp);
router.post("/adminsignin", adminSignIn);
router.post("/adminsignout", adminSignOut);
router.get("/flatAuth", flatAuthMiddleware, flatAuthResponse);
router.post("/flatsignin", flatSignIn);
router.post("/flatsignout", flatSignOut);

export default router;
