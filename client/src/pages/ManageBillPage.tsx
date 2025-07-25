import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
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
import { Loader2Icon } from "lucide-react";
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
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "sonner";

const months = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];

const BillSchema = z.object({
	flatNumber: z.string().nonempty("Falt number can't be empty"),
	month: z.string().nonempty("Please select a month"),
	year: z.number("Year can't be anything other than a number").gte(2020, "You're going too far back in the past"),
	totalAmount: z
		.number("Amount can't be anything other than a number")
		.gte(1, "Amount can't be less than or equal to zero"),
});

type BillDataType = z.infer<typeof BillSchema>;

const ManageBillPage: React.FC = () => {
	const [isFormLoading, setIsFormLoading] = useState(false);
	const [isTableLoading, setIsTableLoading] = useState(false);
	const [flats, setFlats] = useState([]);
	const [bills, setBills] = useState([]);
	const navigate = useNavigate();

	const fetchFlats = () => {
		setIsFormLoading((prev) => (prev = true));
		axios.get("http://localhost:8000/api/flat", { withCredentials: true });
	};

	const fetchBills = () => {
		setIsTableLoading((prev) => (prev = true));
		axios
			.get("http://localhost:8000/api/bill", { withCredentials: true })
			.then((response) => {
				setBills((prev) => (prev = response.data));
			})
			.catch((error) => {
				console.error("Error fetching bills", error);
			});
		setIsTableLoading((prev) => (prev = false));
	};

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
		fetchBills();
	}, [navigate]);

	const billForm = useForm<BillDataType>({
		resolver: zodResolver(BillSchema),
		mode: "onSubmit",
		defaultValues: {
			month: "",
		},
	});

	const handleCreateBill = (data: BillDataType) => {
		setIsFormLoading((prev) => (prev = true));
		axios
			.post(
				"http://localhost:8000/api/bill",
				{
					date: `${data.year}-${data.month}-05`,
					flatNumber: data.flatNumber,
					totalAmount: data.totalAmount,
				},
				{ withCredentials: true }
			)
			.then(() => {
				fetchBills();
				toast("Bill has been created", {
					description: "Check the table below for more options",
					action: {
						label: "Cancel",
						onClick: () => {},
					},
				});
			})
			.catch((error) => {
				console.error("Error creating bill:", error);
			});
		setIsFormLoading((prev) => (prev = false));
	};

	const handleDeleteBill = (id: string) => {
		axios
			.delete(`http://localhost:8000/api/bill/${id}`, { withCredentials: true })
			.then(() => {
				fetchBills();
				toast("Bill has been deleted", {
					description: "Check the table below for more options",
					action: {
						label: "Cancel",
						onClick: () => {},
					},
				});
			})
			.catch((error) => {
				console.error("Error deleting bill:", error);
			});
	};

	return (
		<>
			<Card className="w-full">
				<CardHeader>
					<CardTitle className="text-2xl">Create Bill</CardTitle>
					<CardDescription>Please make sure all information is correct before creating</CardDescription>
					<CardAction></CardAction>
				</CardHeader>
				<CardContent className="flex flex-col">
					<form
						className="flex flex-col gap-6 w-md"
						onSubmit={billForm.handleSubmit(handleCreateBill)}
						action=""
						method=""
					>
						<div className="flex flex-col gap-2">
							<Label htmlFor="flatNumber">Flat Number</Label>
							<Input type="text" {...billForm.register("flatNumber")} />
							{billForm.formState.errors.flatNumber && (
								<span className="text-xs text-red-500">
									{billForm.formState.errors.flatNumber.message}
								</span>
							)}
						</div>
						<div className="flex flex-col gap-2">
							<Label htmlFor="month">Month</Label>
							<Select
								value={billForm.watch("month")}
								onValueChange={(value) => billForm.setValue("month", value)}
								defaultValue=""
							>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Select month" />
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
										<SelectLabel>Months</SelectLabel>
										{months.map((month, index) => (
											<SelectItem key={index} value={`${index + 1}`}>
												{month}
											</SelectItem>
										))}
									</SelectGroup>
								</SelectContent>
							</Select>
							{billForm.formState.errors.month && (
								<span className="text-xs text-red-500">{billForm.formState.errors.month.message}</span>
							)}
						</div>
						<div className="flex flex-col gap-2">
							<Label htmlFor="year">Year</Label>
							<Input type="number" {...billForm.register("year", { valueAsNumber: true })} />
							{billForm.formState.errors.year && (
								<span className="text-xs text-red-500">{billForm.formState.errors.year.message}</span>
							)}
						</div>
						<div className="flex flex-col gap-2">
							<Label htmlFor="totalAmount">Amount</Label>
							<Input type="number" {...billForm.register("totalAmount", { valueAsNumber: true })} />
							{billForm.formState.errors.totalAmount && (
								<span className="text-xs text-red-500">
									{billForm.formState.errors.totalAmount.message}
								</span>
							)}
						</div>
						<Button type="submit" disabled={isFormLoading}>
							{isFormLoading ? <Loader2Icon /> : "Create"}
						</Button>
					</form>
				</CardContent>
				<CardFooter></CardFooter>
				<Card className="mx-6">
					<CardHeader>
						<CardTitle>Bill Table</CardTitle>
						<CardDescription></CardDescription>
						<CardAction></CardAction>
					</CardHeader>
					<CardContent>
						<Table>
							<TableCaption>A list of all bills created</TableCaption>
							<TableHeader>
								<TableRow className="bg-gray-50">
									<TableHead>Bill ID</TableHead>
									<TableHead>Flat Number</TableHead>
									<TableHead>Date</TableHead>
									<TableHead className="text-right">Amount</TableHead>
									<TableHead className="text-right">Paid Amount</TableHead>
									<TableHead className="text-right">Remaining Amount</TableHead>
									<TableHead className="text-center">Status</TableHead>
									<TableHead className="text-center">Action</TableHead>
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
										<TableCell className="text-center">
											<Button
												onClick={() => handleDeleteBill(bill._id)}
												className=""
												variant={"default"}
											>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													// width="16"
													// height="16"
													fill="currentColor"
													className="bi bi-trash-fill"
													viewBox="0 0 16 16"
												>
													<path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0" />
												</svg>
											</Button>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</CardContent>
					<CardFooter>
						<p>Card Footer</p>
					</CardFooter>
				</Card>
				<CardFooter></CardFooter>
			</Card>
		</>
	);
};

export default ManageBillPage;
