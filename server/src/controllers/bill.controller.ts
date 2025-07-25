import { Request, Response } from "express";
import Bill from "../models/bill.model";
import Flat from "../models/flat.model";

export const createBill = async (req: Request, res: Response) => {
	try {
		const { date, flatNumber, totalAmount } = req.body;
		if (!date || !flatNumber || !totalAmount) {
			res.status(400).json({ message: "Flat number, date and amount are required" });
			return;
		}
		const flat = await Flat.findOne({ flatNumber: flatNumber }).select("_id");
		if (!flat) {
			res.status(404).json({ message: "Flat wasn't found" });
			return;
		}
		const bill = await Bill.create({
			date: new Date(date),
			flat: flat._id,
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
