import { Request, Response } from "express";
import Flat from "../models/flat.model";

export const createFlat = async (req: Request, res: Response) => {
	try {
		const {
			building,
			flatNumber,
			ownerName,
			ownerPhone,
			ownerEmail,
			renterName,
			renterPhone,
			renterEmail,
			status,
		} = req.body;
		if (!building || !flatNumber) {
			res.status(400).json({ message: "Building and flat number are required" });
			return;
		}

		const existingFlat = await Flat.findOne({ building, flatNumber });
		if (existingFlat) {
			res.status(400).json({
				message: "A flat with this number already exists in the building",
			});
			return;
		}

		const flat = await Flat.create({
			building,
			flatNumber,
			ownerName,
			ownerPhone,
			ownerEmail,
			renterName,
			renterPhone,
			renterEmail,
			status,
		});
		res.status(201).json(flat);
	} catch (error: any) {
		console.error("Error creating flat:", error.message);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const getFlats = async (req: Request, res: Response) => {
	try {
		const flats = await Flat.find().populate("building");
		res.status(200).json(flats);
	} catch (error: any) {
		console.error("Error fetching flats:", error.message);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const getFlat = async (req: Request, res: Response) => {
	try {
		const { flatNumber } = req.params;
		if (!flatNumber) {
			res.status(400).json({ message: "Flat number is required" });
			return;
		}

		const flat = await Flat.findOne({ flatNumber }).populate("building");
		if (!flat) {
			res.status(404).json({ message: "Couldn't find any flat with this number" });
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
		const { flatNumber } = req.params;
		const { ownerName, ownerPhone, ownerEmail, renterName, renterPhone, renterEmail, status } =
			req.body;
		if (!flatNumber) {
			res.status(400).json({ message: "Flat number is required" });
			return;
		}

		const flat = await Flat.findOneAndUpdate(
			{ flatNumber },
			{ ownerName, ownerPhone, ownerEmail, renterName, renterPhone, renterEmail, status },
			{ new: true }
		).populate("building");
		if (!flat) {
			res.status(404).json({ message: "Couldn't find any flat with this number" });
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
		const { flatNumber } = req.params;
		if (!flatNumber) {
			res.status(400).json({ message: "Flat number is required" });
			return;
		}

		const flat = await Flat.findOneAndDelete({ flatNumber });
		if (!flat) {
			res.status(404).json({ message: "Couldn't find any flat with this number" });
			return;
		}

		res.status(200).json({ message: "Flat has been deleted" });
	} catch (error: any) {
		console.error("Error deleting flat:", error.message);
		res.status(500).json({ message: "Internal server error" });
	}
};
