import { Request, Response } from "express";
import CylinderLog from "../models/cylinderLog.model";

export const createCylinderLog = async (req: Request, res: Response) => {
	try {
		const { building, date, cylindersPurchased, dealer, cost, otherCost } = req.body;
		if (!building || !date || !cylindersPurchased || !cost) {
			res.status(400).json({ message: "Building, date, cylinders purchased and cost are required" });
			return;
		}
		const cylinderLog = await CylinderLog.create({
			building,
			date: new Date(date),
			cylindersPurchased,
			dealer,
			cost,
			otherCost,
		});
		res.status(201).json(cylinderLog);
	} catch (error: any) {
		console.error("Error creating cylinder log:", error.message);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const getCylinderLogs = async (req: Request, res: Response) => {
	try {
		const cylinderLogs = await CylinderLog.find().populate("building").sort({ date: -1 });
		if (!cylinderLogs || cylinderLogs.length === 0) {
			res.status(404).json({ message: "No cylinder logs found" });
			return;
		}
		res.status(200).json(cylinderLogs);
	} catch (error: any) {
		console.error("Error fetching cylinder logs:", error.message);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const deleteCylinderLog = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		if (!id) {
			res.status(400).json({ message: "Cylinder log ID is required" });
			return;
		}
		const cylinderLog = await CylinderLog.findByIdAndDelete(id);
		if (!cylinderLog) {
			res.status(404).json({ message: "Cylinder log not found" });
			return;
		}
		res.status(200).json({ message: "Cylinder log deleted successfully" });
	} catch (error: any) {
		console.error("Error deleting cylinder log:", error.message);
		res.status(500).json({ message: "Internal server error" });
	}
};
