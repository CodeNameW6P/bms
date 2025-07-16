import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const FlatSignInSchema = z.object({
	flatNumber: z.string().min(1, "Flat number is required"),
	phone: z.string().min(1, "Phone number is required"),
});

const AdminSignInSchema = z.object({
	email: z.email("Invalid email address").min(1, "Email is required"),
	password: z.string().min(1, "Password is required"),
});

const SignInPage: React.FC = () => {
	const navigate = useNavigate();
	const [isFlatSignIn, setIsFlatSignIn] = useState(true);

	const flatForm = useForm({
		resolver: zodResolver(FlatSignInSchema),
		defaultValues: {
			flatNumber: "",
			phone: "",
		},
	});

	const adminForm = useForm({
		resolver: zodResolver(AdminSignInSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const handleFlatSignIn = (data: z.infer<typeof FlatSignInSchema>) => {
		console.log("Flat Sign In Data:", data);
		// Handle flat sign-in logic here, e.g., API call to verify flat resident
	};

	const handleAdminSignIn = (data: z.infer<typeof AdminSignInSchema>) => {
		console.log("Admin Sign In Data:", data);
		axios
			.post("http://localhost:8000/api/auth/adminsignin", data, {
				withCredentials: true,
			})
			.then((response) => {
				console.log("Admin signed in successfully:", response.data);
				navigate("/admin-dashboard");
			})
			.catch((error) => {
				console.error("Error signing in admin:", error.response?.data || error.message);
				adminForm.setError("root", {
					message: error.response?.data?.message || "Failed to sign in",
				});
			});
	};

	return (
		<>
			<div className="flex items-center justify-center min-h-screen">
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
									setIsFlatSignIn(!isFlatSignIn);
								}}
							>
								{isFlatSignIn ? "Sign in as Admin" : "Sign in as Flat Resident"}
							</Button>
						</CardAction>
					</CardHeader>
					<CardContent>
						{isFlatSignIn ? (
							<Form {...flatForm}>
								<form onSubmit={flatForm.handleSubmit(handleFlatSignIn)} className="space-y-4">
									<FormField
										control={flatForm.control}
										name="flatNumber"
										render={() => (
											<FormItem>
												<FormLabel>Flat Number</FormLabel>
												<FormControl>
													<Input {...flatForm.register("flatNumber")} type="text" />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={flatForm.control}
										name="phone"
										render={() => (
											<FormItem>
												<FormLabel>Phone Number</FormLabel>
												<FormControl>
													<Input {...flatForm.register("phone")} type="text" />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<Button type="submit" className="w-full">
										Sign In
									</Button>
								</form>
							</Form>
						) : (
							<Form {...adminForm}>
								<form onSubmit={adminForm.handleSubmit(handleAdminSignIn)} className="space-y-4">
									<FormField
										control={adminForm.control}
										name="email"
										render={() => (
											<FormItem>
												<FormLabel>Email</FormLabel>
												<FormControl>
													<Input {...adminForm.register("email")} type="email" />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={adminForm.control}
										name="password"
										render={() => (
											<FormItem>
												<FormLabel>Password</FormLabel>
												<FormControl>
													<Input {...adminForm.register("password")} type="password" />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<Button type="submit" className="w-full">
										Sign In
									</Button>
								</form>
							</Form>
						)}
					</CardContent>
					<CardFooter></CardFooter>
				</Card>
			</div>
		</>
	);
};

export default SignInPage;
