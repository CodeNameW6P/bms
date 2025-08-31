import { adminAuthVerifyApi, flatAuthVerifyApi } from "@/api/authApi";
import { toast } from "sonner";

export const adminAuthVerify = async (
	setIsPageLoading: (isPageLoading: boolean) => void,
	navigate: (to: string) => void
) => {
	const response = await adminAuthVerifyApi();
	if (response.success) {
		setIsPageLoading(false);
		return response.data;
	} else {
		toast("Unauthorized", {
			description: "Please sign in again",
			action: {
				label: "Okay",
				onClick: () => {},
			},
		});
		navigate("/sign-in");
	}
};

export const flatAuthVerify = async (
	setIsPageLoading: (isPageLoading: boolean) => void,
	navigate: (to: string) => void
) => {
	const response = await flatAuthVerifyApi();
	if (response.success) {
		setIsPageLoading(false);
		return response.data;
	} else {
		toast("Unauthorized", {
			description: "Please sign in again",
			action: {
				label: "Okay",
				onClick: () => {},
			},
		});
		navigate("/sign-in");
	}
};
