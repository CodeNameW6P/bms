import { sign, verify } from "jsonwebtoken";
import { JWT_KEY } from "./env";

export const generateToken = (payload: object) => {
	try {
		const token = sign(payload, JWT_KEY!, { expiresIn: "1h" });
		return token;
	} catch (error) {
		console.error("Token generation failed:", error);
		return null;
	}
};

export const verifyToken = (token: string) => {
	try {
		const decoded = verify(token, JWT_KEY!);
		return decoded;
	} catch (error) {
		console.error("Token verification failed:", error);
		return null;
	}
};
