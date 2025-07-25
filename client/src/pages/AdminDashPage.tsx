import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import ExampleChart from "@/components/example-chart";
import ExampleTable from "@/components/example-table";

const AdminDashPage: React.FC = () => {
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	useEffect(() => {
		const adminAuthCheck = () => {
			axios
				.get("http://localhost:8000/api/auth/admin-auth-check", { withCredentials: true })
				.then((response) => {
					// console.log("Admin authenticated successfully", response.data);
				})
				.catch((error) => {
					// console.error("Unauthorized or error authenticating admin", error);
					navigate("/sign-in");
				});
		};

		adminAuthCheck();
	}, [navigate]);

	const handleSignOut = () => {
		axios
			.post("http://localhost:8000/api/auth/admin-sign-out", {}, { withCredentials: true })
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
			<Card className="w-full">
				<CardHeader>
					<CardTitle className="text-2xl">Admin Dashboard</CardTitle>
					<CardDescription></CardDescription>
					<CardAction>
						<Button onClick={handleSignOut} variant={"outline"}>
							Sign Out
						</Button>
					</CardAction>
				</CardHeader>
				<CardContent className="flex flex-col gap-6">
					<div className="flex gap-6">
						<Card className="flex-1">
							<CardHeader>
								<CardTitle>Card Title</CardTitle>
								<CardDescription>Card Description</CardDescription>
								<CardAction>Card Action</CardAction>
							</CardHeader>
							<CardContent>
								<p>Card Content</p>
							</CardContent>
							<CardFooter>
								<p>Card Footer</p>
							</CardFooter>
						</Card>
						<Card className="flex-1">
							<CardHeader>
								<CardTitle>Card Title</CardTitle>
								<CardDescription>Card Description</CardDescription>
								<CardAction>Card Action</CardAction>
							</CardHeader>
							<CardContent>
								<p>Card Content</p>
							</CardContent>
							<CardFooter>
								<p>Card Footer</p>
							</CardFooter>
						</Card>
					</div>
					<Card className="">
						<CardHeader>
							<CardTitle>Example Chart</CardTitle>
							<CardDescription>This is an example of a chart</CardDescription>
							<CardAction>No Action</CardAction>
						</CardHeader>
						<CardContent>
							<ExampleChart />
						</CardContent>
						<CardFooter>
							<p>Card Footer</p>
						</CardFooter>
					</Card>
					<Card className="">
						<CardHeader>
							<CardTitle>Example Table</CardTitle>
							<CardDescription>This is an example of a table</CardDescription>
							<CardAction>No Action</CardAction>
						</CardHeader>
						<CardContent>
							<ExampleTable />
						</CardContent>
						<CardFooter>
							<p>Card Footer</p>
						</CardFooter>
					</Card>
				</CardContent>
				<CardFooter></CardFooter>
			</Card>
		</>
	);
};

export default AdminDashPage;
