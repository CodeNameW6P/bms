// import { useState } from "react";
// import reactLogo from "./assets/react.svg";
// import viteLogo from "/vite.svg";
// import "./App.css";
import { Routes, Route, Link } from "react-router-dom";
import { Button } from "./components/ui/button";
import SignInPage from "./pages/SignInPage";
import AdminDashPage from "./pages/AdminDashPage";
import FlatDashPage from "./pages/FlatDashPage";

function App() {
	return (
		<>
			<div className="flex flex-col min-h-screen">
				<header className="flex items-center justify-between bg-gray-800 text-white p-4">
					<Link to="/">
						<h1 className="text-2xl font-semibold">Navana City Dale Portal</h1>
					</Link>
					<nav>
						<ul className="flex gap-4">
							<li>
								<Button variant="ghost" size="sm">
									<Link to="/">Home</Link>
								</Button>
							</li>
							<li>
								<Button variant="ghost" size="sm">
									<Link to="/about">About</Link>
								</Button>
							</li>
							<li>
								<Button variant="ghost" size="sm">
									<Link to="/contact">Contact</Link>
								</Button>
							</li>
						</ul>
					</nav>
				</header>
				<main className="flex container mx-auto p-4 grow">
					<Routes>
						<Route path="/" element={<h2 className="text-xl">Welcome to the Navana City Dale Portal</h2>} />
						<Route path="/about" element={<h2 className="text-xl">About Us</h2>} />
						<Route path="/contact" element={<h2 className="text-xl">Contact Us</h2>} />
						<Route path="/sign-in" element={<SignInPage />} />
						<Route path="/admin-dashboard" element={<AdminDashPage />} />
						<Route path="/flat-dashboard" element={<FlatDashPage />} />
					</Routes>
				</main>
				<footer className="bg-gray-800 text-white p-4 text-center">
					<span className="text-sm">
						&copy; {new Date().getFullYear()} Navana City Dale Portal. All rights reserved.
					</span>
				</footer>
			</div>
		</>
	);

	// const [count, setCount] = useState(0);
	// return (
	// 	<>
	// 		<div>
	// 			<a href="https://vite.dev" target="_blank">
	// 				<img src={viteLogo} className="logo" alt="Vite logo" />
	// 			</a>
	// 			<a href="https://react.dev" target="_blank">
	// 				<img src={reactLogo} className="logo react" alt="React logo" />
	// 			</a>
	// 		</div>
	// 		<h1>Vite + React</h1>
	// 		<div className="card">
	// 			<button onClick={() => setCount((count) => count + 1)}>count is {count}</button>
	// 			<p>
	// 				Edit <code>src/App.tsx</code> and save to test HMR
	// 			</p>
	// 		</div>
	// 		<p className="read-the-docs">Click on the Vite and React logos to learn more</p>
	// 	</>
	// );
}

export default App;
