import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const FlatDashPage: React.FC = () => {
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	useEffect(() => {
		const flatAuthCheck = () => {
			axios
				.get("http://localhost:8000/api/auth/flat-auth-check", { withCredentials: true })
				.then((response) => {
					console.log(response.data);
					setLoading((prev) => (prev = false));
				})
				.catch((error) => {
					console.error("Flat resident unauthorized or failed to check flat authentication:", error);
					navigate("/sign-in");
				});
		};

		flatAuthCheck();
	}, [navigate]);

	const handleSignOut = () => {
		axios
			.post("http://localhost:8000/api/auth/flat-sign-out", {}, { withCredentials: true })
			.then((response) => {
				console.log("Signed out successfully:", response.data);
				navigate("/sign-in");
			})
			.catch((error) => {
				console.error("Error signing out:", error);
			});
	};

	return (
		<>
			<div className="container mx-auto p-4">
				<h2 className="text-2xl font-semibold mb-4">Flat Dashboard</h2>
				<p className="mb-4">
					Welcome to your flat dashboard. Here you can manage your flat details and sign out.
				</p>
				<Button onClick={handleSignOut}>Sign Out</Button>
			</div>
		</>
	);
};

export default FlatDashPage;
