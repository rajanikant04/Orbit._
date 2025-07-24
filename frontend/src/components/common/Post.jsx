import { FaRegComment } from "react-icons/fa";
import { BiRepost } from "react-icons/bi";
import { FaRegHeart } from "react-icons/fa";
import { FaRegBookmark } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast"
import LoadingSpinner from "./LoadingSpinner";
import { formatPostDate } from "../../utils/date";

const Post = ({ post }) => {
	const [comment, setComment] = useState("");
	const {data:authUser} = useQuery({queryKey:["authUser"]});

	const queryClient = useQueryClient();

	const postOwner = post.user;
	const isLiked = post.likes.includes(authUser._id);
	const isMyPost = authUser._id === post.user._id;
	const formattedDate = formatPostDate(post.createdAt);


	const { mutate: deletePost, isPending: isDeleting } = useMutation({
		mutationFn:async ()=>{
			try {
				const res = await fetch(`/api/posts/${post._id}`, {
					method: "DELETE",
				})
				const data = await res.json();
				if(!res.ok) {
					throw new Error(data.error || "Something went wrong");
				}
				return data;
			} catch (error) {
				throw new Error(error)
			}
		},
		onSuccess: () => {
			toast.success("Post deleted successfully");
			// invalidate the query to refetch the data
			queryClient.invalidateQueries({queryKey: ["posts"]});
		}
	})
	

	const { mutate: likePost, isPending: isLiking } = useMutation({
		mutationFn: async () => {
			try {
				const res = await fetch(`/api/posts/like/${post._id}`, {
					method: "POST",
				});
				const data = await res.json();
				if (!res.ok) {
					throw new Error(data.error || "Something went wrong");
				}
				return data;
			} catch (error) {
				throw new Error(error);
			}
		},
		onSuccess: (updatedLikes) => {
			// this is not the best UX, bc it will refetch all posts
			// queryClient.invalidateQueries({ queryKey: ["posts"] });
			// instead, update the cache directly for that post
			queryClient.setQueryData(["posts"], (oldData) => {
				return oldData.map((p) => {
					if (p._id === post._id) {
						return { ...p, likes: updatedLikes };
					}
					return p;
				});
			});
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

	const { mutate: commentPost, isPending: isCommenting } = useMutation({
		mutationFn: async () => {
			try {
				const res = await fetch(`/api/posts/comment/${post._id}`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ text: comment }),
				});
				const data = await res.json();
				if (!res.ok) {
					throw new Error(data.error || "Something went wrong");
				}
				return data;
			} catch (error) {
				throw new Error(error);
			}
		},
		onSuccess: () => {
			toast.success("Comment posted successfully");
			setComment("");
			queryClient.invalidateQueries({ queryKey: ["posts"] });
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

	const handleDeletePost = () => {
		deletePost(post._id);
	};

	const handlePostComment = (e) => {
		e.preventDefault();
		if (isCommenting) return;
		commentPost();
	};

	const handleLikePost = () => {
		if (isLiking) return;
		likePost();
	};

	return (
		<>
			<div className='flex gap-5 items-start p-8 border-b border-slate-700/30 glass hover:shadow-lg transition-all duration-300 group animate-fade-in-up'>
				<div className='avatar flex-shrink-0'>
					<Link to={`/profile/${postOwner?.username}`} className='w-14 h-14 rounded-full overflow-hidden ring-2 ring-slate-600/50 hover:ring-blue-500/50 transition-all duration-300 shadow-lg'>
						<img 
							src={postOwner?.profileImg || "/avatar-placeholder.png"} 
							className="w-full h-full object-cover"
						/>
					</Link>
				</div>
				<div className='flex flex-col flex-1 min-w-0'>
					<div className='flex gap-3 items-center mb-3'>
						<Link to={`/profile/${postOwner?.username}`} className='font-semibold text-white hover:text-blue-300 transition-colors duration-200 truncate'>
							{postOwner?.fullName}
						</Link>
						<span className='text-slate-400 flex gap-2 text-sm items-center'>
							<Link to={`/profile/${postOwner?.username}`} className='hover:text-slate-300 transition-colors duration-200 truncate'>@{postOwner?.username}</Link>
							<span className='text-slate-500'>•</span>
							<span className='whitespace-nowrap'>{formattedDate}</span>
						</span>
						{isMyPost && (
							<div className='flex justify-end flex-1'>
								{!isDeleting && (
									<button
										onClick={handleDeletePost}
										className='p-2 glass rounded-full hover:border-red-500/30 hover:shadow-lg text-slate-400 hover:text-red-400 transition-all duration-300 opacity-0 group-hover:opacity-100'
									>
										<FaTrash className='w-4 h-4' />
									</button>
								)}
								{isDeleting && (
									<div className='p-2'>
										<LoadingSpinner size="sm"/>
									</div>
								)}
							</div>
						)}
					</div>
					<div className='flex flex-col gap-5 overflow-hidden'>
						<span className='text-white leading-relaxed text-base font-medium'>{post?.text}</span>
						{post?.img && (
							<img
								src={post?.img}
								className='max-h-[500px] object-cover rounded-2xl shadow-2xl border border-slate-600/30 hover:shadow-3xl transition-shadow duration-300'
								alt=''
							/>
						)}
					</div>
					<div className='flex justify-between mt-6 pt-4 border-t border-slate-700/30'>
						<div className='flex gap-8 items-center'>
							<div
								className='flex gap-2 items-center cursor-pointer group p-3 glass rounded-full hover:border-blue-500/30 hover:shadow-lg transition-all duration-300'
								onClick={() => document.getElementById("comments_modal" + post?._id).showModal()}
							>
								<FaRegComment className='w-5 h-5 text-slate-400 group-hover:text-blue-400 transition-colors duration-200' />
								<span className='text-sm font-medium text-slate-400 group-hover:text-blue-400 transition-colors duration-200'>
									{post?.comments?.length}
								</span>
							</div>
							{/* Enhanced Modal Component */}
							<dialog id={`comments_modal${post?._id}`} className='modal border-none outline-none'>
								<div className='modal-box glass border border-slate-600/30 rounded-3xl shadow-2xl backdrop-blur-2xl max-w-2xl'>
									<h3 className='font-bold text-2xl mb-8 text-white'>Comments</h3>
									<div className='flex flex-col gap-5 max-h-80 overflow-auto pr-2' style={{scrollbarWidth: 'thin'}}>
										{post?.comments?.length === 0 && (
											<div className='text-center py-12'>
												<p className='text-slate-400 text-lg mb-2'>No comments yet</p>
												<p className='text-slate-500 text-sm'>💭 Be the first one to comment!</p>
											</div>
										)}
										{post?.comments?.map((comment) => (
											<div key={comment._id} className='flex gap-4 items-start p-4 glass rounded-2xl hover:shadow-lg transition-all duration-300'>
												<div className='avatar flex-shrink-0'>
													<div className='w-10 h-10 rounded-full ring-2 ring-slate-600/50 overflow-hidden'>
														<img
															src={comment?.user?.profileImg || "/avatar-placeholder.png"}
															className="w-full h-full object-cover"
														/>
													</div>
												</div>
												<div className='flex flex-col flex-1 min-w-0'>
													<div className='flex items-center gap-2 mb-2'>
														<span className='font-semibold text-white truncate'>{comment?.user?.fullName}</span>
														<span className='text-slate-400 text-sm truncate'>
															@{comment?.user?.username}
														</span>
													</div>
													<div className='text-slate-200 leading-relaxed'>{comment?.text}</div>
												</div>
											</div>
										))}
									</div>
									<form
										className='flex gap-4 items-end mt-8 pt-6 border-t border-slate-600/30'
										onSubmit={handlePostComment}
									>
										<textarea
											className='flex-1 p-4 glass rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 resize-none transition-all duration-300 font-medium'
											placeholder='Add a comment...'
											value={comment}
											onChange={(e) => setComment(e.target.value)}
											rows={3}
										/>
										<button 
											className='btn-premium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed'
											disabled={!comment.trim() || isCommenting}
										>
											{isCommenting ? <LoadingSpinner size='sm' /> : "Post"}
										</button>
									</form>
								</div>
								<form method='dialog' className='modal-backdrop'>
									<button className='outline-none'>close</button>
								</form>
							</dialog>
							
							<div className='flex gap-2 items-center group cursor-pointer p-3 glass rounded-full hover:border-green-500/30 hover:shadow-lg transition-all duration-300'>
								<BiRepost className='w-5 h-5 text-slate-400 group-hover:text-green-400 transition-colors duration-200' />
								<span className='text-sm font-medium text-slate-400 group-hover:text-green-400 transition-colors duration-200'>0</span>
							</div>
							
							<div className='flex gap-2 items-center group cursor-pointer p-3 glass rounded-full hover:border-pink-500/30 hover:shadow-lg transition-all duration-300' onClick={handleLikePost}>
								{isLiking && <LoadingSpinner size='sm' />}
								{!isLiked && !isLiking && (
									<FaRegHeart className='w-5 h-5 cursor-pointer text-slate-400 group-hover:text-pink-400 transition-all duration-200 group-hover:scale-110' />
								)}
								{isLiked && !isLiking && (
									<FaRegHeart className='w-5 h-5 cursor-pointer text-pink-500 animate-pulse' />
								)}

								<span
									className={`text-sm font-medium transition-colors duration-200 ${
										isLiked ? "text-pink-500" : "text-slate-400 group-hover:text-pink-400"
									}`}
								>
									{post?.likes?.length}
								</span>
							</div>
						</div>
						<div className='flex gap-2 items-center'>
							<button className='p-3 glass rounded-full hover:border-slate-500/30 hover:shadow-lg text-slate-400 hover:text-slate-300 transition-all duration-300 group'>
								<FaRegBookmark className='w-4 h-4 group-hover:scale-110 transition-transform duration-200' />
							</button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};
// always pass variables with ? to check
export default Post;