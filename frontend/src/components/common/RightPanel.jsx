import { Link } from "react-router-dom";
import {useQuery} from "@tanstack/react-query";

import useFollow from "../../hooks/useFollow";

import RightPanelSkeleton from "../skeletons/RightPanelSkeleton";

const RightPanel = () => {
	const {data:suggestedUsers, isLoading } = useQuery({
		queryKey: ["suggestedUsers"],
		queryFn: async() => {
			try {
				const res = await fetch("/api/users/suggested");
				const data = await res.json();
				if(!res.ok) {
					throw new Error(data.error || "Something went wrong");
				}
				return data;
			} catch (error) {
				throw new Error(error.message);
			}
		}
	});


	const {follow,isPending} = useFollow();

	if(suggestedUsers?.length === 0) {
		return <div className="md:w-64 w-0"></div>
	}

	return (
		<div className='hidden lg:block my-6 mx-4'>
			<div className='glass p-8 rounded-3xl sticky top-6 shadow-2xl border border-slate-700/30'>
				<div className='flex items-center gap-3 mb-8'>
					<div className='w-1.5 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full shadow-lg'></div>
					<p className='font-bold text-xl text-white tracking-tight'>Who to follow</p>
				</div>
				<div className='flex flex-col gap-5'>
					{/* item */}
					{isLoading && (
						<>
							<RightPanelSkeleton />
							<RightPanelSkeleton />
							<RightPanelSkeleton />
							<RightPanelSkeleton />
						</>
					)}
					{!isLoading &&
						suggestedUsers?.map((user) => (
							<Link
								to={`/profile/${user.username}`}
								className='flex items-center justify-between gap-4 p-4 glass rounded-2xl hover:shadow-lg transition-all duration-300 group border border-transparent hover:border-blue-500/30 relative overflow-hidden'
								key={user._id}
							>
								<div className='flex gap-4 items-center relative z-10'>
									<div className='avatar'>
										<div className='w-12 h-12 rounded-full ring-2 ring-slate-600/50 group-hover:ring-blue-500/50 transition-all duration-300 overflow-hidden'>
											<img 
												src={user.profileImg || "/avatar-placeholder.png"} 
												className="w-full h-full object-cover"
											/>
										</div>
									</div>
									<div className='flex flex-col flex-1 min-w-0'>
										<span className='font-semibold text-white tracking-tight truncate group-hover:text-blue-300 transition-colors duration-200 text-sm'>
											{user.fullName}
										</span>
										<span className='text-xs text-slate-400 truncate'>@{user.username}</span>
									</div>
								</div>
								<div className='relative z-10'>
									<button
										className='btn-premium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium px-4 py-2 rounded-xl text-sm shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed'
										onClick={(e) => {
											e.preventDefault();
											follow(user._id);
										}}
									>
										{isPending ? (
											<div className='flex items-center gap-2'>
												<div className='w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin'></div>
											</div>
										) : "Follow"}
									</button>
								</div>
								<div className='absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
							</Link>
						))}
				</div>
			</div>
		</div>
	);
};
export default RightPanel;