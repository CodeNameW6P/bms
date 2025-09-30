import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef, use } from "react";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
	SelectGroup,
	SelectLabel,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Dialog,
	DialogClose,
	DialogContent,
	// DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	// DialogTrigger,
} from "@/components/ui/dialog";
import { MONTHS } from "@/lib/constants";
import { toast } from "sonner";
import HeaderFlat from "@/components/HeaderFlat";
import Footer from "@/components/Footer";
import { flatAuthCheckApi } from "@/api/authApi";
import { fetchFlatGasUsagesApi } from "@/api/gasUsageApi";

const ViewGasUsagesPage: React.FC = () => {
	const [_isPageLoading, setIsPageLoading] = useState(true);
	const [flat, setFlat] = useState<any>(null);
	const [gasUsages, setGasUsages] = useState([]);
	const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
	const invoiceRef = useRef<HTMLDivElement>(null);
	const [selectedGasUsage, setSelectedGasUsage] = useState<any>(null);
	const currentDate = new Date();
	const [tableFilters, setTableFilters] = useState({
		starting: `${currentDate.getFullYear()}-01`,
		ending: currentDate.toISOString().slice(0, 7),
		status: "all",
	});
	const navigate = useNavigate();

	const fetchFlatGasUsages = async () => {
		const response = await fetchFlatGasUsagesApi(
			flat._id,
			tableFilters.starting,
			tableFilters.ending,
			tableFilters.status
		);
		if (response.success) {
			setGasUsages(response.data);
		} else {
			toast("Failed to fetch flat gas usage records", {
				description:
					response.error || "Some error is preventing records from being fetched",
				action: {
					label: "OK",
					onClick: () => {},
				},
			});
		}
	};

	useEffect(() => {
		const flatAuthCheck = async () => {
			const response = await flatAuthCheckApi();
			if (response.success) {
				setFlat(response.data.flat);
				setIsPageLoading(false);
			} else {
				toast("Unauthorized", {
					description: "Please sign in again",
					action: {
						label: "OK",
						onClick: () => {},
					},
				});
				navigate("/sign-in");
			}
		};

		flatAuthCheck();
	}, [navigate]);

	useEffect(() => {
		if (flat) {
			fetchFlatGasUsages();
		}
	}, [flat]);

	return (
		<main className="flex flex-col min-h-screen gap-6">
			<HeaderFlat />
			<Card className="flex grow container mx-auto">
				<CardHeader>
					<CardTitle className="text-2xl">
						{flat && flat.flatNumber} Flat Gas Usage Records
					</CardTitle>
				</CardHeader>
				<CardContent className="flex flex-col gap-6">
					<Card className="">
						<CardHeader className="">
							<CardTitle className="">Gas Usage Record Table</CardTitle>
							<CardDescription>
								From {tableFilters.ending} | To {tableFilters.starting}
							</CardDescription>
							<CardAction className="flex gap-4">
								<Button
									onClick={() => setIsFilterDialogOpen(true)}
									variant={"outline"}
								>
									Filters
								</Button>
								<Button onClick={() => fetchFlatGasUsages()} variant={"outline"}>
									Refresh
								</Button>
							</CardAction>
						</CardHeader>
						<CardContent className="">
							<Table>
								<TableCaption>
									{gasUsages.length > 0
										? `${gasUsages.length} Gas Usage Record(s)`
										: "No Data"}
								</TableCaption>
								<TableHeader>
									<TableRow className="bg-muted">
										<TableHead>Gas Usage Record ID</TableHead>
										<TableHead>Month</TableHead>
										<TableHead>Year</TableHead>
										<TableHead className="text-right">Unit Readout</TableHead>
										<TableHead className="text-right">Unit Cost</TableHead>
										<TableHead className="text-right">Units Used</TableHead>
										<TableHead className="text-right">Total Bill</TableHead>
										<TableHead className="text-right">Paid Bill</TableHead>
										<TableHead className="text-right">Remaining Bill</TableHead>
										<TableHead className="text-center">Status</TableHead>
										<TableHead className="text-center">Action</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{gasUsages.map((gasUsage: any, index) => (
										<TableRow key={index}>
											<TableCell>{gasUsage._id}</TableCell>
											<TableCell>{MONTHS[gasUsage.month - 1]}</TableCell>
											<TableCell>{gasUsage.year}</TableCell>
											<TableCell className="text-right">
												{gasUsage.unitReadout}
											</TableCell>
											<TableCell className="text-right">
												{gasUsage.unitCost}
											</TableCell>
											<TableCell className="text-right">
												{gasUsage.unitsUsed}
											</TableCell>
											<TableCell className="text-right">
												{gasUsage.billTotal.toLocaleString("en-IN")}
											</TableCell>
											<TableCell className="text-right">
												{gasUsage.billPaid.toLocaleString("en-IN")}
											</TableCell>
											<TableCell className="text-right">
												{(
													gasUsage.billTotal - gasUsage.billPaid
												).toLocaleString("en-IN")}
											</TableCell>
											<TableCell className="text-center">
												{gasUsage.status ? (
													<Badge
														className="bg-green-500 rounded-xs"
														variant={"default"}
													>
														Paid
													</Badge>
												) : (
													<Badge
														className="bg-red-500 rounded-xs"
														variant={"default"}
													>
														Unpaid
													</Badge>
												)}
											</TableCell>
											<TableCell className="flex flex-row justify-center gap-4 font-semibold">
												<button
													disabled={gasUsage.status}
													onClick={() => {}}
													className="hover:underline cursor-pointer"
												>
													Print
												</button>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
							<Dialog open={isFilterDialogOpen} onOpenChange={setIsFilterDialogOpen}>
								<DialogContent>
									<DialogHeader>
										<DialogTitle className="">Set filters</DialogTitle>
									</DialogHeader>
									<div className="flex flex-col gap-6">
										<div className="flex flex-col gap-2">
											<Label htmlFor="from">From</Label>
											<Input
												type="month"
												value={tableFilters.ending}
												onChange={(
													event: React.ChangeEvent<HTMLInputElement>
												) =>
													setTableFilters((prev) => ({
														...prev,
														ending: event.target.value,
													}))
												}
											/>
										</div>
										<div className="flex flex-col gap-2">
											<Label htmlFor="to">To</Label>
											<Input
												type="month"
												value={tableFilters.starting}
												onChange={(
													event: React.ChangeEvent<HTMLInputElement>
												) =>
													setTableFilters((prev) => ({
														...prev,
														starting: event.target.value,
													}))
												}
											/>
										</div>
										<div className="flex flex-col gap-2">
											<Label htmlFor="status">Status</Label>
											<Select
												value={tableFilters.status}
												onValueChange={(value) =>
													setTableFilters((prev) => ({
														...prev,
														status: value,
													}))
												}
											>
												<SelectTrigger className="w-full">
													<SelectValue placeholder="Select month" />
												</SelectTrigger>
												<SelectContent>
													<SelectGroup>
														<SelectLabel>Status</SelectLabel>
														<SelectItem value="all">All</SelectItem>
														<SelectItem value="true">Paid</SelectItem>
														<SelectItem value="false">
															Unpaid
														</SelectItem>
													</SelectGroup>
												</SelectContent>
											</Select>
										</div>
									</div>
									<DialogFooter className="flex gap-4">
										<DialogClose asChild>
											<Button
												variant={"outline"}
												onClick={() => setIsFilterDialogOpen(false)}
											>
												Cancel
											</Button>
										</DialogClose>
										<Button
											onClick={() => {
												fetchFlatGasUsages();
												setIsFilterDialogOpen(false);
											}}
										>
											Filter
										</Button>
									</DialogFooter>
								</DialogContent>
							</Dialog>
						</CardContent>
						<CardFooter>
							<Button
								disabled={!gasUsages || gasUsages.length === 0}
								onClick={() => {}}
							>
								Download PDF
							</Button>
						</CardFooter>
					</Card>
					<Card ref={invoiceRef}>
						<CardHeader>
							<CardTitle>Gas Usage Record Invoice</CardTitle>
							<CardDescription>{flat?.flatNumber} Flat</CardDescription>
						</CardHeader>
						<CardContent>
							<Table>
								<TableBody>
									<TableRow>
										<TableCell>Gas Usage Record ID</TableCell>
										<TableCell>{selectedGasUsage?._id || "N/A"}</TableCell>
									</TableRow>
									<TableRow>
										<TableCell>Month</TableCell>
										<TableCell>
											{selectedGasUsage
												? MONTHS[selectedGasUsage.month - 1]
												: "N/A"}
										</TableCell>
									</TableRow>
									<TableRow>
										<TableCell>Year</TableCell>
										<TableCell>{selectedGasUsage?.year || "N/A"}</TableCell>
									</TableRow>
									<TableRow>
										<TableCell>Unit Readout</TableCell>
										<TableCell>
											{selectedGasUsage?.unitReadout || "N/A"}
										</TableCell>
									</TableRow>
								</TableBody>
							</Table>
						</CardContent>
					</Card>
				</CardContent>
			</Card>
			<Footer />
		</main>
	);
};

export default ViewGasUsagesPage;
