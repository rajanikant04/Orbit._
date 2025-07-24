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
		<div className='min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden'>
			{/* Premium background elements */}
			<div className='absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.1),transparent_50%)]'></div>
			<div className='absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-full blur-3xl'></div>
			<div className='absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tr from-blue-500/10 to-purple-500/10 rounded-full blur-3xl'></div>
			
			<div className='max-w-screen-xl mx-auto flex h-screen px-4 relative z-10'>
				<div className='flex-1 hidden lg:flex items-center justify-center relative p-8'>
					<div className='absolute inset-0 glass rounded-3xl m-4 shadow-2xl'></div>
					<div className='relative z-10 text-center animate-fade-in-up'>
						<div className='relative inline-block mb-8'>
							<img src="orbit.png" className='lg:w-72 mx-auto drop-shadow-2xl hover:scale-105 transition-all duration-500 filter saturate-110' />
							<div className='absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full blur-2xl'></div>
						</div>
						<h2 className='text-4xl font-bold text-white mb-6 bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent leading-tight'>
							Join the Community
						</h2>
						<p className='text-slate-300 text-lg max-w-md mx-auto leading-relaxed font-medium'>
							Share your thoughts, connect with others, and be part of something bigger
						</p>
						<div className='mt-8 flex justify-center space-x-2'>
							<div className='w-2 h-2 bg-purple-500 rounded-full animate-pulse'></div>
							<div className='w-2 h-2 bg-blue-500 rounded-full animate-pulse' style={{animationDelay: '0.2s'}}></div>
							<div className='w-2 h-2 bg-indigo-500 rounded-full animate-pulse' style={{animationDelay: '0.4s'}}></div>
						</div>
					</div>
				</div>
				
				<div className='flex-1 flex flex-col justify-center items-center px-4 overflow-y-auto'>
					<div className='w-full max-w-md my-8'>
						<form className='glass rounded-3xl p-10 shadow-2xl animate-fade-in-up' onSubmit={handleSubmit}>
							<div className='text-center mb-10'>
								<img src="orbit.png" className='w-16 h-16 mx-auto mb-6 lg:hidden drop-shadow-lg' />
								<h1 className='text-4xl font-bold text-white mb-3 tracking-tight'>Join today.</h1>
								<p className='text-slate-400 text-lg font-medium'>Create your account</p>
							</div>
							
							<div className='space-y-5'>
								<div className='relative group'>
									<label className='flex items-center gap-4 glass rounded-2xl px-5 py-4 focus-within:border-purple-500/50 focus-within:ring-2 focus-within:ring-purple-500/20 transition-all duration-300 group-hover:shadow-md'>
										<MdOutlineMail className='text-slate-400 text-xl group-focus-within:text-purple-400 transition-colors duration-200' />
										<input
											type='email'
											className='flex-1 bg-transparent text-white placeholder-slate-400 focus:outline-none text-lg font-medium'
											placeholder='Email'
											name='email'
											onChange={handleInputChange}
											value={formData.email}
										/>
									</label>
								</div>
								
								<div className='relative group'>
									<label className='flex items-center gap-4 glass rounded-2xl px-5 py-4 focus-within:border-purple-500/50 focus-within:ring-2 focus-within:ring-purple-500/20 transition-all duration-300 group-hover:shadow-md'>
										<FaUser className='text-slate-400 text-lg group-focus-within:text-purple-400 transition-colors duration-200' />
										<input
											type='text'
											className='flex-1 bg-transparent text-white placeholder-slate-400 focus:outline-none text-lg font-medium'
											placeholder='Username'
											name='username'
											onChange={handleInputChange}
											value={formData.username}
										/>
									</label>
								</div>

								<div className='relative group'>
									<label className='flex items-center gap-4 glass rounded-2xl px-5 py-4 focus-within:border-purple-500/50 focus-within:ring-2 focus-within:ring-purple-500/20 transition-all duration-300 group-hover:shadow-md'>
										<MdDriveFileRenameOutline className='text-slate-400 text-xl group-focus-within:text-purple-400 transition-colors duration-200' />
										<input
											type='text'
											className='flex-1 bg-transparent text-white placeholder-slate-400 focus:outline-none text-lg font-medium'
											placeholder='Full Name'
											name='fullName'
											onChange={handleInputChange}
											value={formData.fullName}
										/>
									</label>
								</div>

								<div className='relative group'>
									<label className='flex items-center gap-4 glass rounded-2xl px-5 py-4 focus-within:border-purple-500/50 focus-within:ring-2 focus-within:ring-purple-500/20 transition-all duration-300 group-hover:shadow-md'>
										<MdPassword className='text-slate-400 text-xl group-focus-within:text-purple-400 transition-colors duration-200' />
										<input
											type='password'
											className='flex-1 bg-transparent text-white placeholder-slate-400 focus:outline-none text-lg font-medium'
											placeholder='Password'
											name='password'
											onChange={handleInputChange}
											value={formData.password}
										/>
									</label>
								</div>
								
								<button className='w-full btn-premium bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed text-lg mt-8'>
									{isPending ? (
										<div className='flex items-center justify-center gap-3'>
											<div className='w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin'></div>
											<span className='font-medium'>Creating account...</span>
										</div>
									) : "Create Account"}
								</button>
								
								{isError && (
									<div className='bg-red-500/10 border border-red-500/30 rounded-2xl p-4 animate-fade-in-up'>
										<p className='text-red-400 text-center font-medium'>{error.message}</p>
									</div>
								)}
							</div>
						</form>
						
						<div className='text-center mt-8 animate-fade-in-up' style={{animationDelay: '0.2s'}}>
							<p className='text-slate-300 mb-6 text-lg font-medium'>Already have an account?</p>
							<Link to='/login'>
								<button className='w-full btn-premium bg-transparent border-2 border-slate-600/50 hover:border-purple-500/50 text-slate-300 hover:text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 hover:bg-slate-700/20 hover:shadow-lg text-lg'>
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