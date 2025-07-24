import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

import LoadingSpinner from "../../components/common/LoadingSpinner";

import { IoSettingsOutline } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";

const NotificationPage = () => {
	const queryClient = useQueryClient();
	const { data: notifications, isLoading } = useQuery({
		queryKey: ["notifications"],
		queryFn: async () => {
			try {
				const res = await fetch("/api/notifications");
				const data = await res.json();
				if (!res.ok) throw new Error(data.error || "Something went wrong");
				return data;
			} catch (error) {
				throw new Error(error);
			}
		},
	});
	const { mutate: deleteNotifications } = useMutation({
		mutationFn: async () => {
			try {
				const res = await fetch("/api/notifications", {
					method: "DELETE",
				});
				const data = await res.json();
				if (!res.ok) throw new Error(data.error || "Something went wrong");
				return data;
			} catch (error) {
				throw new Error(error);
			}
		},
		onSuccess: () => {
			toast.success("Notifications deleted successfully");
			queryClient.invalidateQueries({ queryKey: ["notifications"] });
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

	return (
		<div className='min-h-screen'>
			{/* Header */}
			<div className='sticky top-0 z-10 bg-black/80 backdrop-blur-xl border-b border-white/12 p-6'>
				<div className='flex justify-between items-center'>
					<h1 className='text-2xl font-bold text-premium'>Notifications</h1>
					<div className='dropdown dropdown-end'>
						<button 
							tabIndex={0} 
							className='p-2 rounded-xl hover:bg-white/10 transition-colors duration-200'
						>
							<IoSettingsOutline className='w-5 h-5 text-white/80' />
						</button>
						<ul
							tabIndex={0}
							className='dropdown-content z-[1] menu p-2 shadow-xl bg-black/95 backdrop-blur-xl border border-white/15 rounded-xl w-56 mt-2'
						>
							<li>
								<button 
									onClick={deleteNotifications}
									className='text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200'
								>
									Delete all notifications
								</button>
							</li>
						</ul>
					</div>
				</div>
			</div>

			{/* Content */}
			<div className='p-6'>
				{isLoading && (
					<div className='flex justify-center items-center py-20'>
						<div className="flex flex-col items-center space-y-4">
							<LoadingSpinner size='lg' />
							<div className="text-white/60 text-sm font-medium">Loading notifications...</div>
						</div>
					</div>
				)}

				{!isLoading && notifications?.length === 0 && (
					<div className="text-center py-20">
						<div className="text-6xl mb-4">🔔</div>
						<h3 className='text-xl font-semibold text-white mb-2'>No notifications yet</h3>
						<p className='text-white/60'>When someone interacts with your posts, you'll see it here</p>
					</div>
				)}

				{!isLoading && notifications?.length > 0 && (
					<div className='space-y-2'>
						{notifications.map((notification) => (
							<Link
								key={notification._id}
								to={`/profile/${notification.from.username}`}
								className='block'
							>
								<div className='flex items-start space-x-4 p-4 rounded-xl hover:bg-white/5 transition-all duration-200 group'>
									<div className='flex-shrink-0 relative'>
										{notification.type === "follow" && (
											<div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
												<FaUser className='w-5 h-5 text-blue-400' />
											</div>
										)}
										{notification.type === "like" && (
											<div className="w-10 h-10 bg-pink-500/20 rounded-xl flex items-center justify-center">
												<FaHeart className='w-5 h-5 text-pink-400' />
											</div>
										)}
									</div>

									<div className='flex-1 min-w-0'>
										<div className='flex items-center space-x-3 mb-2'>
											<img 
												src={notification.from.profileImg || "/avatar-placeholder.png"} 
												className='w-10 h-10 rounded-xl object-cover ring-2 ring-white/10 group-hover:ring-white/20 transition-all duration-200'
												alt={notification.from.username}
											/>
											<div className='flex-1'>
												<div className='flex items-center space-x-2'>
													<span className='font-semibold text-white group-hover:text-blue-400 transition-colors duration-200'>
														{notification.from.fullName}
													</span>
													<span className='text-white/60 text-sm'>
														@{notification.from.username}
													</span>
												</div>
												<p className='text-white/80 text-sm mt-1'>
													{notification.type === "follow" ? "started following you" : "liked your post"}
												</p>
											</div>
										</div>
									</div>

									<div className='text-white/40 text-xs flex-shrink-0'>
										{new Date(notification.createdAt).toLocaleDateString()}
									</div>
								</div>
							</Link>
						))}
					</div>
				)}
			</div>
		</div>
	);
};
export default NotificationPage;