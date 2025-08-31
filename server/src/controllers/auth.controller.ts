import { Request, Response } from "express";
import Admin from "../models/admin.model";
import Flat from "../models/flat.model";
import { genSalt, hash, compare } from "bcrypt";
import { generateToken } from "../config/jwt";
import { NODE_ENV } from "../config/env";

export const adminAuthVerify = async (req: any, res: Response) => {
	try {
		if (!req.admin) {
			res.status(401).json({
				message: "Unauthorized - Please sign in again",
			});
			return;
		}

		res.status(200).json({ message: "Admin authentication was successful" });
	} catch (error: any) {
		console.error("Error authenticating admin (Verification error):", error.message);
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
			res.status(400).json({ message: "An admin with this email already exists" });
			return;
		}

		const salt = await genSalt(8);
		const hashedPassword = await hash(password, salt);
		const admin = await Admin.create({ username, email, password: hashedPassword });

		if (!admin) {
			res.status(500).json({ message: "Failed to create admin" });
		} else {
			const token = generateToken({ id: admin._id });
			res.cookie("token", token, {
				httpOnly: true,
				secure: NODE_ENV === "production",
				sameSite: "strict",
			})
				.status(201)
				.json({
					id: admin._id,
					username: admin.username,
					email: admin.email,
				});
		}
	} catch (error: any) {
		console.error("Error signing admin up:", error.message);
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
			res.status(404).json({ message: "Couldn't find any admin with this email" });
			return;
		}

		const isPasswordValid = await compare(password, admin.password);
		if (!isPasswordValid) {
			res.status(401).json({ message: "The password is invalid" });
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
		console.error("Error signing admin in:", error.message);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const adminSignOut = (req: Request, res: Response) => {
	try {
		res.clearCookie("token").status(200).json({ message: "Admin has signed out" });
	} catch (error: any) {
		console.error("Error signing admin out:", error.message);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const flatAuthVerify = async (req: any, res: Response) => {
	try {
		if (!req.flat) {
			res.status(401).json({
				message: "Unauthorized - Please sign in again",
			});
			return;
		}

		res.status(200).json(req.flat);
	} catch (error: any) {
		console.error("Error authenticating flat resident (Verification error):", error.message);
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
			res.status(404).json({ message: "Couldn't find flat resident with these credentials" });
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
		console.error("Error signing flat resident in:", error.message);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const flatSignOut = (req: Request, res: Response) => {
	try {
		res.clearCookie("token").status(200).json({ message: "Flat resident has signed out" });
	} catch (error: any) {
		console.error("Error signing flat resident out:", error.message);
		res.status(500).json({ message: "Internal server error" });
	}
};
