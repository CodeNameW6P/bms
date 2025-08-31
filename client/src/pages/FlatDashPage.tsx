import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
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
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import HeaderFlat from "@/components/HeaderFlat";
import Footer from "@/components/Footer";
import { MONTHS } from "@/lib/constants";
import { flatAuthVerifyApi } from "@/api/authApi";
import { fetchFlatBillsApi, fetchFlatBillRemainingApi } from "@/api/billApi";
import { fetchCurrentFlatContributionApi } from "@/api/contributionApi";

const FlatDashPage: React.FC = () => {
	const [isPageloading, setIsPageLoading] = useState(true);
	const [flat, setFlat] = useState<any>(null);
	const [bills, setBills] = useState([]);
	const [billRemaining, setBillRemaining] = useState(0);
	const [currentContribution, setCurrentContribution] = useState(0);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(0);
	const navigate = useNavigate();

	useEffect(() => {
		const flatAuthVerify = async () => {
			const response = await flatAuthVerifyApi();
			if (response.success) {
				setFlat(response.data);
			} else {
				toast("Unauthorized", {
					description: "Please sign in again",
					action: {
						label: "Okay",
						onClick: () => {},
					},
				});
				navigate("/sign-in");
			}
		};

		flatAuthVerify();
	}, [navigate]);

	const fetchFlatBills = async () => {
		const response = await fetchFlatBillsApi(flat._id, currentPage, 10, false, false);
		if (response.success) {
			setBills(response.data.bills);
			setTotalPages(response.data.totalPages);
		} else {
			toast("Failed to fetch flat bills", {
				description: response.error || "Some error is preventing bills from being fetched",
				action: {
					label: "Okay",
					onClick: () => {},
				},
			});
		}
	};

	useEffect(() => {
		const fetchFlatBillRemaining = async () => {
			const response = await fetchFlatBillRemainingApi(flat._id);
			if (response.success) {
				setBillRemaining(response.data);
			} else {
				toast("Failed to fetch flat bill remaining", {
					description:
						response.error ||
						"Some error is preventing bill remaining from being fetched",
					action: {
						label: "Okay",
						onClick: () => {},
					},
				});
			}
		};

		const fetchCurrentFlatContribution = async () => {
			const response = await fetchCurrentFlatContributionApi(flat._id);
			if (response.success) {
				setCurrentContribution(response.data.amount);
			}
		};

		if (flat) {
			fetchFlatBills();
			fetchFlatBillRemaining();
			fetchCurrentFlatContribution();
		}
	}, [flat]);

	return (
		<>
			<main className="flex flex-col min-h-screen gap-6">
				<HeaderFlat />
				<Card className="flex grow container mx-auto">
					<CardHeader>
						<CardTitle className="text-2xl">
							{flat && flat.flatNumber} Flat Resident Dashboard
						</CardTitle>
						<CardDescription>Card Description</CardDescription>
						<CardAction>Card Action</CardAction>
					</CardHeader>
					<CardContent className="flex flex-col gap-6">
						<div className="flex gap-6">
							<Card className="flex-1">
								<CardHeader>
									<CardTitle>Total Remaining Bill</CardTitle>
								</CardHeader>
								<CardContent className="text-2xl">৳ {billRemaining}</CardContent>
							</Card>
							<Card className="flex-1">
								<CardHeader>
									<CardTitle>This Month's Mosque Contribution</CardTitle>
								</CardHeader>
								<CardContent className="text-2xl">
									৳ {currentContribution}
								</CardContent>
							</Card>
						</div>
						<Card className="">
							<CardHeader>
								<CardTitle>Bill Table</CardTitle>
								<CardDescription>Card Description</CardDescription>
								<CardAction>No Action</CardAction>
							</CardHeader>
							<CardContent>
								<Table>
									<TableCaption>
										{bills.length > 0
											? `Page ${currentPage} out of ${totalPages}`
											: "No data"}
									</TableCaption>
									<TableHeader>
										<TableRow className="bg-muted">
											<TableHead>Bill ID</TableHead>
											<TableHead>Flat Number</TableHead>
											<TableHead>Month</TableHead>
											<TableHead>Year</TableHead>
											<TableHead className="text-right">
												Bill Amount
											</TableHead>
											<TableHead className="text-right">
												Paid Amount
											</TableHead>
											<TableHead className="text-right">
												Remaining Amount
											</TableHead>
											<TableHead className="text-center">Status</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{bills &&
											bills.map((bill: any, index) => (
												<TableRow key={index}>
													<TableCell>{bill._id}</TableCell>
													<TableCell>{bill.flat.flatNumber}</TableCell>
													<TableCell>{MONTHS[bill.month - 1]}</TableCell>
													<TableCell>{bill.year}</TableCell>
													<TableCell className="text-right">
														{bill.billAmount}
													</TableCell>
													<TableCell className="text-right">
														{bill.paidAmount}
													</TableCell>
													<TableCell className="text-right">
														{bill.billAmount - bill.paidAmount}
													</TableCell>
													<TableCell className="text-center">
														{bill.paidAmount < bill.billAmount ? (
															<Badge
																className="bg-red-500 rounded-xs"
																variant={"default"}
															>
																Unpaid
															</Badge>
														) : (
															<Badge
																className="bg-green-500 rounded-xs"
																variant={"default"}
															>
																Paid
															</Badge>
														)}
													</TableCell>
												</TableRow>
											))}
									</TableBody>
								</Table>
							</CardContent>
							<CardFooter className="flex justify-between">
								<Button
									onClick={() => {
										if (currentPage > 1) {
											setCurrentPage(currentPage - 1);
											fetchFlatBills();
										}
									}}
									disabled={currentPage === 1}
									variant={"outline"}
								>
									Previous
								</Button>
								<Button
									onClick={() => {
										if (currentPage < totalPages) {
											setCurrentPage(currentPage + 1);
											fetchFlatBills();
										}
									}}
									disabled={currentPage === totalPages || totalPages === 0}
									variant={"outline"}
								>
									Next
								</Button>
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
