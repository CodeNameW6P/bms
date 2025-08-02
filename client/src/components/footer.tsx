const Footer: React.FC = () => {
	return (
		<>
			<footer className="bg-black text-white p-4 text-center">
				<span className="text-sm">
					&copy; {new Date().getFullYear()} Navana City Dale Portal. All rights reserved.
				</span>
			</footer>
		</>
	);
};

export default Footer;
