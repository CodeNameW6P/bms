import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { flatSignOutApi } from "@/api/authApi";

const HeaderFlat: React.FC = () => {
	const navigate = useNavigate();

	const handleSignOut = async () => {
		const response = await flatSignOutApi();
		if (response.success) {
			navigate("/sign-in");
		} else {
			alert(response.error || "Failed to sign out");
		}
	};

	return (
		<>
			<header className="flex items-center justify-between bg-black text-white p-4">
				<Link to="/flat-dashboard">
					<h1 className="text-2xl font-semibold">Navana City Dale Portal</h1>
				</Link>
				<nav>
					<ul className="flex gap-4 items-center">
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
