import { Request, Response } from "express";
import Admin from "../models/admin.model";
import Flat from "../models/flat.model";
import { genSalt, hash, compare } from "bcrypt";
import { generateToken } from "../config/jwt";
import { NODE_ENV } from "../config/env";

export const adminAuthCheck = async (req: any, res: Response) => {
	try {
		if (!req.admin) {
			res.status(401).json({ message: "Unauthorized - Admin wasn't found" });
			return;
		}
		res.status(200).json({ message: "Admin authenticated" });
	} catch (error: any) {
		console.error("Error during admin authentication response:", error.message);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const adminSignUp = async (req: Request, res: Response) => {
	try {
		const { username, email, password } = req.body;
		if (!username || !email || !password) {
			res.status(400).json({ message: "Username, email, and password are required" });
			return;
		}

		const existingAdmin = await Admin.findOne({ email });
		if (existingAdmin) {
			res.status(400).json({ message: "Admin with this email already exists" });
			return;
		}

		const salt = await genSalt(8);
		const hashedPassword = await hash(password, salt);
		const newAdmin = await Admin.create({ username, email, password: hashedPassword });

		if (!newAdmin) {
			res.status(500).json({ message: "Failed to create admin" });
		} else {
			const token = generateToken({ id: newAdmin._id });
			res.cookie("token", token, {
				httpOnly: true,
				secure: NODE_ENV === "production",
				sameSite: "strict",
			})
				.status(201)
				.json({
					id: newAdmin._id,
					username: newAdmin.username,
					email: newAdmin.email,
				});
		}
	} catch (error: any) {
		console.error("Error during admin sign-up:", error.message);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const adminSignIn = async (req: Request, res: Response) => {
	try {
		const { email, password } = req.body;
		if (!email || !password) {
			res.status(400).json({ message: "Email and password are required" });
			return;
		}

		const admin = await Admin.findOne({ email });
		if (!admin) {
			res.status(404).json({ message: "Admin not found" });
			return;
		}

		const isPasswordValid = await compare(password, admin.password);
		if (!isPasswordValid) {
			res.status(401).json({ message: "Invalid password" });
			return;
		}

		const token = generateToken({ id: admin._id });
		res.cookie("token", token, {
			httpOnly: true,
			secure: NODE_ENV === "production",
			sameSite: "strict",
		})
			.status(200)
			.json({
				id: admin._id,
				username: admin.username,
				email: admin.email,
			});
	} catch (error: any) {
		console.error("Error during admin sign-in:", error.message);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const adminSignOut = (req: Request, res: Response) => {
	try {
		res.clearCookie("token").status(200).json({ message: "Admin signed out successfully" });
	} catch (error: any) {
		console.error("Error during admin sign-out:", error.message);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const flatAuthCheck = async (req: any, res: Response) => {
	try {
		if (!req.flat) {
			res.status(401).json({ message: "Unauthorized - Flat wasn't found" });
			return;
		}
		res.status(200).json({ message: "Flat resident authenticated" });
	} catch (error: any) {
		console.error("Error during flat authentication response:", error.message);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const flatSignIn = async (req: Request, res: Response) => {
	try {
		const { flatNumber, phone } = req.body;
		if (!flatNumber || !phone) {
			res.status(400).json({ message: "Flat number and phone are required" });
			return;
		}

		const flat = await Flat.findOne({ flatNumber, phone });
		if (!flat) {
			res.status(404).json({ message: "Flat resident not found" });
			return;
		}

		const token = generateToken({ id: flat._id });
		res.cookie("token", token, {
			httpOnly: true,
			secure: NODE_ENV === "production",
			sameSite: "strict",
		})
			.status(200)
			.json({
				id: flat._id,
				name: flat.name,
				flatNumber: flat.flatNumber,
			});
	} catch (error: any) {
		console.error("Error during flat sign-in:", error.message);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const flatSignOut = (req: Request, res: Response) => {
	try {
		res.clearCookie("token").status(200).json({ message: "Flat resident signed out successfully" });
	} catch (error: any) {
		console.error("Error during flat sign-out:", error.message);
		res.status(500).json({ message: "Internal server error" });
	}
};
