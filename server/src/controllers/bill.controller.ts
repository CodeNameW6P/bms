import { Request, Response } from "express";
import Bill from "../models/bill.model";

export const createBill = async (req: Request, res: Response) => {
	try {
		const { date, flat, totalAmount } = req.body;
		if (!date || !flat || !totalAmount) {
			res.status(400).json({ message: "Flat, date and amount are required" });
			return;
		}
		const bill = await Bill.create({
			date: new Date(date),
			flat,
			totalAmount,
			paidAmount: 0,
			status: false,
		});
		res.status(201).json(bill);
	} catch (error: any) {
		console.error("Error creating bill:", error.message);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const uploadBills = async (req: Request, res: Response) => {
	try {
		const { data } = req.body;
		if (!data || data.length === 0 || !Array.isArray(data)) {
			res.status(400).json({ message: "Data is invalid or missing" });
		}

		const bills = await Bill.insertMany(data);
		res.status(201).json({ message: "Bills have been created", count: bills.length });
	} catch (error: any) {
		console.error("Error creating bills:", error.message);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const getBills = async (req: Request, res: Response) => {
	try {
		const bills = await Bill.find().populate("flat").sort({ date: -1 });
		if (!bills || bills.length === 0) {
			res.status(404).json({ message: "No bills found" });
			return;
		}
		res.status(200).json(bills);
	} catch (error: any) {
		console.error("Error fetching bills:", error.message);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const getFlatBills = async (req: Request, res: Response) => {
	try {
		const { flatId } = req.params;
		if (!flatId) {
			res.status(400).json({ message: "Flat ID is required" });
			return;
		}
		const bills = await Bill.find({ flat: flatId }).populate("flat").sort({ date: -1 });
		res.status(200).json(bills);
	} catch (error: any) {
		console.error("Error fetching bills:", error.message);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const getFlatUnpaidBills = async (req: Request, res: Response) => {
	try {
		const { flatId } = req.params;
		if (!flatId) {
			res.status(400).json({ message: "Flat ID is required" });
			return;
		}
		const bills = await Bill.find({ flat: flatId, status: false }).populate("flat").sort({ date: -1 });
		res.status(200).json(bills);
	} catch (error: any) {
		console.error("Error fetching bills:", error.message);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const deleteBill = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		if (!id) {
			res.status(400).json({ message: "Bill ID is required" });
			return;
		}
		const bill = await Bill.findByIdAndDelete(id);
		if (!bill) {
			res.status(404).json({ message: "Bill not found" });
			return;
		}
		res.status(200).json({ message: "Bill deleted successfully" });
	} catch (error: any) {
		console.error("Error deleting bill:", error.message);
		res.status(500).json({ message: "Internal server error" });
	}
};
