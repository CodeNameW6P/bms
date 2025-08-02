import axios from "axios";

const apiUrl = import.meta.env.VITE_PUBLIC_API_URL;

const api = axios.create({
	baseURL: `${apiUrl}/api`,
	withCredentials: true,
	headers: {
		"Content-Type": "application/json",
	},
});

export default api;
