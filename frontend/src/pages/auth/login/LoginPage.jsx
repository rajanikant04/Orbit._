import { useState } from "react";
import { Link } from "react-router-dom";

import { MdOutlineMail } from "react-icons/md";
import { MdPassword } from "react-icons/md";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import ThemeToggle from "../../../components/ui/ThemeToggle";

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
		<div className='min-h-screen flex'>
			{/* Theme Toggle - Fixed position */}
			<div className="fixed top-4 right-4 z-50">
				<ThemeToggle />
			</div>
			
			{/* Left side - Branding */}
			<div className='hidden lg:flex lg:flex-1 items-center justify-center relative overflow-hidden transition-colors duration-300' 
				 style={{ background: 'var(--bg-secondary)' }}>
				<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>
				<div className="relative z-10 text-center px-12">
					<img src="/orbit.png" className='w-32 h-32 mx-auto mb-8 drop-shadow-2xl' alt="Orbit" />
					<h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Welcome to Orbit</h1>
					<p className="text-xl max-w-md" style={{ color: 'var(--text-secondary)' }}>Connect with friends and discover what's happening in your world.</p>
				</div>
			</div>

			{/* Right side - Login Form */}
			<div className='flex-1 flex items-center justify-center px-6 lg:px-12 relative transition-colors duration-300' 
				 style={{ background: 'var(--bg-primary)' }}>
				<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent"></div>
				
				<div className='w-full max-w-md relative z-10'>
					{/* Mobile logo */}
					<div className="lg:hidden text-center mb-12">
						<img src="/orbit.png" className='w-20 h-20 mx-auto mb-4' alt="Orbit" />
						<h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Welcome back</h1>
					</div>

					{/* Desktop heading */}
					<div className="hidden lg:block mb-12">
						<h1 className='text-4xl font-bold mb-2' style={{ color: 'var(--text-primary)' }}>Sign in to Orbit</h1>
						<p style={{ color: 'var(--text-secondary)' }}>Enter your credentials to access your account</p>
					</div>

					<form className='space-y-6' onSubmit={handleSubmit}>
						<div className="space-y-4">
							<div>
								<label className="block text-sm font-medium text-white/80 mb-2">Username</label>
								<div className="relative">
									<MdOutlineMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40 w-5 h-5" />
									<input
										type='text'
										className='w-full pl-12 pr-4 py-4 bg-white/5 border border-white/15 rounded-xl text-white placeholder-white/40 focus:border-blue-500/50 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200'
										placeholder='Enter your username'
										name='username'
										onChange={handleInputChange}
										value={formData.username}
									/>
								</div>
							</div>

							<div>
								<label className="block text-sm font-medium text-white/80 mb-2">Password</label>
								<div className="relative">
									<MdPassword className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40 w-5 h-5" />
									<input
										type='password'
										className='w-full pl-12 pr-4 py-4 bg-white/5 border border-white/15 rounded-xl text-white placeholder-white/40 focus:border-blue-500/50 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200'
										placeholder='Enter your password'
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
							className='w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none'
						>
							{isPending ? (
								<div className="flex items-center justify-center space-x-2">
									<div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
									<span>Signing in...</span>
								</div>
							) : (
								'Sign in'
							)}
						</button>

						<div className='text-center pt-6 border-t border-white/15'>
							<p className='text-white/60 mb-4'>Don't have an account?</p>
							<Link to='/signup'>
								<button 
									type="button"
									className='w-full py-4 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-xl border border-white/15 hover:border-white/20 transition-all duration-200 transform hover:scale-[1.02]'
								>
									Create account
								</button>
							</Link>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};
export default LoginPage;