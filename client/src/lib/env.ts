import dotenv from "dotenv";

dotenv.config();

export const NODE_ENV = process.env.NODE_ENV || "development";
export const PORT = process.env.PORT || "3000";
export const BACKEND_PUBLIC_URL = process.env.BACKEND_PUBLIC_URL;
