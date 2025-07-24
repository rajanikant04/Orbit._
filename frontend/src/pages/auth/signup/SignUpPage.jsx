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
		<div className='min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900'>
			<div className='max-w-screen-xl mx-auto flex h-screen px-4'>
				<div className='flex-1 hidden lg:flex items-center justify-center relative'>
					<div className='absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-3xl m-8'></div>
					<div className='relative z-10 text-center'>
						<img src="orbit.png" className='lg:w-80 mx-auto mb-8 drop-shadow-2xl hover:scale-105 transition-transform duration-300' />
						<h2 className='text-3xl font-bold text-white mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent'>
							Join the Community
						</h2>
						<p className='text-slate-300 text-lg max-w-md mx-auto'>
							Share your thoughts, connect with others, and be part of something bigger
						</p>
					</div>
				</div>
				<div className='flex-1 flex flex-col justify-center items-center px-4'>
					<div className='w-full max-w-md'>
						<form className='bg-slate-800/50 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-slate-700/50' onSubmit={handleSubmit}>
							<div className='text-center mb-8'>
								<img src="orbit.png" className='w-16 h-16 mx-auto mb-4 lg:hidden' />
								<h1 className='text-4xl font-extrabold text-white mb-2'>Join today.</h1>
								<p className='text-slate-400'>Create your account</p>
							</div>
							
							<div className='space-y-4'>
								<div className='relative'>
									<label className='flex items-center gap-3 bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-500/20 transition-all duration-200'>
										<MdOutlineMail className='text-slate-400 text-xl' />
										<input
											type='email'
											className='flex-1 bg-transparent text-white placeholder-slate-400 focus:outline-none'
											placeholder='Email'
											name='email'
											onChange={handleInputChange}
											value={formData.email}
										/>
									</label>
								</div>
								
								<div className='relative'>
									<label className='flex items-center gap-3 bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-500/20 transition-all duration-200'>
										<FaUser className='text-slate-400 text-lg' />
										<input
											type='text'
											className='flex-1 bg-transparent text-white placeholder-slate-400 focus:outline-none'
											placeholder='Username'
											name='username'
											onChange={handleInputChange}
											value={formData.username}
										/>
									</label>
								</div>

								<div className='relative'>
									<label className='flex items-center gap-3 bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-500/20 transition-all duration-200'>
										<MdDriveFileRenameOutline className='text-slate-400 text-xl' />
										<input
											type='text'
											className='flex-1 bg-transparent text-white placeholder-slate-400 focus:outline-none'
											placeholder='Full Name'
											name='fullName'
											onChange={handleInputChange}
											value={formData.fullName}
										/>
									</label>
								</div>

								<div className='relative'>
									<label className='flex items-center gap-3 bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-500/20 transition-all duration-200'>
										<MdPassword className='text-slate-400 text-xl' />
										<input
											type='password'
											className='flex-1 bg-transparent text-white placeholder-slate-400 focus:outline-none'
											placeholder='Password'
											name='password'
											onChange={handleInputChange}
											value={formData.password}
										/>
									</label>
								</div>
								
								<button className='w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed mt-6'>
									{isPending ? (
										<div className='flex items-center justify-center gap-2'>
											<div className='w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin'></div>
											Loading...
										</div>
									) : "Create Account"}
								</button>
								
								{isError && (
									<div className='bg-red-500/10 border border-red-500/50 rounded-lg p-3 mt-4'>
										<p className='text-red-400 text-sm text-center'>{error.message}</p>
									</div>
								)}
							</div>
						</form>
						
						<div className='text-center mt-6'>
							<p className='text-slate-300 mb-4'>Already have an account?</p>
							<Link to='/login'>
								<button className='w-full bg-transparent border-2 border-slate-600 hover:border-purple-500 text-slate-300 hover:text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 hover:bg-slate-700/30'>
									Sign In
								</button>
							</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
export default SignUpPage;