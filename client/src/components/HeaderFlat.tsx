import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	// DropdownMenuLabel,
	// DropdownMenuPortal,
	DropdownMenuSeparator,
	// DropdownMenuShortcut,
	// DropdownMenuSub,
	// DropdownMenuSubContent,
	// DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const HeaderFlat: React.FC = () => {
	const navigate = useNavigate();

	return (
		<>
			<header className="bg-black text-white p-4">
				<div className="flex container mx-auto items-center justify-between">
					<Link to="/flat-dashboard">
						<h1 className="text-2xl font-semibold">Navana City Dale Portal</h1>
					</Link>
					<nav>
						<ul className="flex gap-4 items-center">
							<li>
								<span>Signed in as Flat Resident</span>
							</li>
							<li>
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button variant="outline" size="sm">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												// width="16"
												// height="16"
												// fill="currentColor"
												// class="bi bi-list"
												viewBox="0 0 16 16"
											>
												<path
													// fill-rule="evenodd"
													d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"
												/>
											</svg>
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent className="w-56" align="start">
										<DropdownMenuGroup>
											<Link
												className="w-full font-semibold"
												to={"/view-gas-usages"}
											>
												<DropdownMenuItem>
													View Gas Usage Records
												</DropdownMenuItem>
											</Link>
											<Link
												className="w-full font-semibold"
												to={"/view-service-charges"}
											>
												<DropdownMenuItem>
													View Service Charges
												</DropdownMenuItem>
											</Link>
											<Link
												className="w-full font-semibold"
												to={"/view-mosque-contributions"}
											>
												<DropdownMenuItem>
													View Mosque Contributions
												</DropdownMenuItem>
											</Link>
										</DropdownMenuGroup>
										<DropdownMenuSeparator />
										<DropdownMenuItem
											className="font-semibold"
											onClick={() => {
												localStorage.removeItem("token");
												navigate("/sign-in");
											}}
										>
											Log Out
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</li>
						</ul>
					</nav>
				</div>
			</header>
		</>
	);
};

export default HeaderFlat;
