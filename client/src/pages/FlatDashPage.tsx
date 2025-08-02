import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import api from "@/lib/axios";
import { useNavigate, Link } from "react-router-dom";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import HeaderFlat from "@/components/header-flat";
import Footer from "@/components/footer";

const FlatDashPage: React.FC = () => {
	const [loading, setLoading] = useState(true);
	const [flat, setFlat] = useState<any>(null);
	const [bills, setBills] = useState([]);
	const navigate = useNavigate();

	const flatAuthCheck = () => {
		api.get("/auth/flat-auth-check")
			.then((response) => {
				setFlat(response.data);
				setLoading(false);
			})
			.catch((error) => {
				console.error("Flat resident unauthorized or failed to check flat authentication:", error);
				navigate("/sign-in");
			});
	};

	const fetchBillsForThisFlat = () => {
		api.get(`/bills/unpaid/${flat._id}`)
			.then((response) => {
				setBills(response.data);
			})
			.catch((error) => {
				console.error("Couldn't fetch bills for this flat:", error);
			});
	};

	useEffect(() => {
		flatAuthCheck();
	}, []);

	useEffect(() => {
		if (flat) {
			fetchBillsForThisFlat();
		}
	}, [flat]);

	return (
		<>
			<main className="flex flex-col min-h-screen gap-6">
				<HeaderFlat />
				<Card className="flex grow container mx-auto">
					<CardHeader>
						<CardTitle className="text-2xl">{flat && flat.flatNumber} Flat Resident Dashboard</CardTitle>
						<CardDescription>Card Description</CardDescription>
						<CardAction>Card Action</CardAction>
					</CardHeader>
					<CardContent className="flex flex-col gap-6">
						<div className="flex gap-6">
							<Card className="flex-1">
								<CardHeader>
									<CardTitle>Total Remaining Bill</CardTitle>
									<CardDescription>Card Description</CardDescription>
									<CardAction>Card Action</CardAction>
								</CardHeader>
								<CardContent>
									<h1 className="text-2xl font-semibold text-red-500">
										{bills.length > 0 &&
											bills.reduce((sum, bill: any) => sum + bill.totalAmount, 0)}
									</h1>
								</CardContent>
								<CardFooter>
									<p>Card Footer</p>
								</CardFooter>
							</Card>
							<Card className="flex-1">
								<CardHeader>
									<CardTitle>Mosque Contribution</CardTitle>
									<CardDescription>Card Description</CardDescription>
									<CardAction>Card Action</CardAction>
								</CardHeader>
								<CardContent>
									<h1>No Contribution During This Month</h1>
								</CardContent>
								<CardFooter>
									<p>Card Footer</p>
								</CardFooter>
							</Card>
						</div>
						{/* <Card className="">
							<CardHeader>
								<CardTitle>Example Chart</CardTitle>
								<CardDescription>This is an example of a chart</CardDescription>
								<CardAction>No Action</CardAction>
							</CardHeader>
							<CardContent>No Content</CardContent>
							<CardFooter>
								<p>Card Footer</p>
							</CardFooter>
						</Card> */}
						<Card className="">
							<CardHeader>
								<CardTitle>Bill Table</CardTitle>
								<CardDescription>Card Description</CardDescription>
								<CardAction>No Action</CardAction>
							</CardHeader>
							<CardContent>
								<Table>
									<TableCaption>{bills.length > 0 ? "Caption" : "No data"}</TableCaption>
									<TableHeader>
										<TableRow className="bg-gray-50">
											<TableHead>Bill ID</TableHead>
											<TableHead>Flat Number</TableHead>
											<TableHead>Date</TableHead>
											<TableHead className="text-right">Amount</TableHead>
											<TableHead className="text-right">Paid Amount</TableHead>
											<TableHead className="text-right">Remaining Amount</TableHead>
											<TableHead className="text-center">Status</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{bills.map((bill: any, index) => (
											<TableRow key={index}>
												<TableCell>{bill._id}</TableCell>
												<TableCell>{bill.flat.flatNumber}</TableCell>
												<TableCell>
													{new Date(bill.date).toLocaleDateString("default", {
														month: "long",
														year: "numeric",
													})}
												</TableCell>
												<TableCell className="text-right">{bill.totalAmount}</TableCell>
												<TableCell className="text-right">{bill.paidAmount}</TableCell>
												<TableCell className="text-right">
													{bill.totalAmount - bill.paidAmount}
												</TableCell>
												<TableCell className="text-center">
													{bill.status ? (
														<Badge className="bg-green-500" variant={"default"}>
															Paid
														</Badge>
													) : (
														<Badge className="bg-red-500" variant={"default"}>
															Unpaid
														</Badge>
													)}
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</CardContent>
							<CardFooter>
								<Button variant={"default"}>Show Bill History</Button>
							</CardFooter>
						</Card>
					</CardContent>
					<CardFooter></CardFooter>
				</Card>
				<Footer />
			</main>
		</>
	);
};

export default FlatDashPage;
