import { Link } from "react-router-dom";
import { useState } from "react";

import { MdOutlineMail } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { MdPassword } from "react-icons/md";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { useMutation, useQueryClient  } from "@tanstack/react-query";
import { toast } from "react-hot-toast"

const SignUpPage = () => {
	const [formData, setFormData] = useState({
		email: "",
		username: "",
		fullName: "",
		password: "",
	});

	const queryClient = useQueryClient();

	const { mutate, isError, isPending, error } = useMutation ({
		mutationFn: async ({ email, username, fullName, password }) => {
			try {
				const res = await fetch("/api/auth/signup", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ email, username, fullName, password }),
				});
				const data = await res.json();
				if (!res.ok) throw new Error(data.error || "Failed to create account");
				console.log(data);
				return data;
			} catch (error) {
				console.error(error);
				throw error
			}
		},
		onSuccess: () => {
			toast.success("Account created successfully");
			queryClient.invalidateQueries({ queryKey: ["authUser"] });
		},
	});

	const handleSubmit = (e) => {
		e.preventDefault();
		mutate(formData);
	};

	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	// const isError = false;

	return (
		<div className='min-h-screen flex'>
			{/* Left side - Branding */}
			<div className='hidden lg:flex lg:flex-1 bg-gradient-to-br from-black via-gray-900 to-black items-center justify-center relative overflow-hidden'>
				<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent"></div>
				<div className="relative z-10 text-center px-12">
					<img src="/orbit.png" className='w-32 h-32 mx-auto mb-8 drop-shadow-2xl' alt="Orbit" />
					<h1 className="text-4xl font-bold text-premium mb-4">Join Orbit Today</h1>
					<p className="text-xl text-white/60 max-w-md">Be part of the conversation and connect with people around the world.</p>
				</div>
			</div>

			{/* Right side - Sign Up Form */}
			<div className='flex-1 flex items-center justify-center px-6 lg:px-12 bg-black relative'>
				<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-900/10 via-transparent to-transparent"></div>
				
				<div className='w-full max-w-md relative z-10'>
					{/* Mobile logo */}
					<div className="lg:hidden text-center mb-12">
						<img src="/orbit.png" className='w-20 h-20 mx-auto mb-4' alt="Orbit" />
						<h1 className="text-2xl font-bold text-premium">Create account</h1>
					</div>

					{/* Desktop heading */}
					<div className="hidden lg:block mb-12">
						<h1 className='text-4xl font-bold text-premium mb-2'>Create your account</h1>
						<p className="text-white/60">Join thousands of users sharing their thoughts</p>
					</div>

					<form className='space-y-6' onSubmit={handleSubmit}>
						<div className="space-y-4">
							<div>
								<label className="block text-sm font-medium text-white/80 mb-2">Email address</label>
								<div className="relative">
									<MdOutlineMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40 w-5 h-5" />
									<input
										type='email'
										className='w-full pl-12 pr-4 py-4 bg-white/5 border border-white/15 rounded-xl text-white placeholder-white/40 focus:border-blue-500/50 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200'
										placeholder='Enter your email'
										name='email'
										onChange={handleInputChange}
										value={formData.email}
									/>
								</div>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-medium text-white/80 mb-2">Username</label>
									<div className="relative">
										<FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40 w-4 h-4" />
										<input
											type='text'
											className='w-full pl-12 pr-4 py-4 bg-white/5 border border-white/15 rounded-xl text-white placeholder-white/40 focus:border-blue-500/50 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200'
											placeholder='Username'
											name='username'
											onChange={handleInputChange}
											value={formData.username}
										/>
									</div>
								</div>

								<div>
									<label className="block text-sm font-medium text-white/80 mb-2">Full name</label>
									<div className="relative">
										<MdDriveFileRenameOutline className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40 w-5 h-5" />
										<input
											type='text'
											className='w-full pl-12 pr-4 py-4 bg-white/5 border border-white/15 rounded-xl text-white placeholder-white/40 focus:border-blue-500/50 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200'
											placeholder='Full name'
											name='fullName'
											onChange={handleInputChange}
											value={formData.fullName}
										/>
									</div>
								</div>
							</div>

							<div>
								<label className="block text-sm font-medium text-white/80 mb-2">Password</label>
								<div className="relative">
									<MdPassword className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40 w-5 h-5" />
									<input
										type='password'
										className='w-full pl-12 pr-4 py-4 bg-white/5 border border-white/15 rounded-xl text-white placeholder-white/40 focus:border-blue-500/50 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200'
										placeholder='Create a password'
										name='password'
										onChange={handleInputChange}
										value={formData.password}
									/>
								</div>
							</div>
						</div>

						{isError && (
							<div className='p-4 bg-red-500/10 border border-red-500/20 rounded-xl'>
								<p className='text-red-400 text-sm font-medium'>{error.message}</p>
							</div>
						)}

						<button 
							type="submit"
							disabled={isPending}
							className='w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none'
						>
							{isPending ? (
								<div className="flex items-center justify-center space-x-2">
									<div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
									<span>Creating account...</span>
								</div>
							) : (
								'Create account'
							)}
						</button>

						<div className='text-center pt-6 border-t border-white/15'>
							<p className='text-white/60 mb-4'>Already have an account?</p>
							<Link to='/login'>
								<button 
									type="button"
									className='w-full py-4 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-xl border border-white/15 hover:border-white/20 transition-all duration-200 transform hover:scale-[1.02]'
								>
									Sign in instead
								</button>
							</Link>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};
export default SignUpPage;