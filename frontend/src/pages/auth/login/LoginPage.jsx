import { useState } from "react";
import { Link } from "react-router-dom";

import { MdOutlineMail } from "react-icons/md";
import { MdPassword } from "react-icons/md";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const LoginPage = () => {
	const [formData, setFormData] = useState({
		username: "",
		password: "",
	});

	const queryClient = useQueryClient();

	const {mutate:loginMutation,isPending,isError,error} = useMutation({
		mutationFn: async ({username,password}) => {
			try {
				const res = await fetch("/api/auth/login" , {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({username,password}),
				});

				const data = await res.json();

				if(!res.ok) {
					throw new Error(data.error || "Something went wrong")
				}
				return data;
			} catch (error) {
				throw new Error(error)
			}
		},
		onSuccess: () =>{
			// toast.success("Login Successfully")
			// refetch the authUser
			queryClient.invalidateQueries({queryKey:["authUser"]});
		}
	})

	const handleSubmit = (e) => {
		e.preventDefault();
		loginMutation(formData);
	};

	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};


	return (
		<div className='min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden'>
			{/* Premium background elements */}
			<div className='absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]'></div>
			<div className='absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl'></div>
			<div className='absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple-500/10 to-pink-500/10 rounded-full blur-3xl'></div>
			
			<div className='max-w-screen-xl mx-auto flex h-screen relative z-10'>
				<div className='flex-1 hidden lg:flex items-center justify-center relative p-8'>
					<div className='absolute inset-0 glass rounded-3xl m-4 shadow-2xl'></div>
					<div className='relative z-10 text-center animate-fade-in-up'>
						<div className='relative inline-block mb-8'>
							<img src="orbit.png" className='lg:w-72 mx-auto drop-shadow-2xl hover:scale-105 transition-all duration-500 filter saturate-110' />
							<div className='absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-2xl'></div>
						</div>
						<h2 className='text-4xl font-bold text-white mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent leading-tight'>
							Welcome to Orbit
						</h2>
						<p className='text-slate-300 text-lg max-w-md mx-auto leading-relaxed font-medium'>
							Connect with friends and discover what&apos;s happening around the world
						</p>
						<div className='mt-8 flex justify-center space-x-2'>
							<div className='w-2 h-2 bg-blue-500 rounded-full animate-pulse'></div>
							<div className='w-2 h-2 bg-purple-500 rounded-full animate-pulse' style={{animationDelay: '0.2s'}}></div>
							<div className='w-2 h-2 bg-pink-500 rounded-full animate-pulse' style={{animationDelay: '0.4s'}}></div>
						</div>
					</div>
				</div>
				
				<div className='flex-1 flex flex-col justify-center items-center px-8'>
					<div className='w-full max-w-md'>
						<form className='glass rounded-3xl p-10 shadow-2xl animate-fade-in-up' onSubmit={handleSubmit}>
							<div className='text-center mb-10'>
								<img src="orbit.png" className='w-16 h-16 mx-auto mb-6 lg:hidden drop-shadow-lg' />
								<h1 className='text-4xl font-bold text-white mb-3 tracking-tight'>Let&apos;s go.</h1>
								<p className='text-slate-400 text-lg font-medium'>Sign in to your account</p>
							</div>
							
							<div className='space-y-6'>
								<div className='relative group'>
									<label className='flex items-center gap-4 glass rounded-2xl px-5 py-4 focus-within:border-blue-500/50 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all duration-300 group-hover:shadow-md'>
										<MdOutlineMail className='text-slate-400 text-xl group-focus-within:text-blue-400 transition-colors duration-200' />
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
									<label className='flex items-center gap-4 glass rounded-2xl px-5 py-4 focus-within:border-blue-500/50 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all duration-300 group-hover:shadow-md'>
										<MdPassword className='text-slate-400 text-xl group-focus-within:text-blue-400 transition-colors duration-200' />
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
								
								<button className='w-full btn-premium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed text-lg'>
									{isPending ? (
										<div className='flex items-center justify-center gap-3'>
											<div className='w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin'></div>
											<span className='font-medium'>Signing in...</span>
										</div>
									) : "Sign In"}
								</button>
								
								{isError && (
									<div className='bg-red-500/10 border border-red-500/30 rounded-2xl p-4 animate-fade-in-up'>
										<p className='text-red-400 text-center font-medium'>{error.message}</p>
									</div>
								)}
							</div>
						</form>
						
						<div className='text-center mt-8 animate-fade-in-up' style={{animationDelay: '0.2s'}}>
							<p className='text-slate-300 mb-6 text-lg font-medium'>Don&apos;t have an account?</p>
							<Link to='/signup'>
								<button className='w-full btn-premium bg-transparent border-2 border-slate-600/50 hover:border-blue-500/50 text-slate-300 hover:text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 hover:bg-slate-700/20 hover:shadow-lg text-lg'>
									Create Account
								</button>
							</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
export default LoginPage;