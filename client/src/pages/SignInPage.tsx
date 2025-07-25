import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2Icon } from "lucide-react";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const FlatSignInSchema = z.object({
	flatNumber: z.string().nonempty("Flat number can't be empty"),
	phone: z.string().nonempty("Phone number can't be empty"),
});

type FlatSignInDataType = z.infer<typeof FlatSignInSchema>;

const AdminSignInSchema = z.object({
	email: z.string().nonempty("Email can't be empty").email("Invalid email address"),
	password: z.string().nonempty("Password can't be empty"),
});

type AdminSignInDataType = z.infer<typeof AdminSignInSchema>;

const SignInPage: React.FC = () => {
	const navigate = useNavigate();
	useEffect(() => {
		axios
			.get("http://localhost:8000/api/auth/admin-auth-check", { withCredentials: true })
			.then((response) => {
				console.log("Admin authenticated successfully", response.data);
				navigate("/admin-dashboard");
			})
			.catch((error) => {
				// console.error("Unauthorized or error authenticating admin", error);
			});
		axios
			.get("http://localhost:8000/api/auth/flat-auth-check", { withCredentials: true })
			.then((response) => {
				console.log("Flat resident authenticated successfully", response.data);
				navigate("/flat-dashboard");
			})
			.catch((error) => {
				// console.error("Unauthorized or error authenticating flat resident", error);
			});
	}, [navigate]);

	const [isFlatSignIn, setIsFlatSignIn] = useState(true);
	const [isFormLoading, setIsFormLoading] = useState(false);

	const flatForm = useForm<FlatSignInDataType>({
		resolver: zodResolver(FlatSignInSchema),
		mode: "onSubmit",
	});

	const adminForm = useForm<AdminSignInDataType>({
		resolver: zodResolver(AdminSignInSchema),
		mode: "onSubmit",
	});

	const handleFlatSignIn = (data: FlatSignInDataType) => {
		setIsFormLoading((prev) => (prev = true));
		axios
			.post("http://localhost:8000/api/auth/flat-sign-in", data, {
				withCredentials: true,
			})
			.then((response) => {
				console.log("Flat resident signed in successfully:", response.data);
				navigate("/flat-dashboard");
			})
			.catch((error) => {
				console.error("Error signing in flat:", error);
				flatForm.setError("root", {
					message: error.response?.data?.message || "Failed to sign in",
				});
			});
		setIsFormLoading((prev) => (prev = false));
	};

	const handleAdminSignIn = (data: AdminSignInDataType) => {
		setIsFormLoading((prev) => (prev = true));
		axios
			.post("http://localhost:8000/api/auth/admin-sign-in", data, {
				withCredentials: true,
			})
			.then((response) => {
				console.log("Admin signed in successfully:", response.data);
				navigate("/admin-dashboard");
			})
			.catch((error) => {
				console.error("Error signing in admin:", error);
				adminForm.setError("root", {
					message: error.response?.data?.message || "Failed to sign in",
				});
			});
		setIsFormLoading((prev) => (prev = false));
	};

	return (
		<>
			<div className="flex flex-col grow justify-center items-center">
				<Card className="w-full max-w-md">
					<CardHeader>
						<CardTitle className="">
							{isFlatSignIn ? "Sign In - Flat Resident" : "Sign In - Admin"}
						</CardTitle>
						<CardDescription className="">Enter your credentials to sign in</CardDescription>
						<CardAction>
							<Button
								variant="outline"
								onClick={() => {
									flatForm.reset();
									adminForm.reset();
									setIsFlatSignIn((prev) => (prev = !prev));
								}}
							>
								{isFlatSignIn ? "Sign in as Admin" : "Sign in as Flat Resident"}
							</Button>
						</CardAction>
					</CardHeader>
					<CardContent>
						{isFlatSignIn ? (
							<form
								className="flex flex-col gap-6"
								onSubmit={flatForm.handleSubmit(handleFlatSignIn)}
								action=""
								method=""
							>
								<div className="flex flex-col gap-2">
									<Label htmlFor="flatNumber">Flat Number</Label>
									<Input type="text" {...flatForm.register("flatNumber")} />
									{flatForm.formState.errors.flatNumber && (
										<span className="text-xs text-red-500">
											{flatForm.formState.errors.flatNumber.message}
										</span>
									)}
								</div>
								<div className="flex flex-col gap-2">
									<Label htmlFor="phone">Phone Number</Label>
									<Input type="text" {...flatForm.register("phone")} />
									{flatForm.formState.errors.phone && (
										<span className="text-xs text-red-500">
											{flatForm.formState.errors.phone.message}
										</span>
									)}
								</div>
								<Button type="submit" disabled={isFormLoading}>
									{isFormLoading ? <Loader2Icon /> : "Sign In"}
								</Button>
							</form>
						) : (
							<form
								className="flex flex-col gap-6"
								onSubmit={adminForm.handleSubmit(handleAdminSignIn)}
								action=""
								method=""
							>
								<div className="flex flex-col gap-2">
									<Label htmlFor="email">Email</Label>
									<Input type="email" {...adminForm.register("email")} />
									{adminForm.formState.errors.email && (
										<span className="text-xs text-red-500">
											{adminForm.formState.errors.email.message}
										</span>
									)}
								</div>
								<div className="flex flex-col gap-2">
									<Label htmlFor="password">Phone Number</Label>
									<Input type="password" {...adminForm.register("password")} />
									{adminForm.formState.errors.password && (
										<span className="text-xs text-red-500">
											{adminForm.formState.errors.password.message}
										</span>
									)}
								</div>
								<Button type="submit" disabled={isFormLoading}>
									{isFormLoading ? <Loader2Icon /> : "Sign In"}
								</Button>
							</form>
						)}
					</CardContent>
					{adminForm.formState.errors.root && (
						<CardFooter>
							<span className="text-red-500 text-sm text-center w-full">
								{adminForm.formState.errors.root.message}
							</span>
						</CardFooter>
					)}
					{flatForm.formState.errors.root && (
						<CardFooter>
							<span className="text-red-500 text-sm text-center w-full">
								{flatForm.formState.errors.root.message}
							</span>
						</CardFooter>
					)}
				</Card>
			</div>
		</>
	);
};

export default SignInPage;
