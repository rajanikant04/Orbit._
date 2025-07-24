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
		<article className='border-b border-white/8 p-6 hover:bg-white/[0.02] transition-colors duration-200'>
			<div className='flex space-x-4'>
				<Link to={`/profile/${postOwner?.username}`} className='flex-shrink-0'>
					<img 
						src={postOwner?.profileImg || "/avatar-placeholder.png"} 
						className='w-12 h-12 rounded-xl object-cover ring-2 ring-white/10 hover:ring-white/20 transition-all duration-200'
						alt={postOwner?.fullName}
					/>
				</Link>
				
				<div className='flex-1 min-w-0'>
					{/* Post Header */}
					<div className='flex items-center space-x-2 mb-3'>
						<Link 
							to={`/profile/${postOwner?.username}`} 
							className='font-semibold text-white hover:text-blue-400 transition-colors duration-200'
						>
							{postOwner?.fullName}
						</Link>
						<Link 
							to={`/profile/${postOwner?.username}`} 
							className='text-white/60 hover:text-white/80 transition-colors duration-200'
						>
							@{postOwner?.username}
						</Link>
						<span className='text-white/40'>·</span>
						<span className='text-white/60 text-sm'>{formattedDate}</span>
						
						{isMyPost && (
							<div className='ml-auto'>
								{!isDeleting ? (
									<button
										onClick={handleDeletePost}
										className='p-2 rounded-lg hover:bg-red-500/10 text-white/60 hover:text-red-400 transition-all duration-200 group'
									>
										<FaTrash className='w-4 h-4 group-hover:scale-110 transition-transform' />
									</button>
								) : (
									<div className="p-2">
										<LoadingSpinner size="sm"/>
									</div>
								)}
							</div>
						)}
					</div>

					{/* Post Content */}
					<div className='space-y-4 mb-4'>
						{post?.text && (
							<p className='text-white leading-relaxed text-[15px]'>{post.text}</p>
						)}
						
						{post?.img && (
							<div className="rounded-2xl overflow-hidden border border-white/10">
								<img
									src={post.img}
									className='w-full max-h-96 object-cover hover:scale-[1.02] transition-transform duration-300'
									alt='Post content'
								/>
							</div>
						)}
					</div>

					{/* Post Actions */}
					<div className='flex items-center justify-between max-w-md'>
						<button
							className='flex items-center space-x-2 px-3 py-2 rounded-xl hover:bg-blue-500/10 text-white/60 hover:text-blue-400 transition-all duration-200 group'
							onClick={() => document.getElementById("comments_modal" + post?._id).showModal()}
						>
							<FaRegComment className='w-4 h-4 group-hover:scale-110 transition-transform' />
							<span className='text-sm font-medium'>{post?.comments?.length}</span>
						</button>

						<button className='flex items-center space-x-2 px-3 py-2 rounded-xl hover:bg-green-500/10 text-white/60 hover:text-green-400 transition-all duration-200 group'>
							<BiRepost className='w-5 h-5 group-hover:scale-110 transition-transform' />
							<span className='text-sm font-medium'>0</span>
						</button>

						<button
							onClick={handleLikePost}
							className={`flex items-center space-x-2 px-3 py-2 rounded-xl hover:bg-pink-500/10 transition-all duration-200 group ${
								isLiked ? 'text-pink-500' : 'text-white/60 hover:text-pink-400'
							}`}
						>
							{isLiking ? (
								<LoadingSpinner size='sm' />
							) : (
								<FaRegHeart className={`w-4 h-4 group-hover:scale-110 transition-transform ${isLiked ? 'fill-current' : ''}`} />
							)}
							<span className='text-sm font-medium'>{post?.likes?.length}</span>
						</button>

						<button className='flex items-center space-x-2 px-3 py-2 rounded-xl hover:bg-white/10 text-white/60 hover:text-white transition-all duration-200 group'>
							<FaRegBookmark className='w-4 h-4 group-hover:scale-110 transition-transform' />
						</button>
					</div>
				</div>
			</div>

			{/* Comments Modal */}
			<dialog id={`comments_modal${post?._id}`} className='modal'>
				<div className='modal-box bg-black/95 backdrop-blur-xl border border-white/10 rounded-2xl max-w-2xl'>
					<h3 className='font-bold text-xl mb-6 text-white'>Comments</h3>
					
					<div className='max-h-80 overflow-y-auto space-y-4 mb-6 custom-scrollbar'>
						{post?.comments?.length === 0 ? (
							<div className="text-center py-12">
								<div className="text-6xl mb-4">💬</div>
								<p className='text-white/60'>No comments yet</p>
								<p className='text-white/40 text-sm'>Be the first to share your thoughts!</p>
							</div>
						) : (
							post?.comments?.map((comment) => (
								<div key={comment._id} className='flex space-x-3 p-4 rounded-xl hover:bg-white/[0.02] transition-colors duration-200'>
									<img
										src={comment?.user?.profileImg || "/avatar-placeholder.png"}
										className='w-10 h-10 rounded-xl object-cover ring-1 ring-white/10'
										alt={comment?.user?.fullName}
									/>
									<div className='flex-1'>
										<div className='flex items-center space-x-2 mb-2'>
											<span className='font-semibold text-white text-sm'>{comment?.user?.fullName}</span>
											<span className='text-white/60 text-sm'>@{comment?.user?.username}</span>
										</div>
										<p className='text-white/90 text-sm leading-relaxed'>{comment?.text}</p>
									</div>
								</div>
							))
						)}
					</div>

					<form onSubmit={handlePostComment} className='border-t border-white/10 pt-4'>
						<div className="flex space-x-4">
							<img 
								src={authUser?.profileImg || "/avatar-placeholder.png"} 
								className='w-10 h-10 rounded-xl object-cover ring-1 ring-white/10 flex-shrink-0'
								alt={authUser?.fullName}
							/>
							<div className="flex-1 space-y-4">
								<textarea
									className='w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-white/40 resize-none focus:border-blue-500/50 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200'
									placeholder='Add a comment...'
									value={comment}
									onChange={(e) => setComment(e.target.value)}
									rows={3}
								/>
								<div className="flex justify-end">
									<button 
										type="submit"
										disabled={isCommenting || !comment.trim()}
										className='px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none'
									>
										{isCommenting ? (
											<div className="flex items-center space-x-2">
												<LoadingSpinner size='sm' />
												<span>Posting...</span>
											</div>
										) : (
											'Post Comment'
										)}
									</button>
								</div>
							</div>
						</div>
					</form>
				</div>
				<form method='dialog' className='modal-backdrop'>
					<button className='outline-none'>close</button>
				</form>
			</dialog>
		</article>
	);
};
// always pass variables with ? to check
export default Post;