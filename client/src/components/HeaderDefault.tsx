import { Link } from "react-router-dom";

const HeaderDefault: React.FC = () => {
	return (
		<>
			<header className="bg-black text-white p-4">
				<div className="flex container mx-auto items-center justify-between">
					<Link to="/sign-in">
						<h1 className="text-2xl font-semibold">Navana City Dale Portal</h1>
					</Link>
				</div>
			</header>
		</>
	);
};

export default HeaderDefault;
