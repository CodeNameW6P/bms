import { Request, Response } from "express";
import CylinderLog from "../models/cylinderLog.model";
import Building from "../models/building.model";

export const createCylinderLog = async (req: Request, res: Response) => {
	try {
		const { buildingNumber, date, cylindersPurchased, dealer, cost, otherCost } = req.body;
		if (!buildingNumber || !date || !cylindersPurchased || !cost) {
			res.status(400).json({ message: "Building number, date, cylinders purchased and cost are required" });
			return;
		}
		const building = await Building.findOne({ buildingNumber: buildingNumber }).select("_id");
	} catch (error) {}
};
