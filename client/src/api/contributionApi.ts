import api from "@/lib/axios";
import type { CreateContributionData } from "@/pages/ManageMosqueContributionsPage";

export const fetchContributionsApi = async (page: number, limit: number, all: boolean) => {
	try {
		const response = await api.get(`/contributions?page=${page}&limit=${limit}&all=${all}`);
		// console.log("Contributions fetched successfully:", response.data);
		return { success: true, data: response.data };
	} catch (error: any) {
		console.error("Error fetching contributions:", error.response?.data);
		return {
			success: false,
			error: error.response?.data?.message || "Failed to fetch contributions",
		};
	}
};

export const fetchCurrentFlatContributionApi = async (flatId: string) => {
	try {
		const response = await api.get(`/contributions/flat/current/${flatId}`);
		// console.log("Current contribution fetched successfully:", response.data);
		return { success: true, data: response.data };
	} catch (error: any) {
		console.error("Error fetching current contribution:", error.response?.data);
		return {
			success: false,
			error: error.response?.data?.message || "Failed to fetch contributions",
		};
	}
};

export const createContributionApi = async (data: CreateContributionData) => {
	try {
		const response = await api.post("contributions/create", data);
		// console.log("Contribution created successfully:", response.data);
		return { success: true, data: response.data };
	} catch (error: any) {
		console.error("Error creating contributions:", error.response?.data);
		return {
			success: false,
			error: error.response?.data?.message || "Failed to create contributions",
		};
	}
};

export const updateContributionApi = async (
	contributionId: string,
	data: CreateContributionData
) => {
	try {
		const response = await api.put(`contributions/${contributionId}`, data);
		// console.log("Contribution updated successfully:", response.data);
		return { success: true, data: response.data };
	} catch (error: any) {
		console.error("Error updating contributions:", error.response?.data);
		return {
			success: false,
			error: error.response?.data?.message || "Failed to update contributions",
		};
	}
};

export const deleteContributionApi = async (contributionId: string) => {
	try {
		const response = await api.delete(`contributions/${contributionId}`);
		// console.log("Contribution deleted successfully:", response.data);
		return { success: true, data: response.data };
	} catch (error: any) {
		console.error("Error deleting contributions:", error.response?.data);
		return {
			success: false,
			error: error.response?.data?.message || "Failed to delete contributions",
		};
	}
};
