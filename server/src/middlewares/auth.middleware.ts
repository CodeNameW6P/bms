import { Response, NextFunction } from "express";
import { verifyToken } from "../config/jwt";
import Admin from "../models/admin.model";
import Flat from "../models/flat.model";

export const adminAuthMiddleware = async (req: any, res: Response, next: NextFunction) => {
	try {
		const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
		if (!token) {
			res.status(401).json({ message: "Unauthorized" });
			return;
		}

		const decoded: any = verifyToken(token);
		if (!decoded) {
			res.status(401).json({ message: "Invalid token" });
			return;
		}

		const admin = await Admin.findById(decoded.id).select("-password");
		if (!admin) {
			res.status(404).json({ message: "Couldn't find admin" });
			return;
		}

		req.admin = admin;
		next();
	} catch (error: any) {
		console.error("Authentication error:", error.message);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const flatAuthMiddleware = async (req: any, res: Response, next: NextFunction) => {
	try {
		const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
		if (!token) {
			res.status(401).json({ message: "Unauthorized" });
			return;
		}

		const decoded: any = verifyToken(token);
		if (!decoded) {
			res.status(401).json({ message: "Invalid token" });
			return;
		}

		const flat = await Flat.findById(decoded.id).populate("building");
		if (!flat) {
			res.status(404).json({ message: "Couldn't find flat" });
			return;
		}

		req.flat = flat;
		next();
	} catch (error: any) {
		console.error("Authentication error:", error.message);
		res.status(500).json({ message: "Internal server error" });
	}
};
