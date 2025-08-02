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
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import api from "@/lib/axios";
import { toast } from "sonner";
import HeaderAdmin from "@/components/header-admin";
import Footer from "@/components/footer";

const CylinderLogSchema = z.object({
	building: z.string().nonempty("Please select a building"),
	date: z.string().nonempty("Please enter a date"),
	cylindersPurchased: z
		.number("Cylinders purchased can't be anything other than a number")
		.gte(1, "Cylinders purchased can't be less than or equal to zero"),
	dealer: z.string(),
	cost: z.number("Cost can't be anything other than a number").gte(1, "Cost can't be less than or equal to zero"),
	otherCost: z.number("Other cost can't be anything other than a number").nonnegative("Other cost can't be negative"),
});

type CylinderLogDataType = z.infer<typeof CylinderLogSchema>;

const ManageCylindersPage = () => {
	const [buildings, setBuildings] = useState([]);
	const [cylinderLogs, setCylinderLogs] = useState([]);
	const [isFormLoading, setIsFormLoading] = useState(false);
	const [isTableLoading, setIsTableLoading] = useState(false);
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

	const fetchBuildings = () => {
		api.get("/buildings")
			.then((response) => {
				setBuildings(response.data);
			})
			.catch((error) => {
				console.error("Error fetching buildings:", error);
			});
	};

	const fetchCylinderLogs = () => {
		setIsTableLoading(true);
		api.get("/cylinder-logs")
			.then((response) => {
				setCylinderLogs(response.data);
			})
			.catch((error) => {
				console.error("Error fetching cylinder logs:", error);
			});
		setIsTableLoading(false);
	};

	useEffect(() => {
		adminAuthCheck();
		fetchBuildings();
		fetchCylinderLogs();
	}, []);

	const cylinderLogForm = useForm<CylinderLogDataType>({
		resolver: zodResolver(CylinderLogSchema),
		mode: "onSubmit",
		defaultValues: {
			building: "",
		},
	});

	const handleCreateCylinderLog = (data: CylinderLogDataType) => {
		setIsFormLoading(true);
		api.post("/cylinder-logs", data)
			.then((response) => {
				fetchCylinderLogs();
				toast("Cylinder log has been created", {
					description: "Check the table for more options",
					action: {
						label: "Cancel",
						onClick: () => {},
					},
				});
			})
			.catch((error) => {
				console.error("Error creating cylinder log:", error);
			});
		setIsFormLoading(false);
	};

	const handleDeleteCylinderLog = (id: string) => {
		api.delete(`/cylinder-logs/${id}`)
			.then((response) => {
				fetchCylinderLogs();
				toast("Cylinder log has been deleted", {
					description: "Check the table for more options",
					action: {
						label: "Cancel",
						onClick: () => {},
					},
				});
			})
			.catch((error) => {
				console.error("Error deleting cylinder log:", error);
			});
	};

	return (
		<>
			<main className="flex flex-col min-h-screen gap-6">
				<HeaderAdmin />
				<Card className="flex grow container mx-auto">
					<CardHeader>
						<CardTitle className="text-2xl">Create Cylinder Purchase Log</CardTitle>
						<CardDescription>Please make sure all information is correct before creating</CardDescription>
						<CardAction>Card Action</CardAction>
					</CardHeader>
					<CardContent className="flex flex-col gap-6">
						<form
							className="flex flex-col gap-6 max-w-md"
							onSubmit={cylinderLogForm.handleSubmit(handleCreateCylinderLog)}
							action=""
							method=""
						>
							<div className="flex flex-col gap-2">
								<Label htmlFor="building">Building</Label>
								<Select
									value={cylinderLogForm.watch("building")}
									onValueChange={(value) => cylinderLogForm.setValue("building", value)}
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
								{cylinderLogForm.formState.errors.building && (
									<span className="text-xs text-red-500">
										{cylinderLogForm.formState.errors.building.message}
									</span>
								)}
							</div>
							<div className="flex flex-col gap-2">
								<Label htmlFor="date">Date</Label>
								<Input type="date" {...cylinderLogForm.register("date")} />
								{cylinderLogForm.formState.errors.date && (
									<span className="text-xs text-red-500">
										{cylinderLogForm.formState.errors.date.message}
									</span>
								)}
							</div>
							<div className="flex flex-col gap-2">
								<Label htmlFor="cylindersPurchased">Cylinders Purchased</Label>
								<Input
									type="number"
									{...cylinderLogForm.register("cylindersPurchased", { valueAsNumber: true })}
								/>
								{cylinderLogForm.formState.errors.cylindersPurchased && (
									<span className="text-xs text-red-500">
										{cylinderLogForm.formState.errors.cylindersPurchased.message}
									</span>
								)}
							</div>
							<div className="flex flex-col gap-2">
								<Label htmlFor="dealer">Dealer (Optional)</Label>
								<Input type="text" {...cylinderLogForm.register("dealer")} />
								{cylinderLogForm.formState.errors.dealer && (
									<span className="text-xs text-red-500">
										{cylinderLogForm.formState.errors.dealer.message}
									</span>
								)}
							</div>
							<div className="flex flex-col gap-2">
								<Label htmlFor="cost">Cost</Label>
								<Input type="number" {...cylinderLogForm.register("cost", { valueAsNumber: true })} />
								{cylinderLogForm.formState.errors.cost && (
									<span className="text-xs text-red-500">
										{cylinderLogForm.formState.errors.cost.message}
									</span>
								)}
							</div>
							<div className="flex flex-col gap-2">
								<Label htmlFor="otherCost">Other Cost</Label>
								<Input
									type="number"
									{...cylinderLogForm.register("otherCost", { valueAsNumber: true })}
								/>
								{cylinderLogForm.formState.errors.otherCost && (
									<span className="text-xs text-red-500">
										{cylinderLogForm.formState.errors.otherCost.message}
									</span>
								)}
							</div>
							<Button type="submit" disabled={isFormLoading}>
								{isFormLoading ? "Loading..." : "Create"}
							</Button>
						</form>
						<Card className="">
							<CardHeader>
								<CardTitle className="text-xl">Cylinder Logs</CardTitle>
								<CardDescription>Card description</CardDescription>
								<CardAction>Card Action</CardAction>
							</CardHeader>
							<CardContent>
								<Table>
									<TableCaption>{cylinderLogs.length > 0 ? "Caption" : "No data"}</TableCaption>
									<TableHeader>
										<TableRow className="bg-gray-50">
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
												<TableCell>{cylinderLog.building.buildingNumber}</TableCell>
												<TableCell>{`${String(new Date(cylinderLog.date).getDate()).padStart(
													2,
													"0"
												)}/${String(new Date(cylinderLog.date).getMonth() + 1).padStart(
													2,
													"0"
												)}/${new Date(cylinderLog.date).getFullYear()}`}</TableCell>
												<TableCell>{cylinderLog.cylindersPurchased}</TableCell>
												<TableCell>{cylinderLog.dealer}</TableCell>
												<TableCell className="text-right">{cylinderLog.cost}</TableCell>
												<TableCell className="text-right">{cylinderLog.otherCost}</TableCell>
												<TableCell className="text-center">
													<button
														onClick={() => {
															handleDeleteCylinderLog(cylinderLog._id);
														}}
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

export default ManageCylindersPage;
