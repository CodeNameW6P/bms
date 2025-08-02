import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import api from "@/lib/axios";

const HeaderFlat: React.FC = () => {
	const navigate = useNavigate();

	const handleSignOut = () => {
		api.post("/auth/flat-sign-out", {})
			.then((response) => {
				// console.log("Signed out successfully:", response.data);
				navigate("/sign-in");
			})
			.catch((error) => {
				console.error("Error signing out:", error);
			});
	};

	return (
		<>
			<header className="flex items-center justify-between bg-black text-white p-4">
				<Link to="/flat-dashboard">
					<h1 className="text-2xl font-semibold">Navana City Dale Portal</h1>
				</Link>
				<nav>
					<ul className="flex gap-4 items-center">
						{/* <li>
							<Button variant="ghost" size="sm">
								<Link to={"/manage-cylinders"}>Manage Cylinders</Link>
							</Button>
						</li> */}
						<li>
							<span>Signed in as Flat Resident</span>
						</li>
						<li>
							<Button onClick={handleSignOut} variant="ghost" size="sm">
								Sign Out
							</Button>
						</li>
					</ul>
				</nav>
			</header>
		</>
	);
};

export default HeaderFlat;
