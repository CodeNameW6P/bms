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

const CylinderLogSchema = z.object({
	buildingNumber: z.string().nonempty("Building number can't be empty"),
	date: z.string().nonempty("Please enter a date"),
	cylindersPurchased: z
		.number("Cylinders purchased can't be anything other than a number")
		.gte(1, "Cylinders purchased can't be less than or equal to zero"),
	dealer: z.string(),
	cost: z.number("Cost can't be anything other than a number").gte(1, "Cost can't be less than or equal to zero"),
	otherCost: z.number("Other cost can't be anything other than a number").nonnegative("Other cost can't be negative"),
});

type CylinderLogDataType = z.infer<typeof CylinderLogSchema>;

const ManageCylinderPage = () => {
	const [cylinderLogs, setCylinderLogs] = useState([]);
	const navigate = useNavigate();

	const [isFormLoading, setIsFormLoading] = useState(false);

	const cylinderLogForm = useForm<CylinderLogDataType>({
		resolver: zodResolver(CylinderLogSchema),
		mode: "onSubmit",
		defaultValues: {},
	});

	const handleCreateCylinderLog = () => {};

	return (
		<>
			<Card className="w-full">
				<CardHeader>
					<CardTitle className="text-2xl">Create Cylinder Purchase Log</CardTitle>
					<CardDescription>Please make sure all information is correct before creating</CardDescription>
					<CardAction></CardAction>
				</CardHeader>
				<CardContent className="flex flex-col">
					<form
						className="flex flex-col gap-6 w-md"
						onSubmit={cylinderLogForm.handleSubmit(handleCreateCylinderLog)}
						action=""
						method=""
					>
						<div className="flex flex-col gap-2">
							<Label htmlFor="buildingNumber">Building Number</Label>
							<Select
								value={cylinderLogForm.watch("buildingNumber")}
								onValueChange={(value) => cylinderLogForm.setValue("buildingNumber", value)}
								defaultValue=""
							>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Select building" />
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
										<SelectLabel>Buildings</SelectLabel>
										<SelectItem value={"4"}>4</SelectItem>
									</SelectGroup>
								</SelectContent>
							</Select>
							{cylinderLogForm.formState.errors.buildingNumber && (
								<span className="text-xs text-red-500">
									{cylinderLogForm.formState.errors.buildingNumber.message}
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
							<Input type="number" {...cylinderLogForm.register("otherCost", { valueAsNumber: true })} />
							{cylinderLogForm.formState.errors.otherCost && (
								<span className="text-xs text-red-500">
									{cylinderLogForm.formState.errors.otherCost.message}
								</span>
							)}
						</div>
						<Button type="submit" disabled={isFormLoading}>
							{isFormLoading ? <Loader2Icon /> : "Create"}
						</Button>
					</form>
				</CardContent>
				<CardFooter>
					<p>Card Footer</p>
				</CardFooter>
			</Card>
		</>
	);
};

export default ManageCylinderPage;
