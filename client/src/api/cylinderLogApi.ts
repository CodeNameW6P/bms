import api from "@/lib/axios";
import type { CreateCylinderLogData } from "@/pages/ManageCylindersPage";

export const fetchCylinderLogsApi = async (page: number, limit: number, all: boolean) => {
	try {
		const response = await api.get(`/cylinder-logs?page=${page}&limit=${limit}&all=${all}`);
		// console.log("Cylinder logs fetched successfully:", response.data);
		return { success: true, data: response.data };
	} catch (error: any) {
		console.error("Error fetching cylinder logs:", error.response?.data);
		return {
			success: false,
			error: error.response?.data?.message || "Failed to fetch cylinder logs",
		};
	}
};

export const createCylinderLogApi = async (data: CreateCylinderLogData) => {
	try {
		const response = await api.post("/cylinder-logs", data);
		// console.log("Cylinder log created successfully:", response.data);
		return { success: true, data: response.data };
	} catch (error: any) {
		console.error("Error creating cylinder log:", error.response?.data);
		return {
			success: false,
			error: error.response?.data?.message || "Failed to create cylinder log",
		};
	}
};

export const updateCylinderLogApi = async (id: string, data: Partial<CreateCylinderLogData>) => {
	try {
		const response = await api.put(`/cylinder-logs/${id}`, data);
		// console.log("Cylinder log updated successfully:", response.data);
		return { success: true, data: response.data };
	} catch (error: any) {
		console.error("Error updating cylinder log:", error.response?.data);
		return {
			success: false,
			error: error.response?.data?.message || "Failed to update cylinder log",
		};
	}
};

export const deleteCylinderLogApi = async (id: string) => {
	try {
		const response = await api.delete(`/cylinder-logs/${id}`);
		// console.log("Cylinder log deleted successfully:", response.data);
		return { success: true, data: response.data };
	} catch (error: any) {
		console.error("Error deleting cylinder log:", error.response?.data);
		return {
			success: false,
			error: error.response?.data?.message || "Failed to delete cylinder log",
		};
	}
};
