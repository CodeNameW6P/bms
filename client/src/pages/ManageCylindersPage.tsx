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
import { fetchBuildingsApi } from "@/api/buildingApi";
import {
	fetchCylinderLogsApi,
	createCylinderLogApi,
	updateCylinderLogApi,
	deleteCylinderLogApi,
} from "@/api/cylinderLogApi";

const CreateCylinderLogSchema = z.object({
	buildingId: z.string().nonempty("Please select a building"),
	date: z.string().nonempty("Please enter a date"),
	cylindersPurchased: z
		.number("Cylinders purchased can't be anything other than a number")
		.gte(1, "Cylinders purchased can't be less than or equal to zero"),
	dealer: z.string().optional(),
	cost: z
		.number("Cost can't be anything other than a number")
		.gte(1, "Cost can't be less than or equal to zero"),
	otherCost: z
		.number("Other cost can't be anything other than a number")
		.nonnegative("Other cost can't be negative"),
});

export type CreateCylinderLogData = z.infer<typeof CreateCylinderLogSchema>;

const ManageCylindersPage = () => {
	const [isPageLoading, setIsPageLoading] = useState(true);
	const [buildings, setBuildings] = useState([]);
	const [cylinderLogs, setCylinderLogs] = useState([]);
	const [isFormLoading, setIsFormLoading] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(0);
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [deletingId, setDeletingId] = useState<string | null>(null);
	const navigate = useNavigate();

	const fetchCylinderLogs = async () => {
		const response = await fetchCylinderLogsApi(currentPage, 10, false);
		if (response.success) {
			setCylinderLogs(response.data.cylinderLogs);
			setTotalPages(response.data.totalPages);
		} else {
			toast("Failed to fetch cylinder logs", {
				description:
					response.error || "Some error is preventing cylinder logs from being fetched",
				action: {
					label: "Okay",
					onClick: () => {},
				},
			});
		}
	};

	useEffect(() => {
		adminAuthVerify(setIsPageLoading, navigate);
		const fetchBuildings = async () => {
			const response = await fetchBuildingsApi();
			if (response.success) {
				setBuildings(response.data);
			} else {
				toast("Failed to fetch buildings", {
					description:
						response.error || "Some error is preventing buildings from being fetched",
					action: {
						label: "Okay",
						onClick: () => {},
					},
				});
			}
		};

		fetchBuildings();
		fetchCylinderLogs();
	}, [navigate]);

	const createCylinderLogForm = useForm<CreateCylinderLogData>({
		resolver: zodResolver(CreateCylinderLogSchema),
		mode: "onSubmit",
		defaultValues: {
			buildingId: "",
		},
	});

	const editCylinderLogForm = useForm<CreateCylinderLogData>({
		resolver: zodResolver(CreateCylinderLogSchema),
		mode: "onSubmit",
		defaultValues: {
			buildingId: "",
		},
	});

	const handleCreateCylinderLog = async (formData: CreateCylinderLogData) => {
		setIsFormLoading(true);
		const response = await createCylinderLogApi(formData);
		if (response.success) {
			fetchCylinderLogs();
			toast("Cylinder log has been created", {
				description: "Check the table for more options",
				action: {
					label: "Okay",
					onClick: () => {},
				},
			});
			createCylinderLogForm.reset();
		} else {
			createCylinderLogForm.setError("root", {
				message: response.error || "Failed to create cylinder log",
			});
		}
		setIsFormLoading(false);
	};

	const handleEditCylinderLog = async (id: string, formData: CreateCylinderLogData) => {
		setIsFormLoading(true);
		const response = await updateCylinderLogApi(id, formData);
		if (response.success) {
			fetchCylinderLogs();
			toast("Cylinder log has been updated", {
				description: "Check the table for more options",
				action: {
					label: "Okay",
					onClick: () => {},
				},
			});
			setIsEditDialogOpen(false);
			editCylinderLogForm.reset();
		} else {
			editCylinderLogForm.setError("root", {
				message: response.error || "Failed to update cylinder log",
			});
		}
		setIsFormLoading(false);
	};

	const handleDeleteCylinderLog = async (id: string) => {
		const response = await deleteCylinderLogApi(id);
		if (response.success) {
			fetchCylinderLogs();
			toast("Cylinder log has been deleted", {
				description: "Check the table for more options",
				action: {
					label: "Cancel",
					onClick: () => {},
				},
			});
			setIsDeleteDialogOpen(false);
		} else {
			toast("Failed to delete cylinder log", {
				description:
					response.error || "Some error is preventing cylinder log from being deleted",
				action: {
					label: "Okay",
					onClick: () => {},
				},
			});
		}
	};

	const convertISODateIntoDDMMYYYYFormat = (isoDate: string) => {
		const date = new Date(isoDate);
		const day = String(date.getDate()).padStart(2, "0");
		const month = String(date.getMonth() + 1).padStart(2, "0");
		const year = date.getFullYear();

		return `${day}/${month}/${year}`;
	};

	return (
		<>
			<main className="flex flex-col min-h-screen gap-6">
				<HeaderAdmin />
				<Card className="flex grow container mx-auto">
					<CardHeader>
						<CardTitle className="text-2xl">Create Cylinder Purchase Log</CardTitle>
						<CardDescription>
							Please make sure all information is correct before creating
						</CardDescription>
						<CardAction>Card Action</CardAction>
					</CardHeader>
					<CardContent className="flex flex-col gap-6">
						<form
							className="flex flex-col gap-6 max-w-md"
							onSubmit={createCylinderLogForm.handleSubmit(handleCreateCylinderLog)}
							action=""
							method=""
						>
							<div className="flex flex-col gap-2">
								<Label htmlFor="building">Building</Label>
								<Select
									value={createCylinderLogForm.watch("buildingId")}
									onValueChange={(value) =>
										createCylinderLogForm.setValue("buildingId", value)
									}
									defaultValue=""
								>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Select building" />
									</SelectTrigger>
									<SelectContent>
										<SelectGroup>
											<SelectLabel>Buildings</SelectLabel>
											{buildings.map((building: any, index) => (
												<SelectItem key={index} value={building._id}>
													{building.buildingNumber}
												</SelectItem>
											))}
										</SelectGroup>
									</SelectContent>
								</Select>
								{createCylinderLogForm.formState.errors.buildingId && (
									<span className="text-xs text-red-500 font-semibold">
										{createCylinderLogForm.formState.errors.buildingId.message}
									</span>
								)}
							</div>
							<div className="flex flex-col gap-2">
								<Label htmlFor="date">Date</Label>
								<Input type="date" {...createCylinderLogForm.register("date")} />
								{createCylinderLogForm.formState.errors.date && (
									<span className="text-xs text-red-500 font-semibold">
										{createCylinderLogForm.formState.errors.date.message}
									</span>
								)}
							</div>
							<div className="flex flex-col gap-2">
								<Label htmlFor="cylindersPurchased">Cylinders Purchased</Label>
								<Input
									type="number"
									{...createCylinderLogForm.register("cylindersPurchased", {
										valueAsNumber: true,
									})}
								/>
								{createCylinderLogForm.formState.errors.cylindersPurchased && (
									<span className="text-xs text-red-500 font-semibold">
										{
											createCylinderLogForm.formState.errors
												.cylindersPurchased.message
										}
									</span>
								)}
							</div>
							<div className="flex flex-col gap-2">
								<Label htmlFor="dealer">Dealer (Optional)</Label>
								<Input type="text" {...createCylinderLogForm.register("dealer")} />
								{createCylinderLogForm.formState.errors.dealer && (
									<span className="text-xs text-red-500 font-semibold">
										{createCylinderLogForm.formState.errors.dealer.message}
									</span>
								)}
							</div>
							<div className="flex flex-col gap-2">
								<Label htmlFor="cost">Cost</Label>
								<Input
									type="number"
									{...createCylinderLogForm.register("cost", {
										valueAsNumber: true,
									})}
								/>
								{createCylinderLogForm.formState.errors.cost && (
									<span className="text-xs text-red-500 font-semibold">
										{createCylinderLogForm.formState.errors.cost.message}
									</span>
								)}
							</div>
							<div className="flex flex-col gap-2">
								<Label htmlFor="otherCost">Other Cost</Label>
								<Input
									type="number"
									{...createCylinderLogForm.register("otherCost", {
										valueAsNumber: true,
									})}
								/>
								{createCylinderLogForm.formState.errors.otherCost && (
									<span className="text-xs text-red-500 font-semibold">
										{createCylinderLogForm.formState.errors.otherCost.message}
									</span>
								)}
							</div>
							<Button type="submit" disabled={isFormLoading}>
								{isFormLoading ? "Loading..." : "Create"}
							</Button>
							{createCylinderLogForm.formState.errors.root && (
								<span className="text-red-500">
									{createCylinderLogForm.formState.errors.root.message}
								</span>
							)}
						</form>
						<Card className="">
							<CardHeader>
								<CardTitle className="">Cylinder Logs</CardTitle>
								<CardDescription>Card description</CardDescription>
								<CardAction>
									<Button onClick={fetchCylinderLogs} variant={"outline"}>
										Refresh
									</Button>
								</CardAction>
							</CardHeader>
							<CardContent>
								<Table>
									<TableCaption>
										{cylinderLogs.length > 0
											? `Page ${currentPage} out of ${totalPages}`
											: "No data"}
									</TableCaption>
									<TableHeader>
										<TableRow className="bg-muted">
											<TableHead>Cylinder Log ID</TableHead>
											<TableHead>Building Number</TableHead>
											<TableHead>Date</TableHead>
											<TableHead>Cylinders Purchased</TableHead>
											<TableHead>Dealer</TableHead>
											<TableHead className="text-right">Cost</TableHead>
											<TableHead className="text-right">Other Cost</TableHead>
											<TableHead className="text-center">Action</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{cylinderLogs.map((cylinderLog: any, index) => (
											<TableRow key={index}>
												<TableCell>{cylinderLog._id}</TableCell>
												<TableCell>
													{cylinderLog.building.buildingNumber}
												</TableCell>
												<TableCell>
													{convertISODateIntoDDMMYYYYFormat(
														cylinderLog.date
													)}
												</TableCell>
												<TableCell>
													{cylinderLog.cylindersPurchased}
												</TableCell>
												<TableCell>{cylinderLog.dealer}</TableCell>
												<TableCell className="text-right">
													{cylinderLog.cost}
												</TableCell>
												<TableCell className="text-right">
													{cylinderLog.otherCost}
												</TableCell>
												<TableCell className="flex flex-row justify-center gap-4">
													<button
														onClick={() => {
															setEditingId(cylinderLog._id);
															editCylinderLogForm.reset({
																buildingId:
																	cylinderLog.building._id,
																date: cylinderLog.date.split(
																	"T"
																)[0],
																cylindersPurchased:
																	cylinderLog.cylindersPurchased,
																dealer: cylinderLog.dealer,
																cost: cylinderLog.cost,
																otherCost: cylinderLog.otherCost,
															});
															setIsEditDialogOpen(true);
														}}
														className="hover:underline cursor-pointer"
													>
														Edit
													</button>
													<button
														onClick={() => {
															setDeletingId(cylinderLog._id);
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
									<DialogContent>
										<DialogHeader>
											<DialogTitle className="">
												Edit Cylinder Log
											</DialogTitle>
											<DialogDescription>
												Please make sure all information is correct before
												proceeding
											</DialogDescription>
										</DialogHeader>
										<form
											onSubmit={editCylinderLogForm.handleSubmit(
												(formData) => {
													handleEditCylinderLog(
														editingId as string,
														formData
													);
												}
											)}
											className="flex flex-col gap-6 mt-2"
											action=""
											method=""
										>
											<div className="flex flex-col gap-2">
												<Label htmlFor="building">Building</Label>
												<Select
													value={editCylinderLogForm.watch("buildingId")}
													onValueChange={(value) =>
														editCylinderLogForm.setValue(
															"buildingId",
															value
														)
													}
													defaultValue=""
												>
													<SelectTrigger className="w-full">
														<SelectValue placeholder="Select building" />
													</SelectTrigger>
													<SelectContent>
														<SelectGroup>
															<SelectLabel>Buildings</SelectLabel>
															{buildings.map(
																(building: any, index) => (
																	<SelectItem
																		key={index}
																		value={building._id}
																	>
																		{building.buildingNumber}
																	</SelectItem>
																)
															)}
														</SelectGroup>
													</SelectContent>
												</Select>
												{editCylinderLogForm.formState.errors
													.buildingId && (
													<span className="text-xs text-red-500 font-semibold">
														{
															editCylinderLogForm.formState.errors
																.buildingId.message
														}
													</span>
												)}
											</div>
											<div className="flex flex-col gap-2">
												<Label htmlFor="date">Date</Label>
												<Input
													type="date"
													{...editCylinderLogForm.register("date")}
												/>
												{editCylinderLogForm.formState.errors.date && (
													<span className="text-xs text-red-500 font-semibold">
														{
															editCylinderLogForm.formState.errors
																.date.message
														}
													</span>
												)}
											</div>
											<div className="flex flex-col gap-2">
												<Label htmlFor="cylindersPurchased">
													Cylinders Purchased
												</Label>
												<Input
													type="number"
													{...editCylinderLogForm.register(
														"cylindersPurchased",
														{
															valueAsNumber: true,
														}
													)}
												/>
												{editCylinderLogForm.formState.errors
													.cylindersPurchased && (
													<span className="text-xs text-red-500 font-semibold">
														{
															editCylinderLogForm.formState.errors
																.cylindersPurchased.message
														}
													</span>
												)}
											</div>
											<div className="flex flex-col gap-2">
												<Label htmlFor="dealer">Dealer (Optional)</Label>
												<Input
													type="text"
													{...editCylinderLogForm.register("dealer")}
												/>
												{editCylinderLogForm.formState.errors.dealer && (
													<span className="text-xs text-red-500 font-semibold">
														{
															editCylinderLogForm.formState.errors
																.dealer.message
														}
													</span>
												)}
											</div>
											<div className="flex flex-col gap-2">
												<Label htmlFor="cost">Cost</Label>
												<Input
													type="number"
													{...editCylinderLogForm.register("cost", {
														valueAsNumber: true,
													})}
												/>
												{editCylinderLogForm.formState.errors.cost && (
													<span className="text-xs text-red-500 font-semibold">
														{
															editCylinderLogForm.formState.errors
																.cost.message
														}
													</span>
												)}
											</div>
											<div className="flex flex-col gap-2">
												<Label htmlFor="otherCost">Other Cost</Label>
												<Input
													type="number"
													{...editCylinderLogForm.register("otherCost", {
														valueAsNumber: true,
													})}
												/>
												{editCylinderLogForm.formState.errors.otherCost && (
													<span className="text-xs text-red-500 font-semibold">
														{
															editCylinderLogForm.formState.errors
																.otherCost.message
														}
													</span>
												)}
											</div>
											<Button type="submit" disabled={isFormLoading}>
												{isFormLoading ? "Loading..." : "Save Changes"}
											</Button>
										</form>
										{editCylinderLogForm.formState.errors.root && (
											<DialogFooter>
												<span className="text-red-500 text-center w-full">
													{
														editCylinderLogForm.formState.errors.root
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
												Are you sure you want to delete this cylinder log?
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
													handleDeleteCylinderLog(deletingId as string)
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
											fetchCylinderLogs();
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
											fetchCylinderLogs();
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

export default ManageCylindersPage;
