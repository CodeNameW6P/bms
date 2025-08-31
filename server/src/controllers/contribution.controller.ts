import { Request, Response } from "express";
import Contribution from "../models/contribution.model";

export const createContribution = async (req: Request, res: Response) => {
	try {
		const { flatId, month, year, amount } = req.body;
		if (!flatId || !month || !year || !amount) {
			res.status(400).json({ message: "Flat ID, amount, month and year are required" });
			return;
		}

		const existingContribution = await Contribution.findOne({
			flat: flatId,
			month,
			year,
		});
		if (existingContribution) {
			res.status(400).json({
				message: "A contribution for this month already exists",
			});
			return;
		}

		const contribution = await Contribution.create({
			flat: flatId,
			month,
			year,
			amount,
		});
		res.status(201).json(contribution);
	} catch (error: any) {
		console.error("Error creating contribution:", error.message);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const getContributions = async (req: Request, res: Response) => {
	try {
		let { page = 1, limit = 15, all } = req.query;
		if (all === "true") {
			const contributions = await Contribution.find()
				.populate("flat")
				.sort({ year: -1, month: -1 });
			res.status(200).json(contributions);
			return;
		}

		page = parseInt(page as string);
		limit = parseInt(limit as string);

		const totalContributions = await Contribution.countDocuments();
		const contributions = await Contribution.find()
			.populate("flat")
			.sort({ year: -1, month: -1 })
			.skip((page - 1) * limit)
			.limit(limit);

		res.status(200).json({
			contributions,
			totalContributions,
			totalPages: Math.ceil(totalContributions / limit),
		});
	} catch (error: any) {
		console.error("Error fetching contributions:", error.message);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const getFlatContributions = async (req: Request, res: Response) => {
	try {
		const { flatId } = req.params;
		if (!flatId) {
			res.status(400).json({ message: "Flat ID is required" });
			return;
		}

		const contributions = await Contribution.find({ flat: flatId })
			.populate("flat")
			.sort({ year: -1, month: -1 });
		res.status(200).json(contributions);
	} catch (error: any) {
		console.error("Error fetching flat contributions:", error.message);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const updateContribution = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const { flatId, month, year, amount } = req.body;

		if (!id) {
			res.status(400).json({ message: "Contribution ID is required" });
			return;
		}
		if (!flatId || !month || !year || !amount) {
			res.status(400).json({ message: "Flat ID, amount, month and year are required" });
			return;
		}

		const existingContribution = await Contribution.findOne({
			flat: flatId,
			month,
			year,
			_id: { $ne: id },
		});

		if (existingContribution) {
			res.status(400).json({
				message: "A contribution for this month already exists",
			});
			return;
		}

		const contribution = await Contribution.findByIdAndUpdate(
			id,
			{ flat: flatId, month, year, amount },
			{ new: true }
		).populate("flat");
		if (!contribution) {
			res.status(404).json({ message: "Couldn't find any contribution with this ID" });
			return;
		}

		res.status(200).json(contribution);
	} catch (error: any) {
		console.error("Error updating contribution:", error.message);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const deleteContribution = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		if (!id) {
			res.status(400).json({ message: "Contribution ID is required" });
			return;
		}

		const contribution = await Contribution.findByIdAndDelete(id);
		if (!contribution) {
			res.status(404).json({ message: "Couldn't find any contribution with this ID" });
			return;
		}

		res.status(200).json({ message: "Contribution has been deleted" });
	} catch (error: any) {
		console.error("Error deleting contribution:", error.message);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const getCurrentFlatContribution = async (req: Request, res: Response) => {
	try {
		const { flatId } = req.params;

		const currentDate = new Date();
		const currentMonth = currentDate.getMonth() + 1;
		const currentYear = currentDate.getFullYear();

		const contribution = await Contribution.findOne({
			flat: flatId,
			month: currentMonth,
			year: currentYear,
		});

		if (!contribution) {
			res.status(404).json({
				message: "Couldn't find any contribution for the current month",
			});
			return;
		}

		res.status(200).json(contribution);
	} catch (error: any) {
		console.error("Error fetching current contribution:", error.message);
		res.status(500).json({ message: "Internal server error" });
	}
};
