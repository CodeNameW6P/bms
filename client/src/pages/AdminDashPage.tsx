import { Button } from "@/components/ui/button";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminDashPage: React.FC = () => {
	const navigate = useNavigate();

	const handleSignOut = () => {
		axios
			.post("http://localhost:8000/api/auth/adminsignout", {}, { withCredentials: true })
			.then((response) => {
				console.log("Signed out successfully:", response.data);
				navigate("/sign-in");
			})
			.catch((error) => {
				console.error("Error signing out:", error);
				// Handle error, e.g., show error message
			});
	};

	return (
		<>
			<div className="container mx-auto p-4">
				<h2 className="text-2xl font-semibold mb-4">Admin Dashboard</h2>
				<p className="mb-4">
					Welcome to the admin dashboard. Here you can manage various aspects of the portal.
				</p>
				<Button onClick={handleSignOut}>Sign Out</Button>
			</div>
		</>
	);
};

export default AdminDashPage;
