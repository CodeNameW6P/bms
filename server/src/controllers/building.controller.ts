import { Request, Response } from "express";
import Building from "../models/building.model";

export const createBuilding = async (req: Request, res: Response) => {
	try {
		const { buildingNumber, name } = req.body;
		if (!buildingNumber) {
			res.status(400).json({ message: "Building number is required" });
			return;
		}

		const existingBuilding = await Building.findOne({ buildingNumber });
		if (existingBuilding) {
			res.status(400).json({ message: "A building with this number already exists" });
			return;
		}

		const newBuilding = await Building.create({ buildingNumber, name });
		res.status(201).json(newBuilding);
	} catch (error: any) {
		console.error("Error creating building:", error.message);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const getBuildings = async (req: Request, res: Response) => {
	try {
		const buildings = await Building.find();
		res.status(200).json(buildings);
	} catch (error: any) {
		console.error("Error fetching buildings:", error.message);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const getBuilding = async (req: Request, res: Response) => {
	try {
		const { buildingNumber } = req.params;
		if (!buildingNumber) {
			res.status(400).json({ message: "Building number is required" });
			return;
		}

		const building = await Building.findOne({ buildingNumber });
		if (!building) {
			res.status(404).json({ message: "Couldn't find any building with this number" });
			return;
		}

		res.status(200).json(building);
	} catch (error: any) {
		console.error("Error fetching building:", error.message);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const deleteBuilding = async (req: Request, res: Response) => {
	try {
		const { buildingNumber } = req.params;
		if (!buildingNumber) {
			res.status(400).json({ message: "Building number is required" });
			return;
		}

		const building = await Building.findOneAndDelete({ buildingNumber });
		if (!building) {
			res.status(404).json({ message: "Couldn't find any building with this number" });
			return;
		}

		res.status(200).json({ message: "Building has been deleted" });
	} catch (error: any) {
		console.error("Error deleting building:", error.message);
		res.status(500).json({ message: "Internal server error" });
	}
};
