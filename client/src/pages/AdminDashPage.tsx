import { useState, useEffect } from "react";
import { adminAuthVerifyApi } from "@/api/authApi";
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
import HeaderAdmin from "@/components/HeaderAdmin";
import Footer from "@/components/Footer";
import { adminAuthVerify } from "@/lib/authVerify";

const AdminDashPage: React.FC = () => {
	const [isPageloading, setIsPageLoading] = useState(true);
	const navigate = useNavigate();

	useEffect(() => {
		adminAuthVerify(setIsPageLoading, navigate);
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
							<CardContent></CardContent>
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
