import { Link } from "react-router-dom";
import {useQuery} from "@tanstack/react-query";

import useFollow from "../../hooks/useFollow";

import LoadingSpinner from "./LoadingSpinner"
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
		return <div className="w-80 flex-shrink-0 hidden xl:block"></div>
	}

	return (
		<div className='w-80 flex-shrink-0 hidden xl:block'>
			<div className='fixed w-80 h-screen p-6 overflow-y-auto custom-scrollbar'>
				<div className='glass-elevated rounded-2xl p-6 sticky top-6'>
					<h2 className='text-xl font-bold text-premium mb-6'>Who to follow</h2>
					
					<div className='space-y-4'>
						{isLoading && (
							<>
								{[...Array(4)].map((_, i) => (
									<div key={i} className="animate-pulse">
										<div className="flex items-center space-x-3">
											<div className="w-12 h-12 bg-white/10 rounded-xl"></div>
											<div className="flex-1 space-y-2">
												<div className="h-4 bg-white/10 rounded w-3/4"></div>
												<div className="h-3 bg-white/5 rounded w-1/2"></div>
											</div>
											<div className="w-16 h-8 bg-white/10 rounded-lg"></div>
										</div>
									</div>
								))}
							</>
						)}
						
						{!isLoading &&
							suggestedUsers?.map((user) => (
								<div
									key={user._id}
									className='flex items-center space-x-3 p-3 rounded-xl hover:bg-white/5 transition-all duration-200 group'
								>
									<Link to={`/profile/${user.username}`} className="flex-shrink-0">
										<img 
											src={user.profileImg || "/avatar-placeholder.png"} 
											className='w-12 h-12 rounded-xl object-cover ring-2 ring-white/10 group-hover:ring-white/20 transition-all duration-200'
											alt={user.fullName}
										/>
									</Link>
									
									<Link 
										to={`/profile/${user.username}`}
										className='flex-1 min-w-0'
									>
										<div className='space-y-1'>
											<p className='font-semibold text-white text-sm truncate group-hover:text-blue-400 transition-colors duration-200'>
												{user.fullName}
											</p>
											<p className='text-white/60 text-xs truncate'>
												@{user.username}
											</p>
										</div>
									</Link>
									
									<button
										className='px-4 py-2 bg-white text-black text-sm font-semibold rounded-xl hover:bg-white/90 transition-all duration-200 transform hover:scale-[1.02] flex-shrink-0'
										onClick={(e) => {
											e.preventDefault();
											follow(user._id);
										}}
										disabled={isPending}
									>
										{isPending ? (
											<div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
										) : (
											"Follow"
										)}
									</button>
								</div>
							))}
					</div>
					
					{!isLoading && suggestedUsers?.length === 0 && (
						<div className="text-center py-12">
							<div className="text-4xl mb-4">👥</div>
							<p className='text-white/60 text-sm'>No suggestions right now</p>
							<p className='text-white/40 text-xs mt-1'>Check back later for new people to follow</p>
						</div>
					)}
				</div>

				{/* Trending Topics */}
				<div className='glass-elevated rounded-2xl p-6 mt-6'>
					<h2 className='text-xl font-bold text-premium mb-6'>What's happening</h2>
					
					<div className='space-y-4'>
						{[
							{ category: "Technology", title: "AI Revolution", posts: "42.1K posts" },
							{ category: "Sports", title: "World Cup 2025", posts: "28.3K posts" },
							{ category: "Music", title: "New Album Drops", posts: "15.7K posts" }
						].map((trend, index) => (
							<div 
								key={index}
								className='p-3 rounded-xl hover:bg-white/5 cursor-pointer transition-all duration-200 group'
							>
								<p className='text-white/60 text-xs font-medium mb-1'>{trend.category}</p>
								<p className='text-white font-semibold text-sm group-hover:text-blue-400 transition-colors duration-200'>
									{trend.title}
								</p>
								<p className='text-white/40 text-xs mt-1'>{trend.posts}</p>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};
export default RightPanel;