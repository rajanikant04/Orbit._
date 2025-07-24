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
			<div className='flex gap-4 items-start p-6 border-b border-slate-700/50 bg-slate-900/20 hover:bg-slate-800/30 transition-colors duration-200'>
				<div className='avatar flex-shrink-0'>
					<Link to={`/profile/${postOwner?.username}`} className='w-12 h-12 rounded-full overflow-hidden ring-2 ring-slate-700 hover:ring-blue-500/50 transition-all duration-200'>
						<img src={postOwner?.profileImg || "/avatar-placeholder.png"} />
					</Link>
				</div>
				<div className='flex flex-col flex-1'>
					<div className='flex gap-2 items-center mb-2'>
						<Link to={`/profile/${postOwner?.username}`} className='font-bold text-white hover:text-blue-300 transition-colors duration-200'>
							{postOwner?.fullName}
						</Link>
						<span className='text-slate-400 flex gap-1 text-sm'>
							<Link to={`/profile/${postOwner?.username}`} className='hover:text-slate-300 transition-colors duration-200'>@{postOwner?.username}</Link>
							<span>·</span>
							<span>{formattedDate}</span>
						</span>
						{isMyPost && (
							<span className='flex justify-end flex-1'>
								{!isDeleting && (
									<button
										onClick={handleDeletePost}
										className='p-2 rounded-full hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-all duration-200'
									>
										<FaTrash className='w-4 h-4' />
									</button>
								)}
								{isDeleting && (
									<div className='p-2'>
										<LoadingSpinner size="sm"/>
									</div>
								)}
							</span>
						)}
					</div>
					<div className='flex flex-col gap-4 overflow-hidden'>
						<span className='text-white leading-relaxed'>{post?.text}</span>
						{post?.img && (
							<img
								src={post?.img}
								className='max-h-96 object-cover rounded-xl border border-slate-600/50 shadow-lg'
								alt=''
							/>
						)}
					</div>
					<div className='flex justify-between mt-4 pt-3 border-t border-slate-700/30'>
						<div className='flex gap-6 items-center'>
							<div
								className='flex gap-2 items-center cursor-pointer group p-2 rounded-full hover:bg-blue-500/10 transition-all duration-200'
								onClick={() => document.getElementById("comments_modal" + post?._id).showModal()}
							>
								<FaRegComment className='w-4 h-4 text-slate-400 group-hover:text-blue-400 transition-colors duration-200' />
								<span className='text-sm text-slate-400 group-hover:text-blue-400 transition-colors duration-200'>
									{post?.comments?.length}
								</span>
							</div>
							{/* Enhanced Modal Component */}
							<dialog id={`comments_modal${post?._id}`} className='modal border-none outline-none'>
								<div className='modal-box bg-slate-800 border border-slate-600 rounded-2xl shadow-2xl'>
									<h3 className='font-bold text-xl mb-6 text-white'>Comments</h3>
									<div className='flex flex-col gap-4 max-h-80 overflow-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800'>
										{post?.comments?.length === 0 && (
											<p className='text-slate-400 text-center py-8'>
												No comments yet 💭 Be the first one to comment!
											</p>
										)}
										{post?.comments?.map((comment) => (
											<div key={comment._id} className='flex gap-3 items-start p-3 bg-slate-700/30 rounded-xl'>
												<div className='avatar flex-shrink-0'>
													<div className='w-8 h-8 rounded-full ring-2 ring-slate-600'>
														<img
															src={comment?.user?.profileImg || "/avatar-placeholder.png"}
														/>
													</div>
												</div>
												<div className='flex flex-col'>
													<div className='flex items-center gap-2 mb-1'>
														<span className='font-semibold text-white'>{comment?.user?.fullName}</span>
														<span className='text-slate-400 text-sm'>
															@{comment?.user?.username}
														</span>
													</div>
													<div className='text-slate-200 text-sm leading-relaxed'>{comment?.text}</div>
												</div>
											</div>
										))}
									</div>
									<form
										className='flex gap-3 items-end mt-6 pt-4 border-t border-slate-600'
										onSubmit={handlePostComment}
									>
										<textarea
											className='flex-1 p-3 rounded-xl bg-slate-700/50 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 resize-none transition-all duration-200'
											placeholder='Add a comment...'
											value={comment}
											onChange={(e) => setComment(e.target.value)}
											rows={2}
										/>
										<button 
											className='bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50'
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
							
							<div className='flex gap-2 items-center group cursor-pointer p-2 rounded-full hover:bg-green-500/10 transition-all duration-200'>
								<BiRepost className='w-5 h-5 text-slate-400 group-hover:text-green-400 transition-colors duration-200' />
								<span className='text-sm text-slate-400 group-hover:text-green-400 transition-colors duration-200'>0</span>
							</div>
							
							<div className='flex gap-2 items-center group cursor-pointer p-2 rounded-full hover:bg-pink-500/10 transition-all duration-200' onClick={handleLikePost}>
								{isLiking && <LoadingSpinner size='sm' />}
								{!isLiked && !isLiking && (
									<FaRegHeart className='w-4 h-4 cursor-pointer text-slate-400 group-hover:text-pink-400 transition-colors duration-200' />
								)}
								{isLiked && !isLiking && (
									<FaRegHeart className='w-4 h-4 cursor-pointer text-pink-500 animate-pulse' />
								)}

								<span
									className={`text-sm transition-colors duration-200 ${
										isLiked ? "text-pink-500" : "text-slate-400 group-hover:text-pink-400"
									}`}
								>
									{post?.likes?.length}
								</span>
							</div>
						</div>
						<div className='flex gap-2 items-center'>
							<button className='p-2 rounded-full hover:bg-slate-600/50 text-slate-400 hover:text-slate-300 transition-all duration-200'>
								<FaRegBookmark className='w-4 h-4' />
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