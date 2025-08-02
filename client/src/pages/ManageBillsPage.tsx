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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import api from "@/lib/axios";
import { toast } from "sonner";
import * as xlsx from "xlsx";
import HeaderAdmin from "@/components/header-admin";
import Footer from "@/components/footer";

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

const CreateBillSchema = z.object({
	flat: z.string().nonempty("Please select a flat"),
	month: z.string().nonempty("Please select a month"),
	year: z.number("Year can't be anything other than a number").gte(2020, "You're going too far back in the past"),
	totalAmount: z
		.number("Amount can't be anything other than a number")
		.gte(1, "Amount can't be less than or equal to zero"),
});

const UploadBillSchema = z.object({
	month: z.string().nonempty("Please select a month"),
	year: z.number("Year can't be anything other than a number").gte(2020, "You're going too far back in the past"),
});

type CreateBillDataType = z.infer<typeof CreateBillSchema>;
type UploadBillDataType = z.infer<typeof UploadBillSchema>;

const ManageBillsPage: React.FC = () => {
	const [isFormLoading, setIsFormLoading] = useState(false);
	const [isTableLoading, setIsTableLoading] = useState(false);
	const [flats, setFlats] = useState([]);
	const [bills, setBills] = useState([]);
	const [file, setFile] = useState<File | null>(null);
	const [fileInputError, setFileInputError] = useState<string | null>(null);
	const navigate = useNavigate();

	const adminAuthCheck = () => {
		api.get("/auth/admin-auth-check")
			.then((response) => {
				// console.log("Admin authenticated successfully:", response.data);
			})
			.catch((error) => {
				// console.error("Unauthorized or error authenticating admin:", error);
				navigate("/sign-in");
			});
	};

	const fetchFlats = () => {
		setIsFormLoading(true);
		api.get("/flats")
			.then((response) => {
				setFlats(response.data);
			})
			.catch((error) => {
				console.error("Error fetching flats:", error);
			});
		setIsFormLoading(false);
	};

	const fetchBills = () => {
		setIsTableLoading(true);
		api.get("/bills")
			.then((response) => {
				setBills(response.data);
			})
			.catch((error) => {
				console.error("Error fetching bills:", error);
			});
		setIsTableLoading(false);
	};

	useEffect(() => {
		adminAuthCheck();
		fetchFlats();
		fetchBills();
	}, []);

	const createBillForm = useForm<CreateBillDataType>({
		resolver: zodResolver(CreateBillSchema),
		mode: "onSubmit",
		defaultValues: {
			flat: "",
			month: "",
		},
	});

	const uploadBillForm = useForm<UploadBillDataType>({
		resolver: zodResolver(UploadBillSchema),
		mode: "onSubmit",
		defaultValues: {
			month: "",
		},
	});

	const handleCreateBill = (data: CreateBillDataType) => {
		setIsFormLoading(true);
		api.post("/bills/create", {
			date: `${data.year}-${data.month}-15`,
			flat: data.flat,
			totalAmount: data.totalAmount,
		})
			.then((response) => {
				fetchBills();
				toast("Bill has been created", {
					description: "Check the table for more options",
					action: {
						label: "Cancel",
						onClick: () => {},
					},
				});
			})
			.catch((error) => {
				console.error("Error creating bill:", error);
			});
		setIsFormLoading(false);
	};

	const handleUploadBill = async (data: UploadBillDataType) => {
		setIsFormLoading(true);
		setFileInputError(null);
		if (!file) {
			setFileInputError("File is required");
			setIsFormLoading(false);
			return;
		}
		const allowedTypes = [
			"application/vnd.ms-excel",
			"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
		];
		if (!allowedTypes.includes(file.type)) {
			setFileInputError("Only .xls and .xlsx files are allowed");
			setIsFormLoading(false);
			return;
		}
		if (file.size >= 5 * 1024 * 1024) {
			setFileInputError("File size mustn't exceed 5 MB");
			setIsFormLoading(false);
			return;
		}
		const fileData = await file.arrayBuffer();
		const workbook = xlsx.read(fileData, { type: "array" });
		const sheetName = workbook.SheetNames[0];
		const worksheet = workbook.Sheets[sheetName];
		const sheetData = xlsx.utils.sheet_to_json(worksheet);

		const finalData = sheetData.map((entry: any, index) => {
			if (!entry.flatId || !entry.flatNumber) {
				setFileInputError(`Row ${index + 1} has missing data`);
				setIsFormLoading(false);
				return;
			}
			if (!flats.some((flat: any) => flat._id === entry.flatId && flat.flatNumber === entry.flatNumber)) {
				setFileInputError(`Row ${index + 1} has incorrect data`);
				setIsFormLoading(false);
				return;
			}

			return {
				date: `${data.year}-${data.month}-15`,
				flat: entry.flatId,
				totalAmount: entry.bill || 0,
				paidAmount: 0,
				status: false,
			};
		});

		api.post("/bills/upload", { data: finalData })
			.then((response) => {
				fetchBills();
				toast(`${response.data.count} bills have been created`, {
					description: "Check the table for more options",
					action: {
						label: "Cancel",
						onClick: () => {},
					},
				});
			})
			.catch((error) => {
				console.error("Error uploading bills:", error);
			});

		setIsFormLoading(false);
	};

	const handleDeleteBill = (id: string) => {
		api.delete(`/bills/${id}`)
			.then((response) => {
				fetchBills();
				toast("Bill has been deleted", {
					description: "Check the table for more options",
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
			<main className="flex flex-col min-h-screen gap-6">
				<HeaderAdmin />
				<Card className="flex grow container mx-auto">
					<CardHeader>
						<CardTitle className="text-2xl">Create Bill</CardTitle>
						<CardDescription>Please make sure all information is correct before creating</CardDescription>
						<CardAction>Card Action</CardAction>
					</CardHeader>
					<CardContent className="flex flex-col gap-6">
						<Tabs defaultValue="create" className="max-w-md">
							<TabsList className="w-full mb-6">
								<TabsTrigger value="create">Create Individually</TabsTrigger>
								<TabsTrigger value="upload">Upload Collectively</TabsTrigger>
							</TabsList>
							<TabsContent value="create">
								<form
									className="flex flex-col gap-6"
									onSubmit={createBillForm.handleSubmit(handleCreateBill)}
									action=""
									method=""
								>
									<div className="flex flex-col gap-2">
										<Label htmlFor="flat">Flat</Label>
										<Select
											value={createBillForm.watch("flat")}
											onValueChange={(value) => createBillForm.setValue("flat", value)}
											defaultValue=""
										>
											<SelectTrigger className="w-full">
												<SelectValue placeholder="Select flat" />
											</SelectTrigger>
											<SelectContent>
												<SelectGroup>
													<SelectLabel>Flats</SelectLabel>
													{flats.map((flat: any, index) => (
														<SelectItem key={index} value={flat._id}>
															{flat.flatNumber}
														</SelectItem>
													))}
												</SelectGroup>
											</SelectContent>
										</Select>
										{createBillForm.formState.errors.flat && (
											<span className="text-xs text-red-500">
												{createBillForm.formState.errors.flat.message}
											</span>
										)}
									</div>
									<div className="flex flex-col gap-2">
										<Label htmlFor="month">Month</Label>
										<Select
											value={createBillForm.watch("month")}
											onValueChange={(value) => createBillForm.setValue("month", value)}
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
										{createBillForm.formState.errors.month && (
											<span className="text-xs text-red-500">
												{createBillForm.formState.errors.month.message}
											</span>
										)}
									</div>
									<div className="flex flex-col gap-2">
										<Label htmlFor="year">Year</Label>
										<Input
											type="number"
											{...createBillForm.register("year", { valueAsNumber: true })}
										/>
										{createBillForm.formState.errors.year && (
											<span className="text-xs text-red-500">
												{createBillForm.formState.errors.year.message}
											</span>
										)}
									</div>
									<div className="flex flex-col gap-2">
										<Label htmlFor="totalAmount">Amount</Label>
										<Input
											type="number"
											{...createBillForm.register("totalAmount", { valueAsNumber: true })}
										/>
										{createBillForm.formState.errors.totalAmount && (
											<span className="text-xs text-red-500">
												{createBillForm.formState.errors.totalAmount.message}
											</span>
										)}
									</div>
									<Button type="submit" disabled={isFormLoading}>
										{isFormLoading ? "Loading..." : "Create"}
									</Button>
								</form>
							</TabsContent>
							<TabsContent value="upload">
								<form
									className="flex flex-col gap-6"
									onSubmit={uploadBillForm.handleSubmit(handleUploadBill)}
									action=""
									method=""
								>
									<div className="flex flex-col gap-2">
										<Label htmlFor="month">Month</Label>
										<Select
											value={uploadBillForm.watch("month")}
											onValueChange={(value) => uploadBillForm.setValue("month", value)}
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
										{uploadBillForm.formState.errors.month && (
											<span className="text-xs text-red-500">
												{uploadBillForm.formState.errors.month.message}
											</span>
										)}
									</div>
									<div className="flex flex-col gap-2">
										<Label htmlFor="year">Year</Label>
										<Input
											type="number"
											{...uploadBillForm.register("year", { valueAsNumber: true })}
										/>
										{uploadBillForm.formState.errors.year && (
											<span className="text-xs text-red-500">
												{uploadBillForm.formState.errors.year.message}
											</span>
										)}
									</div>
									<div className="flex flex-col gap-2">
										<Label htmlFor="spreadsheet">Upload Spreadsheet</Label>
										<Input
											type="file"
											accept=".xls, .xlsx"
											onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
												setFile(event.target.files && event.target.files[0]);
											}}
										/>
										{fileInputError && (
											<span className="text-xs text-red-500">{fileInputError}</span>
										)}
									</div>
									<Button type="submit" disabled={isFormLoading}>
										{isFormLoading ? "Loading..." : "Upload"}
									</Button>
								</form>
							</TabsContent>
						</Tabs>
						<Card className="">
							<CardHeader>
								<CardTitle className="">Bill Table</CardTitle>
								<CardDescription>Card description</CardDescription>
								<CardAction>Card Action</CardAction>
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
													<button
														onClick={() => handleDeleteBill(bill._id)}
														className="font-semibold hover:underline cursor-pointer"
													>
														Delete
													</button>
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

export default ManageBillsPage;
