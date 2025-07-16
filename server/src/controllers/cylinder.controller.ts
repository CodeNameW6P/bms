import { Request, Response } from "express";
import Cylinder from "../models/cylinder.model";

export const testCylinder = async (req: Request, res: Response) => {
	try {
		res.status(200).json({ message: "Cylinder route is working" });
	} catch (error: any) {
		console.error("Error in testCylinder:", error.message);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const createCylinder = async (req: Request, res: Response) => {
	try {
		const { building, date, number, dealer, cost, otherCost } = req.body;
		if (!building || !date || !number || !cost) {
			res.status(400).json({ message: "Building, date, number of cylinder and cost are required" });
			return;
		}
		const existingCylinder = await Cylinder.findOne({ number, building });
		if (existingCylinder) {
			res.status(400).json({ message: "Cylinder already exists in the building" });
			return;
		}
		const newCylinder = await Cylinder.create({ building, date, number, dealer, cost, otherCost });
		res.status(201).json(newCylinder);
	} catch (error: any) {
		console.error("Error creating cylinder:", error.message);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const getCylinders = async (req: Request, res: Response) => {
	try {
		const cylinders = await Cylinder.find().populate("building");
		if (!cylinders || cylinders.length === 0) {
			res.status(404).json({ message: "No cylinders found" });
			return;
		}
		res.status(200).json(cylinders);
	} catch (error: any) {
		console.error("Error fetching cylinders:", error.message);
		res.status(500).json({ message: "Internal server error" });
	}
};
