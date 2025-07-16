import { Request, Response } from "express";
import Admin from "../models/admin.model";

export const createAdmin = async (req: Request, res: Response) => {
	try {
		const { username, email, password } = req.body;
		if (!username || !email || !password) {
			res.status(400).json({ message: "Name, email, and password are required" });
			return;
		}
		const existingAdmin = await Admin.findOne({ email });
		if (existingAdmin) {
			res.status(400).json({ message: "Admin with this email already exists" });
			return;
		}
		const newAdmin = await Admin.create({ username, email, password });
		res.status(201).json(newAdmin);
	} catch (error: any) {
		console.error("Error creating admin:", error.message);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const getAdmins = async (req: Request, res: Response) => {
	try {
		const admins = await Admin.find();
		if (!admins || admins.length === 0) {
			res.status(404).json({ message: "No admins found" });
			return;
		}
		res.status(200).json(admins);
	} catch (error: any) {
		console.error("Error fetching admins:", error.message);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const getAdmin = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		if (!id) {
			res.status(400).json({ message: "Admin ID is required" });
			return;
		}
		const admin = await Admin.findById(id);
		if (!admin) {
			res.status(404).json({ message: "Admin not found" });
			return;
		}
		res.status(200).json(admin);
	} catch (error: any) {
		console.error("Error fetching admin:", error.message);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const deleteAdmin = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		if (!id) {
			res.status(400).json({ message: "Admin ID is required" });
			return;
		}
		const admin = await Admin.findByIdAndDelete(id);
		if (!admin) {
			res.status(404).json({ message: "Admin not found" });
			return;
		}
		res.status(200).json({ message: "Admin deleted successfully" });
	} catch (error: any) {
		console.error("Error deleting admin:", error.message);
		res.status(500).json({ message: "Internal server error" });
	}
};
