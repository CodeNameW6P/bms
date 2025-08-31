import { Request, Response } from "express";
import CylinderLog from "../models/cylinderLog.model";

export const createCylinderLog = async (req: Request, res: Response) => {
	try {
		const { buildingId, date, cylindersPurchased, dealer, cost, otherCost = 0 } = req.body;
		if (!buildingId || !date || !cylindersPurchased || !cost) {
			res.status(400).json({
				message: "Building ID, date, cylinders purchased and cost are required",
			});
			return;
		}

		const cylinderLog = await CylinderLog.create({
			building: buildingId,
			date,
			cylindersPurchased,
			dealer,
			cost,
			otherCost: otherCost || 0,
		});
		res.status(201).json(cylinderLog);
	} catch (error: any) {
		console.error("Error creating cylinder log:", error.message);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const getCylinderLogs = async (req: Request, res: Response) => {
	try {
		let { page = 1, limit = 15, all } = req.query;
		if (all === "true") {
			const cylinderLogs = await CylinderLog.find().populate("building").sort({ date: -1 });
			res.status(200).json(cylinderLogs);
			return;
		}

		page = parseInt(page as string);
		limit = parseInt(limit as string);

		const totalCylinderLogs = await CylinderLog.countDocuments();
		const cylinderLogs = await CylinderLog.find()
			.populate("building")
			.sort({ date: -1 })
			.skip((page - 1) * limit)
			.limit(limit);

		res.status(200).json({
			cylinderLogs,
			totalCylinderLogs,
			totalPages: Math.ceil(totalCylinderLogs / limit),
		});
	} catch (error: any) {
		console.error("Error fetching cylinder logs:", error.message);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const updateCylinderLog = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const { buildingId, date, cylindersPurchased, dealer, cost, otherCost = 0 } = req.body;

		if (!id) {
			res.status(400).json({ message: "Cylinder log ID is required" });
			return;
		}
		if (!buildingId || !date || !cylindersPurchased || !cost) {
			res.status(400).json({
				message: "Building ID, date, cylinders purchased and cost are required",
			});
			return;
		}

		const cylinderLog = await CylinderLog.findByIdAndUpdate(
			id,
			{
				building: buildingId,
				date,
				cylindersPurchased,
				dealer,
				cost,
				otherCost,
			},
			{ new: true, runValidators: true }
		);
		if (!cylinderLog) {
			res.status(404).json({ message: "Couldn't find any cylinder log with this ID" });
			return;
		}

		res.status(200).json(cylinderLog);
	} catch (error: any) {
		console.error("Error updating cylinder log:", error.message);
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
			res.status(404).json({ message: "Couldn't find any cylinder log with this ID" });
			return;
		}

		res.status(200).json({ message: "Cylinder log has been deleted" });
	} catch (error: any) {
		console.error("Error deleting cylinder log:", error.message);
		res.status(500).json({ message: "Internal server error" });
	}
};
