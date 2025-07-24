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
		<div className='min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900'>
			<div className='max-w-screen-xl mx-auto flex h-screen'>
				<div className='flex-1 hidden lg:flex items-center justify-center relative'>
					<div className='absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-3xl m-8'></div>
					<div className='relative z-10 text-center'>
						<img src="orbit.png" className='lg:w-80 mx-auto mb-8 drop-shadow-2xl hover:scale-105 transition-transform duration-300' />
						<h2 className='text-3xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent'>
							Welcome to Orbit
						</h2>
						<p className='text-slate-300 text-lg max-w-md mx-auto'>
							Connect with friends and discover what's happening around the world
						</p>
					</div>
				</div>
				<div className='flex-1 flex flex-col justify-center items-center px-8'>
					<div className='w-full max-w-md'>
						<form className='bg-slate-800/50 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-slate-700/50' onSubmit={handleSubmit}>
							<div className='text-center mb-8'>
								<img src="orbit.png" className='w-16 h-16 mx-auto mb-4 lg:hidden' />
								<h1 className='text-4xl font-extrabold text-white mb-2'>{"Let's"} go.</h1>
								<p className='text-slate-400'>Sign in to your account</p>
							</div>
							
							<div className='space-y-6'>
								<div className='relative'>
									<label className='flex items-center gap-3 bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all duration-200'>
										<MdOutlineMail className='text-slate-400 text-xl' />
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
									<label className='flex items-center gap-3 bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all duration-200'>
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
								
								<button className='w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed'>
									{isPending ? (
										<div className='flex items-center justify-center gap-2'>
											<div className='w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin'></div>
											Loading...
										</div>
									) : "Login"}
								</button>
								
								{isError && (
									<div className='bg-red-500/10 border border-red-500/50 rounded-lg p-3'>
										<p className='text-red-400 text-sm text-center'>{error.message}</p>
									</div>
								)}
							</div>
						</form>
						
						<div className='text-center mt-6'>
							<p className='text-slate-300 mb-4'>{"Don't"} have an account?</p>
							<Link to='/signup'>
								<button className='w-full bg-transparent border-2 border-slate-600 hover:border-blue-500 text-slate-300 hover:text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 hover:bg-slate-700/30'>
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