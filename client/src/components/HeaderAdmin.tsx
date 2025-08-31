import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { adminSignOutApi } from "@/api/authApi";

const HeaderAdmin: React.FC = () => {
	const navigate = useNavigate();

	const handleSignOut = async () => {
		const response = await adminSignOutApi();
		if (response.success) {
			navigate("/sign-in");
		} else {
			alert(response.error || "Failed to sign out");
		}
	};

	return (
		<>
			<header className="flex items-center justify-between bg-black text-white p-4">
				<Link to="/admin-dashboard">
					<h1 className="text-2xl font-semibold">Navana City Dale Portal</h1>
				</Link>
				<nav>
					<ul className="flex gap-4 items-center">
						<li>
							<Link to={"/manage-bills"}>
								<Button variant="ghost" size="sm">
									Manage Bills
								</Button>
							</Link>
						</li>
						<li>
							<Link to={"/manage-mosque-contributions"}>
								<Button variant="ghost" size="sm">
									Manage Mosque Contributions
								</Button>
							</Link>
						</li>
						<li>
							<Link to={"/manage-cylinders"}>
								<Button variant="ghost" size="sm">
									Manage Cylinders
								</Button>
							</Link>
						</li>
						<li>
							<span>Signed in as Admin</span>
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

export default HeaderAdmin;
