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
		<>
			<div className='flex-[4_4_0] border-r border-slate-700/30 min-h-screen glass'>
				<div className='flex justify-between items-center p-8 border-b border-slate-700/30 glass sticky top-0 z-10 backdrop-blur-xl'>
					<h1 className='font-bold text-2xl text-white tracking-tight'>Notifications</h1>
					<div className='dropdown dropdown-end'>
						<div tabIndex={0} role='button' className='p-3 glass rounded-full hover:shadow-lg hover:border-slate-500/30 transition-all duration-300 group'>
							<IoSettingsOutline className='w-5 h-5 text-slate-400 group-hover:text-white transition-colors duration-200' />
						</div>
						<ul
							tabIndex={0}
							className='dropdown-content z-[1] menu p-4 shadow-2xl glass rounded-2xl w-56 border border-slate-600/30 mt-2'
						>
							<li>
								<a 
									onClick={deleteNotifications}
									className='text-slate-300 hover:text-white p-3 rounded-xl hover:bg-red-500/20 hover:text-red-400 transition-all duration-200 font-medium'
								>
									Delete all notifications
								</a>
							</li>
						</ul>
					</div>
				</div>
				{isLoading && (
					<div className='flex justify-center h-full items-center py-20'>
						<LoadingSpinner size='lg' />
					</div>
				)}
				{notifications?.length === 0 && (
					<div className='text-center py-20'>
						<div className='glass rounded-3xl p-10 mx-8 max-w-md mx-auto'>
							<div className='text-6xl mb-4'>🔔</div>
							<p className='text-xl font-bold text-white mb-2'>No notifications yet</p>
							<p className='text-slate-400'>You&apos;ll see notifications here when someone interacts with your posts</p>
						</div>
					</div>
				)}
				{notifications?.map((notification) => (
					<div className='border-b border-slate-700/30 last:border-b-0 animate-fade-in-up' key={notification._id}>
						<div className='flex gap-5 p-8 hover:bg-slate-800/20 transition-all duration-300 group'>
							<div className='flex-shrink-0'>
								{notification.type === "follow" && (
									<div className='p-3 glass rounded-full'>
										<FaUser className='w-6 h-6 text-blue-400' />
									</div>
								)}
								{notification.type === "like" && (
									<div className='p-3 glass rounded-full'>
										<FaHeart className='w-6 h-6 text-pink-500 animate-pulse' />
									</div>
								)}
							</div>
							<Link to={`/profile/${notification.from.username}`} className='flex gap-4 items-start flex-1 min-w-0 group-hover:scale-[1.01] transition-transform duration-300'>
								<div className='avatar flex-shrink-0'>
									<div className='w-12 h-12 rounded-full ring-2 ring-slate-600/50 group-hover:ring-blue-500/50 transition-all duration-300 overflow-hidden'>
										<img 
											src={notification.from.profileImg || "/avatar-placeholder.png"} 
											className="w-full h-full object-cover"
										/>
									</div>
								</div>
								<div className='flex flex-col flex-1 min-w-0'>
									<div className='flex gap-2 items-center mb-1'>
										<span className='font-bold text-white group-hover:text-blue-300 transition-colors duration-200 truncate'>
											@{notification.from.username}
										</span>
										<span className='text-slate-400 font-medium'>
											{notification.type === "follow" ? "started following you" : "liked your post"}
										</span>
									</div>
									<p className='text-slate-500 text-sm'>
										{notification.type === "follow" ? "Check out their profile!" : "Your post caught their attention"}
									</p>
								</div>
							</Link>
						</div>
					</div>
				))}
			</div>
		</>
	);
};
export default NotificationPage;