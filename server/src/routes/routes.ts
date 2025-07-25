import { Router } from "express";
import { adminAuthMiddleware } from "../middlewares/auth.middleware";
import buildingRoutes from "./building.route";
import flatRoutes from "./flat.route";
import adminRoutes from "./admin.route";
import authRoutes from "./auth.route";
import billRoutes from "./bill.route";

const router = Router();

router.use("/buildings", buildingRoutes);
router.use("/flats", flatRoutes);
router.use("/admins", adminRoutes);
router.use("/auth", authRoutes);
router.use("/bill", billRoutes);

export default router;
