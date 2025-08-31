import api from "@/lib/axios";
import type { AdminSignInFormDataType } from "@/pages/SignInPage";
import type { FlatSignInFormDataType } from "@/pages/SignInPage";

export const adminSignInApi = async (data: AdminSignInFormDataType) => {
	try {
		const response = await api.post("/auth/admin-sign-in", data);
		// console.log("Admin signed in successfully:", response.data);
		return { success: true, data: response.data };
	} catch (error: any) {
		console.error("Error signing admin in:", error.response?.data);
		return { success: false, error: error.response?.data?.message || "Failed to sign in" };
	}
};

export const adminSignOutApi = async () => {
	try {
		const response = await api.post("/auth/admin-sign-out");
		// console.log("Admin signed out successfully:", response.data);
		return { success: true, data: response.data };
	} catch (error: any) {
		console.error("Error signing admin out:", error.response?.data);
		return { success: false, error: error.response?.data?.message || "Failed to sign out" };
	}
};

export const adminAuthVerifyApi = async () => {
	try {
		const response = await api.get("/auth/admin-auth-verify");
		// console.log("Admin authenticated successfully:", response.data);
		return { success: true, data: response.data };
	} catch (error: any) {
		console.error("Unauthorized or error authenticating admin:", error.response?.data);
		return {
			success: false,
			error: error.response?.data?.message || "Authentication failed",
		};
	}
};

export const flatSignInApi = async (data: FlatSignInFormDataType) => {
	try {
		const response = await api.post("/auth/flat-sign-in", data);
		// console.log("Flat resident signed in successfully:", response.data);
		return { success: true, data: response.data };
	} catch (error: any) {
		console.error("Error signing flat resident in:", error.response?.data);
		return { success: false, error: error.response?.data?.message || "Failed to sign in" };
	}
};

export const flatSignOutApi = async () => {
	try {
		const response = await api.post("/auth/flat-sign-out");
		// console.log("Flat resident signed out successfully:", response.data);
		return { success: true, data: response.data };
	} catch (error: any) {
		console.error("Error signing flat resident out:", error.response?.data);
		return { success: false, error: error.response?.data?.message || "Failed to sign out" };
	}
};

export const flatAuthVerifyApi = async () => {
	try {
		const response = await api.get("/auth/flat-auth-verify");
		// console.log("Flat resident authenticated successfully:", response.data);
		return { success: true, data: response.data };
	} catch (error: any) {
		console.error("Unauthorized or error authenticating flat resident:", error.response?.data);
		return {
			success: false,
			error: error.response?.data?.message || "Authentication failed",
		};
	}
};
