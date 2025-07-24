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
		<div className='hidden lg:block my-4 mx-2'>
			<div className='bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-lg p-6 rounded-2xl sticky top-2 border border-slate-700/50 shadow-xl'>
				<div className='flex items-center gap-2 mb-6'>
					<div className='w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full'></div>
					<p className='font-bold text-lg text-white'>Who to follow</p>
				</div>
				<div className='flex flex-col gap-4'>
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
								className='flex items-center justify-between gap-4 p-3 rounded-xl hover:bg-slate-700/30 transition-all duration-200 group border border-transparent hover:border-slate-600/50'
								key={user._id}
							>
								<div className='flex gap-3 items-center'>
									<div className='avatar'>
										<div className='w-10 h-10 rounded-full ring-2 ring-slate-600 group-hover:ring-blue-500/50 transition-all duration-200'>
											<img src={user.profileImg || "/avatar-placeholder.png"} />
										</div>
									</div>
									<div className='flex flex-col'>
										<span className='font-semibold text-white tracking-tight truncate w-28 group-hover:text-blue-300 transition-colors duration-200'>
											{user.fullName}
										</span>
										<span className='text-sm text-slate-400'>@{user.username}</span>
									</div>
								</div>
								<div>
									<button
										className='bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium px-4 py-2 rounded-lg text-sm transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50'
										onClick={(e) => {
											e.preventDefault();
											follow(user._id);
										}}
									>
										{isPending ? (
											<div className='flex items-center gap-1'>
												<div className='w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin'></div>
											</div>
										) : "Follow"}
									</button>
								</div>
							</Link>
						))}
				</div>
			</div>
		</div>
	);
};
export default RightPanel;