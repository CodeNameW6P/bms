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
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import HeaderAdmin from "@/components/HeaderAdmin";
import Footer from "@/components/Footer";
import { adminAuthVerify } from "@/lib/authVerify";
import { fetchFlatsApi } from "@/api/flatApi";
import {
	createContributionApi,
	fetchContributionsApi,
	updateContributionApi,
	deleteContributionApi,
} from "@/api/contributionApi";

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

const CreateContributionSchema = z.object({
	flatId: z.string("Flat can't be anything other than a string").nonempty("Please select a flat"),
	month: z
		.string("Month can't be anything other than a string")
		.nonempty("Please select a month"),
	year: z
		.number("Year can't be anything other than a number")
		.gte(2020, "You're going too far back in the past"),
	amount: z
		.number("Amount can't be anything other than a number")
		.nonnegative("Amount can't be negative"),
});

export type CreateContributionData = z.infer<typeof CreateContributionSchema>;

const ManageMosqueContributionsPage: React.FC = () => {
	const [isPageLoading, setIsPageLoading] = useState(true);
	const [isFormLoading, setIsFormLoading] = useState(false);
	const [flats, setFlats] = useState([]);
	const [contributions, setContributions] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(0);
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [deletingId, setDeletingId] = useState<string | null>(null);
	const navigate = useNavigate();

	const fetchContributions = async () => {
		const response = await fetchContributionsApi(currentPage, 10, false);
		if (response.success) {
			setContributions(response.data.contributions);
			setTotalPages(response.data.totalPages);
		} else {
			toast("Failed to fetch contributions", {
				description:
					response.error || "Some error is preventing contributions from being fetched",
				action: {
					label: "Okay",
					onClick: () => {},
				},
			});
		}
	};

	useEffect(() => {
		adminAuthVerify(setIsPageLoading, navigate);
		const fetchFlats = async () => {
			const response = await fetchFlatsApi();
			if (response.success) {
				setFlats(response.data);
			} else {
				toast("Failed to fetch flats", {
					description:
						response.error || "Some error is preventing flats from being fetched",
					action: {
						label: "Okay",
						onClick: () => {},
					},
				});
			}
		};

		fetchFlats();
		fetchContributions();
	}, [navigate]);

	const createContributionForm = useForm({
		resolver: zodResolver(CreateContributionSchema),
		mode: "onSubmit",
		defaultValues: {
			flatId: "",
			month: "",
		},
	});

	const editContributionForm = useForm({
		resolver: zodResolver(CreateContributionSchema),
		mode: "onSubmit",
		defaultValues: {
			flatId: "",
			month: "",
		},
	});

	const handleCreateContribution = async (formData: CreateContributionData) => {
		setIsFormLoading(true);
		const response = await createContributionApi(formData);
		if (response.success) {
			fetchContributions();
			toast("Contribution has been created", {
				description: "Check the table for more options",
				action: {
					label: "Okay",
					onClick: () => {},
				},
			});
			createContributionForm.reset();
		} else {
			createContributionForm.setError("root", {
				message: response.error || "Failed to create contribution",
			});
		}
		setIsFormLoading(false);
	};

	const handleEditContribution = async (id: string, formData: CreateContributionData) => {
		setIsFormLoading(true);
		const response = await updateContributionApi(id, formData);
		if (response.success) {
			fetchContributions();
			toast("Contribution has been edited", {
				description: "Check the table for more options",
				action: {
					label: "Okay",
					onClick: () => {},
				},
			});
			setIsEditDialogOpen(false);
			editContributionForm.reset();
		} else {
			editContributionForm.setError("root", {
				message: response.error || "Failed to edit contribution",
			});
		}
		setIsFormLoading(false);
	};

	const handleDeleteContribution = async (id: string) => {
		const response = await deleteContributionApi(id);
		if (response.success) {
			fetchContributions();
			toast("Contribution has been deleted", {
				description: "Check the table for more options",
				action: {
					label: "Okay",
					onClick: () => {},
				},
			});
			setIsDeleteDialogOpen(false);
		} else {
			toast("Failed to delete contribution", {
				description:
					response.error || "Some error is preventing contribution from being deleted",
				action: {
					label: "Okay",
					onClick: () => {},
				},
			});
		}
	};

	return (
		<>
			<main className="flex flex-col min-h-screen gap-6">
				<HeaderAdmin />
				<Card className="flex grow container mx-auto">
					<CardHeader>
						<CardTitle className="text-2xl">
							Insert Mosque Contribution Information
						</CardTitle>
						<CardDescription>
							Please make sure all information is correct before proceeding
						</CardDescription>
						<CardAction>Card Action</CardAction>
					</CardHeader>
					<CardContent className="flex flex-col gap-6">
						<Tabs defaultValue="create" className="max-w-md">
							<TabsList className="w-full mb-4">
								<TabsTrigger value="create">Insert Individually</TabsTrigger>
								<TabsTrigger value="upload">Upload Collectively</TabsTrigger>
							</TabsList>
							<TabsContent value="create">
								<form
									className="flex flex-col gap-6"
									onSubmit={createContributionForm.handleSubmit(
										handleCreateContribution
									)}
									action=""
									method=""
								>
									<div className="flex flex-col gap-2">
										<Label htmlFor="flatId">Flat</Label>
										<Select
											value={createContributionForm.watch("flatId")}
											onValueChange={(value) =>
												createContributionForm.setValue("flatId", value)
											}
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
										{createContributionForm.formState.errors.flatId && (
											<span className="text-xs text-red-500 font-semibold">
												{
													createContributionForm.formState.errors.flatId
														.message
												}
											</span>
										)}
									</div>
									<div className="flex flex-col gap-2">
										<Label htmlFor="month">Month</Label>
										<Select
											value={createContributionForm.watch("month")}
											onValueChange={(value) =>
												createContributionForm.setValue("month", value)
											}
											defaultValue=""
										>
											<SelectTrigger className="w-full">
												<SelectValue placeholder="Select month" />
											</SelectTrigger>
											<SelectContent>
												<SelectGroup>
													<SelectLabel>Months</SelectLabel>
													{months.map((month, index) => (
														<SelectItem
															key={index}
															value={`${index + 1}`}
														>
															{month}
														</SelectItem>
													))}
												</SelectGroup>
											</SelectContent>
										</Select>
										{createContributionForm.formState.errors.month && (
											<span className="text-xs text-red-500 font-semibold">
												{
													createContributionForm.formState.errors.month
														.message
												}
											</span>
										)}
									</div>
									<div className="flex flex-col gap-2">
										<Label htmlFor="year">Year</Label>
										<Input
											type="number"
											{...createContributionForm.register("year", {
												valueAsNumber: true,
											})}
										/>
										{createContributionForm.formState.errors.year && (
											<span className="text-xs text-red-500 font-semibold">
												{
													createContributionForm.formState.errors.year
														.message
												}
											</span>
										)}
									</div>
									<div className="flex flex-col gap-2">
										<Label htmlFor="amount">Amount</Label>
										<Input
											type="number"
											{...createContributionForm.register("amount", {
												valueAsNumber: true,
											})}
										/>
										{createContributionForm.formState.errors.amount && (
											<span className="text-xs text-red-500 font-semibold">
												{
													createContributionForm.formState.errors.amount
														.message
												}
											</span>
										)}
									</div>
									<Button type="submit" disabled={isFormLoading}>
										{isFormLoading ? "Loading..." : "Create"}
									</Button>
									{createContributionForm.formState.errors.root && (
										<span className="text-red-500 text-center">
											{createContributionForm.formState.errors.root.message}
										</span>
									)}
								</form>
							</TabsContent>
							<TabsContent value="upload"></TabsContent>
						</Tabs>
						<Card className="">
							<CardHeader>
								<CardTitle className="">Mosque Contribution Table</CardTitle>
								<CardDescription>Card description</CardDescription>
								<CardAction>
									<Button onClick={fetchContributions} variant={"outline"}>
										Refresh
									</Button>
								</CardAction>
							</CardHeader>
							<CardContent>
								<Table>
									<TableCaption>
										{contributions.length > 0
											? `Page ${currentPage} out of ${totalPages}`
											: "No data"}
									</TableCaption>
									<TableHeader>
										<TableRow className="bg-muted">
											<TableHead>Mosque Contribution ID</TableHead>
											<TableHead>Flat Number</TableHead>
											<TableHead>Month</TableHead>
											<TableHead>Year</TableHead>
											<TableHead className="text-right">Amount</TableHead>
											<TableHead className="text-center">Action</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{contributions.map((contribution: any, index) => (
											<TableRow key={index}>
												<TableCell>{contribution._id}</TableCell>
												<TableCell>
													{contribution.flat.flatNumber}
												</TableCell>
												<TableCell>
													{months[contribution.month - 1]}
												</TableCell>
												<TableCell>{contribution.year}</TableCell>
												<TableCell className="text-right">
													{contribution.amount}
												</TableCell>
												<TableCell className="flex flex-row justify-center gap-4 font-semibold">
													<button
														onClick={() => {
															setEditingId(contribution._id);
															editContributionForm.reset({
																flatId: contribution.flat._id,
																month: `${contribution.month}`,
																year: contribution.year,
																amount: contribution.amount,
															});
															setIsEditDialogOpen(true);
														}}
														className="hover:underline cursor-pointer"
													>
														Edit
													</button>
													<button
														onClick={() => {
															setDeletingId(contribution._id);
															setIsDeleteDialogOpen(true);
														}}
														className="hover:underline cursor-pointer"
													>
														Delete
													</button>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
								<Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
									<DialogContent className="">
										<DialogHeader>
											<DialogTitle className="">
												Edit Mosque Contribution
											</DialogTitle>
											<DialogDescription>
												Please make sure all information is correct before
												proceeding
											</DialogDescription>
										</DialogHeader>
										<form
											className="flex flex-col gap-6 mt-2"
											onSubmit={editContributionForm.handleSubmit(
												(formData) => {
													handleEditContribution(
														editingId as string,
														formData
													);
												}
											)}
											action=""
											method=""
										>
											<div className="flex flex-col gap-2">
												<Label htmlFor="flat">Flat</Label>
												<Select
													value={editContributionForm.watch("flatId")}
													onValueChange={(value) =>
														editContributionForm.setValue(
															"flatId",
															value
														)
													}
													defaultValue=""
												>
													<SelectTrigger className="w-full">
														<SelectValue placeholder="Select flat" />
													</SelectTrigger>
													<SelectContent>
														<SelectGroup>
															<SelectLabel>Flats</SelectLabel>
															{flats.map((flat: any, index) => (
																<SelectItem
																	key={index}
																	value={flat._id}
																>
																	{flat.flatNumber}
																</SelectItem>
															))}
														</SelectGroup>
													</SelectContent>
												</Select>
												{editContributionForm.formState.errors.flatId && (
													<span className="text-xs text-red-500 font-semibold">
														{
															editContributionForm.formState.errors
																.flatId.message
														}
													</span>
												)}
											</div>
											<div className="flex flex-col gap-2">
												<Label htmlFor="month">Month</Label>
												<Select
													value={editContributionForm.watch("month")}
													onValueChange={(value) =>
														editContributionForm.setValue(
															"month",
															value
														)
													}
													defaultValue=""
												>
													<SelectTrigger className="w-full">
														<SelectValue placeholder="Select month" />
													</SelectTrigger>
													<SelectContent>
														<SelectGroup>
															<SelectLabel>Months</SelectLabel>
															{months.map((month, index) => (
																<SelectItem
																	key={index}
																	value={`${index + 1}`}
																>
																	{month}
																</SelectItem>
															))}
														</SelectGroup>
													</SelectContent>
												</Select>
												{editContributionForm.formState.errors.month && (
													<span className="text-xs text-red-500 font-semibold">
														{
															editContributionForm.formState.errors
																.month.message
														}
													</span>
												)}
											</div>
											<div className="flex flex-col gap-2">
												<Label htmlFor="year">Year</Label>
												<Input
													type="number"
													{...editContributionForm.register("year", {
														valueAsNumber: true,
													})}
												/>
												{editContributionForm.formState.errors.year && (
													<span className="text-xs text-red-500 font-semibold">
														{
															editContributionForm.formState.errors
																.year.message
														}
													</span>
												)}
											</div>
											<div className="flex flex-col gap-2">
												<Label htmlFor="amount">Amount</Label>
												<Input
													type="number"
													{...editContributionForm.register("amount", {
														valueAsNumber: true,
													})}
												/>
												{editContributionForm.formState.errors.amount && (
													<span className="text-xs text-red-500 font-semibold">
														{
															editContributionForm.formState.errors
																.amount.message
														}
													</span>
												)}
											</div>
											<Button type="submit" disabled={isFormLoading}>
												{isFormLoading ? "Loading..." : "Save Changes"}
											</Button>
										</form>
										{editContributionForm.formState.errors.root && (
											<DialogFooter>
												<span className="text-red-500 text-center w-full">
													{
														editContributionForm.formState.errors.root
															.message
													}
												</span>
											</DialogFooter>
										)}
									</DialogContent>
								</Dialog>
								<Dialog
									open={isDeleteDialogOpen}
									onOpenChange={setIsDeleteDialogOpen}
								>
									<DialogContent>
										<DialogHeader>
											<DialogTitle className="">
												Are you sure you want to delete this mosque
												contribution?
											</DialogTitle>
											<DialogDescription>
												Once you delete, this action can't be undone
											</DialogDescription>
										</DialogHeader>
										<DialogFooter className="flex gap-4">
											<DialogClose asChild>
												<Button
													variant={"outline"}
													onClick={() => setIsDeleteDialogOpen(false)}
												>
													Cancel
												</Button>
											</DialogClose>
											<Button
												onClick={() =>
													handleDeleteContribution(deletingId as string)
												}
											>
												Delete
											</Button>
										</DialogFooter>
									</DialogContent>
								</Dialog>
							</CardContent>
							<CardFooter className="flex justify-between">
								<Button
									onClick={() => {
										if (currentPage > 1) {
											setCurrentPage(currentPage - 1);
											fetchContributions();
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
											fetchContributions();
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
					<CardFooter>
						<p>Card Footer</p>
					</CardFooter>
				</Card>
				<Footer />
			</main>
		</>
	);
};

export default ManageMosqueContributionsPage;
