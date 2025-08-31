import api from "@/lib/axios";

export const fetchFlatsApi = async () => {
	try {
		const response = await api.get("/flats");
		// console.log("Flats fetched successfully:", response.data);
		return { success: true, data: response.data };
	} catch (error: any) {
		console.error("Error fetching flats:", error.response?.data);
		return { success: false, error: error.response?.data?.message || "Failed to fetch flats" };
	}
};

export const updateFlatApi = async (flatNumber: string) => {
	try {
		const response = await api.put(`/flat/${flatNumber}`);
		// console.log("Flat updated successfully:", response.data);
		return { success: true, data: response.data };
	} catch (error: any) {
		console.error("Error updating flat:", error.response?.data);
		return { success: false, error: error.response?.data?.message || "Failed to update flat" };
	}
};
