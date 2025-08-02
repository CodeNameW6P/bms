import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import api from "@/lib/axios";
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
import HeaderAdmin from "@/components/header-admin";
import Footer from "@/components/footer";

const AdminDashPage: React.FC = () => {
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	useEffect(() => {
		const adminAuthCheck = () => {
			api.get("/auth/admin-auth-check")
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

	return (
		<>
			<main className="flex flex-col min-h-screen gap-6">
				<HeaderAdmin />
				<Card className="flex grow container mx-auto">
					<CardHeader>
						<CardTitle className="text-2xl">Admin Dashboard</CardTitle>
						<CardDescription>Card Description</CardDescription>
						<CardAction>Card Action</CardAction>
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
							<CardContent></CardContent>
							<CardFooter>
								<p>Card Footer</p>
							</CardFooter>
						</Card>
					</CardContent>
					<CardFooter>
						<p>Card Footer</p>
					</CardFooter>
				</Card>
				<Footer />
			</main>
		</>
	);
};

export default AdminDashPage;
