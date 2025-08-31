import { Router } from "express";
import { adminAuthMiddleware, flatAuthMiddleware } from "../middlewares/auth.middleware";
import buildingRoutes from "./building.route";
import flatRoutes from "./flat.route";
import adminRoutes from "./admin.route";
import authRoutes from "./auth.route";
import billRoutes from "./bill.route";
import cylinderLogRoutes from "./cylinderLog.route";
import contributionRoutes from "./contribution.route";

const router = Router();

router.use("/buildings", buildingRoutes);
router.use("/flats", flatRoutes);
router.use("/admins", adminRoutes);
router.use("/auth", authRoutes);
router.use("/bills", billRoutes);
router.use("/cylinder-logs", cylinderLogRoutes);
router.use("/contributions", contributionRoutes);

export default router;
