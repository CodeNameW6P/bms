import { Request, Response } from "express";
import Flat from "../models/flat.model";

export const createFlat = async (req: Request, res: Response) => {
	try {
		const { building, number, owner, phone, email, status } = req.body;
		if (!building || !number) {
			res.status(400).json({ message: "Building and flat number are required" });
			return;
		}
		const existingFlat = await Flat.findOne({ number, building });
		if (existingFlat) {
			res.status(400).json({ message: "Flat already exists in the building" });
			return;
		}
		const newFlat = await Flat.create({ building, number, owner, phone, email, status });
		res.status(201).json(newFlat);
	} catch (error: any) {
		console.error("Error creating flat:", error.message);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const getFlats = async (req: Request, res: Response) => {
	try {
		const flats = await Flat.find().populate("building");
		if (!flats || flats.length === 0) {
			res.status(404).json({ message: "No flats found" });
			return;
		}
		res.status(200).json(flats);
	} catch (error: any) {
		console.error("Error fetching flats:", error.message);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const getFlat = async (req: Request, res: Response) => {
	try {
		const { number } = req.params;
		if (!number) {
			res.status(400).json({ message: "Flat number is required" });
			return;
		}
		const flat = await Flat.findOne({ number }).populate("building");
		if (!flat) {
			res.status(404).json({ message: "Flat not found" });
			return;
		}
		res.status(200).json(flat);
	} catch (error: any) {
		console.error("Error fetching flat:", error.message);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const updateFlat = async (req: Request, res: Response) => {
	try {
		const { number } = req.params;
		const { owner, phone, email, status } = req.body;
		if (!number) {
			res.status(400).json({ message: "Flat number is required" });
			return;
		}
		const flat = await Flat.findOneAndUpdate({ number }, { owner, phone, email, status }, { new: true }).populate(
			"building"
		);
		if (!flat) {
			res.status(404).json({ message: "Flat not found" });
			return;
		}
		res.status(200).json(flat);
	} catch (error: any) {
		console.error("Error updating flat:", error.message);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const deleteFlat = async (req: Request, res: Response) => {
	try {
		const { number } = req.params;
		if (!number) {
			res.status(400).json({ message: "Flat number is required" });
			return;
		}
		const flat = await Flat.findOneAndDelete({ number });
		if (!flat) {
			res.status(404).json({ message: "Flat not found" });
			return;
		}
		res.status(200).json({ message: "Flat deleted successfully" });
	} catch (error: any) {
		console.error("Error deleting flat:", error.message);
		res.status(500).json({ message: "Internal server error" });
	}
};
