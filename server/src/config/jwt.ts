import { sign, verify } from "jsonwebtoken";
import { JWT_KEY } from "./env";

export const generateToken = (payload: object) => {
	const token = sign(payload, JWT_KEY!, { expiresIn: "1h" });
	return token;
};

export const verifyToken = (token: string) => {
	const decoded = verify(token, JWT_KEY!);
	return decoded;
};
